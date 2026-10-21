import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { solveTents } from './solver.ts';
import { DIFFICULTY_GRID_SIZES, type DifficultyLevel } from './types.ts';
import { createBoardFromPuzzle, isPuzzleSolved } from './validator.ts';

describe('Tents & Trees - Generator Engine', () => {
	it('generates valid and uniquely solvable puzzles for all difficulty levels', () => {
		const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'];

		for (const diff of difficulties) {
			const puzzle = generatePuzzle(diff, 100);
			const expectedSize = DIFFICULTY_GRID_SIZES[diff].width;
			const expectedTents = DIFFICULTY_GRID_SIZES[diff].defaultTents;

			assert.equal(puzzle.size, expectedSize, `${diff} size should match ${expectedSize}`);
			assert.equal(puzzle.trees.length, expectedTents, `${diff} trees count should match ${expectedTents}`);
			assert.equal(
				puzzle.solution?.length,
				expectedTents,
				`${diff} solution tent count should match ${expectedTents}`,
			);

			// Clues sum must match tree count
			const rowSum = puzzle.rowClues.reduce((a, b) => a + b, 0);
			const colSum = puzzle.colClues.reduce((a, b) => a + b, 0);
			assert.equal(rowSum, expectedTents);
			assert.equal(colSum, expectedTents);

			// Solver confirms uniqueness
			const solverResult = solveTents(puzzle, 2);
			assert.equal(solverResult.isUnique, true, `Generated ${diff} puzzle must have a unique solution`);

			// Solution matches validator win condition
			const board = createBoardFromPuzzle(puzzle);
			for (const tent of puzzle.solution ?? []) {
				board.grid[tent.row][tent.col].mark = 'tent';
			}
			assert.equal(isPuzzleSolved(board), true, 'Board with generated solution must be validated as solved');
		}
	});

	it('produces deterministic output when given the same seed', () => {
		const puzzleA = generatePuzzle('easy', 4242);
		const puzzleB = generatePuzzle('easy', 4242);

		assert.deepEqual(puzzleA.trees, puzzleB.trees);
		assert.deepEqual(puzzleA.rowClues, puzzleB.rowClues);
		assert.deepEqual(puzzleA.colClues, puzzleB.colClues);
		assert.deepEqual(puzzleA.solution, puzzleB.solution);
	});

	it('produces different puzzles with different seeds', () => {
		const puzzleA = generatePuzzle('easy', 1111);
		const puzzleB = generatePuzzle('easy', 8888);

		const isTreesDifferent = JSON.stringify(puzzleA.trees) !== JSON.stringify(puzzleB.trees);
		const isCluesDifferent =
			JSON.stringify(puzzleA.rowClues) !== JSON.stringify(puzzleB.rowClues) ||
			JSON.stringify(puzzleA.colClues) !== JSON.stringify(puzzleB.colClues);

		assert.ok(isTreesDifferent || isCluesDifferent, 'Different seeds should yield different puzzles');
	});
});
