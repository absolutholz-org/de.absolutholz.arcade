import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PENTOMINO_IDS, TETROMINO_IDS, TROMINO_IDS, getPlacementCells, getUniqueOrientations } from './pieces.ts';
import { findPlacementAtCell, isPuzzleComplete, placePiece, removePiece, validatePlacement } from './validator.ts';

describe('Polyomino piece geometry and symmetries', () => {
	it('produces exactly 63 fixed pentominoes across the 12 canonical free pentominoes', () => {
		let totalFixed = 0;
		for (const id of PENTOMINO_IDS) {
			const orientations = getUniqueOrientations(id);
			totalFixed += orientations.length;
			for (const shape of orientations) {
				assert.equal(shape.cells.length, 5, `Pentomino ${id} must have 5 cells`);
				const minRow = Math.min(...shape.cells.map((c) => c.row));
				const minCol = Math.min(...shape.cells.map((c) => c.col));
				assert.equal(minRow, 0);
				assert.equal(minCol, 0);
			}
		}
		assert.equal(totalFixed, 63);
	});

	it('produces 19 fixed tetrominoes and 6 fixed trominoes', () => {
		const tetrominoFixed = TETROMINO_IDS.reduce((sum, id) => sum + getUniqueOrientations(id).length, 0);
		const trominoFixed = TROMINO_IDS.reduce((sum, id) => sum + getUniqueOrientations(id).length, 0);
		assert.equal(tetrominoFixed, 19);
		assert.equal(trominoFixed, 6);
	});
});

describe('Placement validation and completion checks', () => {
	const mask3x5 = [
		[1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1],
	];

	it('detects out-of-bounds and overlapping placements', () => {
		const outOfBounds = validatePlacement(mask3x5, [], {
			pieceId: 'I',
			anchor: { row: 0, col: 0 },
			rotation: 0,
			flipped: false,
		});
		assert.equal(outOfBounds.valid, false);
		assert.equal(outOfBounds.reason, 'out-of-bounds');

		const validFirst = placePiece(mask3x5, [], {
			pieceId: 'U',
			anchor: { row: 0, col: 0 },
			rotation: 0,
			flipped: false,
		});
		assert.equal(validFirst.validation.valid, true);

		const overlapping = validatePlacement(mask3x5, validFirst.placements, {
			pieceId: 'P',
			anchor: { row: 0, col: 0 },
			rotation: 0,
			flipped: false,
		});
		assert.equal(overlapping.valid, false);
		assert.equal(overlapping.reason, 'overlap');
	});

	it('supports finding and removing placed pieces by cell coordinate', () => {
		const placed = placePiece(mask3x5, [], {
			pieceId: 'P',
			anchor: { row: 0, col: 0 },
			rotation: 0,
			flipped: false,
		}).placements;

		const cells = getPlacementCells(placed[0]);
		const found = findPlacementAtCell(placed, cells[0]);
		assert.equal(found?.pieceId, 'P');

		const afterRemove = removePiece(placed, 'P');
		assert.equal(afterRemove.length, 0);
		assert.equal(isPuzzleComplete(mask3x5, ['F', 'P', 'U'], afterRemove), false);
	});
});
