import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { computeClues, computeLineClue, isLineCompleted, isPuzzleSolved } from './clues.ts';
import { PUZZLE_CATALOG } from './puzzles.ts';
import type { CellState } from './types.ts';

describe('Nonogram Clue Evaluation & Line Completion', () => {
	it('computes line clues correctly for binary rows and empty rows', () => {
		assert.deepEqual(computeLineClue([0, 1, 1, 0, 1]), [2, 1]);
		assert.deepEqual(computeLineClue([1, 1, 1, 1, 1]), [5]);
		assert.deepEqual(computeLineClue([0, 0, 0]), [0]);
		assert.deepEqual(computeLineClue([1, 0, 1, 0, 1, 1]), [1, 1, 2]);
	});

	it('safely handles empty or undefined inputs without throwing', () => {
		assert.equal(isLineCompleted(undefined, [2, 1]), false);
		assert.equal(isLineCompleted([], [2, 1]), false);
		assert.equal(isLineCompleted(['filled', 'filled'], undefined), false);
		// biome-ignore lint/suspicious/noExplicitAny: Intentional runtime guard testing
		assert.equal(isLineCompleted(['filled'], null as any), false);
		assert.equal(isLineCompleted(['filled'], []), false);

		assert.equal(isPuzzleSolved(undefined, [1, 0]), false);
		assert.equal(isPuzzleSolved(['filled'], undefined), false);
		assert.equal(isPuzzleSolved(['filled'], [1, 0]), false);
	});

	it('evaluates complex multi-number lines accurately (e.g. 2 7 2 and 4 4)', () => {
		const target272 = [2, 7, 2];
		// 15-cell line: 2 filled, 1 empty, 7 filled, 1 empty, 2 filled, 2 empty = 15 cells
		const line272Match: CellState[] = [
			'filled',
			'filled',
			'crossed',
			'filled',
			'filled',
			'filled',
			'filled',
			'filled',
			'filled',
			'filled',
			'empty',
			'filled',
			'filled',
			'crossed',
			'empty',
		];
		assert.equal(isLineCompleted(line272Match, target272), true);

		// Missing one cell in the run of 7
		const line272Incomplete: CellState[] = [...line272Match];
		line272Incomplete[5] = 'empty';
		assert.equal(isLineCompleted(line272Incomplete, target272), false);

		// Merged run (2 + 7 merged into 10)
		const line272Merged: CellState[] = [...line272Match];
		line272Merged[2] = 'filled';
		assert.equal(isLineCompleted(line272Merged, target272), false);

		// Multi-number line with 4 4
		const target44 = [4, 4];
		const line44Match: CellState[] = [
			'filled',
			'filled',
			'filled',
			'filled',
			'crossed',
			'filled',
			'filled',
			'filled',
			'filled',
			'empty',
		];
		assert.equal(isLineCompleted(line44Match, target44), true);

		// 1 1 1 1 1
		const targetOnes = [1, 1, 1, 1, 1];
		const lineOnesMatch: CellState[] = [
			'filled',
			'crossed',
			'filled',
			'crossed',
			'filled',
			'crossed',
			'filled',
			'crossed',
			'filled',
		];
		assert.equal(isLineCompleted(lineOnesMatch, targetOnes), true);
	});

	it('evaluates empty clue lines ([0]) requiring cross markers and no fills', () => {
		const emptyClue = [0];
		assert.equal(isLineCompleted(['empty', 'empty', 'empty'], emptyClue), false);
		assert.equal(isLineCompleted(['crossed', 'empty', 'empty'], emptyClue), true);
		assert.equal(isLineCompleted(['crossed', 'filled', 'crossed'], emptyClue), false);
	});

	it('safely validates all 15x15 catalog puzzles bottom rows (indices 10-14)', () => {
		const hardPuzzles = PUZZLE_CATALOG.filter((p) => p.width === 15 && p.height === 15);
		assert.ok(hardPuzzles.length > 0, 'Catalog must contain 15x15 puzzles');

		for (const puzzle of hardPuzzles) {
			const { width, height, grid, rowClues, colClues } = puzzle;
			const { rowClues: computedRows, colClues: computedCols } = computeClues(grid, width, height);

			assert.equal(rowClues.length, height);
			assert.equal(colClues.length, width);

			// Test bottom rows (10 through 14)
			for (let r = 10; r < height; r++) {
				const rowSlice = grid.slice(r * width, (r + 1) * width);
				const cellStates: CellState[] = rowSlice.map((v) => (v === 1 ? 'filled' : 'crossed'));

				assert.deepEqual(rowClues[r], computedRows[r]);
				assert.equal(isLineCompleted(cellStates, rowClues[r]), true);
			}

			// Test rightmost columns (10 through 14)
			for (let c = 10; c < width; c++) {
				const colSlice: CellState[] = [];
				for (let r = 0; r < height; r++) {
					colSlice.push(grid[r * width + c] === 1 ? 'filled' : 'crossed');
				}

				assert.deepEqual(colClues[c], computedCols[c]);
				assert.equal(isLineCompleted(colSlice, colClues[c]), true);
			}
		}
	});
});
