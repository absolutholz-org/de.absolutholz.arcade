/**
 * Checks whether placing a digit at (row, col) violates Sudoku constraints.
 */
export function isValidPlacement(grid: number[][], row: number, col: number, num: number): boolean {
	for (let i = 0; i < 9; i += 1) {
		if (grid[row][i] === num && i !== col) return false;
		if (grid[i][col] === num && i !== row) return false;
	}

	const startRow = Math.floor(row / 3) * 3;
	const startCol = Math.floor(col / 3) * 3;

	for (let r = 0; r < 3; r += 1) {
		for (let c = 0; c < 3; c += 1) {
			const curRow = startRow + r;
			const curCol = startCol + c;
			if (grid[curRow][curCol] === num && (curRow !== row || curCol !== col)) {
				return false;
			}
		}
	}

	return true;
}

/**
 * Creates an independent deep clone of a 9×9 board.
 */
export function cloneBoard(grid: number[][]): number[][] {
	return grid.map((row) => [...row]);
}

/**
 * Finds the first empty cell (value === 0).
 */
function findEmptyCell(grid: number[][]): [number, number] | null {
	for (let r = 0; r < 9; r += 1) {
		for (let c = 0; c < 9; c += 1) {
			if (grid[r][c] === 0) return [r, c];
		}
	}
	return null;
}

/**
 * Solves a 9×9 Sudoku grid using deterministic backtracking.
 * Returns the solved 9×9 board, or null if unsolvable.
 */
export function solveBoard(grid: number[][]): number[][] | null {
	const board = cloneBoard(grid);

	function solve(): boolean {
		const empty = findEmptyCell(board);
		if (!empty) return true;

		const [row, col] = empty;
		for (let num = 1; num <= 9; num += 1) {
			if (isValidPlacement(board, row, col, num)) {
				board[row][col] = num;
				if (solve()) return true;
				board[row][col] = 0;
			}
		}
		return false;
	}

	return solve() ? board : null;
}

/**
 * Counts the number of valid solutions for a given board, up to `limit`.
 * Typically used with `limit = 2` to verify unique solvability (`countSolutions === 1`).
 */
export function countSolutions(grid: number[][], limit = 2): number {
	let solutions = 0;
	const board = cloneBoard(grid);

	function backtrack(): void {
		if (solutions >= limit) return;

		const empty = findEmptyCell(board);
		if (!empty) {
			solutions += 1;
			return;
		}

		const [row, col] = empty;
		for (let num = 1; num <= 9; num += 1) {
			if (isValidPlacement(board, row, col, num)) {
				board[row][col] = num;
				backtrack();
				board[row][col] = 0;
				if (solutions >= limit) return;
			}
		}
	}

	backtrack();
	return solutions;
}
