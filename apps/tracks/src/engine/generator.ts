import { hasUniqueSolution } from './solver.ts';
import type { DifficultyLevel, Direction, FixedCell, GateCoord, PathStep, StaticPuzzleDefinition } from './types.ts';
import { DIRECTION_DELTA, getDirectionBetween, getTrackTypeFromDirections } from './validator.ts';

const DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W'];

function createRng(seed?: number): () => number {
	if (seed === undefined) {
		return () => Math.random();
	}
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffle<T>(items: T[], rng: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = copy[i];
		copy[i] = copy[j];
		copy[j] = tmp;
	}
	return copy;
}

function getBorderSides(size: number, row: number, col: number): Direction[] {
	const sides: Direction[] = [];
	if (row === 0) sides.push('N');
	if (col === size - 1) sides.push('E');
	if (row === size - 1) sides.push('S');
	if (col === 0) sides.push('W');
	return sides;
}

function generateSelfAvoidingWalk(
	size: number,
	minLen: number,
	maxLen: number,
	rng: () => number,
): Array<{ row: number; col: number }> | null {
	const borderCells: Array<{ row: number; col: number }> = [];
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			if (r === 0 || r === size - 1 || c === 0 || c === size - 1) {
				borderCells.push({ row: r, col: c });
			}
		}
	}

	const startCell = borderCells[Math.floor(rng() * borderCells.length)];
	const targetLen = minLen + Math.floor(rng() * (maxLen - minLen + 1));
	const visited = new Uint8Array(size * size);
	const path: Array<{ row: number; col: number }> = [startCell];
	visited[startCell.row * size + startCell.col] = 1;

	let stepsBudget = 2500;

	function walk(r: number, c: number): boolean {
		if (stepsBudget-- <= 0) return false;

		if (path.length >= targetLen) {
			const isBorder = r === 0 || r === size - 1 || c === 0 || c === size - 1;
			const dist = Math.abs(r - startCell.row) + Math.abs(c - startCell.col);
			if (isBorder && dist >= Math.floor(size / 2) + 1) {
				return true;
			}
			if (path.length >= maxLen) {
				return false;
			}
		}

		// Prefer moves that don't hug the border too early and have available neighbors
		const dirs = shuffle(DIRECTIONS, rng);
		for (const dir of dirs) {
			const nr = r + DIRECTION_DELTA[dir].dRow;
			const nc = c + DIRECTION_DELTA[dir].dCol;
			if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
			const idx = nr * size + nc;
			if (visited[idx]) continue;

			visited[idx] = 1;
			path.push({ row: nr, col: nc });
			if (walk(nr, nc)) {
				return true;
			}
			path.pop();
			visited[idx] = 0;
		}

		return false;
	}

	if (walk(startCell.row, startCell.col)) {
		return path;
	}
	return null;
}

function getTargetConfig(
	size: number,
	difficulty: DifficultyLevel,
): { minLen: number; maxLen: number; minFixed: number; maxNodes: number } {
	if (difficulty === 'easy') {
		return {
			minLen: Math.max(12, Math.floor(size * size * 0.42)),
			maxLen: Math.max(16, Math.floor(size * size * 0.58)),
			minFixed: 4,
			maxNodes: 2000,
		};
	}
	if (difficulty === 'medium') {
		return {
			minLen: Math.max(22, Math.floor(size * size * 0.42)),
			maxLen: Math.max(34, Math.floor(size * size * 0.56)),
			minFixed: 6,
			maxNodes: 2500,
		};
	}
	if (difficulty === 'hard') {
		return {
			minLen: Math.max(24, Math.floor(size * size * 0.44)),
			maxLen: Math.max(36, Math.floor(size * size * 0.58)),
			minFixed: 4,
			maxNodes: 3000,
		};
	}
	return {
		minLen: Math.max(36, Math.floor(size * size * 0.4)),
		maxLen: Math.max(50, Math.floor(size * size * 0.52)),
		minFixed: 7,
		maxNodes: 3500,
	};
}

