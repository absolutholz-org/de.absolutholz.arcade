import assert from 'node:assert';
import test, { describe } from 'node:test';
import {
	SUDOKU_PUZZLES,
	createGridFromClues,
	decodeBoardString,
	getNextPuzzle,
	getPuzzleById,
	getPuzzlesByDifficulty,
} from './puzzles.ts';
import { DIFFICULTY_LEVELS } from './types.ts';

describe('Sudoku Puzzles Catalog & Decoder', () => {
	test('decodes 81-character board strings into 9x9 arrays', () => {
		const sampleStr = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
		const decoded = decodeBoardString(sampleStr);

		assert.strictEqual(decoded.length, 9);
		assert.strictEqual(decoded[0].length, 9);
		assert.strictEqual(decoded[0][0], 5);
		assert.strictEqual(decoded[0][1], 3);
		assert.strictEqual(decoded[0][2], 0);
		assert.strictEqual(decoded[8][8], 9);
	});

	test('creates 9x9 cell grid with proper clues and blocks', () => {
		const sampleClues = Array(9)
			.fill(0)
			.map(() => Array(9).fill(0));
		sampleClues[0][0] = 7;

		const grid = createGridFromClues(sampleClues);
		assert.strictEqual(grid.length, 9);
		assert.strictEqual(grid[0].length, 9);
		assert.strictEqual(grid[0][0].value, 7);
		assert.strictEqual(grid[0][0].isClue, true);
		assert.strictEqual(grid[0][1].value, null);
		assert.strictEqual(grid[0][1].isClue, false);
		assert.strictEqual(grid[4][4].block, 4);
	});

	test('contains exactly 6 puzzles per difficulty tier', () => {
		for (const diff of DIFFICULTY_LEVELS) {
			const puzzles = getPuzzlesByDifficulty(diff);
			assert.strictEqual(puzzles.length, 6, `Expected 6 puzzles for difficulty ${diff}`);
			for (let i = 0; i < puzzles.length; i++) {
				assert.strictEqual(puzzles[i].index, i + 1);
				assert.strictEqual(puzzles[i].difficulty, diff);
				assert.strictEqual(puzzles[i].clues.length, 9);
				assert.strictEqual(puzzles[i].solution.length, 9);
			}
		}
	});

	test('finds puzzle by id', () => {
		const first = SUDOKU_PUZZLES[0];
		const found = getPuzzleById(first.id);
		assert.deepStrictEqual(found, first);

		const nonExistent = getPuzzleById('invalid-puzzle-id');
		assert.strictEqual(nonExistent, undefined);
	});

	test('returns next puzzle in sequence', () => {
		const first = SUDOKU_PUZZLES[0];
		const next = getNextPuzzle(first.id);
		assert.strictEqual(next?.id, SUDOKU_PUZZLES[1].id);

		const last = SUDOKU_PUZZLES[SUDOKU_PUZZLES.length - 1];
		assert.strictEqual(getNextPuzzle(last.id), undefined);
	});
});
