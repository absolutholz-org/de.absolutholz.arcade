import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { evaluateBoard } from './evaluator.ts';
import { createInitialBoard, createInitialSnapshot, pickObstacleCoords } from './generator.ts';
import {
	checkAgainstAllOdds,
	checkDeadCenter,
	checkDiagonallyGifted,
	checkTheHoarder,
	checkTheLandfill,
	checkYahtzeeWrongGame,
	evaluateRoundFeats,
} from './medals.ts';
import type { Board } from './types.ts';

describe('Dice Bingo Generator & Feats Engine', () => {
	it('generates correct grid sizes and obstacle counts per difficulty', () => {
		const easy = createInitialSnapshot('easy', 42);
		assert.equal(easy.board.length, 4);
		assert.equal(easy.board[0].length, 4);
		assert.equal(easy.maxTurns, 16);
		const easyObstacles = easy.board.flat().filter((c) => c.isObstacle);
		assert.equal(easyObstacles.length, 0);

		const medium = createInitialSnapshot('medium', 42);
		assert.equal(medium.board.length, 5);
		assert.equal(medium.board[0].length, 5);
		assert.equal(medium.maxTurns, 25);
		const mediumObstacles = medium.board.flat().filter((c) => c.isObstacle);
		assert.equal(mediumObstacles.length, 0);

		const hard = createInitialSnapshot('hard', 42);
		assert.equal(hard.board.length, 5);
		assert.equal(hard.board[0].length, 5);
		assert.equal(hard.maxTurns, 23);
		const hardObstacles = hard.board.flat().filter((c) => c.isObstacle);
		assert.equal(hardObstacles.length, 2);
		// Center cell (2, 2) must never be blocked
		assert.equal(hard.board[2][2].isObstacle, false);
	});

	it('evaluates feat achievement conditions', () => {
		const snapshot = createInitialSnapshot('medium', 1);
		// Center cell 7
		snapshot.board[2][2] = { row: 2, col: 2, value: 7, isObstacle: false };
		assert.equal(checkDeadCenter(snapshot), true);

		// Yahtzee wrong game
		const yahtzeeBoard: Board = Array.from({ length: 5 }, (_, r) =>
			Array.from({ length: 5 }, (_, c) => ({
				row: r,
				col: c,
				value: r === 0 ? 6 : c + 2,
				isObstacle: false,
			})),
		);
		const yahtzeeScore = evaluateBoard(yahtzeeBoard);
		assert.equal(checkYahtzeeWrongGame(yahtzeeScore.lines), true);

		// The Landfill (3 or more 2s/12s in a 0-pt line)
		const landfillBoard: Board = Array.from({ length: 5 }, (_, r) =>
			Array.from({ length: 5 }, (_, c) => ({
				row: r,
				col: c,
				value: r === 0 ? [2, 12, 2, 4, 8][c] : 5,
				isObstacle: false,
			})),
		);
		const landfillScore = evaluateBoard(landfillBoard);
		assert.equal(checkTheLandfill(landfillScore.lines), true);

		// Diagonally Gifted (diagonalScore > rowScore)
		const diagGiftedScore = {
			...landfillScore,
			diagonalScore: 24,
			rowScore: 10,
		};
		assert.equal(checkDiagonallyGifted(diagGiftedScore), true);
	});

	it('evaluates round feats comprehensively', () => {
		const snapshot = createInitialSnapshot('medium', 1);
		snapshot.board[2][2] = { row: 2, col: 2, value: 7, isObstacle: false };
		const score = evaluateBoard(snapshot.board);
		const feats = evaluateRoundFeats({
			snapshot,
			boardScore: {
				...score,
				diagonalScore: 30,
				rowScore: 10,
				cleanSweep: true,
			},
		});

		assert.ok(feats.includes('dead_center'));
		assert.ok(feats.includes('diagonally_gifted'));
		assert.ok(feats.includes('clean_sweep'));
	});
});
