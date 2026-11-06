import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateStarBattlePuzzle } from './generator.ts';
import { isValidRegionLayout } from './regionLayout.ts';
import { countSolutions } from './solver.ts';
import type { CellState } from './types.ts';
import { isBoardSolved } from './validator.ts';

describe('Star Battle Generator & Procedural Quick Play', () => {
	test('generates a valid, solvable Star Battle puzzle for easy (6x6)', () => {
		const puzzle = generateStarBattlePuzzle('easy', 'test-easy-1', 42);

		assert.strictEqual(puzzle.size, 6);
		assert.strictEqual(puzzle.difficulty, 'easy');
		assert.strictEqual(puzzle.regions.length, 6);
		assert.strictEqual(puzzle.solution.length, 6);
		assert.strictEqual(isValidRegionLayout(puzzle.regions, 6), true);

		// Verify unique solution
		const numSolutions = countSolutions(puzzle.regions, 6, 2);
		assert.strictEqual(numSolutions, 1);

		// Verify the planted solution solves the board
		const board: CellState[][] = Array.from({ length: 6 }, () => new Array(6).fill('empty'));
		for (const [r, c] of puzzle.solution) {
			board[r][c] = 'token';
		}
		assert.strictEqual(isBoardSolved(board, puzzle.regions, 6), true);
	});

	test('generates a valid, solvable Star Battle puzzle for medium (8x8)', () => {
		const puzzle = generateStarBattlePuzzle('medium', 'test-med-1', 101);

		assert.strictEqual(puzzle.size, 8);
		assert.strictEqual(puzzle.difficulty, 'medium');
		assert.strictEqual(isValidRegionLayout(puzzle.regions, 8), true);

		const numSolutions = countSolutions(puzzle.regions, 8, 2);
		assert.strictEqual(numSolutions, 1);
	});

	test('produces deterministic output with identical seeds', () => {
		const p1 = generateStarBattlePuzzle('easy', 'test-p1', 9999);
		const p2 = generateStarBattlePuzzle('easy', 'test-p2', 9999);

		assert.deepStrictEqual(p1.regions, p2.regions);
		assert.deepStrictEqual(p1.solution, p2.solution);
	});
});
