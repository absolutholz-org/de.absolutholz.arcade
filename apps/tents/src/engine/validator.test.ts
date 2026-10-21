import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getPresetById } from './presets/index.ts';
import type { BoardState } from './types.ts';
import {
	areChebyshevTouching,
	areOrthogonallyAdjacent,
	checkBipartiteMatching,
	checkColClues,
	checkRowClues,
	coordKey,
	createBoardFromPuzzle,
	evaluateBoard,
	findTouchingTents,
	isPuzzleSolved,
	parseCoordKey,
} from './validator.ts';

describe('Tents & Trees - Validator Engine', () => {
	describe('Coordinate & Adjacency Helpers', () => {
		it('formats and parses coordinate keys', () => {
			assert.equal(coordKey(3, 7), '3,7');
			assert.deepEqual(parseCoordKey('3,7'), { row: 3, col: 7 });
		});

		it('identifies orthogonal adjacency', () => {
			assert.equal(areOrthogonallyAdjacent({ row: 2, col: 3 }, { row: 1, col: 3 }), true); // North
			assert.equal(areOrthogonallyAdjacent({ row: 2, col: 3 }, { row: 3, col: 3 }), true); // South
			assert.equal(areOrthogonallyAdjacent({ row: 2, col: 3 }, { row: 2, col: 4 }), true); // East
			assert.equal(areOrthogonallyAdjacent({ row: 2, col: 3 }, { row: 2, col: 2 }), true); // West

			// Diagonal is not orthogonal
			assert.equal(areOrthogonallyAdjacent({ row: 2, col: 3 }, { row: 3, col: 4 }), false);
			// Same cell
			assert.equal(areOrthogonallyAdjacent({ row: 2, col: 3 }, { row: 2, col: 3 }), false);
			// Distance 2
			assert.equal(areOrthogonallyAdjacent({ row: 2, col: 3 }, { row: 4, col: 3 }), false);
		});

		it('identifies Chebyshev touching (horizontal, vertical, diagonal)', () => {
			// Horizontal
			assert.equal(areChebyshevTouching({ row: 2, col: 2 }, { row: 2, col: 3 }), true);
			// Vertical
			assert.equal(areChebyshevTouching({ row: 2, col: 2 }, { row: 3, col: 2 }), true);
			// Diagonal
			assert.equal(areChebyshevTouching({ row: 2, col: 2 }, { row: 3, col: 3 }), true);
			assert.equal(areChebyshevTouching({ row: 2, col: 2 }, { row: 1, col: 1 }), true);

			// Identity (same cell) does NOT count as touching neighbor
			assert.equal(areChebyshevTouching({ row: 2, col: 2 }, { row: 2, col: 2 }), false);

			// Distance 2 is NOT touching
			assert.equal(areChebyshevTouching({ row: 2, col: 2 }, { row: 2, col: 4 }), false);
			assert.equal(areChebyshevTouching({ row: 2, col: 2 }, { row: 4, col: 4 }), false);
		});
	});

	describe('Line Clue Evaluation', () => {
		it('correctly reports under, satisfied, and overflow line statuses', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			// row 0 clue is 1 (from easy-1: rowClues: [1, 0, 1, 0, 1, 2])
			const initialRows = checkRowClues(board);
			assert.equal(initialRows[0].status, 'under');
			assert.equal(initialRows[1].status, 'satisfied'); // target 0, current 0

			// Place 1 tent in row 0
			board.grid[0][2].mark = 'tent';
			const updatedRows = checkRowClues(board);
			assert.equal(updatedRows[0].status, 'satisfied');
			assert.equal(updatedRows[0].current, 1);

			// Place another tent in row 0 -> overflow
			board.grid[0][0].mark = 'tent';
			const overflowRows = checkRowClues(board);
			assert.equal(overflowRows[0].status, 'overflow');
			assert.equal(overflowRows[0].current, 2);
		});

		it('evaluates column clues identically', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			// col 2 clue is 2
			board.grid[0][2].mark = 'tent';
			let cols = checkColClues(board);
			assert.equal(cols[2].status, 'under');

			board.grid[2][2].mark = 'tent';
			cols = checkColClues(board);
			assert.equal(cols[2].status, 'satisfied');

			board.grid[4][2].mark = 'tent';
			cols = checkColClues(board);
			assert.equal(cols[2].status, 'overflow');
		});
	});

	describe('Touching Tents Detection', () => {
		it('returns empty set when no tents touch', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			// Place non-touching tents: (0, 0) and (2, 2)
			board.grid[0][0].mark = 'tent';
			board.grid[2][2].mark = 'tent';

			const touching = findTouchingTents(board);
			assert.equal(touching.size, 0);
		});

		it('detects horizontally touching tents', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			board.grid[1][3].mark = 'tent';
			board.grid[1][4].mark = 'tent';

			const touching = findTouchingTents(board);
			assert.equal(touching.size, 2);
			assert.ok(touching.has('1,3'));
			assert.ok(touching.has('1,4'));
		});

		it('detects diagonally touching tents', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			board.grid[1][1].mark = 'tent';
			board.grid[2][2].mark = 'tent';

			const touching = findTouchingTents(board);
			assert.equal(touching.size, 2);
			assert.ok(touching.has('1,1'));
			assert.ok(touching.has('2,2'));
		});
	});

	describe('Bipartite Matching (Tree-Tent Pairing)', () => {
		it('confirms perfect matching for valid 1-to-1 orthogonal pairs', () => {
			const trees = [
				{ row: 1, col: 2 },
				{ row: 3, col: 4 },
			];
			const tents = [
				{ row: 0, col: 2 }, // Orthogonal to tree 0
				{ row: 3, col: 5 }, // Orthogonal to tree 1
			];

			const result = checkBipartiteMatching(trees, tents);
			assert.equal(result.isPerfect, true);
			assert.equal(result.unpairedTrees.size, 0);
			assert.equal(result.unpairedTents.size, 0);
			assert.equal(result.matching.get('1,2'), '0,2');
			assert.equal(result.matching.get('3,4'), '3,5');
		});

		it('rejects diagonal tree-tent arrangement as unpaired', () => {
			const trees = [{ row: 1, col: 2 }];
			const tents = [{ row: 2, col: 3 }]; // Diagonal!

			const result = checkBipartiteMatching(trees, tents);
			assert.equal(result.isPerfect, false);
			assert.ok(result.unpairedTrees.has('1,2'));
			assert.ok(result.unpairedTents.has('2,3'));
		});

		it('rejects unmatched count mismatch', () => {
			const trees = [
				{ row: 1, col: 2 },
				{ row: 4, col: 4 },
			];
			const tents = [{ row: 1, col: 3 }];

			const result = checkBipartiteMatching(trees, tents);
			assert.equal(result.isPerfect, false);
		});

		it('resolves shared neighbor ambiguity using augmenting path', () => {
			// Tree A at (1, 1) can connect to Tent 1 (0, 1) or Tent 2 (1, 2)
			// Tree B at (1, 3) can ONLY connect to Tent 2 (1, 2)
			// Maximum bipartite matching should pair Tree A with Tent 1 and Tree B with Tent 2!
			const trees = [
				{ row: 1, col: 1 },
				{ row: 1, col: 3 },
			];
			const tents = [
				{ row: 0, col: 1 }, // Adjacent only to Tree A
				{ row: 1, col: 2 }, // Adjacent to Tree A AND Tree B
			];

			const result = checkBipartiteMatching(trees, tents);
			assert.equal(result.isPerfect, true);
			assert.equal(result.matching.get('1,1'), '0,1');
			assert.equal(result.matching.get('1,3'), '1,2');
		});
	});

	describe('Full Win State (isPuzzleSolved)', () => {
		it('returns false for initial empty puzzle', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			assert.equal(isPuzzleSolved(board), false);
		});

		it('returns true when the exact solution is placed', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			// Place the solution tents
			for (const tent of preset.solution ?? []) {
				board.grid[tent.row][tent.col].mark = 'tent';
			}

			assert.equal(isPuzzleSolved(board), true);
		});

		it('remains solved if player places additional grass marks on empty cells', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			for (const tent of preset.solution ?? []) {
				board.grid[tent.row][tent.col].mark = 'tent';
			}

			// Add grass marks
			board.grid[0][0].mark = 'grass';
			board.grid[1][1].mark = 'grass';

			assert.equal(isPuzzleSolved(board), true);
		});

		it('returns false if a tent is placed on top of a tree cell', () => {
			const preset = getPresetById('easy-1');
			assert.ok(preset);
			const board = createBoardFromPuzzle(preset);

			// Place tents but one is placed on a tree
			const tree = preset.trees[0];
			board.grid[tree.row][tree.col].mark = 'tent';

			assert.equal(isPuzzleSolved(board), false);
		});
	});
});
