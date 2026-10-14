import { computeClues } from './clues.ts';

/**
 * Line solver result for a single row or column.
 */
export interface LineSolveResult {
	/** Deduced line state where 1 is filled, 0 is crossed/empty, and -1 is unknown. Null if contradictory. */
	deduced: number[] | null;
	/** Number of valid line configurations compatible with current known cells. */
	validCount: number;
}

/**
 * Solves a single nonogram line (row or column) using constraint propagation across all
 * valid configurations of the given clues.
 *
 * @param length Total length of the line.
 * @param clues Target clue runs for this line (e.g. [2, 1] or [0] for empty line).
 * @param current Current cell states for the line (1 = filled, 0 = crossed/empty, -1 = unknown).
 */
export function solveLine(length: number, clues: readonly number[], current: readonly number[]): LineSolveResult {
	if (clues.length === 1 && clues[0] === 0) {
		for (let i = 0; i < length; i++) {
			if (current[i] === 1) {
				return { deduced: null, validCount: 0 };
			}
		}
		return { deduced: new Array(length).fill(0), validCount: 1 };
	}

	const canBe1 = new Array(length).fill(false);
	const canBe0 = new Array(length).fill(false);
	let validCount = 0;

	function search(runIdx: number, pos: number, lineSoFar: number[]) {
		if (runIdx === clues.length) {
			for (let i = pos; i < length; i++) {
				if (current[i] === 1) {
					return;
				}
				lineSoFar[i] = 0;
			}
			validCount++;
			for (let i = 0; i < length; i++) {
				if (lineSoFar[i] === 1) {
					canBe1[i] = true;
				} else {
					canBe0[i] = true;
				}
			}
			return;
		}

		const runLen = clues[runIdx];
		let remSpace = 0;
		for (let r = runIdx + 1; r < clues.length; r++) {
			remSpace += clues[r] + 1;
		}
		const maxStart = length - remSpace - runLen;

		for (let start = pos; start <= maxStart; start++) {
			let valid = true;
			for (let i = pos; i < start; i++) {
				if (current[i] === 1) {
					valid = false;
					break;
				}
				lineSoFar[i] = 0;
			}
			if (!valid) {
				break;
			}

			for (let i = start; i < start + runLen; i++) {
				if (current[i] === 0) {
					valid = false;
					break;
				}
				lineSoFar[i] = 1;
			}
			if (!valid) {
				continue;
			}

			const after = start + runLen;
			if (after < length) {
				if (current[after] === 1) {
					continue;
				}
				lineSoFar[after] = 0;
				search(runIdx + 1, after + 1, lineSoFar);
			} else {
				search(runIdx + 1, after, lineSoFar);
			}
		}
	}

	const tempLine = new Array(length).fill(0);
	search(0, 0, tempLine);

	if (validCount === 0) {
		return { deduced: null, validCount: 0 };
	}

	const deduced = new Array(length).fill(-1);
	for (let i = 0; i < length; i++) {
		if (canBe1[i] && !canBe0[i]) {
			deduced[i] = 1;
		} else if (canBe0[i] && !canBe1[i]) {
			deduced[i] = 0;
		} else {
			deduced[i] = -1;
		}
	}

	return { deduced, validCount };
}

/**
 * Iterative 2D line solver that alternates between rows and columns, deducing cells
 * through line overlap without guessing or backtracking.
 */
export function solveNonogram(
	width: number,
	height: number,
	rowClues: readonly (readonly number[])[],
	colClues: readonly (readonly number[])[],
): { solved: boolean; grid: number[]; iterations: number } {
	const grid = new Array(width * height).fill(-1);
	let iterations = 0;
	let changed = true;

	while (changed) {
		changed = false;
		iterations++;

		// Process rows
		for (let r = 0; r < height; r++) {
			const row = grid.slice(r * width, (r + 1) * width);
			const { deduced, validCount } = solveLine(width, rowClues[r], row);
			if (!deduced || validCount === 0) {
				return { solved: false, grid, iterations };
			}
			for (let c = 0; c < width; c++) {
				if (grid[r * width + c] === -1 && deduced[c] !== -1) {
					grid[r * width + c] = deduced[c];
					changed = true;
				}
			}
		}

		// Process columns
		for (let c = 0; c < width; c++) {
			const col = [];
			for (let r = 0; r < height; r++) {
				col.push(grid[r * width + c]);
			}
			const { deduced, validCount } = solveLine(height, colClues[c], col);
			if (!deduced || validCount === 0) {
				return { solved: false, grid, iterations };
			}
			for (let r = 0; r < height; r++) {
				if (grid[r * width + c] === -1 && deduced[r] !== -1) {
					grid[r * width + c] = deduced[r];
					changed = true;
				}
			}
		}
	}

	const isComplete = grid.every((cell) => cell !== -1);
	return { solved: isComplete, grid, iterations };
}

/**
 * Checks whether a binary solution grid produces clues that are uniquely
 * and deterministically solvable using line deductions alone without guessing.
 */
export function isUniquelySolvable(grid: readonly number[], width: number, height: number): boolean {
	const { rowClues, colClues } = computeClues(grid as number[], width, height);
	const result = solveNonogram(width, height, rowClues, colClues);
	return result.solved && result.grid.every((val, idx) => val === grid[idx]);
}
