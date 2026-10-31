import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createEmptyBoard } from './board.ts';
import { canRedo, canUndo, createHistory, pushHistory, redoHistory, undoHistory } from './history.ts';
import type { Cell } from './types.ts';

describe('Minesweeper history engine', () => {
	it('manages undo and redo stacks correctly', () => {
		const board0 = createEmptyBoard(5, 5);
		const step0 = { cells: board0, minesPlaced: false, status: 'not_started' as const };

		const h0 = createHistory(step0);
		assert.equal(canUndo(h0), false);
		assert.equal(canRedo(h0), false);
		assert.equal(undoHistory(h0), h0);
		assert.equal(redoHistory(h0), h0);

		// Make a move
		const board1: Cell[] = board0.map((c, i) => (i === 0 ? { ...c, state: 'revealed' as const } : c));
		const step1 = { cells: board1, minesPlaced: true, status: 'playing' as const };
		const h1 = pushHistory(h0, step1);

		assert.equal(canUndo(h1), true);
		assert.equal(canRedo(h1), false);
		assert.equal(h1.present.cells[0]?.state, 'revealed');

		// Make another move (flagging)
		const board2: Cell[] = board1.map((c, i) => (i === 1 ? { ...c, state: 'flagged' as const } : c));
		const step2 = { cells: board2, minesPlaced: true, status: 'playing' as const };
		const h2 = pushHistory(h1, step2);

		assert.equal(canUndo(h2), true);
		assert.equal(canRedo(h2), false);
		assert.equal(h2.past.length, 2);

		// Undo back to step 1
		const hUndo1 = undoHistory(h2);
		assert.equal(hUndo1.present.cells[1]?.state, 'unexplored');
		assert.equal(canUndo(hUndo1), true);
		assert.equal(canRedo(hUndo1), true);

		// Undo back to step 0
		const hUndo2 = undoHistory(hUndo1);
		assert.equal(hUndo2.present.cells[0]?.state, 'unexplored');
		assert.equal(canUndo(hUndo2), false);
		assert.equal(canRedo(hUndo2), true);

		// Redo back to step 1
		const hRedo1 = redoHistory(hUndo2);
		assert.equal(hRedo1.present.cells[0]?.state, 'revealed');
		assert.equal(canUndo(hRedo1), true);
		assert.equal(canRedo(hRedo1), true);

		// Push clear future
		const board3: Cell[] = board1.map((c, i) => (i === 2 ? { ...c, state: 'flagged' as const } : c));
		const step3 = { cells: board3, minesPlaced: true, status: 'playing' as const };
		const hBranch = pushHistory(hRedo1, step3);

		assert.equal(canRedo(hBranch), false);
		assert.equal(hBranch.future.length, 0);
	});
});
