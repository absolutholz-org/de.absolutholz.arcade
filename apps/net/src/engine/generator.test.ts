import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createBoardFromSnapshot, generateNetPuzzle } from './generator.ts';
import { countPorts } from './rotator.ts';
import { DIFFICULTY_CONFIGS, type Difficulty, type GameSnapshot } from './types.ts';
import { validateBoard } from './validator.ts';

describe('Net Engine: Generator', () => {
	const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

	for (const diff of difficulties) {
		it(`generates a valid board for ${diff} difficulty`, () => {
			const board = generateNetPuzzle(diff);
			const expected = DIFFICULTY_CONFIGS[diff];

			assert.equal(board.rows, expected.rows);
			assert.equal(board.cols, expected.cols);
			assert.equal(board.rootRow, Math.floor(expected.rows / 2));
			assert.equal(board.rootCol, Math.floor(expected.cols / 2));

			// Check all cells have at least 1 connection in solution
			for (let r = 0; r < board.rows; r++) {
				for (let c = 0; c < board.cols; c++) {
					const cell = board.grid[r][c];
					assert.ok(countPorts(cell.solutionMask) >= 1, `Cell (${r}, ${c}) has no ports in solution`);
				}
			}

			// Root node should be powered
			const rootCell = board.grid[board.rootRow][board.rootCol];
			assert.equal(rootCell.isRoot, true);
			assert.equal(rootCell.isPowered, true);
		});
	}

	it('restores a board from snapshot accurately', () => {
		const board = generateNetPuzzle('easy');
		const snapshot: GameSnapshot = {
			difficulty: 'easy',
			rows: board.rows,
			cols: board.cols,
			rootRow: board.rootRow,
			rootCol: board.rootCol,
			cells: board.grid.flatMap((row) =>
				row.map((cell) => ({
					row: cell.row,
					col: cell.col,
					solutionMask: cell.solutionMask,
					currentMask: cell.currentMask,
					rotation: cell.rotation,
					isLocked: cell.isLocked,
				})),
			),
			movesCount: 5,
			elapsedTimeSeconds: 42,
			isSolved: false,
			timestamp: Date.now(),
		};

		const restored = createBoardFromSnapshot(snapshot);
		assert.equal(restored.rows, board.rows);
		assert.equal(restored.cols, board.cols);
		assert.equal(restored.rootRow, board.rootRow);
		assert.equal(restored.rootCol, board.rootCol);
		assert.equal(restored.grid[0][0].currentMask, board.grid[0][0].currentMask);
		assert.equal(restored.grid[0][0].solutionMask, board.grid[0][0].solutionMask);
	});

	it('solution state is 100% solved and powered when un-shuffled', () => {
		const board = generateNetPuzzle('easy');
		// Force all cells back to solutionMask
		const solvedBoard = {
			...board,
			grid: board.grid.map((row) =>
				row.map((cell) => ({
					...cell,
					currentMask: cell.solutionMask,
					isPowered: true,
				})),
			),
		};

		const validation = validateBoard(solvedBoard);
		assert.equal(validation.isSolved, true);
		assert.equal(validation.poweredCount, board.rows * board.cols);
		assert.equal(validation.leakingPortsCount, 0);
	});
});
