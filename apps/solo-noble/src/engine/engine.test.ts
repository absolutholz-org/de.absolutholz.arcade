import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SoloNobleEngine } from './engine.js';
import { BOARD_DEFINITIONS, getCompiledLayout, toCoordinateKey } from './layouts.js';
import type { CoordinateKey } from './types.js';

describe('SoloNobleEngine - Board Geometries & Layouts', () => {
	it('compiles all 5 board layouts with correct hole counts and centers', () => {
		const english = getCompiledLayout('english');
		assert.equal(english.holeKeys.size, 33);
		assert.equal(english.centerKey, '3,3');

		// Assert English board boundary coordinates
		// (0,2), (0,3), (0,4) exist
		assert.equal(english.holeKeys.has('0,2'), true);
		assert.equal(english.holeKeys.has('0,3'), true);
		assert.equal(english.holeKeys.has('0,4'), true);
		// (0,0) and (0,1) must be invalid
		assert.equal(english.holeKeys.has('0,0'), false);
		assert.equal(english.holeKeys.has('0,1'), false);
		assert.equal(english.holeKeys.has('0,5'), false);
		assert.equal(english.holeKeys.has('0,6'), false);

		const european = getCompiledLayout('european');
		assert.equal(european.holeKeys.size, 37);
		assert.equal(european.centerKey, '3,3');

		const triangular = getCompiledLayout('triangular');
		assert.equal(triangular.holeKeys.size, 15);
		assert.equal(triangular.centerKey, '0,0');

		const diamond = getCompiledLayout('diamond');
		assert.equal(diamond.holeKeys.size, 41);
		assert.equal(diamond.centerKey, '4,4');

		const wiegleb = getCompiledLayout('wiegleb');
		assert.equal(wiegleb.holeKeys.size, 45);
		assert.equal(wiegleb.centerKey, '4,4');
	});

	it('precomputes legal jumps for orthogonal and triangular geometries', () => {
		const english = getCompiledLayout('english');
		// English 33 layout has 76 legal jump vectors
		assert.equal(english.allJumps.length, 76);

		const triangular = getCompiledLayout('triangular');
		// 15-hole triangular layout has 36 legal jump vectors
		assert.equal(triangular.allJumps.length, 36);
	});
});

describe('SoloNobleEngine - Move Validation & Execution', () => {
	it('validates legal and illegal jumps in English board', () => {
		const engine = new SoloNobleEngine('english', 'classic-central');
		assert.equal(engine.getStatus(), 'playing');
		assert.equal(engine.getPegCount(), 32);

		// Vertical jump into center (3,3) succeeds
		assert.equal(engine.isValidMove('1,3', '3,3'), true);
		assert.equal(engine.isValidMove('5,3', '3,3'), true);

		// Horizontal jump into center (3,3) succeeds
		assert.equal(engine.isValidMove('3,1', '3,3'), true);
		assert.equal(engine.isValidMove('3,5', '3,3'), true);

		// Diagonal jump on orthogonal board is strictly rejected
		assert.equal(engine.isValidMove('1,2', '3,4'), false);
		assert.equal(engine.isValidMove('1,1' as unknown as CoordinateKey, '3,3'), false);

		// Illegal jumps to occupied holes
		assert.equal(engine.isValidMove('0,2', '0,4'), false);
		// Jump from empty hole
		assert.equal(engine.isValidMove('3,3', '1,3'), false);
		// Jump off board
		assert.equal(engine.isValidMove('0,3', '-2,3' as unknown as CoordinateKey), false);

		// Execute vertical jump
		const success = engine.executeMove('1,3', '3,3');
		assert.equal(success, true);
		assert.equal(engine.getPegCount(), 31);
		assert.equal(engine.getMoveCount(), 1);

		const board = engine.getBoard();
		assert.equal(board['1,3'], false);
		assert.equal(board['2,3'], false);
		assert.equal(board['3,3'], true);
	});

	it('validates legal and illegal jumps in Triangular board', () => {
		const engine = new SoloNobleEngine('triangular', 'classic-central');
		assert.equal(engine.getStatus(), 'playing');
		assert.equal(engine.getPegCount(), 14);

		// Legal jumps into apex (0,0) along the two slanted axes
		assert.equal(engine.isValidMove('2,0', '0,0'), true);
		assert.equal(engine.isValidMove('2,2', '0,0'), true);

		// Horizontal jump when target occupied is rejected
		assert.equal(engine.isValidMove('2,0', '2,2'), false);

		// Execute triangular jump
		const moved = engine.executeMove('2,0', '0,0');
		assert.equal(moved, true);
		assert.equal(engine.getPegCount(), 13);
		assert.equal(engine.getBoard()['2,0'], false);
		assert.equal(engine.getBoard()['1,0'], false);
		assert.equal(engine.getBoard()['0,0'], true);
	});
});

