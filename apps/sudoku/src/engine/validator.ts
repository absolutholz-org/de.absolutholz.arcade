import type { SudokuGrid } from './types';

/**
 * Checks if a specific cell value conflicts with any other cell in its row, column, or 3×3 block.
 */
export function hasCellConflict(grid: SudokuGrid, row: number, col: number, value: number | null): boolean {
	if (value === null) return false;

	// Check row
	for (let c = 0; c < 9; c += 1) {
		if (c !== col && grid[row][c].value === value) {
			return true;
		}
	}

	// Check column
	for (let r = 0; r < 9; r += 1) {
		if (r !== row && grid[r][col].value === value) {
			return true;
		}
	}

	// Check 3×3 block
	const startRow = Math.floor(row / 3) * 3;
	const startCol = Math.floor(col / 3) * 3;

	for (let r = 0; r < 3; r += 1) {
		for (let c = 0; c < 3; c += 1) {
			const curRow = startRow + r;
			const curCol = startCol + c;
			if ((curRow !== row || curCol !== col) && grid[curRow][curCol].value === value) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Identifies all cells on the board that are currently in conflict (duplicate values
 * within the same row, column, or 3×3 block).
 * Returns a Set of coordinate keys in "row,col" format.
 */
export function findAllConflicts(grid: SudokuGrid): Set<string> {
	const conflicts = new Set<string>();

	for (let r = 0; r < 9; r += 1) {
		for (let c = 0; c < 9; c += 1) {
			const cellValue = grid[r][c].value;
			if (cellValue !== null && hasCellConflict(grid, r, c, cellValue)) {
				conflicts.add(`${r},${c}`);
			}
		}
	}

	return conflicts;
}

/**
 * Checks whether the puzzle is completely and correctly solved:
 * all 81 cells are non-null and there are zero conflicts.
 */
export function isBoardComplete(grid: SudokuGrid): boolean {
	for (let r = 0; r < 9; r += 1) {
		for (let c = 0; c < 9; c += 1) {
			if (grid[r][c].value === null) {
				return false;
			}
		}
	}

	return findAllConflicts(grid).size === 0;
}
