import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { countSolutions, requiresInequalities, solveDeductively } from './solver.ts';
import { DIFFICULTIES, DIFFICULTY_CONFIG } from './types.ts';
import { createBoardFromPuzzle, isBoardComplete } from './validator.ts';

describe('Futoshiki puzzle generator', () => {
	for (const difficulty of DIFFICULTIES) {
		it(`generates uniquely & deductively solvable ${difficulty} puzzles requiring inequalities`, () => {
			const expectedSize = DIFFICULTY_CONFIG[difficulty].size;
			const seeds = [101, 202, 303];

			for (const seed of seeds) {
				const puzzle = generatePuzzle(difficulty, seed);
				assert.equal(puzzle.size, expectedSize);
				assert.equal(puzzle.difficulty, difficulty);

				// 1. Solution must be a valid completed board
				const solvedBoard = createBoardFromPuzzle(puzzle, puzzle.solution);
				assert.equal(isBoardComplete(solvedBoard), true);

				// 2. Deductive solver must solve it strictly by logic without guessing
				const deductive = solveDeductively(
					puzzle.size,
					puzzle.givens,
					puzzle.hInequalities,
					puzzle.vInequalities,
				);
				assert.equal(deductive.solved, true, `Seed ${seed} (${difficulty}) should be deductively solvable`);
				assert.deepEqual(deductive.grid, puzzle.solution);

				// 3. Backtracking solver must verify uniqueness
				const solutionCount = countSolutions(
					puzzle.size,
					puzzle.givens,
					puzzle.hInequalities,
					puzzle.vInequalities,
					2,
				);
				assert.equal(solutionCount, 1, `Seed ${seed} (${difficulty}) must have a unique solution`);

				// 4. Inequalities must be strictly required
				assert.equal(
					requiresInequalities(puzzle),
					true,
					`Seed ${seed} (${difficulty}) must require inequalities`,
				);
			}
		});
	}
});
