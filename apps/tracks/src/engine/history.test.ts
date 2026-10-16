import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	canRedo,
	canUndo,
	cloneBoardState,
	createHistory,
	pushState,
	redo,
	reset,
	resetBoardState,
	undo,
} from './history.ts';
import { STATIC_PUZZLES, createBoardFromPuzzle } from './puzzles.ts';

describe('Tracks History', () => {
	it('manages immutable undo, redo, and reset operations while preserving fixedCells', () => {
		const puzzle = STATIC_PUZZLES.easy[0];
		const initialBoard = createBoardFromPuzzle(puzzle);
		let history = createHistory(initialBoard);

		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);

		// Find a non-fixed cell to modify
		let targetRow = -1;
		let targetCol = -1;
		for (let r = 0; r < initialBoard.size && targetRow === -1; r++) {
			for (let c = 0; c < initialBoard.size && targetCol === -1; c++) {
				if (initialBoard.grid[r][c] === 'empty') {
					targetRow = r;
					targetCol = c;
				}
			}
		}

		const nextBoard = cloneBoardState(history.present);
		nextBoard.grid[targetRow][targetCol] = 'straight-h';
		history = pushState(history, nextBoard);

		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);
		assert.equal(history.present.grid[targetRow][targetCol], 'straight-h');

		history = undo(history);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), true);
		assert.equal(history.present.grid[targetRow][targetCol], 'empty');

		history = redo(history);
		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);
		assert.equal(history.present.grid[targetRow][targetCol], 'straight-h');

		history = reset(history);
		assert.equal(history.present.grid[targetRow][targetCol], 'empty');
		for (const fixed of puzzle.fixedCells) {
			assert.equal(history.present.grid[fixed.row][fixed.col], fixed.track);
		}

		const directReset = resetBoardState(nextBoard);
		assert.equal(directReset.grid[targetRow][targetCol], 'empty');
		for (const fixed of puzzle.fixedCells) {
			assert.equal(directReset.grid[fixed.row][fixed.col], fixed.track);
		}
	});
});
