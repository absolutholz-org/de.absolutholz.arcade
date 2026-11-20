import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countSolutions, getNextHint, requiresInequalities, solveDeductively } from './solver.ts';
import type { InequalitySign } from './types.ts';
import { createBoardFromPuzzle } from './validator.ts';

describe('Futoshiki deductive solver & uniqueness checker', () => {
	it('solves a pure inequality-chain 4×4 puzzle with zero given digits', () => {
		// Row 0: 1 < 2 < 3 < 4
		// Row 1: 2 < 3 < 4 > 1
		// Row 2: 3 < 4 > 1 < 2
		// Row 3: 4 > 1 < 2 < 3
		const givens: (number | null)[][] = Array.from({ length: 4 }, () => Array<number | null>(4).fill(null));
		const hInequalities: InequalitySign[][] = [
			['<', '<', '<'],
			['<', '<', '>'],
			['<', '>', '<'],
			['>', '<', '<'],
		];
		const vInequalities: InequalitySign[][] = [
			['<', '<', '<', '>'],
			['<', '<', '>', '<'],
			['<', '>', '<', '<'],
		];

		const res = solveDeductively(4, givens, hInequalities, vInequalities);
		assert.equal(res.solved, true);
		assert.equal(res.contradiction, false);
		assert.deepEqual(res.grid, [
			[1, 2, 3, 4],
			[2, 3, 4, 1],
			[3, 4, 1, 2],
			[4, 1, 2, 3],
		]);
		assert.equal(countSolutions(4, givens, hInequalities, vInequalities, 2), 1);
		assert.equal(requiresInequalities({ size: 4, givens }), true);
	});

	it('detects multiple solutions when inequalities are stripped', () => {
		const givens: (number | null)[][] = [
			[1, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
		];
		assert.equal(requiresInequalities({ size: 4, givens }), true);
	});

	it('returns a valid logical next hint from the deductive solver', () => {
		const givens: (number | null)[][] = [
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
		];
		const hInequalities: InequalitySign[][] = [
			['<', '<', '<'],
			['<', '<', '>'],
			['<', '>', '<'],
			['>', '<', '<'],
		];
		const vInequalities: InequalitySign[][] = [
			['<', '<', '<', '>'],
			['<', '<', '>', '<'],
			['<', '>', '<', '<'],
		];
		const solution = [
			[1, 2, 3, 4],
			[2, 3, 4, 1],
			[3, 4, 1, 2],
			[4, 1, 2, 3],
		];

		const board = createBoardFromPuzzle({
			id: 'test-hint',
			difficulty: 'easy',
			size: 4,
			givens,
			solution,
			hInequalities,
			vInequalities,
		});

		const hint = getNextHint(board, solution);
		assert.ok(hint !== null);
		assert.equal(hint.value, solution[hint.row][hint.col]);
	});
});
