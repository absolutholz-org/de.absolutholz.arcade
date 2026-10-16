import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateTracksPuzzle } from './generator.ts';
import { createBoardFromPuzzle } from './puzzles.ts';
import { hasUniqueSolution } from './solver.ts';
import { DIFFICULTY_GRID_SIZES, DIFFICULTY_LEVELS } from './types.ts';
import { checkVictory } from './validator.ts';

describe('Tracks Generator', () => {
	it('generates uniquely solvable puzzles for all difficulty levels with deterministic seeds', () => {
		for (const diff of DIFFICULTY_LEVELS) {
			const { width } = DIFFICULTY_GRID_SIZES[diff];
			const puzzle = generateTracksPuzzle(width, diff, `test-${diff}`, 101);

			assert.equal(puzzle.id, `test-${diff}`);
			assert.equal(puzzle.difficulty, diff);
			assert.equal(puzzle.size, width);
			assert.equal(puzzle.rowClues.length, width);
			assert.equal(puzzle.colClues.length, width);
			assert.equal(hasUniqueSolution(puzzle), true);

			const board = createBoardFromPuzzle(puzzle);
			for (const step of puzzle.solution) {
				board.grid[step.row][step.col] = step.track;
			}
			assert.equal(checkVictory(board), true);
		}
	});
});
