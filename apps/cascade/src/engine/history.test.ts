import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateBoard } from './generator.ts';
import {
	canRedo,
	canUndo,
	createHistory,
	getCurrentSnapshot,
	pushHistory,
	redoHistory,
	undoHistory,
} from './history.ts';
import { DIFFICULTY_CONFIGS } from './types.ts';

describe('Cascade move history', () => {
	it('supports push, undo, redo, and branching truncation', () => {
		const { board } = generateBoard('normal', 99);
		const totalTiles = DIFFICULTY_CONFIGS.normal.cols * DIFFICULTY_CONFIGS.normal.rows;
		const initial = {
			board,
			score: 0,
			movesCount: 0,
			maxClusterCleared: 0,
			remainingTiles: totalTiles,
		};

		let history = createHistory(initial);
		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);

		history = pushHistory(history, {
			...initial,
			score: 16,
			movesCount: 1,
			maxClusterCleared: 6,
			remainingTiles: 144,
		});
		history = pushHistory(history, {
			...initial,
			score: 41,
			movesCount: 2,
			maxClusterCleared: 7,
			remainingTiles: 137,
		});
		assert.equal(canUndo(history), true);
		assert.equal(canRedo(history), false);
		assert.equal(getCurrentSnapshot(history).score, 41);

		history = undoHistory(history);
		assert.equal(getCurrentSnapshot(history).score, 16);
		assert.equal(canRedo(history), true);

		history = redoHistory(history);
		assert.equal(getCurrentSnapshot(history).score, 41);

		// Undo then push a new branch should clear redo stack
		history = undoHistory(history);
		history = pushHistory(history, {
			...initial,
			score: 25,
			movesCount: 2,
			maxClusterCleared: 5,
			remainingTiles: 139,
		});
		assert.equal(canRedo(history), false);
		assert.equal(getCurrentSnapshot(history).score, 25);
	});
});
