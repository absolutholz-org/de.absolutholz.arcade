import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canRedo, canUndo, createHistory, pushHistory, redoHistory, resetHistory, undoHistory } from './history.ts';
import type { LaserGrid } from './types.ts';

const gridA: LaserGrid = [[{ row: 0, col: 0, kind: 'mirror', orientation: '/' }]];
const gridB: LaserGrid = [[{ row: 0, col: 0, kind: 'mirror', orientation: '\\' }]];

describe('Laser & Mirrors Undo/Redo History', () => {
	it('tracks push, undo, redo, and reset cleanly', () => {
		let history = createHistory(gridA);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);

		history = pushHistory(history, gridB);
		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);
		assert.equal(history.present, gridB);

		history = undoHistory(history);
		assert.equal(history.present, gridA);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), true);

		history = redoHistory(history);
		assert.equal(history.present, gridB);
		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);

		history = resetHistory(gridA);
		assert.equal(history.present, gridA);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);
	});
});
