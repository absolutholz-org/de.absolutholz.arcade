import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SoloNobleEngine } from './engine.ts';
import { BOARD_DEFINITIONS, posKey } from './layouts.ts';

describe('SoloNobleEngine', () => {
	describe('Board Layout Definitions', () => {
		it('accurately defines all 5 layout hole counts and dimensions', () => {
			assert.equal(BOARD_DEFINITIONS.english.holes.length, 33);
			assert.deepEqual(BOARD_DEFINITIONS.english.center, { r: 3, c: 3 });

			assert.equal(BOARD_DEFINITIONS.european.holes.length, 37);
			assert.deepEqual(BOARD_DEFINITIONS.european.center, { r: 3, c: 3 });

			assert.equal(BOARD_DEFINITIONS.triangular.holes.length, 15);
			assert.deepEqual(BOARD_DEFINITIONS.triangular.center, { r: 0, c: 0 });

			assert.equal(BOARD_DEFINITIONS.diamond.holes.length, 41);
			assert.deepEqual(BOARD_DEFINITIONS.diamond.center, { r: 4, c: 4 });

			assert.equal(BOARD_DEFINITIONS.wiegleb.holes.length, 45);
			assert.deepEqual(BOARD_DEFINITIONS.wiegleb.center, { r: 4, c: 4 });
		});
	});

	describe('Jump Validation across Distinct Geometries', () => {
		it('validates legal and illegal orthogonal moves on English board', () => {
			const engine = new SoloNobleEngine({ layoutId: 'english', variantId: 'classic-central' });

			assert.equal(engine.pegCount, 32);
			assert.equal(engine.gameStatus, 'ready');
			assert.equal(engine.hasPeg({ r: 3, c: 3 }), false); // Center is empty

			// Initial legal moves jumping into center (3,3)
			const legalMoves = engine.getLegalMoves();
			assert.equal(legalMoves.length, 4);

			// (1,3) jumping over (2,3) to (3,3) should be valid
			assert.equal(engine.isValidMove({ r: 1, c: 3 }, { r: 3, c: 3 }), true);
			// (5,3) jumping over (4,3) to (3,3) should be valid
			assert.equal(engine.isValidMove({ r: 5, c: 3 }, { r: 3, c: 3 }), true);
			// (3,1) jumping over (3,2) to (3,3) should be valid
			assert.equal(engine.isValidMove({ r: 3, c: 1 }, { r: 3, c: 3 }), true);
			// (3,5) jumping over (3,4) to (3,3) should be valid
			assert.equal(engine.isValidMove({ r: 3, c: 5 }, { r: 3, c: 3 }), true);

			// Illegal diagonal move on orthogonal board
			assert.equal(engine.isValidMove({ r: 1, c: 1 }, { r: 3, c: 3 }), false);

			// Illegal move to non-empty hole
			assert.equal(engine.isValidMove({ r: 0, c: 2 }, { r: 2, c: 2 }), false);

			// Illegal jump into non-hole (corner)
			assert.equal(engine.isValidMove({ r: 2, c: 2 }, { r: 0, c: 0 }), false);

			// Execute legal move
			const success = engine.makeMove({ r: 1, c: 3 }, { r: 3, c: 3 });
			assert.equal(success, true);
			assert.equal(engine.hasPeg({ r: 1, c: 3 }), false);
			assert.equal(engine.hasPeg({ r: 2, c: 3 }), false);
			assert.equal(engine.hasPeg({ r: 3, c: 3 }), true);
			assert.equal(engine.pegCount, 31);
			assert.equal(engine.moveCount, 1);
			assert.equal(engine.gameStatus, 'playing');
		});

		it('validates 3-axis triangular jumps on Triangular board', () => {
			// Triangular board has 15 holes, apex (0,0) empty
			const engine = new SoloNobleEngine({ layoutId: 'triangular', variantId: 'clear-out' });

			assert.equal(engine.pegCount, 14);
			assert.equal(engine.hasPeg({ r: 0, c: 0 }), false);

			// 2 legal moves can jump into apex (0,0):
			// 1) From (2,0) jumping over (1,0) to (0,0) (Axis: Up-Right)
			// 2) From (2,2) jumping over (1,1) to (0,0) (Axis: Up-Left)
			assert.equal(engine.isValidMove({ r: 2, c: 0 }, { r: 0, c: 0 }), true);
			assert.equal(engine.isValidMove({ r: 2, c: 2 }, { r: 0, c: 0 }), true);

			// (2,1) cannot jump to (0,0) because there is no collinear line
			assert.equal(engine.isValidMove({ r: 2, c: 1 }, { r: 0, c: 0 }), false);

			// Horizontal jump along a row should be valid when layout allows:
			// Let's execute (2,0) -> (0,0)
			assert.equal(engine.makeMove({ r: 2, c: 0 }, { r: 0, c: 0 }), true);
			assert.equal(engine.hasPeg({ r: 2, c: 0 }), false);
			assert.equal(engine.hasPeg({ r: 1, c: 0 }), false);
			assert.equal(engine.hasPeg({ r: 0, c: 0 }), true);

			// Now (2,0) is empty. From (2,2), can jump horizontally over (2,1) into (2,0)!
			assert.equal(engine.isValidMove({ r: 2, c: 2 }, { r: 2, c: 0 }), true);
			assert.equal(engine.makeMove({ r: 2, c: 2 }, { r: 2, c: 0 }), true);
			assert.equal(engine.hasPeg({ r: 2, c: 2 }), false);
			assert.equal(engine.hasPeg({ r: 2, c: 1 }), false);
			assert.equal(engine.hasPeg({ r: 2, c: 0 }), true);
			assert.equal(engine.pegCount, 12);
		});
	});

	describe('Undo and Redo Integrity', () => {
		it('manages undo/redo history cleanly and reverts all board changes', () => {
			const engine = new SoloNobleEngine({ layoutId: 'english', variantId: 'classic-central' });

			assert.equal(engine.canUndo, false);
			assert.equal(engine.canRedo, false);

			// Move 1: (1,3) -> (3,3)
			assert.equal(engine.makeMove({ r: 1, c: 3 }, { r: 3, c: 3 }), true);
			assert.equal(engine.canUndo, true);
			assert.equal(engine.canRedo, false);
			assert.equal(engine.moveCount, 1);
			assert.equal(engine.pegCount, 31);

			// Move 2: (4,3) -> (2,3)
			assert.equal(engine.makeMove({ r: 4, c: 3 }, { r: 2, c: 3 }), true);
			assert.equal(engine.moveCount, 2);
			assert.equal(engine.pegCount, 30);

			// Undo Move 2
			assert.equal(engine.undo(), true);
			assert.equal(engine.moveCount, 1);
			assert.equal(engine.pegCount, 31);
			assert.equal(engine.canRedo, true);
			assert.equal(engine.hasPeg({ r: 4, c: 3 }), true);
			assert.equal(engine.hasPeg({ r: 3, c: 3 }), true);
			assert.equal(engine.hasPeg({ r: 2, c: 3 }), false);

			// Undo Move 1 (back to initial)
			assert.equal(engine.undo(), true);
			assert.equal(engine.moveCount, 0);
			assert.equal(engine.pegCount, 32);
			assert.equal(engine.canUndo, false);
			assert.equal(engine.canRedo, true);
			assert.equal(engine.gameStatus, 'ready');
			assert.equal(engine.hasPeg({ r: 3, c: 3 }), false);

			// Redo Move 1
			assert.equal(engine.redo(), true);
			assert.equal(engine.moveCount, 1);
			assert.equal(engine.pegCount, 31);
			assert.equal(engine.hasPeg({ r: 3, c: 3 }), true);
			assert.equal(engine.gameStatus, 'playing');

			// Redo Move 2
			assert.equal(engine.redo(), true);
			assert.equal(engine.moveCount, 2);
			assert.equal(engine.pegCount, 30);
			assert.equal(engine.canRedo, false);

			// Branching history: undo 1 move and make a different move
			assert.equal(engine.undo(), true);
			assert.equal(engine.canRedo, true);

			// Alternative move: (3,1) -> (3,3)
			assert.equal(engine.makeMove({ r: 3, c: 1 }, { r: 3, c: 3 }), false); // (3,3) is occupied
			// Instead: (2,3) jumping over (3,3) into (4,3) is not possible since (2,3) is empty
			// But (2,1) -> (2,3) is valid!
			assert.equal(engine.makeMove({ r: 2, c: 1 }, { r: 2, c: 3 }), true);
			assert.equal(engine.canRedo, false); // Redo stack invalidated!
		});
	});

	describe('Terminal States: Won vs Stuck', () => {
		it('detects Classic Central won state (single peg in center)', () => {
			const engine = new SoloNobleEngine({ layoutId: 'english', variantId: 'classic-central' });

			// Simulate end game by directly manipulating private state via class for testing
			// We can verify win condition behavior by simulating the final move
			// Let's set up 2 pegs remaining: peg at (1,3) and peg at (2,3), empty at (3,3)
			// Reset and create a small custom board or directly set pegs
			const engineAny = engine as unknown as {
				pegs: Set<string>;
				updateStatus: () => void;
				makeMove: (from: { r: number; c: number }, to: { r: number; c: number }) => boolean;
			};

			engineAny.pegs.clear();
			engineAny.pegs.add(posKey(1, 3));
			engineAny.pegs.add(posKey(2, 3));
			engineAny.updateStatus();

			assert.equal(engine.pegCount, 2);
			assert.equal(engine.isValidMove({ r: 1, c: 3 }, { r: 3, c: 3 }), true);

			assert.equal(engine.makeMove({ r: 1, c: 3 }, { r: 3, c: 3 }), true);
			assert.equal(engine.pegCount, 1);
			assert.equal(engine.hasPeg({ r: 3, c: 3 }), true);
			assert.equal(engine.gameStatus, 'won');
		});

		it('detects stuck state when single peg remains but NOT in center for Classic Central', () => {
			const engine = new SoloNobleEngine({ layoutId: 'english', variantId: 'classic-central' });
			const engineAny = engine as unknown as {
				pegs: Set<string>;
				updateStatus: () => void;
			};

			// Setup 2 pegs: (3,1) and (3,2) jumping into (3,3) would win, but jumping into (3,0) does not
			// Let's set pegs at (3,2) and (3,1) jumping away to (3,0)
			engineAny.pegs.clear();
			engineAny.pegs.add(posKey(3, 2));
			engineAny.pegs.add(posKey(3, 1));
			engineAny.updateStatus();

			assert.equal(engine.makeMove({ r: 3, c: 2 }, { r: 3, c: 0 }), true);
			assert.equal(engine.pegCount, 1);
			assert.equal(engine.hasPeg({ r: 3, c: 0 }), true);
			assert.equal(engine.gameStatus, 'stuck'); // 1 peg left, but not center!
		});

		it('detects won state for Clear Out when single peg remains anywhere', () => {
			const engine = new SoloNobleEngine({ layoutId: 'english', variantId: 'clear-out' });
			const engineAny = engine as unknown as {
				pegs: Set<string>;
				updateStatus: () => void;
			};

			engineAny.pegs.clear();
			engineAny.pegs.add(posKey(3, 2));
			engineAny.pegs.add(posKey(3, 1));
			engineAny.updateStatus();

			assert.equal(engine.makeMove({ r: 3, c: 2 }, { r: 3, c: 0 }), true);
			assert.equal(engine.pegCount, 1);
			assert.equal(engine.hasPeg({ r: 3, c: 0 }), true);
			assert.equal(engine.gameStatus, 'won'); // Clear Out wins on any position!
		});

		it('detects stuck state when multiple pegs remain with no legal moves', () => {
			const engine = new SoloNobleEngine({ layoutId: 'english', variantId: 'classic-central' });
			const engineAny = engine as unknown as {
				pegs: Set<string>;
				updateStatus: () => void;
			};

			// Isolated pegs that cannot jump each other
			engineAny.pegs.clear();
			engineAny.pegs.add(posKey(0, 2));
			engineAny.pegs.add(posKey(6, 4));
			engineAny.updateStatus();

			assert.equal(engine.pegCount, 2);
			assert.equal(engine.hasLegalMoves(), false);
			assert.equal(engine.gameStatus, 'stuck');
			assert.equal(engine.getLegalMoves().length, 0);
		});
	});

	describe('Custom Start Variant', () => {
		it('supports player picking an arbitrary initial empty hole', () => {
			const engine = new SoloNobleEngine({ layoutId: 'english', variantId: 'custom-start' });

			assert.equal(engine.pegCount, 33);
			assert.equal(engine.initialEmptyPosition, null);

			// Attempting a move before selecting empty hole should fail
			assert.equal(engine.makeMove({ r: 1, c: 3 }, { r: 3, c: 3 }), false);

			// Invalid hole selection
			assert.equal(engine.selectInitialEmpty({ r: 0, c: 0 }), false);

			// Valid selection: hole at (2,0)
			assert.equal(engine.selectInitialEmpty({ r: 2, c: 0 }), true);
			assert.equal(engine.pegCount, 32);
			assert.equal(engine.hasPeg({ r: 2, c: 0 }), false);
			assert.deepEqual(engine.initialEmptyPosition, { r: 2, c: 0 });

			// Jumps into (2,0) should now be valid (e.g. from (2,2) over (2,1))
			assert.equal(engine.isValidMove({ r: 2, c: 2 }, { r: 2, c: 0 }), true);
			assert.equal(engine.makeMove({ r: 2, c: 2 }, { r: 2, c: 0 }), true);
			assert.equal(engine.pegCount, 31);
		});
	});
});
