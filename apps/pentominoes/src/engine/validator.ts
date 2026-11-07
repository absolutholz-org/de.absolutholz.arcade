import { getPlacementCells } from './pieces.ts';
import type { Coordinate, PieceId, Placement, PlacementValidationResult } from './types.ts';

export function buildOccupancyGrid(
	mask: ReadonlyArray<ReadonlyArray<number>>,
	placements: ReadonlyArray<Placement>,
): ReadonlyArray<ReadonlyArray<PieceId | null>> {
	const rows = mask.length;
	const cols = mask[0]?.length ?? 0;
	const grid: Array<Array<PieceId | null>> = Array.from({ length: rows }, () =>
		Array.from({ length: cols }, () => null),
	);

	for (const placement of placements) {
		const cells = getPlacementCells(placement);
		for (const cell of cells) {
			if (cell.row >= 0 && cell.row < rows && cell.col >= 0 && cell.col < cols) {
				const rowArr = grid[cell.row];
				if (rowArr) {
					rowArr[cell.col] = placement.pieceId;
				}
			}
		}
	}

	return grid;
}

export function validatePlacement(
	mask: ReadonlyArray<ReadonlyArray<number>>,
	existingPlacements: ReadonlyArray<Placement>,
	candidate: Placement,
): PlacementValidationResult {
	const rows = mask.length;
	const cols = mask[0]?.length ?? 0;
	const filteredPlacements = existingPlacements.filter((p) => p.pieceId !== candidate.pieceId);
	const occupancy = buildOccupancyGrid(mask, filteredPlacements);
	const occupiedCells = getPlacementCells(candidate);

	for (const cell of occupiedCells) {
		if (cell.row < 0 || cell.row >= rows || cell.col < 0 || cell.col >= cols) {
			return {
				valid: false,
				reason: 'out-of-bounds',
				occupiedCells,
			};
		}
		if (mask[cell.row]?.[cell.col] !== 1) {
			return {
				valid: false,
				reason: 'void-cell',
				occupiedCells,
			};
		}
	}

	for (const cell of occupiedCells) {
		if (occupancy[cell.row]?.[cell.col] !== null) {
			return {
				valid: false,
				reason: 'overlap',
				occupiedCells,
			};
		}
	}

	return {
		valid: true,
		occupiedCells,
	};
}

export function placePiece(
	mask: ReadonlyArray<ReadonlyArray<number>>,
	existingPlacements: ReadonlyArray<Placement>,
	candidate: Placement,
): {
	readonly placements: ReadonlyArray<Placement>;
	readonly validation: PlacementValidationResult;
} {
	const validation = validatePlacement(mask, existingPlacements, candidate);
	if (!validation.valid) {
		return {
			placements: existingPlacements,
			validation,
		};
	}

	const withoutCurrent = existingPlacements.filter((p) => p.pieceId !== candidate.pieceId);
	return {
		placements: [...withoutCurrent, candidate],
		validation,
	};
}

export function removePiece(existingPlacements: ReadonlyArray<Placement>, pieceId: PieceId): ReadonlyArray<Placement> {
	return existingPlacements.filter((p) => p.pieceId !== pieceId);
}

export function findPlacementAtCell(existingPlacements: ReadonlyArray<Placement>, coord: Coordinate): Placement | null {
	for (const placement of existingPlacements) {
		const cells = getPlacementCells(placement);
		if (cells.some((c) => c.row === coord.row && c.col === coord.col)) {
			return placement;
		}
	}
	return null;
}

export function countPlayableCells(mask: ReadonlyArray<ReadonlyArray<number>>): number {
	let count = 0;
	for (const row of mask) {
		for (const val of row) {
			if (val === 1) {
				count += 1;
			}
		}
	}
	return count;
}

export function isPuzzleComplete(
	mask: ReadonlyArray<ReadonlyArray<number>>,
	requiredPieces: ReadonlyArray<PieceId>,
	placements: ReadonlyArray<Placement>,
): boolean {
	if (placements.length !== requiredPieces.length) {
		return false;
	}

	const requiredSet = new Set(requiredPieces);
	const placedSet = new Set<PieceId>();

	for (const p of placements) {
		if (!requiredSet.has(p.pieceId) || placedSet.has(p.pieceId)) {
			return false;
		}
		placedSet.add(p.pieceId);
	}

	const occupancy = buildOccupancyGrid(mask, placements);
	for (let r = 0; r < mask.length; r += 1) {
		const maskRow = mask[r];
		const occRow = occupancy[r];
		if (!maskRow || !occRow) {
			continue;
		}
		for (let c = 0; c < maskRow.length; c += 1) {
			if (maskRow[c] === 1 && occRow[c] === null) {
				return false;
			}
			if (maskRow[c] === 0 && occRow[c] !== null) {
				return false;
			}
		}
	}

	return true;
}
