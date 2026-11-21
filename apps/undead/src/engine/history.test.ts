import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushHistory, redoHistory, undoHistory } from './history.ts';

describe('Undead History Stack', () => {
	it('supports push, undo, redo, and clears redo branch on new push', () => {
		let h = createHistory('a');
		assert.equal(canUndo(h), false);
		assert.equal(canRedo(h), false);

		h = pushHistory(h, 'b');
		h = pushHistory(h, 'c');
		assert.equal(h.present, 'c');
		assert.equal(canUndo(h), true);
		assert.equal(canRedo(h), false);

		h = undoHistory(h);
		assert.equal(h.present, 'b');
		assert.equal(canRedo(h), true);

		h = redoHistory(h);
		assert.equal(h.present, 'c');
		assert.equal(canRedo(h), false);

		h = undoHistory(h);
		h = pushHistory(h, 'd');
		assert.equal(h.present, 'd');
		assert.equal(canRedo(h), false);
	});
});
