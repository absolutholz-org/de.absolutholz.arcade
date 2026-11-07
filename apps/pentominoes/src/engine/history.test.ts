import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushHistory, redoHistory, undoHistory } from './history.ts';
import type { Placement } from './types.ts';

describe('Move history stack', () => {
	const p1: Placement = {
		pieceId: 'F',
		anchor: { row: 0, col: 0 },
		rotation: 0,
		flipped: false,
	};
	const p2: Placement = {
		pieceId: 'P',
		anchor: { row: 0, col: 2 },
		rotation: 90,
		flipped: false,
	};

	it('supports push, undo, redo, and future invalidation on new push', () => {
		let state = createHistory([]);
		assert.equal(canUndo(state), false);
		assert.equal(canRedo(state), false);

		state = pushHistory(state, [p1]);
		assert.equal(canUndo(state), true);
		assert.equal(state.present.length, 1);

		state = pushHistory(state, [p1, p2]);
		assert.equal(state.present.length, 2);

		state = undoHistory(state);
		assert.equal(state.present.length, 1);
		assert.equal(canRedo(state), true);

		state = redoHistory(state);
		assert.equal(state.present.length, 2);

		state = undoHistory(state);
		state = pushHistory(state, []);
		assert.equal(canRedo(state), false);
		assert.equal(state.present.length, 0);
	});
});
