import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { FutoshikiBoard, InequalitySign } from './types.ts';
import { coordKey, getCellInequalityRelations, isBoardComplete, validateBoard } from './validator.ts';

function makeBoard(
	values: (number | null)[][],
	hInequalities: InequalitySign[][],
	vInequalities: InequalitySign[][],
): FutoshikiBoard {
	const size = values.length;
	return {
		size,
		cells: values.map((row, r) =>
			row.map((value, c) => ({
				row: r,
				col: c,
				value,
				given: false,
				notes: [],
			})),
		),
		hInequalities,
		vInequalities,
	};
}

describe('Futoshiki validator', () => {
	it('accepts a valid completed 4×4 Futoshiki board', () => {
		const board = makeBoard(
			[
				[1, 2, 3, 4],
				[2, 3, 4, 1],
				[3, 4, 1, 2],
				[4, 1, 2, 3],
			],
			[
				['<', '<', null],
				[null, '<', '>'],
				[null, '>', null],
				['>', null, '<'],
			],
			[
				['<', null, null, '>'],
				['<', '<', '>', null],
				[null, '>', '<', '<'],
			],
		);

		const conflicts = validateBoard(board);
		assert.equal(conflicts.hasConflicts, false);
		assert.equal(isBoardComplete(board), true);
	});

	it('detects row and column duplicate digits', () => {
		const board = makeBoard(
			[
				[1, 1, null, null],
				[1, null, null, null],
				[null, null, null, null],
				[null, null, null, null],
			],
			Array.from({ length: 4 }, () => Array<InequalitySign>(3).fill(null)),
			Array.from({ length: 3 }, () => Array<InequalitySign>(4).fill(null)),
		);

		const conflicts = validateBoard(board);
		assert.equal(conflicts.hasConflicts, true);
		assert.equal(conflicts.duplicateCells.has(coordKey(0, 0)), true);
		assert.equal(conflicts.duplicateCells.has(coordKey(0, 1)), true);
		assert.equal(conflicts.duplicateCells.has(coordKey(1, 0)), true);
		assert.equal(isBoardComplete(board), false);
	});

	it('detects horizontal and vertical inequality violations', () => {
		const board = makeBoard(
			[
				[3, 2, null, null],
				[4, null, null, null],
				[null, null, null, null],
				[null, null, null, null],
			],
			[
				['<', null, null],
				[null, null, null],
				[null, null, null],
				[null, null, null],
			],
			[
				['>', null, null, null],
				[null, null, null, null],
				[null, null, null, null],
			],
		);

		const conflicts = validateBoard(board);
		assert.equal(conflicts.hasConflicts, true);
		assert.equal(conflicts.violatedHorizontal.has(coordKey(0, 0)), true);
		assert.equal(conflicts.violatedVertical.has(coordKey(0, 0)), true);
	});

	it('computes adjacent inequality relations from a cell perspective', () => {
		const board = makeBoard(
			[
				[null, null, null],
				[null, null, null],
				[null, null, null],
			],
			[
				[null, null],
				['<', '>'], // (1,0) < (1,1) > (1,2)
				[null, null],
			],
			[
				[null, '>', null], // (0,1) > (1,1)
				[null, '<', null], // (1,1) < (2,1)
			],
		);

		const rel = getCellInequalityRelations(board, 1, 1);
		assert.equal(rel.left, 'greater');
		assert.equal(rel.right, 'greater');
		assert.equal(rel.above, 'less');
		assert.equal(rel.below, 'less');
	});
});
