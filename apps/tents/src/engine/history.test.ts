import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	batchSetMarks,
	canRedo,
	canUndo,
	createHistory,
	createHistoryStack,
	redo,
	reset,
	setCellMark,
	undo,
} from './history.ts';
import { getPresetById } from './presets/index.ts';
import { createBoardFromPuzzle } from './validator.ts';

describe('Tents & Trees - History & Move Management Engine', () => {
	it('initializes with clean undo/redo stacks and zero counters', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		const history = createHistory(board);

		assert.equal(canUndo(history), false);
		assert.equal(canRedo(history), false);
		assert.equal(history.moveCount, 0);
		assert.equal(history.grassPlacedCount, 0);
	});

	it('tracks grassPlacedCount when grass marks are placed', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		let history = createHistory(board);

		// Place a tent: does NOT increment grassPlacedCount
		history = setCellMark(history, 0, 0, 'tent');
		assert.equal(history.grassPlacedCount, 0);
		assert.equal(history.moveCount, 1);
		assert.equal(history.present.grid[0][0].mark, 'tent');

		// Place a grass mark: increments grassPlacedCount
		history = setCellMark(history, 0, 1, 'grass');
		assert.equal(history.grassPlacedCount, 1);
		assert.equal(history.moveCount, 2);
		assert.equal(history.present.grid[0][1].mark, 'grass');

		// Changing grass to tent: grass count does NOT increment
		history = setCellMark(history, 0, 1, 'tent');
		assert.equal(history.grassPlacedCount, 1);
		assert.equal(history.moveCount, 3);
	});

	it('batchSetMarks tracks multiple grass marks in a single action', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		let history = createHistory(board);

		// Batch place 3 grass cells
		history = batchSetMarks(history, [
			{ row: 1, col: 0, mark: 'grass' },
			{ row: 1, col: 1, mark: 'grass' },
			{ row: 1, col: 3, mark: 'grass' },
		]);

		assert.equal(history.grassPlacedCount, 3);
		assert.equal(history.moveCount, 1);
		assert.equal(canUndo(history), true);
	});

	it('supports undo and redo, restoring board states and counters', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		let history = createHistory(board);

		history = setCellMark(history, 0, 0, 'grass');
		assert.equal(history.grassPlacedCount, 1);
		assert.equal(history.moveCount, 1);

		history = setCellMark(history, 0, 1, 'tent');
		assert.equal(history.grassPlacedCount, 1);
		assert.equal(history.moveCount, 2);

		// Undo last move (tent placement)
		history = undo(history);
		assert.equal(history.present.grid[0][1].mark, 'none');
		assert.equal(history.grassPlacedCount, 1);
		assert.equal(history.moveCount, 1);
		assert.equal(canRedo(history), true);

		// Undo first move (grass placement)
		history = undo(history);
		assert.equal(history.present.grid[0][0].mark, 'none');
		assert.equal(history.grassPlacedCount, 0);
		assert.equal(history.moveCount, 0);

		// Redo first move
		history = redo(history);
		assert.equal(history.present.grid[0][0].mark, 'grass');
		assert.equal(history.grassPlacedCount, 1);
		assert.equal(history.moveCount, 1);

		// Redo second move
		history = redo(history);
		assert.equal(history.present.grid[0][1].mark, 'tent');
		assert.equal(history.grassPlacedCount, 1);
		assert.equal(history.moveCount, 2);
	});

	it('ignores moves on tree cells and redundant mark setting', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		const history = createHistory(board);

		// Find a tree cell
		const tree = preset.trees[0];
		const updatedTree = setCellMark(history, tree.row, tree.col, 'tent');
		assert.equal(updatedTree, history, 'Attempting to mark a tree should return unchanged history');

		// Redundant mark setting
		const withTent = setCellMark(history, 0, 0, 'tent');
		const withSameTent = setCellMark(withTent, 0, 0, 'tent');
		assert.equal(withSameTent, withTent, 'Redundant mark should return unchanged history');
	});

	it('clears redo future when a new move is made after an undo', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		let history = createHistory(board);

		history = setCellMark(history, 0, 0, 'tent');
		history = undo(history);
		assert.equal(canRedo(history), true);

		// New move diverges timeline
		history = setCellMark(history, 0, 1, 'grass');
		assert.equal(canRedo(history), false);
		assert.equal(history.present.grid[0][0].mark, 'none');
		assert.equal(history.present.grid[0][1].mark, 'grass');
	});

	it('resets all player marks while preserving fixed trees and enabling undo', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		let history = createHistory(board);

		history = setCellMark(history, 0, 0, 'tent');
		history = setCellMark(history, 0, 1, 'grass');

		history = reset(history);
		assert.equal(history.present.grid[0][0].mark, 'none');
		assert.equal(history.present.grid[0][1].mark, 'none');

		// Trees remain preserved
		for (const tree of preset.trees) {
			assert.equal(history.present.grid[tree.row][tree.col].fixed, 'tree');
		}

		// Undo restores the pre-reset state
		history = undo(history);
		assert.equal(history.present.grid[0][0].mark, 'tent');
		assert.equal(history.present.grid[0][1].mark, 'grass');
	});

	it('HistoryManager class provides complete stateful facade', () => {
		const preset = getPresetById('easy-1');
		assert.ok(preset);
		const board = createBoardFromPuzzle(preset);
		const manager = createHistoryStack(board);

		assert.equal(manager.canUndo(), false);
		assert.equal(manager.canRedo(), false);
		assert.equal(manager.getGrassPlacedCount(), 0);

		manager.setMark(0, 0, 'grass');
		assert.equal(manager.getGrassPlacedCount(), 1);
		assert.equal(manager.canUndo(), true);

		manager.setMark(0, 2, 'tent');
		assert.equal(manager.getMoveCount(), 2);

		const undone = manager.undo();
		assert.ok(undone);
		assert.equal(undone.grid[0][2].mark, 'none');
		assert.equal(manager.canRedo(), true);

		const redone = manager.redo();
		assert.ok(redone);
		assert.equal(redone.grid[0][2].mark, 'tent');
	});
});