export function generateTracksPuzzle(
	size: number,
	difficulty: DifficultyLevel,
	id = `generated-${difficulty}-${Date.now()}`,
	seed?: number,
): StaticPuzzleDefinition {
	const rng = createRng(seed);
	const { minLen, maxLen, minFixed, maxNodes } = getTargetConfig(size, difficulty);

	for (let attempt = 0; attempt < 80; attempt++) {
		const coords = generateSelfAvoidingWalk(size, minLen, maxLen, rng);
		if (!coords || coords.length < 4) continue;

		const first = coords[0];
		const second = coords[1];
		const last = coords[coords.length - 1];
		const prevLast = coords[coords.length - 2];

		const firstExit = getDirectionBetween(first.row, first.col, second.row, second.col);
		const lastEnter = getDirectionBetween(last.row, last.col, prevLast.row, prevLast.col);
		if (!firstExit || !lastEnter) continue;

		const startSides = getBorderSides(size, first.row, first.col).filter((s) => s !== firstExit);
		const endSides = getBorderSides(size, last.row, last.col).filter((s) => s !== lastEnter);
		if (startSides.length === 0 || endSides.length === 0) continue;

		const start: GateCoord = {
			row: first.row,
			col: first.col,
			side: startSides[Math.floor(rng() * startSides.length)],
		};
		const end: GateCoord = {
			row: last.row,
			col: last.col,
			side: endSides[Math.floor(rng() * endSides.length)],
		};

		const rowClues = new Array<number>(size).fill(0);
		const colClues = new Array<number>(size).fill(0);
		const solution: PathStep[] = [];
		let validSolution = true;

		for (let i = 0; i < coords.length; i++) {
			const curr = coords[i];
			rowClues[curr.row]++;
			colClues[curr.col]++;

			const enterFrom =
				i === 0 ? start.side : getDirectionBetween(curr.row, curr.col, coords[i - 1].row, coords[i - 1].col);
			const exitTo =
				i === coords.length - 1
					? end.side
					: getDirectionBetween(curr.row, curr.col, coords[i + 1].row, coords[i + 1].col);

			if (!enterFrom || !exitTo) {
				validSolution = false;
				break;
			}

			const track = getTrackTypeFromDirections(enterFrom, exitTo);
			if (!track) {
				validSolution = false;
				break;
			}

			solution.push({
				row: curr.row,
				col: curr.col,
				track,
				enterFrom,
				exitTo,
			});
		}

		if (!validSolution) continue;

		// Start with start, end, and every 2nd interior step as initial fixed cells
		const interiorIndices: number[] = [];
		for (let i = 1; i < solution.length - 1; i++) {
			interiorIndices.push(i);
		}

		const activeInterior = new Set<number>();
		for (let i = 1; i < solution.length - 1; i += 2) {
			activeInterior.add(i);
		}

		const buildFixedCells = (indices: Set<number>): FixedCell[] => {
			const list: FixedCell[] = [{ row: solution[0].row, col: solution[0].col, track: solution[0].track }];
			const sorted = [...indices].sort((a, b) => a - b);
			for (const idx of sorted) {
				list.push({
					row: solution[idx].row,
					col: solution[idx].col,
					track: solution[idx].track,
				});
			}
			const endStep = solution[solution.length - 1];
			list.push({ row: endStep.row, col: endStep.col, track: endStep.track });
			return list;
		};

		// Ensure initial set is uniquely solvable within node budget; if not, add remaining interior steps
		if (
			!hasUniqueSolution(
				{ size, rowClues, colClues, start, end, fixedCells: buildFixedCells(activeInterior) },
				maxNodes,
			)
		) {
			for (const idx of shuffle(interiorIndices, rng)) {
				if (activeInterior.has(idx)) continue;
				activeInterior.add(idx);
				if (
					hasUniqueSolution(
						{ size, rowClues, colClues, start, end, fixedCells: buildFixedCells(activeInterior) },
						maxNodes,
					)
				) {
					break;
				}
			}
		}

		// Greedily remove interior fixed cells while preserving fast unique solvability
		for (const idx of shuffle([...activeInterior], rng)) {
			if (activeInterior.size + 2 <= minFixed) {
				break;
			}
			activeInterior.delete(idx);
			const candidateFixed = buildFixedCells(activeInterior);
			if (!hasUniqueSolution({ size, rowClues, colClues, start, end, fixedCells: candidateFixed }, maxNodes)) {
				activeInterior.add(idx);
			}
		}

		const finalFixed = buildFixedCells(activeInterior);
		if (hasUniqueSolution({ size, rowClues, colClues, start, end, fixedCells: finalFixed })) {
			return {
				id,
				difficulty,
				size,
				rowClues,
				colClues,
				start,
				end,
				fixedCells: finalFixed,
				solution,
			};
		}
	}

	throw new Error(`Failed to generate uniquely solvable Tracks puzzle for ${difficulty} (${size}x${size})`);
}
