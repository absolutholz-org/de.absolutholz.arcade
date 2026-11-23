import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle, getSolvedGrid } from './generator.ts';
import { traceBeams } from './raytrace.ts';
import { DIFFICULTIES, DIFFICULTY_CONFIGS } from './types.ts';

describe('Laser & Mirrors Procedural Generator', () => {
	for (const difficulty of DIFFICULTIES) {
		it(`generates 15 deterministic, un-solved, 100% solvable "${difficulty}" puzzles`, () => {
			const config = DIFFICULTY_CONFIGS[difficulty];
			for (let seed = 101; seed <= 115; seed += 1) {
				const puzzle = generatePuzzle(difficulty, seed);

				assert.equal(puzzle.difficulty, difficulty);
				assert.equal(puzzle.rows, config.rows);
				assert.equal(puzzle.cols, config.cols);
				assert.ok(puzzle.parMoves >= 1, `Expected parMoves >= 1 for ${difficulty} seed ${seed}`);

				// Initial state must NOT already be solved
				const initialTrace = traceBeams(puzzle.initialGrid);
				assert.equal(
					initialTrace.isSolved,
					false,
					`Initial puzzle must not be solved (${difficulty}, seed ${seed})`,
				);

				// Solved state MUST be 100% solved
				const solvedGrid = getSolvedGrid(puzzle.initialGrid);
				const solvedTrace = traceBeams(solvedGrid);
				assert.equal(
					solvedTrace.isSolved,
					true,
					`Constructed solution must solve all targets (${difficulty}, seed ${seed})`,
				);
				assert.equal(solvedTrace.litTargetCount, solvedTrace.totalTargetCount);
				assert.ok(solvedTrace.totalTargetCount >= 1);

				// Determinism check
				const repeat = generatePuzzle(difficulty, seed);
				assert.deepEqual(repeat.initialGrid, puzzle.initialGrid);
				assert.equal(repeat.parMoves, puzzle.parMoves);
			}
		});
	}

	it('includes color-mixing targets on hard and expert tiers', () => {
		for (const difficulty of ['hard', 'expert'] as const) {
			let foundMixedTarget = false;
			for (let seed = 1; seed <= 10; seed += 1) {
				const puzzle = generatePuzzle(difficulty, seed);
				const solvedTrace = traceBeams(getSolvedGrid(puzzle.initialGrid));
				if (
					solvedTrace.targets.some(
						(t) =>
							t.requiredColor === 'magenta' || t.requiredColor === 'yellow' || t.requiredColor === 'cyan',
					)
				) {
					foundMixedTarget = true;
					break;
				}
			}
			assert.equal(foundMixedTarget, true, `Expected mixed-color target in ${difficulty} puzzles`);
		}
	});
});
