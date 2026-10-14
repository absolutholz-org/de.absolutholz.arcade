import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushState, redo, reset, resetBoardState, undo } from './history.ts';
import type { BoardState, Island } from './types.ts';
import { toggleBridge } from './validator.ts';

describe('Hashiwokakero History Engine', () => {
	const islands: Island[] = [
		{ id: 'a', x: 0, y: 0, target: 2 },
		{ id: 'b', x: 2, y: 0, target: 2 },
	];

	const initialBoard: BoardState = {
		islands,
		bridges: [],
		difficulty: 'beginner',
		width: 6,
		height: 6,
	};

	it('initializes with empty past and future', () => {
		const history = createHistory(initialBoard);
		assert.equal(history.past.length, 0);
		assert.equal(history.present.bridges.length, 0);
		assert.equal(history.future.length, 0);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);
	});

	it('pushes new states and clears redo future', () => {
		const h0 = createHistory(initialBoard);
		const boardWith1Bridge = toggleBridge('a', 'b', initialBoard);

		const h1 = pushState(h0, boardWith1Bridge);
		assert.equal(h1.past.length, 1);
		assert.equal(h1.present.bridges.length, 1);
		assert.equal(h1.future.length, 0);
		assert.equal(canUndo(h1), true);
		assert.equal(canRedo(h1), false);
	});

	it('handles undo and redo cycles', () => {
		const h0 = createHistory(initialBoard);
		const boardWith1 = toggleBridge('a', 'b', initialBoard);
		const boardWith2 = toggleBridge('a', 'b', boardWith1);

		const h1 = pushState(h0, boardWith1);
		const h2 = pushState(h1, boardWith2);

		assert.equal(h2.present.bridges[0].count, 2);

		// Undo to boardWith1
		const hUndo1 = undo(h2);
		assert.equal(hUndo1.present.bridges[0].count, 1);
		assert.equal(canUndo(hUndo1), true);
		assert.equal(canRedo(hUndo1), true);

		// Undo to initialBoard
		const hUndo2 = undo(hUndo1);
		assert.equal(hUndo2.present.bridges.length, 0);
		assert.equal(canUndo(hUndo2), false);
		assert.equal(canRedo(hUndo2), true);

		// Redo back to boardWith1
		const hRedo1 = redo(hUndo2);
		assert.equal(hRedo1.present.bridges[0].count, 1);
		assert.equal(canUndo(hRedo1), true);

		// Redo back to boardWith2
		const hRedo2 = redo(hRedo1);
		assert.equal(hRedo2.present.bridges[0].count, 2);
		assert.equal(canRedo(hRedo2), false);
	});

	it('resets the board and allows undoing the reset', () => {
		const h0 = createHistory(initialBoard);
		const boardWith2 = toggleBridge('a', 'b', toggleBridge('a', 'b', initialBoard));
		const h1 = pushState(h0, boardWith2);

		assert.equal(h1.present.bridges.length, 1);

		const hReset = reset(h1);
		assert.equal(hReset.present.bridges.length, 0);
		assert.equal(canUndo(hReset), true);

		// Undoing the reset restores the previous board state
		const hRestored = undo(hReset);
		assert.equal(hRestored.present.bridges.length, 1);
		assert.equal(hRestored.present.bridges[0].count, 2);
	});

	it('resets board state directly via resetBoardState', () => {
		const boardWithBridge = toggleBridge('a', 'b', initialBoard);
		assert.equal(boardWithBridge.bridges.length, 1);

		const cleared = resetBoardState(boardWithBridge);
		assert.equal(cleared.bridges.length, 0);
		assert.deepEqual(cleared.islands, initialBoard.islands);
	});
});
