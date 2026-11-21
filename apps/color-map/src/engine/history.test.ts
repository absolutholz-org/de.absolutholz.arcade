import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushHistory, redoHistory, undoHistory } from './history.ts';

describe('color-map history stack', () => {
	it('supports push, undo, redo, and clears future on new branch', () => {
		let h = createHistory(0);
		assert.equal(canUndo(h), false);
		assert.equal(canRedo(h), false);

		h = pushHistory(h, 1);
		h = pushHistory(h, 2);
		assert.equal(h.present, 2);
		assert.equal(canUndo(h), true);

		h = undoHistory(h);
		assert.equal(h.present, 1);
		assert.equal(canRedo(h), true);

		h = redoHistory(h);
		assert.equal(h.present, 2);
		assert.equal(canRedo(h), false);

		h = undoHistory(h);
		h = pushHistory(h, 99);
		assert.equal(h.present, 99);
		assert.equal(canRedo(h), false);
	});
});
