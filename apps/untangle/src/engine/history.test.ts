import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePlanarGraph, moveVertex } from './graph-generator.ts';
import { canRedo, canUndo, createInitialHistory, pushHistory, redoHistory, undoHistory } from './history.ts';

describe('history', () => {
	it('manages undo and redo history transitions immutably', () => {
		const initialBoard = generatePlanarGraph('easy', 12345);
		const firstVertex = initialBoard.vertices[0];
		assert.ok(firstVertex);
		const vertexId = firstVertex.id;

		const h0 = createInitialHistory(initialBoard);
		assert.equal(canUndo(h0), false);
		assert.equal(canRedo(h0), false);
		assert.equal(undoHistory(h0), h0);
		assert.equal(redoHistory(h0), h0);

		const board1 = moveVertex(initialBoard, vertexId, 0.25, 0.35, true);
		const h1 = pushHistory(h0, board1);
		assert.equal(canUndo(h1), true);
		assert.equal(canRedo(h1), false);
		assert.equal(h1.present, board1);

		const board2 = moveVertex(board1, vertexId, 0.45, 0.55, true);
		const h2 = pushHistory(h1, board2);
		assert.equal(h2.past.length, 2);
		assert.equal(h2.present, board2);

		const hUndo1 = undoHistory(h2);
		assert.equal(hUndo1.present, board1);
		assert.equal(canUndo(hUndo1), true);
		assert.equal(canRedo(hUndo1), true);

		const hUndo2 = undoHistory(hUndo1);
		assert.equal(hUndo2.present, initialBoard);
		assert.equal(canUndo(hUndo2), false);
		assert.equal(canRedo(hUndo2), true);

		const hRedo1 = redoHistory(hUndo2);
		assert.equal(hRedo1.present, board1);
		assert.equal(canUndo(hRedo1), true);
		assert.equal(canRedo(hRedo1), true);

		// Pushing a new state clears the redo future stack
		const board3 = moveVertex(board1, vertexId, 0.75, 0.75, true);
		const hBranch = pushHistory(hRedo1, board3);
		assert.equal(hBranch.present, board3);
		assert.equal(canRedo(hBranch), false);
		assert.equal(hBranch.future.length, 0);
	});
});
