import type { Coordinate, PieceId, Placement, PolyominoDefinition, Rotation, TransformedShape } from './types.ts';

export const PENTOMINO_IDS: ReadonlyArray<PieceId> = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const TETROMINO_IDS: ReadonlyArray<PieceId> = ['I4', 'O4', 'T4', 'L4', 'Z4'];

export const TROMINO_IDS: ReadonlyArray<PieceId> = ['I3', 'V3'];

export const POLYOMINO_DEFINITIONS: Readonly<Record<PieceId, PolyominoDefinition>> = {
	F: {
		id: 'F',
		label: 'F',
		size: 5,
		colorIndex: 0,
		baseCells: [
			{ row: 0, col: 1 },
			{ row: 0, col: 2 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
			{ row: 2, col: 1 },
		],
	},
	I: {
		id: 'I',
		label: 'I',
		size: 5,
		colorIndex: 1,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 2, col: 0 },
			{ row: 3, col: 0 },
			{ row: 4, col: 0 },
		],
	},
	L: {
		id: 'L',
		label: 'L',
		size: 5,
		colorIndex: 2,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 2, col: 0 },
			{ row: 3, col: 0 },
			{ row: 3, col: 1 },
		],
	},
	N: {
		id: 'N',
		label: 'N',
		size: 5,
		colorIndex: 3,
		baseCells: [
			{ row: 0, col: 1 },
			{ row: 1, col: 1 },
			{ row: 2, col: 0 },
			{ row: 2, col: 1 },
			{ row: 3, col: 0 },
		],
	},
	P: {
		id: 'P',
		label: 'P',
		size: 5,
		colorIndex: 4,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 0, col: 1 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
			{ row: 2, col: 0 },
		],
	},
	T: {
		id: 'T',
		label: 'T',
		size: 5,
		colorIndex: 5,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 0, col: 1 },
			{ row: 0, col: 2 },
			{ row: 1, col: 1 },
			{ row: 2, col: 1 },
		],
	},
	U: {
		id: 'U',
		label: 'U',
		size: 5,
		colorIndex: 6,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 0, col: 2 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
			{ row: 1, col: 2 },
		],
	},
	V: {
		id: 'V',
		label: 'V',
		size: 5,
		colorIndex: 7,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 2, col: 0 },
			{ row: 2, col: 1 },
			{ row: 2, col: 2 },
		],
	},
	W: {
		id: 'W',
		label: 'W',
		size: 5,
		colorIndex: 8,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
			{ row: 2, col: 1 },
			{ row: 2, col: 2 },
		],
	},
	X: {
		id: 'X',
		label: 'X',
		size: 5,
		colorIndex: 9,
		baseCells: [
			{ row: 0, col: 1 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
			{ row: 1, col: 2 },
			{ row: 2, col: 1 },
		],
	},
	Y: {
		id: 'Y',
		label: 'Y',
		size: 5,
		colorIndex: 10,
		baseCells: [
			{ row: 0, col: 1 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
			{ row: 2, col: 1 },
			{ row: 3, col: 1 },
		],
	},
	Z: {
		id: 'Z',
		label: 'Z',
		size: 5,
		colorIndex: 11,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 0, col: 1 },
			{ row: 1, col: 1 },
			{ row: 2, col: 1 },
			{ row: 2, col: 2 },
		],
	},
	I4: {
		id: 'I4',
		label: 'I4',
		size: 4,
		colorIndex: 1,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 2, col: 0 },
			{ row: 3, col: 0 },
		],
	},
	O4: {
		id: 'O4',
		label: 'O4',
		size: 4,
		colorIndex: 2,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 0, col: 1 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
		],
	},
	T4: {
		id: 'T4',
		label: 'T4',
		size: 4,
		colorIndex: 5,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 0, col: 1 },
			{ row: 0, col: 2 },
			{ row: 1, col: 1 },
		],
	},
	L4: {
		id: 'L4',
		label: 'L4',
		size: 4,
		colorIndex: 6,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 2, col: 0 },
			{ row: 2, col: 1 },
		],
	},
	Z4: {
		id: 'Z4',
		label: 'Z4',
		size: 4,
		colorIndex: 11,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 0, col: 1 },
			{ row: 1, col: 1 },
			{ row: 1, col: 2 },
		],
	},
	I3: {
		id: 'I3',
		label: 'I3',
		size: 3,
		colorIndex: 3,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 2, col: 0 },
		],
	},
	V3: {
		id: 'V3',
		label: 'V3',
		size: 3,
		colorIndex: 7,
		baseCells: [
			{ row: 0, col: 0 },
			{ row: 1, col: 0 },
			{ row: 1, col: 1 },
		],
	},
};

export function getPieceDefinition(pieceId: PieceId): PolyominoDefinition {
	return POLYOMINO_DEFINITIONS[pieceId];
}

