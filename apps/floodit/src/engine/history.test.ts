import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createHistory, pushState, redo, undo } from './history.ts';
import type { BoardState } from './types.ts';
import { calculateBoardState } from './validator.ts';

describe('Flood-It Engine: History (Undo/Redo)', () => {
	it('correctly tracks undo and redo steps', () => {
		const s1 = calculateBoardState(
			[
				[0, 1],
				[2, 3],
			],
			0,
			10,
			1,
		);
		const s2 = calculateBoardState(
			[
				[1, 1],
				[2, 3],
			],
			1,
			10,
			1,
		);
		const s3 = calculateBoardState(
			[
				[2, 2],
				[2, 3],
			],
			2,
			10,
			1,
		);

		let history = createHistory(s1);
		assert.equal(history.past.length, 0);
		assert.equal(history.present, s1);

		history = pushState(history, s2);
		assert.equal(history.past.length, 1);
		assert.equal(history.present, s2);

		history = pushState(history, s3);
		assert.equal(history.past.length, 2);
		assert.equal(history.present, s3);

		// Undo back to s2
		history = undo(history);
		assert.equal(history.present, s2);
		assert.equal(history.future.length, 1);

		// Undo back to s1
		history = undo(history);
		assert.equal(history.present, s1);
		assert.equal(history.past.length, 0);

		// Redo forward to s2
		history = redo(history);
		assert.equal(history.present, s2);
		assert.equal(history.future.length, 1);

		// Redo forward to s3
		history = redo(history);
		assert.equal(history.present, s3);
		assert.equal(history.future.length, 0);
	});
});
