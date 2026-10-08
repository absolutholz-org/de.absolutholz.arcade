import type { MoveAction, SudokuGrid } from './types';

/**
 * Creates an immutable clone of a SudokuGrid.
 */
export function cloneGrid(grid: SudokuGrid): SudokuGrid {
	return grid.map((row) =>
		row.map((cell) => ({
			...cell,
			notes: [...cell.notes],
		})),
	);
}

/**
 * Finds and clears matching candidate notes in all peer cells (row, column, 3×3 block)
 * when a confirmed digit is placed.
 * Returns the list of modified notes so they can be accurately restored on Undo.
 */
export function autoClearPeerNotes(
	grid: SudokuGrid,
	row: number,
	col: number,
	digit: number,
): { row: number; col: number; digit: number }[] {
	const cleared: { row: number; col: number; digit: number }[] = [];
	const noteIndex = digit - 1;

	const startRow = Math.floor(row / 3) * 3;
	const startCol = Math.floor(col / 3) * 3;

	for (let r = 0; r < 9; r += 1) {
		for (let c = 0; c < 9; c += 1) {
			const isPeer =
				r === row || c === col || (r >= startRow && r < startRow + 3 && c >= startCol && c < startCol + 3);

			if (isPeer && (r !== row || c !== col)) {
				if (grid[r][c].notes[noteIndex]) {
					cleared.push({ row: r, col: c, digit });
				}
			}
		}
	}

	return cleared;
}

/**
 * Applies a forward move to the grid and returns a new grid state.
 */
export function applyMove(grid: SudokuGrid, move: MoveAction): SudokuGrid {
	const next = cloneGrid(grid);
	const { row, col } = move;

	switch (move.type) {
		case 'setValue':
			next[row][col].value = move.nextValue;
			if (move.clearedOwnNotes) {
				next[row][col].notes = Array(9).fill(false);
			}
			if (move.autoClearedNotes) {
				for (const item of move.autoClearedNotes) {
					next[item.row][item.col].notes[item.digit - 1] = false;
				}
			}
			break;

		case 'clearValue':
			next[row][col].value = null;
			break;

		case 'toggleNote':
			next[row][col].notes[move.digit - 1] = move.nextValue;
			break;

		case 'clearNotes':
			next[row][col].notes = Array(9).fill(false);
			break;
	}

	return next;
}

/**
 * Reverses a previously applied move and returns the restored grid state.
 */
export function undoMove(grid: SudokuGrid, move: MoveAction): SudokuGrid {
	const prev = cloneGrid(grid);
	const { row, col } = move;

	switch (move.type) {
		case 'setValue':
			prev[row][col].value = move.prevValue;
			if (move.clearedOwnNotes && move.prevNotes) {
				prev[row][col].notes = [...move.prevNotes];
			}
			if (move.autoClearedNotes) {
				for (const item of move.autoClearedNotes) {
					prev[item.row][item.col].notes[item.digit - 1] = true;
				}
			}
			break;

		case 'clearValue':
			prev[row][col].value = move.prevValue;
			prev[row][col].notes = [...move.prevNotes];
			break;

		case 'toggleNote':
			prev[row][col].notes[move.digit - 1] = move.prevValue;
			break;

		case 'clearNotes':
			prev[row][col].notes = [...move.prevNotes];
			break;
	}

	return prev;
}
