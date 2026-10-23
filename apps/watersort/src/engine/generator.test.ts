import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { DIFFICULTY_CONFIG, DIFFICULTY_LEVELS, type DifficultyLevel } from './types.ts';
import { applyPour, canPour, getLegalMoves, isSolved, isValidBoard } from './validator.ts';

const SEEDS = [1, 2, 3, 42, 2026];

const MIN_SOLUTION_LENGTH: Record<DifficultyLevel, number> = {
	easy: 8,
	medium: 14,
	hard: 20,
	expert: 28,
};

describe('Water Sort Generator', () => {
	for (const difficulty of DIFFICULTY_LEVELS) {
		it(`generates valid, certified and replayable ${difficulty} puzzles`, () => {
			const { colorCount, emptyTubes } = DIFFICULTY_CONFIG[difficulty];
			for (const seed of SEEDS) {
				const { board, solution } = generatePuzzle(difficulty, seed);
				assert.equal(board.length, colorCount + emptyTubes);
				assert.equal(isValidBoard(board, colorCount), true, `seed ${seed} board validity`);
				assert.equal(board.filter((tube) => tube.length === 0).length, emptyTubes, `seed ${seed} empty tubes`);
				assert.equal(isSolved(board), false, `seed ${seed} must not start solved`);
				assert.ok(
					solution.length >= MIN_SOLUTION_LENGTH[difficulty],
					`seed ${seed} solution length ${solution.length} is below ${MIN_SOLUTION_LENGTH[difficulty]}`,
				);

				// Holds for certified boards only, so a failure here also reveals a silent fallback to reverse-scramble.
				const hasRunOfThree = board.some((tube) =>
					tube.some((color, index) => index >= 2 && color === tube[index - 1] && color === tube[index - 2]),
				);
				assert.equal(hasRunOfThree, false, `seed ${seed} must not start with a run of three`);
				assert.ok(getLegalMoves(board).length >= 3, `seed ${seed} must open with at least three legal moves`);

				let replay = board;
				for (const move of solution) {
					assert.equal(canPour(replay, move), true, `seed ${seed} solution move must be legal`);
					replay = applyPour(replay, move);
				}
				assert.equal(isSolved(replay), true, `seed ${seed} solution must solve the board`);
			}
		});
	}

	it('is deterministic per seed and varies across seeds', () => {
		const first = generatePuzzle('medium', 7);
		const again = generatePuzzle('medium', 7);
		const other = generatePuzzle('medium', 8);
		assert.equal(JSON.stringify(first), JSON.stringify(again));
		assert.notEqual(JSON.stringify(first.board), JSON.stringify(other.board));
	});

	it('generates 6 colors and 8 total tubes for Medium Puzzle #6', () => {
		const puzzle = generatePuzzle('medium', 6);
		assert.equal(puzzle.board.length, 8);
		assert.equal(isValidBoard(puzzle.board, 6), true);
		assert.equal(puzzle.board.filter((t) => t.length === 0).length, 2);
		assert.ok(puzzle.solution.length >= MIN_SOLUTION_LENGTH.medium);
	});
});
