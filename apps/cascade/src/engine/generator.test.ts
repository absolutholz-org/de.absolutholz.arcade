import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countRemainingTiles, hasValidMoves } from './board.ts';
import { generateBoard } from './generator.ts';
import { DIFFICULTIES, DIFFICULTY_CONFIGS } from './types.ts';

describe('Cascade board generator', () => {
	it('generates a deterministic board matching each difficulty dimensions and color count', () => {
		for (const difficulty of DIFFICULTIES) {
			const config = DIFFICULTY_CONFIGS[difficulty];
			const first = generateBoard(difficulty, 424242);
			const second = generateBoard(difficulty, 424242);

			assert.equal(first.board.length, config.rows);
			assert.equal(first.board[0]?.length, config.cols);
			assert.equal(countRemainingTiles(first.board), config.rows * config.cols);
			assert.equal(hasValidMoves(first.board), true);
			assert.deepEqual(first.board, second.board);

			const maxColor = config.colorCount - 1;
			for (const row of first.board) {
				for (const cell of row) {
					assert.ok(cell !== null);
					assert.ok(cell.color >= 0 && cell.color <= maxColor);
				}
			}
		}
	});
});
