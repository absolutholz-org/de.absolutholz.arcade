import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	applyGravity,
	calculateClusterScore,
	countRemainingTiles,
	executeMove,
	findCluster,
	findOrphanTiles,
	hasValidMoves,
	isValidClusterCell,
} from './board.ts';
import { type Board, PERFECT_CLEAR_BONUS, type Tile, type TileColor } from './types.ts';

function makeBoard(pattern: (TileColor | null)[][]): Board {
	let id = 1;
	return pattern.map((row) =>
		row.map((color) => {
			if (color === null) return null;
			const tile: Tile = { id, color };
			id += 1;
			return tile;
		}),
	);
}

describe('Cascade board engine', () => {
	it('computes cluster score using (n - 2)^2', () => {
		assert.equal(calculateClusterScore(0), 0);
		assert.equal(calculateClusterScore(1), 0);
		assert.equal(calculateClusterScore(2), 0);
		assert.equal(calculateClusterScore(3), 1);
		assert.equal(calculateClusterScore(4), 4);
		assert.equal(calculateClusterScore(5), 9);
		assert.equal(calculateClusterScore(10), 64);
		assert.equal(calculateClusterScore(12), 100);
	});

	it('finds orthogonally connected clusters and ignores diagonals', () => {
		const board = makeBoard([
			[0, 0, 1],
			[1, 0, 2],
			[0, 1, 0],
		]);

		const cluster = findCluster(board, 0, 0);
		assert.equal(cluster.length, 3);
		assert.equal(isValidClusterCell(board, 0, 0), true);
		// Diagonal 0 at (2,0) is isolated
		assert.equal(findCluster(board, 2, 0).length, 1);
		assert.equal(isValidClusterCell(board, 2, 0), false);
	});

	it('rejects moves on empty cells or isolated single tiles', () => {
		const board = makeBoard([
			[null, 1, 2],
			[0, 2, 1],
		]);

		assert.equal(executeMove(board, 0, 0), null);
		assert.equal(executeMove(board, 0, 1), null);
		assert.equal(hasValidMoves(board), false);
	});

	it('applies vertical gravity and shifts columns left when a column becomes empty', () => {
		const board = makeBoard([
			[0, null, 2, 1],
			[null, null, null, 2],
			[1, null, 0, null],
		]);

		const settled = applyGravity(board);
		// Column 1 was empty, so columns 2 and 3 shift left to indices 1 and 2; column 3 becomes all null
		assert.equal(settled[0]?.[0], null);
		assert.equal(settled[1]?.[0]?.color, 0);
		assert.equal(settled[2]?.[0]?.color, 1);

		assert.equal(settled[0]?.[1], null);
		assert.equal(settled[1]?.[1]?.color, 2);
		assert.equal(settled[2]?.[1]?.color, 0);

		assert.equal(settled[0]?.[2], null);
		assert.equal(settled[1]?.[2]?.color, 1);
		assert.equal(settled[2]?.[2]?.color, 2);

		assert.equal(settled[0]?.[3], null);
		assert.equal(settled[1]?.[3], null);
		assert.equal(settled[2]?.[3], null);
	});

	it('preserves tile IDs across gravity drops and horizontal shifts', () => {
		const board = makeBoard([
			[0, 1, 2],
			[0, 1, 0],
		]);
		const topRightId = board[0]?.[2]?.id;
		const bottomRightId = board[1]?.[2]?.id;

		// Clear column 0 (two 0s), column 1 shifts to 0, column 2 shifts to 1
		const result = executeMove(board, 0, 0);
		assert.ok(result);
		assert.equal(result.board[0]?.[1]?.id, topRightId);
		assert.equal(result.board[1]?.[1]?.id, bottomRightId);
		assert.equal(result.board[0]?.[2], null);
		assert.equal(result.board[1]?.[2], null);
	});

	it('awards +1000 Perfect Clear bonus when clearing the last tiles', () => {
		const board = makeBoard([
			[null, null, null],
			[0, 0, 0],
		]);

		const result = executeMove(board, 1, 1);
		assert.ok(result);
		assert.equal(result.clusterSize, 3);
		assert.equal(result.pointsAwarded, 1);
		assert.equal(result.perfectClearBonus, PERFECT_CLEAR_BONUS);
		assert.equal(result.remainingTiles, 0);
		assert.equal(result.isPerfectClear, true);
		assert.equal(result.isGameOver, true);
		assert.equal(result.orphanTiles.length, 0);
	});

	it('detects end-of-game and reports orphan tiles when no moves remain', () => {
		const board = makeBoard([
			[0, 1, 2],
			[0, 2, 1],
		]);

		const result = executeMove(board, 0, 0);
		assert.ok(result);
		assert.equal(result.remainingTiles, 4);
		assert.equal(countRemainingTiles(result.board), 4);
		assert.equal(result.isPerfectClear, false);
		assert.equal(result.isGameOver, true);
		assert.equal(result.orphanTiles.length, 4);
		assert.equal(findOrphanTiles(result.board).length, 4);
	});
});
