import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Board } from './types.ts';
import {
	applyPour,
	canPour,
	getLegalMoves,
	getTopRunLength,
	isDeadlocked,
	isSolved,
	isValidBoard,
} from './validator.ts';

describe('Water Sort Validator', () => {
	it('measures the contiguous top run of a tube', () => {
		assert.equal(getTopRunLength([]), 0);
		assert.equal(getTopRunLength([0, 1, 1, 1]), 3);
		assert.equal(getTopRunLength([1, 0]), 1);
	});

	it('allows pours only onto empty tubes or matching tops with free space', () => {
		const board: Board = [[0, 1], [2, 2, 2, 2], [1, 3], []];
		assert.equal(canPour(board, { from: 0, to: 3 }), true);
		assert.equal(canPour(board, { from: 0, to: 1 }), false, 'full target');
		assert.equal(canPour(board, { from: 0, to: 2 }), false, 'top color mismatch');
		assert.equal(canPour(board, { from: 3, to: 0 }), false, 'empty source');
		assert.equal(canPour(board, { from: 0, to: 0 }), false, 'same tube');
		assert.equal(canPour(board, { from: 0, to: 9 }), false, 'unknown tube');
	});

	it('moves the whole top run limited by target space without mutating the input', () => {
		const board: Board = [[0, 1, 1, 1], [2, 1], []];
		const snapshot = JSON.stringify(board);
		const next = applyPour(board, { from: 0, to: 1 });
		assert.deepEqual(next, [[0, 1], [2, 1, 1, 1], []]);
		assert.equal(JSON.stringify(board), snapshot);
		assert.equal(applyPour(board, { from: 2, to: 0 }), board, 'illegal pour returns the same board');
	});

	it('detects the solved state', () => {
		assert.equal(isSolved([[0, 0, 0, 0], [], [1, 1, 1, 1]]), true);
		assert.equal(isSolved([[0, 0, 0], [0], []]), false);
		assert.equal(
			isSolved([
				[0, 1, 0, 1],
				[1, 0, 1, 0],
			]),
			false,
		);
	});

	it('detects deadlocks only when no legal pour remains and the board is unsolved', () => {
		assert.equal(
			isDeadlocked([
				[0, 1, 0, 1],
				[1, 0, 1, 0],
			]),
			true,
		);
		assert.equal(isDeadlocked([[0, 0, 0, 0], [1, 1, 1, 1], []]), false, 'solved');
		assert.equal(isDeadlocked([[0, 1], [1], []]), false);
	});

	it('lists progress-making moves and skips uniform-to-empty and duplicate-empty pours', () => {
		assert.deepEqual(getLegalMoves([[0, 0], [1, 1], [], []]), []);
		assert.deepEqual(getLegalMoves([[0, 1], [1], [], []]), [
			{ from: 0, to: 1 },
			{ from: 0, to: 2 },
			{ from: 1, to: 0 },
		]);
	});

	it('validates color counts and tube sizes', () => {
		assert.equal(isValidBoard([[0, 0, 0, 0], [1, 1, 1, 1], []], 2), true);
		assert.equal(isValidBoard([[0, 0, 0, 0], [1, 1, 1], []], 2), false);
		assert.equal(isValidBoard([[0, 0, 0, 0, 0], [1, 1, 1], []], 2), false);
		assert.equal(
			isValidBoard(
				[
					[0, 0, 0, 0],
					[5, 5, 5, 5],
				],
				2,
			),
			false,
		);
	});
});
