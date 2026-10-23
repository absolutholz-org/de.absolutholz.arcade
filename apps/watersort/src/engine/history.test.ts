import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushState, redo, reset, undo } from './history.ts';
import type { Board } from './types.ts';
import { applyPour } from './validator.ts';

describe('Water Sort History', () => {
	const initial: Board = [[0, 1], []];
	const poured = applyPour(initial, { from: 0, to: 1 });

	it('supports immutable push, undo and redo', () => {
		let history = createHistory(initial);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);

		history = pushState(history, poured);
		assert.equal(canUndo(history), true);
		assert.equal(history.present, poured);

		history = undo(history);
		assert.equal(history.present, initial);
		assert.equal(canRedo(history), true);

		history = redo(history);
		assert.equal(history.present, poured);
		assert.equal(canRedo(history), false);
	});

	it('clears the redo future when a new move is pushed after undo', () => {
		let history = pushState(createHistory(initial), poured);
		history = undo(history);
		history = pushState(history, applyPour(initial, { from: 0, to: 1 }));
		assert.equal(canRedo(history), false);
	});

	it('resets to the starting board while keeping the reset undoable', () => {
		const fresh = createHistory(initial);
		assert.equal(reset(fresh), fresh, 'reset on an untouched board is a no-op');

		let history = pushState(fresh, poured);
		history = reset(history);
		assert.equal(history.present, initial);
		assert.equal(canUndo(history), true);
		assert.equal(undo(history).present, poured);
	});

	it('ignores undo and redo when unavailable', () => {
		const history = createHistory(initial);
		assert.equal(undo(history), history);
		assert.equal(redo(history), history);
	});
});
