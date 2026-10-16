import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { STATIC_PUZZLES, createBoardFromPuzzle } from './puzzles.ts';
import { countTracksSolutions, hasUniqueSolution, solveTracksPuzzle } from './solver.ts';
import { DIFFICULTY_LEVELS } from './types.ts';
import { checkVictory } from './validator.ts';

describe('Tracks Solver', () => {
	it('uniquely solves all static puzzles across easy, medium, hard, and expert', () => {
		for (const diff of DIFFICULTY_LEVELS) {
			for (const puzzle of STATIC_PUZZLES[diff]) {
				assert.equal(hasUniqueSolution(puzzle), true, `Expected ${puzzle.id} to have a unique solution`);
				assert.equal(countTracksSolutions(puzzle, 2), 1);

				const solvedPath = solveTracksPuzzle(puzzle);
				assert.ok(solvedPath, `Expected solver to find a solution for ${puzzle.id}`);
				assert.equal(solvedPath.length, puzzle.solution.length);

				const board = createBoardFromPuzzle(puzzle);
				for (const step of solvedPath) {
					board.grid[step.row][step.col] = step.track;
				}
				assert.equal(checkVictory(board), true);
			}
		}
	});

	it('returns null and 0 solutions for impossible puzzles', () => {
		const base = STATIC_PUZZLES.easy[0];
		const badClues = {
			...base,
			rowClues: [0, 0, 0, 0, 0, 0],
		};
		assert.equal(solveTracksPuzzle(badClues), null);
		assert.equal(countTracksSolutions(badClues), 0);
		assert.equal(hasUniqueSolution(badClues), false);
	});
});
