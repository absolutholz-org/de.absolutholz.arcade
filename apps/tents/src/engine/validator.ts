import type { BoardEvaluation, BoardState, CellCoord, LineEvaluation, LineStatus, PuzzleDefinition } from './types.ts';

/**
 * Creates a coordinate key formatted as "row,col".
 */
export function coordKey(row: number, col: number): string {
	return `${row},${col}`;
}

/**
 * Parses a "row,col" key back into a CellCoord.
 */
export function parseCoordKey(key: string): CellCoord {
	const [rowStr, colStr] = key.split(',');
	return {
		row: Number.parseInt(rowStr, 10),
		col: Number.parseInt(colStr, 10),
	};
}

/**
 * Returns true if two coordinates are orthogonally adjacent (Manhattan distance = 1).
 */
export function areOrthogonallyAdjacent(c1: CellCoord, c2: CellCoord): boolean {
	return Math.abs(c1.row - c2.row) + Math.abs(c1.col - c2.col) === 1;
}

/**
 * Returns true if two coordinates touch horizontally, vertically, or diagonally
 * (Chebyshev distance <= 1, excluding identity).
 */
export function areChebyshevTouching(c1: CellCoord, c2: CellCoord): boolean {
	const rowDiff = Math.abs(c1.row - c2.row);
	const colDiff = Math.abs(c1.col - c2.col);
	return Math.max(rowDiff, colDiff) <= 1 && (rowDiff > 0 || colDiff > 0);
}

/**
 * Creates a clean BoardState initialized from a PuzzleDefinition.
 */
export function createBoardFromPuzzle(puzzle: PuzzleDefinition): BoardState {
	const treeCoords = new Set(puzzle.trees.map((t) => coordKey(t.row, t.col)));

	const grid = Array.from({ length: puzzle.size }, (_, r) =>
		Array.from({ length: puzzle.size }, (_, c) => ({
			fixed: treeCoords.has(coordKey(r, c)) ? ('tree' as const) : ('empty' as const),
			mark: 'none' as const,
		})),
	);

	return {
		id: puzzle.id,
		difficulty: puzzle.difficulty,
		size: puzzle.size,
		trees: puzzle.trees.map((t) => ({ ...t })),
		rowClues: [...puzzle.rowClues],
		colClues: [...puzzle.colClues],
		grid,
	};
}

/**
 * Checks all row clues against placed tent marks.
 */
export function checkRowClues(board: BoardState): LineEvaluation[] {
	return board.rowClues.map((target, r) => {
		let current = 0;
		for (let c = 0; c < board.size; c++) {
			if (board.grid[r][c].mark === 'tent') {
				current++;
			}
		}

		let status: LineStatus = 'under';
		if (current === target) {
			status = 'satisfied';
		} else if (current > target) {
			status = 'overflow';
		}

		return { current, target, status };
	});
}

/**
 * Checks all column clues against placed tent marks.
 */
export function checkColClues(board: BoardState): LineEvaluation[] {
	return board.colClues.map((target, c) => {
		let current = 0;
		for (let r = 0; r < board.size; r++) {
			if (board.grid[r][c].mark === 'tent') {
				current++;
			}
		}

		let status: LineStatus = 'under';
		if (current === target) {
			status = 'satisfied';
		} else if (current > target) {
			status = 'overflow';
		}

		return { current, target, status };
	});
}

/**
 * Finds all placed tents that touch any other tent horizontally, vertically, or diagonally.
 * Returns a Set of "row,col" keys for all touching tents.
 */
export function findTouchingTents(board: BoardState): Set<string> {
	const tents: CellCoord[] = [];

	for (let r = 0; r < board.size; r++) {
		for (let c = 0; c < board.size; c++) {
			if (board.grid[r][c].mark === 'tent') {
				tents.push({ row: r, col: c });
			}
		}
	}

	const touching = new Set<string>();

	for (let i = 0; i < tents.length; i++) {
		for (let j = i + 1; j < tents.length; j++) {
			if (areChebyshevTouching(tents[i], tents[j])) {
				touching.add(coordKey(tents[i].row, tents[i].col));
				touching.add(coordKey(tents[j].row, tents[j].col));
			}
		}
	}

	return touching;
}

/**
 * Computes maximum bipartite matching between trees and tents.
 * An edge exists between tree T and tent P iff they are orthogonally adjacent.
 */
