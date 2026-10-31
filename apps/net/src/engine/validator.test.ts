import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { type Board, DIR_EAST, DIR_NORTH, DIR_SOUTH, DIR_WEST } from './types.ts';
import { updateBoardPoweredState, validateBoard } from './validator.ts';

describe('Net Engine: Validator', () => {
	it('validates a simple 2x2 fully connected network', () => {
		// (0,0) [E|S: 6] -- (0,1) [W|S: 12]
		//   |                 |
		// (1,0) [N|E: 3] -- (1,1) [N|W: 9]
		// Root at (0,0)
		const board: Board = {
			rows: 2,
			cols: 2,
			rootRow: 0,
			rootCol: 0,
			grid: [
				[
					{
						id: '0-0',
						row: 0,
						col: 0,
						isRoot: true,
						solutionMask: DIR_EAST | DIR_SOUTH,
						currentMask: DIR_EAST | DIR_SOUTH,
						rotation: 0,
						isPowered: true,
						isLocked: false,
					},
					{
						id: '0-1',
						row: 0,
						col: 1,
						isRoot: false,
						solutionMask: DIR_WEST | DIR_SOUTH,
						currentMask: DIR_WEST | DIR_SOUTH,
						rotation: 0,
						isPowered: true,
						isLocked: false,
					},
				],
				[
					{
						id: '1-0',
						row: 1,
						col: 0,
						isRoot: false,
						solutionMask: DIR_NORTH | DIR_EAST,
						currentMask: DIR_NORTH | DIR_EAST,
						rotation: 0,
						isPowered: true,
						isLocked: false,
					},
					{
						id: '1-1',
						row: 1,
						col: 1,
						isRoot: false,
						solutionMask: DIR_NORTH | DIR_WEST,
						currentMask: DIR_NORTH | DIR_WEST,
						rotation: 0,
						isPowered: true,
						isLocked: false,
					},
				],
			],
		};

		const result = validateBoard(board);
		assert.equal(result.isSolved, true);
		assert.equal(result.poweredCount, 4);
		assert.equal(result.leakingPortsCount, 0);
	});

	it('detects unpowered nodes and leaking ports when a tile is misaligned', () => {
		// Same 2x2 board but cell (1,1) rotated so its ports point off-grid (S|E: 6 instead of N|W: 9)
		const board: Board = {
			rows: 2,
			cols: 2,
			rootRow: 0,
			rootCol: 0,
			grid: [
				[
					{
						id: '0-0',
						row: 0,
						col: 0,
						isRoot: true,
						solutionMask: DIR_EAST | DIR_SOUTH,
						currentMask: DIR_EAST | DIR_SOUTH,
						rotation: 0,
						isPowered: true,
						isLocked: false,
					},
					{
						id: '0-1',
						row: 0,
						col: 1,
						isRoot: false,
						solutionMask: DIR_WEST | DIR_SOUTH,
						currentMask: DIR_WEST | DIR_SOUTH,
						rotation: 0,
						isPowered: true,
						isLocked: false,
					},
				],
				[
					{
						id: '1-0',
						row: 1,
						col: 0,
						isRoot: false,
						solutionMask: DIR_NORTH | DIR_EAST,
						currentMask: DIR_NORTH | DIR_EAST,
						rotation: 0,
						isPowered: true,
						isLocked: false,
					},
					{
						id: '1-1',
						row: 1,
						col: 1,
						isRoot: false,
						solutionMask: DIR_NORTH | DIR_WEST,
						currentMask: DIR_SOUTH | DIR_EAST, // rotated away!
						rotation: 180,
						isPowered: false,
						isLocked: false,
					},
				],
			],
		};

		const result = validateBoard(board);
		assert.equal(result.isSolved, false);
		assert.equal(result.poweredCount, 3); // (1,1) is not reached
		assert.ok(result.leakingPortsCount > 0);

		const updatedBoard = updateBoardPoweredState(board);
		assert.equal(updatedBoard.grid[1][1].isPowered, false);
		assert.equal(updatedBoard.grid[0][0].isPowered, true);
	});
});
