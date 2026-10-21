import type { CellCoord, PuzzleDefinition } from './types.ts';
import { areOrthogonallyAdjacent, checkBipartiteMatching, coordKey } from './validator.ts';

export interface SolverResult {
	solutions: CellCoord[][];
	isUnique: boolean;
}

/**
 * Finds all combinations of choosing `count` numbers from `candidates`
 * such that no two chosen numbers have distance <= 1 (|a - b| > 1).
 */
function getNonTouchingRowCombinations(candidates: number[], count: number): number[][] {
	if (count === 0) return [[]];
	if (candidates.length < count) return [];

	const results: number[][] = [];
	const current: number[] = [];

	function backtrack(startIdx: number, needed: number) {
		if (needed === 0) {
			results.push([...current]);
			return;
		}

		for (let i = startIdx; i < candidates.length; i++) {
			const candidate = candidates[i];
			if (current.length === 0 || candidate - current[current.length - 1] > 1) {
				current.push(candidate);
				backtrack(i + 1, needed - 1);
				current.pop();
			}
		}
	}

	backtrack(0, count);
	return results;
}

/**
 * Solves a Tents & Trees puzzle using constraint propagation and backtracking search.
 * Returns up to `maxSolutions` (default 2) and whether the solution is unique.
 */
export function solveTents(puzzle: PuzzleDefinition, maxSolutions = 2): SolverResult {
	const N = puzzle.size;
	const K = puzzle.trees.length;

	// Initial feasibility checks
	const rowSum = puzzle.rowClues.reduce((a, b) => a + b, 0);
	const colSum = puzzle.colClues.reduce((a, b) => a + b, 0);

	if (rowSum !== K || colSum !== K) {
		return { solutions: [], isUnique: false };
	}

	for (let r = 0; r < N; r++) {
		if (puzzle.rowClues[r] < 0 || puzzle.rowClues[r] > Math.ceil(N / 2)) {
			return { solutions: [], isUnique: false };
		}
	}
	for (let c = 0; c < N; c++) {
		if (puzzle.colClues[c] < 0 || puzzle.colClues[c] > Math.ceil(N / 2)) {
			return { solutions: [], isUnique: false };
		}
	}

	if (K === 0) {
		return { solutions: [[]], isUnique: true };
	}

	// Grid of tree positions
	const isTree: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
	for (const t of puzzle.trees) {
		if (t.row >= 0 && t.row < N && t.col >= 0 && t.col < N) {
			isTree[t.row][t.col] = true;
		}
	}

	// Identify candidate tent cells: empty cells with at least one orthogonally adjacent tree
	// and positive row and column clues.
	const isCandidate: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
	for (let r = 0; r < N; r++) {
		if (puzzle.rowClues[r] === 0) continue;
		for (let c = 0; c < N; c++) {
			if (puzzle.colClues[c] === 0 || isTree[r][c]) continue;

			// Check orthogonal adjacency to at least one tree
			const hasAdjacentTree =
				(r > 0 && isTree[r - 1][c]) ||
				(r < N - 1 && isTree[r + 1][c]) ||
				(c > 0 && isTree[r][c - 1]) ||
				(c < N - 1 && isTree[r][c + 1]);

			if (hasAdjacentTree) {
				isCandidate[r][c] = true;
			}
		}
	}

	// Verify each tree has at least one candidate cell around it
	for (const t of puzzle.trees) {
		let adjacentCandidates = 0;
		if (t.row > 0 && isCandidate[t.row - 1][t.col]) adjacentCandidates++;
		if (t.row < N - 1 && isCandidate[t.row + 1][t.col]) adjacentCandidates++;
		if (t.col > 0 && isCandidate[t.row][t.col - 1]) adjacentCandidates++;
		if (t.col < N - 1 && isCandidate[t.row][t.col + 1]) adjacentCandidates++;

		if (adjacentCandidates === 0) {
			return { solutions: [], isUnique: false };
		}
	}

	// Verify each row and column has enough candidates
	for (let r = 0; r < N; r++) {
		let count = 0;
		for (let c = 0; c < N; c++) {
			if (isCandidate[r][c]) count++;
		}
		if (count < puzzle.rowClues[r]) {
			return { solutions: [], isUnique: false };
		}
	}

	for (let c = 0; c < N; c++) {
		let count = 0;
		for (let r = 0; r < N; r++) {
			if (isCandidate[r][c]) count++;
		}
		if (count < puzzle.colClues[c]) {
			return { solutions: [], isUnique: false };
		}
	}

	const colRemaining = [...puzzle.colClues];
	const tentsByRow: number[][] = Array.from({ length: N }, () => []);
	const solutions: CellCoord[][] = [];

	function search(r: number): void {
		if (solutions.length >= maxSolutions) return;

		if (r === N) {
			// All rows placed. Verify column clues are exactly satisfied.
			for (let c = 0; c < N; c++) {
				if (colRemaining[c] !== 0) return;
			}

			// Gather all placed tents
			const allTents: CellCoord[] = [];
			for (let rowIdx = 0; rowIdx < N; rowIdx++) {
				for (const colIdx of tentsByRow[rowIdx]) {
					allTents.push({ row: rowIdx, col: colIdx });
				}
			}

			if (allTents.length !== K) return;

			// Verify bipartite matching between trees and tents
			const matching = checkBipartiteMatching(puzzle.trees, allTents);
			if (matching.isPerfect) {
				solutions.push(allTents.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col)));
			}
			return;
		}

		const targetInRow = puzzle.rowClues[r];
		const prevRowTents = r > 0 ? tentsByRow[r - 1] : [];

		// Filter available candidate columns in row r
		const availableCols: number[] = [];
		for (let c = 0; c < N; c++) {
			if (!isCandidate[r][c] || colRemaining[c] <= 0) continue;

			// Must not touch any tent in row r - 1
			let touchesPrev = false;
			for (const prevCol of prevRowTents) {
				if (Math.abs(c - prevCol) <= 1) {
					touchesPrev = true;
					break;
				}
			}

			if (!touchesPrev) {
				availableCols.push(c);
			}
		}

		if (availableCols.length < targetInRow) {
			return;
		}

		const combinations = getNonTouchingRowCombinations(availableCols, targetInRow);

		for (const combo of combinations) {
			// Apply tentative placement for row r
			tentsByRow[r] = combo;
			for (const c of combo) {
				colRemaining[c]--;
			}

			// Pruning checks for future rows (r + 1 .. N - 1)
			let canProceed = true;

			// 1. Column remaining check:
			// For each column, count how many valid candidates remain in future rows
			for (let c = 0; c < N; c++) {
				if (colRemaining[c] === 0) continue;

				let futureCandidateCount = 0;
				for (let nextR = r + 1; nextR < N; nextR++) {
					if (!isCandidate[nextR][c]) continue;

					// If nextR === r + 1, check conflict with current combo
					if (nextR === r + 1) {
						let touchesCombo = false;
						for (const placedCol of combo) {
							if (Math.abs(c - placedCol) <= 1) {
								touchesCombo = true;
								break;
							}
						}
						if (touchesCombo) continue;
					}

					futureCandidateCount++;
				}

				if (futureCandidateCount < colRemaining[c]) {
					canProceed = false;
					break;
				}
			}

			// 2. Tree feasibility check:
			// Each tree must either have an adjacent tent already placed, or at least one
			// reachable candidate cell in the future rows.
			if (canProceed) {
				for (const t of puzzle.trees) {
					// Check if tree has a tent already placed (in rows <= r)
					let hasPlacedTent = false;
					for (let checkR = 0; checkR <= r; checkR++) {
						for (const placedCol of tentsByRow[checkR]) {
							if (areOrthogonallyAdjacent(t, { row: checkR, col: placedCol })) {
								hasPlacedTent = true;
								break;
							}
						}
						if (hasPlacedTent) break;
					}

					if (hasPlacedTent) continue;

					// Tree has no placed tent yet. Does it have any valid candidate in rows > r?
					let hasFutureNeighbor = false;
					const potentialNeighbors = [
						{ row: t.row - 1, col: t.col },
						{ row: t.row + 1, col: t.col },
						{ row: t.row, col: t.col - 1 },
						{ row: t.row, col: t.col + 1 },
					];

					for (const neighbor of potentialNeighbors) {
						if (
							neighbor.row > r &&
							neighbor.row < N &&
							neighbor.col >= 0 &&
							neighbor.col < N &&
							isCandidate[neighbor.row][neighbor.col] &&
							colRemaining[neighbor.col] > 0
						) {
							// Check if neighbor in row r + 1 touches combo
							if (neighbor.row === r + 1) {
								let touchesCombo = false;
								for (const placedCol of combo) {
									if (Math.abs(neighbor.col - placedCol) <= 1) {
										touchesCombo = true;
										break;
									}
								}
								if (touchesCombo) continue;
							}

							hasFutureNeighbor = true;
							break;
						}
					}

					if (!hasFutureNeighbor) {
						canProceed = false;
						break;
					}
				}
			}

			if (canProceed) {
				search(r + 1);
			}

			// Undo tentative placement
			for (const c of combo) {
				colRemaining[c]++;
			}
			tentsByRow[r] = [];

			if (solutions.length >= maxSolutions) return;
		}
	}

	search(0);

	return {
		solutions,
		isUnique: solutions.length === 1,
	};
}
