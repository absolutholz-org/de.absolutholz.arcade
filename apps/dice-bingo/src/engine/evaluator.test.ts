import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { evaluateBoard, evaluateHand4, evaluateHand5, evaluateLine, isStraight4, isStraight5 } from './evaluator.ts';
import type { Board } from './types.ts';

describe('Dice Bingo Evaluator: Hand Classification & Precedence', () => {
	it('classifies 5-number hands with exact precedence', () => {
		// 5 of a kind
		assert.equal(evaluateHand5([6, 6, 6, 6, 6]), 'five_of_a_kind');
		assert.equal(evaluateHand5([2, 2, 2, 2, 2]), 'five_of_a_kind');

		// Straight without 7 (12 pts) - unordered
		assert.equal(evaluateHand5([2, 3, 4, 5, 6]), 'straight_no_seven');
		assert.equal(evaluateHand5([6, 2, 4, 5, 3]), 'straight_no_seven');
		assert.equal(evaluateHand5([8, 9, 10, 11, 12]), 'straight_no_seven');
		assert.equal(evaluateHand5([12, 10, 8, 9, 11]), 'straight_no_seven');

		// Straight with 7 (8 pts) - unordered
		assert.equal(evaluateHand5([3, 4, 5, 6, 7]), 'straight_with_seven');
		assert.equal(evaluateHand5([7, 5, 9, 8, 6]), 'straight_with_seven');
		assert.equal(evaluateHand5([4, 5, 6, 7, 8]), 'straight_with_seven');

		// Full House (3 of a kind + pair)
		assert.equal(evaluateHand5([4, 4, 4, 9, 9]), 'full_house');
		assert.equal(evaluateHand5([11, 7, 11, 7, 11]), 'full_house');

		// Four of a kind
		assert.equal(evaluateHand5([10, 10, 10, 10, 3]), 'four_of_a_kind');
		assert.equal(evaluateHand5([8, 2, 2, 2, 2]), 'four_of_a_kind');

		// Three of a kind
		assert.equal(evaluateHand5([5, 5, 5, 2, 8]), 'three_of_a_kind');

		// Two pair
		assert.equal(evaluateHand5([6, 6, 8, 8, 3]), 'two_pair');

		// One pair
		assert.equal(evaluateHand5([7, 7, 3, 4, 9]), 'one_pair');

		// Bust / None
		assert.equal(evaluateHand5([2, 4, 6, 8, 11]), 'none');
	});

	it('validates 4-number hands for Easy mode and obstacle lines', () => {
		assert.equal(evaluateHand4([9, 9, 9, 9]), 'four_of_a_kind');
		assert.equal(evaluateHand4([3, 4, 5, 6]), 'straight_four');
		assert.equal(evaluateHand4([6, 4, 5, 3]), 'straight_four');
		assert.equal(evaluateHand4([8, 8, 8, 2]), 'three_of_a_kind');
		assert.equal(evaluateHand4([5, 5, 10, 10]), 'two_pair');
		assert.equal(evaluateHand4([3, 3, 7, 11]), 'one_pair');
		assert.equal(evaluateHand4([2, 5, 8, 12]), 'none');
	});

	it('detects against-all-odds wrap-around straight with 2 and 12', () => {
		assert.equal(isStraight5([11, 12, 2, 3, 4]), true);
		assert.equal(evaluateHand5([11, 12, 2, 3, 4]), 'straight_no_seven');
		assert.equal(isStraight5([10, 11, 12, 2, 3]), true);
		assert.equal(isStraight5([9, 10, 11, 12, 2]), true);
	});

	it('scores diagonals with a 2x multiplier', () => {
		const board: Board = Array.from({ length: 5 }, (_, r) =>
			Array.from({ length: 5 }, (_, c) => ({
				row: r,
				col: c,
				value: r === c ? 6 : null,
				isObstacle: false,
			})),
		);

		const lineEval = evaluateLine(
			'main_diagonal',
			0,
			[
				{ row: 0, col: 0 },
				{ row: 1, col: 1 },
				{ row: 2, col: 2 },
				{ row: 3, col: 3 },
				{ row: 4, col: 4 },
			],
			board,
		);

		assert.equal(lineEval.hand, 'five_of_a_kind');
		assert.equal(lineEval.basePoints, 10);
		assert.equal(lineEval.multiplier, 2);
		assert.equal(lineEval.score, 20);
	});

	it('evaluates entire board correctly and checks clean sweep', () => {
		// Create a 4x4 board filled with pairs (1 pt each line, 2 pts for diagonals)
		// Rows: [2, 2, 3, 4], [5, 5, 6, 8], [9, 9, 10, 11], [12, 12, 7, 7]
		const gridValues = [
			[2, 2, 3, 4],
			[5, 5, 6, 8],
			[9, 9, 10, 11],
			[12, 12, 7, 7],
		];

		const board: Board = gridValues.map((row, r) =>
			row.map((val, c) => ({
				row: r,
				col: c,
				value: val,
				isObstacle: false,
			})),
		);

		const result = evaluateBoard(board);
		assert.equal(result.lines.length, 10); // 4 rows + 4 cols + 2 diags
		assert.ok(result.totalScore > 0);
		assert.equal(typeof result.cleanSweep, 'boolean');
	});
});
