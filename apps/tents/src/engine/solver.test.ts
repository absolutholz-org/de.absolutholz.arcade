import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PRESET_PUZZLES, getPresetById } from './presets/index.ts';
import { solveTents } from './solver.ts';
import type { PuzzleDefinition } from './types.ts';

describe('Tents & Trees - Solver Engine', () => {
	it('solves known easy-1 puzzle to exact unique solution', () => {
		const puzzle = getPresetById('easy-1');
		assert.ok(puzzle);

		const result = solveTents(puzzle);
		assert.equal(result.isUnique, true);
		assert.equal(result.solutions.length, 1);

		const expected = puzzle.solution?.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col));
		assert.deepEqual(result.solutions[0], expected);
	});

	it('detects multiple solutions on ambiguous symmetrical puzzle', () => {
		// A 4x4 grid with 2 trees and 2 tents where either diagonal placement is valid
		// Row clues: [1, 0, 1, 0], Col clues: [1, 0, 1, 0]
		// Trees at (0, 1) and (2, 1).
		// Tents can be at (0, 0) and (2, 2) OR (0, 2) and (2, 0).
		const ambiguousPuzzle: PuzzleDefinition = {
			id: 'ambiguous-test',
			difficulty: 'easy',
			size: 4,
			trees: [
				{ row: 0, col: 1 },
				{ row: 2, col: 1 },
			],
			rowClues: [1, 0, 1, 0],
			colClues: [1, 0, 1, 0],
		};

		const result = solveTents(ambiguousPuzzle, 2);
		assert.equal(result.isUnique, false);
		assert.equal(result.solutions.length, 2);
	});

	it('returns zero solutions when line clues sum does not match tree count', () => {
		const invalidCluePuzzle: PuzzleDefinition = {
			id: 'invalid-clues',
			difficulty: 'easy',
			size: 4,
			trees: [{ row: 1, col: 1 }],
			rowClues: [2, 0, 0, 0], // Sum = 2, trees = 1
			colClues: [1, 0, 0, 0], // Sum = 1
		};

		const result = solveTents(invalidCluePuzzle);
		assert.equal(result.isUnique, false);
		assert.equal(result.solutions.length, 0);
	});

	it('returns zero solutions when a tree has zero orthogonal empty space', () => {
		// Tree surrounded by edges or row/col 0 clues
		const impossibleTreePuzzle: PuzzleDefinition = {
			id: 'impossible-tree',
			difficulty: 'easy',
			size: 4,
			trees: [{ row: 0, col: 0 }],
			rowClues: [1, 0, 0, 0],
			colClues: [0, 0, 0, 1], // Col 0 has 0 tents, Row 1 has 0 tents -> tree at (0,0) has no candidate neighbor!
		};

		const result = solveTents(impossibleTreePuzzle);
		assert.equal(result.isUnique, false);
		assert.equal(result.solutions.length, 0);
	});

	it('verifies all 40 curated presets have verified unique solutions', () => {
		assert.equal(PRESET_PUZZLES.length, 40, 'Must have exactly 40 curated presets');
		for (const preset of PRESET_PUZZLES) {
			const result = solveTents(preset, 2);
			assert.equal(
				result.isUnique,
				true,
				`Preset ${preset.id} (${preset.difficulty}) must have a unique solution`,
			);
			assert.equal(result.solutions.length, 1);
		}
	});
});
