import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { countSolutions } from './solver.ts';
import { DIFFICULTIES, DIFFICULTY_CONFIGS } from './types.ts';
import { isBoardComplete, validateBoard } from './validator.ts';

describe('color-map procedural generator', () => {
	for (const difficulty of DIFFICULTIES) {
		it(`generates a uniquely solvable ${difficulty} puzzle matching tier constraints`, () => {
			const config = DIFFICULTY_CONFIGS[difficulty];
			const puzzle = generatePuzzle(difficulty, 20260401);

			assert.equal(puzzle.difficulty, difficulty);
			assert.equal(puzzle.gridSize, config.gridSize);
			assert.ok(
				puzzle.regions.length >= config.minRegions && puzzle.regions.length <= config.maxRegions,
				`Expected ${config.minRegions}..${config.maxRegions} regions, got ${puzzle.regions.length}`,
			);

			// Solution must be valid and complete
			assert.equal(isBoardComplete(puzzle.regions, puzzle.solution), true);
			assert.equal(validateBoard(puzzle.regions, puzzle.solution).hasConflicts, false);

			// Every given must match the solution
			let clueCount = 0;
			for (let r = 0; r < puzzle.regions.length; r += 1) {
				if (puzzle.givens[r] !== null) {
					assert.equal(puzzle.givens[r], puzzle.solution[r]);
					clueCount += 1;
				}
			}
			assert.ok(clueCount < puzzle.regions.length, 'Puzzle must have at least one uncolored region');

			// Unique solution guarantee
			const adjacency = puzzle.regions.map((reg) => reg.neighbors);
			const check = countSolutions(adjacency, puzzle.givens, 2, 50000);
			assert.equal(check.aborted, false);
			assert.equal(check.count, 1, `Expected unique solution for ${difficulty}, got ${check.count}`);
		});
	}

	it('is deterministic for the same difficulty and seed', () => {
		const a = generatePuzzle('medium', 1337);
		const b = generatePuzzle('medium', 1337);
		assert.deepEqual(a.regionGrid, b.regionGrid);
		assert.deepEqual(a.givens, b.givens);
		assert.deepEqual(a.solution, b.solution);
	});
});