export function checkBipartiteMatching(
	trees: CellCoord[],
	tents: CellCoord[],
): {
	isPerfect: boolean;
	matching: Map<string, string>; // treeKey -> tentKey
	unpairedTrees: Set<string>;
	unpairedTents: Set<string>;
} {
	const treeKeys = trees.map((t) => coordKey(t.row, t.col));
	const tentKeys = tents.map((p) => coordKey(p.row, p.col));

	if (trees.length !== tents.length || trees.length === 0) {
		const isPerfect = trees.length === 0 && tents.length === 0;
		return {
			isPerfect,
			matching: new Map(),
			unpairedTrees: new Set(treeKeys),
			unpairedTents: new Set(tentKeys),
		};
	}

	// Build adjacency list: treeKey -> list of adjacent tentKeys
	const adj = new Map<string, string[]>();
	for (const t of trees) {
		const tKey = coordKey(t.row, t.col);
		const neighbors: string[] = [];
		for (const p of tents) {
			if (areOrthogonallyAdjacent(t, p)) {
				neighbors.push(coordKey(p.row, p.col));
			}
		}
		adj.set(tKey, neighbors);
	}

	// matchTentToTree: tentKey -> treeKey
	const matchTentToTree = new Map<string, string>();

	function dfs(treeKey: string, visitedTents: Set<string>): boolean {
		const neighbors = adj.get(treeKey) ?? [];
		for (const tentKey of neighbors) {
			if (visitedTents.has(tentKey)) continue;
			visitedTents.add(tentKey);

			const currentOwner = matchTentToTree.get(tentKey);
			if (!currentOwner || dfs(currentOwner, visitedTents)) {
				matchTentToTree.set(tentKey, treeKey);
				return true;
			}
		}
		return false;
	}

	let matchingSize = 0;
	for (const tKey of treeKeys) {
		const visitedTents = new Set<string>();
		if (dfs(tKey, visitedTents)) {
			matchingSize++;
		}
	}

	const treeToTent = new Map<string, string>();
	const matchedTents = new Set<string>();
	for (const [tentKey, treeKey] of matchTentToTree.entries()) {
		treeToTent.set(treeKey, tentKey);
		matchedTents.add(tentKey);
	}

	const unpairedTrees = new Set<string>();
	for (const tKey of treeKeys) {
		if (!treeToTent.has(tKey)) {
			unpairedTrees.add(tKey);
		}
	}

	const unpairedTents = new Set<string>();
	for (const pKey of tentKeys) {
		if (!matchedTents.has(pKey)) {
			unpairedTents.add(pKey);
		}
	}

	const isPerfect = matchingSize === trees.length && trees.length === tents.length;

	return {
		isPerfect,
		matching: treeToTent,
		unpairedTrees,
		unpairedTents,
	};
}

/**
 * Performs a comprehensive evaluation of the entire board state.
 */
export function evaluateBoard(board: BoardState): BoardEvaluation {
	const rows = checkRowClues(board);
	const cols = checkColClues(board);

	let satisfiedLines = 0;
	for (const r of rows) {
		if (r.status === 'satisfied') satisfiedLines++;
	}
	for (const c of cols) {
		if (c.status === 'satisfied') satisfiedLines++;
	}

	const touchingTents = findTouchingTents(board);

	// Extract all placed tents and verify no tent is placed on a tree
	const placedTents: CellCoord[] = [];
	let tentOnTreeCount = 0;

	for (let r = 0; r < board.size; r++) {
		for (let c = 0; c < board.size; c++) {
			const cell = board.grid[r][c];
			if (cell.mark === 'tent') {
				placedTents.push({ row: r, col: c });
				if (cell.fixed === 'tree') {
					tentOnTreeCount++;
				}
			}
		}
	}

	const matchingResult = checkBipartiteMatching(board.trees, placedTents);

	const isSolved =
		satisfiedLines === rows.length + cols.length &&
		touchingTents.size === 0 &&
		matchingResult.isPerfect &&
		tentOnTreeCount === 0 &&
		placedTents.length === board.trees.length;

	return {
		rows,
		cols,
		satisfiedLines,
		totalLines: rows.length + cols.length,
		touchingTents,
		unpairedTents: matchingResult.unpairedTents,
		unpairedTrees: matchingResult.unpairedTrees,
		treeToTentMatching: matchingResult.matching,
		isBipartitePerfect: matchingResult.isPerfect,
		isSolved,
	};
}

/**
 * Returns true if the board satisfies all winning criteria.
 */
export function isPuzzleSolved(board: BoardState): boolean {
	return evaluateBoard(board).isSolved;
}
