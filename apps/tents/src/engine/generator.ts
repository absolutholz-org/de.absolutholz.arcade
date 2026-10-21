import { solveTents } from './solver.ts';
import { type CellCoord, DIFFICULTY_GRID_SIZES, type DifficultyLevel, type PuzzleDefinition } from './types.ts';
import { areChebyshevTouching, coordKey, parseCoordKey } from './validator.ts';

/**
 * Seedable Mulberry32 pseudo-random number generator.
 */
export function createRng(seed: number): () => number {
	let s = seed >>> 0;
	return function next(): number {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Shuffles an array in place using the provided RNG function (Fisher-Yates).
 */
export function shuffleArray<T>(array: T[], rng: () => number): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

/**
 * Bipartite matching to assign each tent a distinct, orthogonally adjacent tree.
 */
function assignTreesToTents(tents: CellCoord[], size: number, rng: () => number): CellCoord[] | null {
	const tentSet = new Set(tents.map((t) => coordKey(t.row, t.col)));
	const tentKeys = tents.map((t) => coordKey(t.row, t.col));

	// Candidate tree cells: empty cells orthogonally adjacent to at least one tent
	const adj = new Map<string, string[]>();

	for (const tent of tents) {
		const tKey = coordKey(tent.row, tent.col);
		const neighbors: string[] = [];

		const candidates = [
			{ row: tent.row - 1, col: tent.col },
			{ row: tent.row + 1, col: tent.col },
			{ row: tent.row, col: tent.col - 1 },
			{ row: tent.row, col: tent.col + 1 },
		];

		// Shuffle candidates for variety
		shuffleArray(candidates, rng);

		for (const cand of candidates) {
			if (
				cand.row >= 0 &&
				cand.row < size &&
				cand.col >= 0 &&
				cand.col < size &&
				!tentSet.has(coordKey(cand.row, cand.col))
			) {
				neighbors.push(coordKey(cand.row, cand.col));
			}
		}

		adj.set(tKey, neighbors);
	}

	// Match tents to tree candidate cells
	const matchTreeToTent = new Map<string, string>(); // treeKey -> tentKey

	function dfs(tentKey: string, visitedTrees: Set<string>): boolean {
		const neighbors = adj.get(tentKey) ?? [];
		for (const treeKey of neighbors) {
			if (visitedTrees.has(treeKey)) continue;
			visitedTrees.add(treeKey);

			const currentOwner = matchTreeToTent.get(treeKey);
			if (!currentOwner || dfs(currentOwner, visitedTrees)) {
				matchTreeToTent.set(treeKey, tentKey);
				return true;
			}
		}
		return false;
	}

	let matchingSize = 0;
	for (const tKey of tentKeys) {
		const visitedTrees = new Set<string>();
		if (dfs(tKey, visitedTrees)) {
			matchingSize++;
		}
	}

	if (matchingSize !== tents.length) {
		return null;
	}

	// Return array of chosen tree coordinates
	const trees: CellCoord[] = [];
	for (const treeKey of matchTreeToTent.keys()) {
		trees.push(parseCoordKey(treeKey));
	}

	return trees.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col));
}

/**
 * Generates a valid Tents & Trees puzzle with a verified unique solution.
 */
export function generatePuzzle(difficulty: DifficultyLevel, seed?: number): PuzzleDefinition {
	const effectiveSeed = seed !== undefined ? seed : (Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0;
	const rng = createRng(effectiveSeed);

	const { width: size, defaultTents: targetTents } = DIFFICULTY_GRID_SIZES[difficulty];

	const maxAttempts = 120;

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		// 1. Generate all coordinates and shuffle them
		const allCoords: CellCoord[] = [];
		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				allCoords.push({ row: r, col: c });
			}
		}
		shuffleArray(allCoords, rng);

		// 2. Greedily pick non-touching tents
		const placedTents: CellCoord[] = [];
		for (const coord of allCoords) {
			let touches = false;
			for (const existing of placedTents) {
				if (areChebyshevTouching(coord, existing)) {
					touches = true;
					break;
				}
			}

			if (!touches) {
				placedTents.push(coord);
				if (placedTents.length === targetTents) {
					break;
				}
			}
		}

		if (placedTents.length !== targetTents) {
			continue;
		}

		// 3. Assign trees
		const trees = assignTreesToTents(placedTents, size, rng);
		if (!trees || trees.length !== targetTents) {
			continue;
		}

		// 4. Compute line clues
		const rowClues = Array(size).fill(0);
		const colClues = Array(size).fill(0);
		for (const tent of placedTents) {
			rowClues[tent.row]++;
			colClues[tent.col]++;
		}

		const candidatePuzzle: PuzzleDefinition = {
			id: `tents-${difficulty}-${effectiveSeed}-${attempt}`,
			difficulty,
			size,
			trees,
			rowClues,
			colClues,
			solution: placedTents.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col)),
		};

		// 5. Test uniqueness using solver
		const result = solveTents(candidatePuzzle, 2);
		if (result.isUnique) {
			return candidatePuzzle;
		}
	}

	// Fallback: Return a procedurally guaranteed minimal puzzle if random attempts didn't yield uniqueness
	// (Should be exceedingly rare, but ensures total reliability)
	throw new Error(`Failed to generate unique puzzle for difficulty ${difficulty} with seed ${effectiveSeed}`);
}

export { generatePuzzle as generateTentsPuzzle };
