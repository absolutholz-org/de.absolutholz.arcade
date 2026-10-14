import { ORTHOGONAL_OFFSETS, isValidRegionLayout } from './regionLayout.ts';
import { countSolutions, findSolutions } from './solver.ts';
import type { QueenPlacement } from './types.ts';

export type RandomSource = () => number;

export interface GenerateOptions {
	/** Fresh queen placements to try before giving up. */
	maxAttempts?: number;
	/** Border mutations allowed per attempt while breaking alternative solutions. */
	maxRepairsPerAttempt?: number;
	/** Rejects boards with more one-cell regions than this (each one is a free, trivial queen). */
	maxSingleCellRegions?: number;
}

export interface GeneratedLayout {
	regions: number[][];
	solution: QueenPlacement[];
	attempts: number;
}

const UNASSIGNED = -1;
const DEFAULT_MAX_ATTEMPTS = 300;
const DEFAULT_MAX_REPAIRS_PER_ATTEMPT = 400;

/** Deterministic mulberry32 generator so batches can be reproduced from a seed. */
export function createSeededRandom(seed: number): RandomSource {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Generates a region layout with exactly one solution:
 * A) plant N non-touching queens (one per row/column),
 * B) grow N contiguous regions outward from the queens,
 * C) while the solver finds a second solution, move a border cell of that alternative so it breaks,
 *    keeping the planted queens in place so the planted solution always stays valid.
 */
export function generateUniqueLayout(
	size: number,
	random: RandomSource,
	options: GenerateOptions = {},
): GeneratedLayout | null {
	const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
	const maxRepairs = options.maxRepairsPerAttempt ?? DEFAULT_MAX_REPAIRS_PER_ATTEMPT;
	const maxSingleCellRegions = options.maxSingleCellRegions ?? Math.floor(size / 4);

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		const queenColumns = placeQueens(size, random);
		if (!queenColumns) {
			continue;
		}
		const solution = queenColumns.map((col, row): QueenPlacement => [row, col]);
		const regions = growRegions(size, queenColumns, random);

		const isUnique = repairUntilUnique(regions, size, solution, random, maxRepairs);
		if (!isUnique || countSingleCellRegions(regions, size) > maxSingleCellRegions) {
			continue;
		}

		const canonicalRegions = renumberRegionsByAppearance(regions, size);
		if (isValidRegionLayout(canonicalRegions, size) && countSolutions(canonicalRegions, size) === 1) {
			return { regions: canonicalRegions, solution, attempts: attempt };
		}
	}
	return null;
}

function shuffle<T>(items: T[], random: RandomSource): T[] {
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
	return items;
}

/** Randomized DFS: one queen per row and column, never touching the previous row's queen. */
function placeQueens(size: number, random: RandomSource): number[] | null {
	const queenColumns: number[] = [];
	const usedColumns = new Set<number>();

	function placeRow(row: number): boolean {
		if (row === size) {
			return true;
		}
		const previousColumn = row > 0 ? queenColumns[row - 1] : -2;
		const candidates = shuffle(
			Array.from({ length: size }, (_, col) => col).filter(
				(col) => !usedColumns.has(col) && Math.abs(col - previousColumn) > 1,
			),
			random,
		);
		for (const col of candidates) {
			queenColumns[row] = col;
			usedColumns.add(col);
			if (placeRow(row + 1)) {
				return true;
			}
			usedColumns.delete(col);
		}
		return false;
	}

	return placeRow(0) ? queenColumns : null;
}

/**
 * Multi-source random flood fill. Per-region weights vary growth speed so region sizes differ
 * (a mix of large and small regions makes more interesting puzzles than evenly sized ones).
 */
