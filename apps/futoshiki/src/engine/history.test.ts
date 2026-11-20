import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushHistory, redoHistory, undoHistory } from './history.ts';

describe('Futoshiki undo/redo history', () => {
	it('supports push, undo, redo, and clears future on new push', () => {
		let history = createHistory(0);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);

		history = pushHistory(history, 1);
		history = pushHistory(history, 2);
		assert.equal(history.present, 2);
		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);

		history = undoHistory(history);
		assert.equal(history.present, 1);
		assert.equal(canRedo(history), true);

		history = redoHistory(history);
		assert.equal(history.present, 2);
		assert.equal(canRedo(history), false);

		history = undoHistory(history);
		history = pushHistory(history, 3);
		assert.equal(history.present, 3);
		assert.equal(canRedo(history), false);
	});
});
