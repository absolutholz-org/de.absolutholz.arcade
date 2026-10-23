import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { solve, suggestHint } from './solver.ts';
import type { Board } from './types.ts';
import { applyPour, canPour, isSolved } from './validator.ts';

function replay(board: Board, moves: readonly { from: number; to: number }[]): Board {
	let current = board;
	for (const move of moves) {
		assert.equal(canPour(current, move), true);
		current = applyPour(current, move);
	}
	return current;
}

describe('Water Sort Solver', () => {
	it('finds the optimal solution for a small board', () => {
		const board: Board = [[0, 0, 1, 1], [1, 1, 0, 0], []];
		const result = solve(board);
		assert.equal(result.status, 'solved');
		assert.equal(result.moves.length, 3);
		assert.equal(isSolved(replay(board, result.moves)), true);
	});

	it('returns an empty solution for an already solved board', () => {
		assert.deepEqual(solve([[0, 0, 0, 0], []]), { status: 'solved', moves: [] });
	});

	it('proves a deadlocked board unsolvable', () => {
		const result = solve([
			[0, 1, 0, 1],
			[1, 0, 1, 0],
		]);
		assert.deepEqual(result, { status: 'unsolvable', moves: [] });
	});

	it('solves generated easy puzzles with a weighted search', () => {
		for (const seed of [1, 2, 3]) {
			const { board } = generatePuzzle('easy', seed);
			const result = solve(board, { heuristicWeight: 3, maxEvaluations: 200000, maxMillis: 20000 });
			assert.equal(result.status, 'solved', `seed ${seed}`);
			assert.equal(isSolved(replay(board, result.moves)), true);
		}
	});

	it('stops at the evaluation budget with a legal partial plan', () => {
		const { board } = generatePuzzle('expert', 7);
		const result = solve(board, { maxEvaluations: 1 });
		assert.equal(result.status, 'budget');
		replay(board, result.moves);
	});

	it('suggests the optimal first pour when the budget allows', () => {
		const board: Board = [[0, 0, 1, 1], [1, 1, 0, 0], []];
		const hint = suggestHint(board);
		assert.ok(hint);
		assert.equal(canPour(board, hint), true);
		assert.equal(solve(applyPour(board, hint)).moves.length, 2);
	});

	it('falls back to a legal pour when the budget expires and returns null when stuck', () => {
		const { board } = generatePuzzle('expert', 11);
		const hint = suggestHint(board, { maxEvaluations: 1 });
		assert.ok(hint);
		assert.equal(canPour(board, hint), true);
		assert.equal(
			suggestHint([
				[0, 1, 0, 1],
				[1, 0, 1, 0],
			]),
			null,
		);
	});
});