function growRegions(size: number, queenColumns: readonly number[], random: RandomSource): number[][] {
	const regions = Array.from({ length: size }, () => new Array<number>(size).fill(UNASSIGNED));
	const frontiers = Array.from({ length: size }, () => new Set<number>());
	const growthWeights = Array.from({ length: size }, () => 0.25 + random() * 1.75);
	let unassignedCount = size * size;

	function assign(row: number, col: number, regionId: number): void {
		regions[row][col] = regionId;
		unassignedCount--;
		for (const frontier of frontiers) {
			frontier.delete(row * size + col);
		}
		for (const [rowOffset, colOffset] of ORTHOGONAL_OFFSETS) {
			const neighborRow = row + rowOffset;
			const neighborCol = col + colOffset;
			const isInside = neighborRow >= 0 && neighborRow < size && neighborCol >= 0 && neighborCol < size;
			if (isInside && regions[neighborRow][neighborCol] === UNASSIGNED) {
				frontiers[regionId].add(neighborRow * size + neighborCol);
			}
		}
	}

	queenColumns.forEach((col, row) => {
		assign(row, col, row);
	});

	while (unassignedCount > 0) {
		const regionId = pickWeightedRegion(frontiers, growthWeights, random);
		const frontierCells = [...frontiers[regionId]];
		const cell = frontierCells[Math.floor(random() * frontierCells.length)];
		assign(Math.floor(cell / size), cell % size, regionId);
	}
	return regions;
}

function pickWeightedRegion(frontiers: Set<number>[], weights: number[], random: RandomSource): number {
	let totalWeight = 0;
	for (let regionId = 0; regionId < frontiers.length; regionId++) {
		if (frontiers[regionId].size > 0) {
			totalWeight += weights[regionId];
		}
	}

	let threshold = random() * totalWeight;
	let lastGrowable = -1;
	for (let regionId = 0; regionId < frontiers.length; regionId++) {
		if (frontiers[regionId].size === 0) {
			continue;
		}
		lastGrowable = regionId;
		threshold -= weights[regionId];
		if (threshold < 0) {
			return regionId;
		}
	}
	return lastGrowable;
}

function isSameSolution(a: QueenPlacement[], b: QueenPlacement[]): boolean {
	return a.every(([row, col], index) => b[index][0] === row && b[index][1] === col);
}

function repairUntilUnique(
	regions: number[][],
	size: number,
	plantedSolution: QueenPlacement[],
	random: RandomSource,
	maxRepairs: number,
): boolean {
	const plantedCells = new Set(plantedSolution.map(([row, col]) => row * size + col));

	for (let repair = 0; repair <= maxRepairs; repair++) {
		const alternative = findSolutions(regions, size, 2).find((found) => !isSameSolution(found, plantedSolution));
		if (!alternative) {
			return true;
		}
		if (!breakSolution(regions, size, alternative, plantedCells, random)) {
			return false;
		}
	}
	return false;
}

/**
 * Moves one non-planted queen cell of `solution` into an adjacent region. That region already holds another
 * queen of `solution`, so the solution now has two queens in one region and is no longer valid. A move is only
 * kept when every region stays non-empty and contiguous.
 */
function breakSolution(
	regions: number[][],
	size: number,
	solution: QueenPlacement[],
	plantedCells: Set<number>,
	random: RandomSource,
): boolean {
	const moves: { row: number; col: number; targetRegion: number }[] = [];
	for (const [row, col] of solution) {
		if (plantedCells.has(row * size + col)) {
			continue;
		}
		for (const [rowOffset, colOffset] of ORTHOGONAL_OFFSETS) {
			const neighborRegion = regions[row + rowOffset]?.[col + colOffset];
			if (neighborRegion !== undefined && neighborRegion !== regions[row][col]) {
				moves.push({ row, col, targetRegion: neighborRegion });
			}
		}
	}

	for (const { row, col, targetRegion } of shuffle(moves, random)) {
		const originalRegion = regions[row][col];
		regions[row][col] = targetRegion;
		if (isValidRegionLayout(regions, size)) {
			return true;
		}
		regions[row][col] = originalRegion;
	}
	return false;
}

function countSingleCellRegions(regions: number[][], size: number): number {
	const cellCounts = new Array<number>(size).fill(0);
	for (const row of regions) {
		for (const regionId of row) {
			cellCounts[regionId]++;
		}
	}
	return cellCounts.filter((count) => count === 1).length;
}

/** Region ids in reading order, so ids never reveal which row a region's queen sits in. */
function renumberRegionsByAppearance(regions: number[][], size: number): number[][] {
	const newIdByOldId = new Map<number, number>();
	return regions.map((row) =>
		row.map((oldId) => {
			if (!newIdByOldId.has(oldId)) {
				newIdByOldId.set(oldId, newIdByOldId.size);
			}
			return newIdByOldId.get(oldId) as number;
		}),
	);
}
