import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushMove, redoMove, undoMove } from './history.ts';
import { DIR_EAST, DIR_NORTH, type Move } from './types.ts';

describe('Net Engine: History', () => {
	it('supports pushing moves, undoing and redoing', () => {
		let history = createHistory();
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);

		const move1: Move = {
			row: 1,
			col: 1,
			previousMask: DIR_NORTH,
			newMask: DIR_EAST,
			previousRotation: 0,
			newRotation: 90,
		};

		history = pushMove(history, move1);
		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);

		// Undo
		const undone = undoMove(history);
		history = undone.nextHistory;
		assert.deepEqual(undone.move, move1);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), true);

		// Redo
		const redone = redoMove(history);
		history = redone.nextHistory;
		assert.deepEqual(redone.move, move1);
		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);
	});

	it('clears future redo stack when new move is pushed after undo', () => {
		let history = createHistory();
		const move1: Move = {
			row: 0,
			col: 0,
			previousMask: 1,
			newMask: 2,
			previousRotation: 0,
			newRotation: 90,
		};
		const move2: Move = {
			row: 0,
			col: 0,
			previousMask: 2,
			newMask: 4,
			previousRotation: 90,
			newRotation: 180,
		};

		history = pushMove(history, move1);
		history = undoMove(history).nextHistory;
		assert.equal(canRedo(history), true);

		history = pushMove(history, move2);
		assert.equal(canRedo(history), false);
		assert.equal(history.past.length, 1);
		assert.deepEqual(history.past[0], move2);
	});
});
