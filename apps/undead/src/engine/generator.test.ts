import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { countSolutions } from './solver.ts';
import { DIFFICULTIES, DIFFICULTY_CONFIG } from './types.ts';
import { validateBoard } from './validator.ts';

describe('Undead Procedural Puzzle Generator', () => {
	for (const difficulty of DIFFICULTIES) {
		it(`generates a strictly unique ${difficulty} (${DIFFICULTY_CONFIG[difficulty].size}x${DIFFICULTY_CONFIG[difficulty].size}) puzzle`, () => {
			const puzzle = generatePuzzle(difficulty, 424242);
			assert.equal(puzzle.size, DIFFICULTY_CONFIG[difficulty].size);
			assert.ok(puzzle.inventory.ghost >= 1);
			assert.ok(puzzle.inventory.vampire >= 1);
			assert.ok(puzzle.inventory.zombie >= 1);

			// Verify solution satisfies all clues & inventory
			const validation = validateBoard(puzzle, puzzle.solution);
			assert.equal(validation.isSolved, true);

			// Verify strict uniqueness via independent solver call
			assert.equal(countSolutions(puzzle, 2), 1);
		});
	}
});