describe('SoloNobleEngine - Undo, Redo and Reset', () => {
	it('supports full undo and redo stacks with integrity', () => {
		const engine = new SoloNobleEngine('english', 'classic-central');
		assert.equal(engine.canUndo(), false);
		assert.equal(engine.canRedo(), false);

		engine.executeMove('1,3', '3,3');
		assert.equal(engine.canUndo(), true);
		assert.equal(engine.canRedo(), false);
		assert.equal(engine.getPegCount(), 31);

		// Undo move
		const undone = engine.undo();
		assert.equal(undone, true);
		assert.equal(engine.canUndo(), false);
		assert.equal(engine.canRedo(), true);
		assert.equal(engine.getPegCount(), 32);
		assert.equal(engine.getBoard()['1,3'], true);
		assert.equal(engine.getBoard()['2,3'], true);
		assert.equal(engine.getBoard()['3,3'], false);

		// Redo move
		const redone = engine.redo();
		assert.equal(redone, true);
		assert.equal(engine.canUndo(), true);
		assert.equal(engine.canRedo(), false);
		assert.equal(engine.getPegCount(), 31);
		assert.equal(engine.getBoard()['1,3'], false);
		assert.equal(engine.getBoard()['2,3'], false);
		assert.equal(engine.getBoard()['3,3'], true);

		// New move clears redo stack
		engine.undo();
		assert.equal(engine.canRedo(), true);
		engine.executeMove('3,1', '3,3');
		assert.equal(engine.canRedo(), false);
		assert.equal(engine.getPegCount(), 31);
	});

	it('resets board to initial layout and clears history', () => {
		const engine = new SoloNobleEngine('english', 'classic-central');
		engine.executeMove('1,3', '3,3');
		engine.executeMove('4,3', '2,3');
		assert.equal(engine.getMoveCount(), 2);

		engine.reset();
		assert.equal(engine.getMoveCount(), 0);
		assert.equal(engine.canUndo(), false);
		assert.equal(engine.canRedo(), false);
		assert.equal(engine.getPegCount(), 32);
		assert.equal(engine.getBoard()['3,3'], false);
	});
});

describe('SoloNobleEngine - Gameplay Variants & Terminal States', () => {
	it('handles custom-start variant flow', () => {
		const engine = new SoloNobleEngine('english', 'custom-start');
		assert.equal(engine.getStatus(), 'ready');
		assert.equal(engine.getPegCount(), 33);
		assert.equal(engine.getLegalMoves().length, 0);

		// Invalid empty hole selection
		assert.equal(engine.selectInitialEmptyHole('9,9' as unknown as CoordinateKey), false);

		// Select valid hole
		const selected = engine.selectInitialEmptyHole('2,3');
		assert.equal(selected, true);
		assert.equal(engine.getStatus(), 'playing');
		assert.equal(engine.getPegCount(), 32);
		assert.equal(engine.getInitialEmptyKey(), '2,3');
		assert.equal(engine.getBoard()['2,3'], false);
		assert.ok(engine.getLegalMoves().length > 0);
	});

	it('detects stuck state when no legal moves remain with > 1 pegs', () => {
		const engine = new SoloNobleEngine('english', 'classic-central');

		// Synthesize a stuck state by directly loading a 2-peg disconnected board
		const stuckBoard: Record<string, boolean> = {};
		for (const key of engine.getLayout().holeKeys) {
			stuckBoard[key] = false;
		}
		stuckBoard['0,2'] = true;
		stuckBoard['6,4'] = true;

		engine.loadState({
			layoutId: 'english',
			variant: 'classic-central',
			status: 'playing',
			board: stuckBoard,
			pegCount: 2,
			moveCount: 10,
			initialEmptyKey: '3,3',
		});

		assert.equal(engine.getPegCount(), 2);
		assert.equal(engine.getLegalMoves().length, 0);
		assert.equal(engine.getStatus(), 'stuck');
	});

	it('detects won vs stuck in classic-central variant (1 peg remaining)', () => {
		const engine = new SoloNobleEngine('english', 'classic-central');
		const emptyBoard: Record<string, boolean> = {};
		for (const key of engine.getLayout().holeKeys) {
			emptyBoard[key] = false;
		}

		// Case 1: 1 peg remaining in center (3,3) -> WON
		const wonBoard = { ...emptyBoard, '3,3': true };
		engine.loadState({
			layoutId: 'english',
			variant: 'classic-central',
			status: 'playing',
			board: wonBoard,
			pegCount: 1,
			moveCount: 31,
			initialEmptyKey: '3,3',
		});
		assert.equal(engine.getStatus(), 'won');

		// Case 2: 1 peg remaining NOT in center (0,2) -> STUCK
		const notCenterBoard = { ...emptyBoard, '0,2': true };
		engine.loadState({
			layoutId: 'english',
			variant: 'classic-central',
			status: 'playing',
			board: notCenterBoard,
			pegCount: 1,
			moveCount: 31,
			initialEmptyKey: '3,3',
		});
		assert.equal(engine.getStatus(), 'stuck');
	});

	it('detects won in clear-out variant (1 peg anywhere)', () => {
		const engine = new SoloNobleEngine('english', 'clear-out');
		const emptyBoard: Record<string, boolean> = {};
		for (const key of engine.getLayout().holeKeys) {
			emptyBoard[key] = false;
		}

		// 1 peg not in center is a WIN in clear-out
		const wonBoard = { ...emptyBoard, '0,2': true };
		engine.loadState({
			layoutId: 'english',
			variant: 'clear-out',
			status: 'playing',
			board: wonBoard,
			pegCount: 1,
			moveCount: 31,
			initialEmptyKey: '3,3',
		});
		assert.equal(engine.getStatus(), 'won');
	});
});