export function normalizeCells(cells: ReadonlyArray<Coordinate>): ReadonlyArray<Coordinate> {
	if (cells.length === 0) {
		return [];
	}
	let minRow = Number.POSITIVE_INFINITY;
	let minCol = Number.POSITIVE_INFINITY;
	for (const cell of cells) {
		if (cell.row < minRow) {
			minRow = cell.row;
		}
		if (cell.col < minCol) {
			minCol = cell.col;
		}
	}
	const shifted = cells.map((cell) => ({
		row: cell.row - minRow,
		col: cell.col - minCol,
	}));
	shifted.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col));
	return shifted;
}

export function serializeShapeKey(cells: ReadonlyArray<Coordinate>): string {
	return cells.map((c) => `${c.row}:${c.col}`).join('|');
}

function selectCentroidCell(cells: ReadonlyArray<Coordinate>): Coordinate {
	if (cells.length === 0) {
		return { row: 0, col: 0 };
	}
	let sumRow = 0;
	let sumCol = 0;
	for (const c of cells) {
		sumRow += c.row;
		sumCol += c.col;
	}
	const avgRow = sumRow / cells.length;
	const avgCol = sumCol / cells.length;

	let bestCell = cells[0] ?? { row: 0, col: 0 };
	let bestDist = Number.POSITIVE_INFINITY;
	for (const c of cells) {
		const dist = (c.row - avgRow) ** 2 + (c.col - avgCol) ** 2;
		if (dist < bestDist) {
			bestDist = dist;
			bestCell = c;
		}
	}
	return bestCell;
}

export function getTransformedShape(pieceId: PieceId, rotation: Rotation = 0, flipped = false): TransformedShape {
	const def = POLYOMINO_DEFINITIONS[pieceId];
	const transformed = def.baseCells.map((cell) => {
		const colAfterFlip = flipped ? -cell.col : cell.col;
		const rowAfterFlip = cell.row;
		switch (rotation) {
			case 0:
				return { row: rowAfterFlip, col: colAfterFlip };
			case 90:
				return { row: colAfterFlip, col: -rowAfterFlip };
			case 180:
				return { row: -rowAfterFlip, col: -colAfterFlip };
			case 270:
				return { row: -colAfterFlip, col: rowAfterFlip };
		}
	});

	const normalized = normalizeCells(transformed);
	let maxRow = 0;
	let maxCol = 0;
	for (const cell of normalized) {
		if (cell.row > maxRow) {
			maxRow = cell.row;
		}
		if (cell.col > maxCol) {
			maxCol = cell.col;
		}
	}

	return {
		rotation,
		flipped,
		cells: normalized,
		width: maxCol + 1,
		height: maxRow + 1,
		labelCell: selectCentroidCell(normalized),
		key: serializeShapeKey(normalized),
	};
}

const UNIQUE_ORIENTATIONS_CACHE = new Map<PieceId, ReadonlyArray<TransformedShape>>();

export function getUniqueOrientations(pieceId: PieceId): ReadonlyArray<TransformedShape> {
	const cached = UNIQUE_ORIENTATIONS_CACHE.get(pieceId);
	if (cached) {
		return cached;
	}

	const seen = new Set<string>();
	const orientations: TransformedShape[] = [];
	const rotations: ReadonlyArray<Rotation> = [0, 90, 180, 270];
	const flips: ReadonlyArray<boolean> = [false, true];

	for (const flipped of flips) {
		for (const rotation of rotations) {
			const shape = getTransformedShape(pieceId, rotation, flipped);
			if (!seen.has(shape.key)) {
				seen.add(shape.key);
				orientations.push(shape);
			}
		}
	}

	UNIQUE_ORIENTATIONS_CACHE.set(pieceId, orientations);
	return orientations;
}

export function getPlacementCells(placement: Placement): ReadonlyArray<Coordinate> {
	const shape = getTransformedShape(placement.pieceId, placement.rotation, placement.flipped);
	return shape.cells.map((cell) => ({
		row: placement.anchor.row + cell.row,
		col: placement.anchor.col + cell.col,
	}));
}

export function getPlacementLabelCell(placement: Placement): Coordinate {
	const shape = getTransformedShape(placement.pieceId, placement.rotation, placement.flipped);
	return {
		row: placement.anchor.row + shape.labelCell.row,
		col: placement.anchor.col + shape.labelCell.col,
	};
}

export function rotateClockwise(rotation: Rotation): Rotation {
	switch (rotation) {
		case 0:
			return 90;
		case 90:
			return 180;
		case 180:
			return 270;
		case 270:
			return 0;
	}
}

export function rotateCounterClockwise(rotation: Rotation): Rotation {
	switch (rotation) {
		case 0:
			return 270;
		case 90:
			return 0;
		case 180:
			return 90;
		case 270:
			return 180;
	}
}
