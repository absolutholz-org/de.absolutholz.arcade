import type { QueenPlacement } from './types.ts';

const MAX_SUPPORTED_SIZE = 30;

/**
 * Constraint-satisfaction search with forward checking and the minimum-remaining-values heuristic.
 *
 * "Exactly one queen" must hold for every row, column and region, so at each node we compute the candidate
 * cells still available, fail immediately if any unplaced row, unused column or unused region has none left,
 * and branch on the constraint with the fewest candidates. Each placement removes its column, its region
 * and its king-adjacent neighbors from play. The search stops as soon as `limit` solutions are found, which
 * keeps uniqueness checks (`limit = 2`) fast.
 *
 * Imports use explicit `.ts` extensions so the engine can run under Node's native type stripping (CLI generator).
 */
function searchSolutions(
	regions: number[][],
	size: number,
	limit: number,
	onSolution: (queenColumns: readonly number[]) => void,
): number {
	if (!hasValidGridShape(regions, size)) {
		return 0;
	}

	const allColumnsMask = (1 << size) - 1;
	const regionCells: [number, number][][] = Array.from({ length: size }, () => []);
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			regionCells[regions[row][col]].push([row, col]);
		}
	}

	const queenColumns = new Array<number>(size).fill(-1);
	let found = 0;

	/** `touchedColumns[row]`: columns in that row blocked because a placed queen in an adjacent row touches them. */
	function search(placedCount: number, usedColumns: number, usedRegions: number, touchedColumns: number[]): void {
		if (placedCount === size) {
			found++;
			onSolution(queenColumns);
			return;
		}

		const candidatesByRow = new Array<number>(size).fill(0);
		const candidateCountByColumn = new Array<number>(size).fill(0);
		const candidateCountByRegion = new Array<number>(size).fill(0);
		let fewestCandidates = Number.POSITIVE_INFINITY;
		let branchKind: 'row' | 'column' | 'region' = 'row';
		let branchIndex = 0;

		for (let row = 0; row < size; row++) {
			if (queenColumns[row] !== -1) {
				continue;
			}
			let candidates = 0;
			let candidateCount = 0;
			for (let col = 0; col < size; col++) {
				const columnBit = 1 << col;
				if (
					usedColumns & columnBit ||
					touchedColumns[row] & columnBit ||
					usedRegions & (1 << regions[row][col])
				) {
					continue;
				}
				candidates |= columnBit;
				candidateCount++;
				candidateCountByColumn[col]++;
				candidateCountByRegion[regions[row][col]]++;
			}
			if (candidateCount === 0) {
				return;
			}
			candidatesByRow[row] = candidates;
			if (candidateCount < fewestCandidates) {
				fewestCandidates = candidateCount;
				branchKind = 'row';
				branchIndex = row;
			}
		}

		for (let index = 0; index < size; index++) {
			if (!(usedColumns & (1 << index))) {
				if (candidateCountByColumn[index] === 0) {
					return;
				}
				if (candidateCountByColumn[index] < fewestCandidates) {
					fewestCandidates = candidateCountByColumn[index];
					branchKind = 'column';
					branchIndex = index;
				}
			}
			if (!(usedRegions & (1 << index))) {
				if (candidateCountByRegion[index] === 0) {
					return;
				}
				if (candidateCountByRegion[index] < fewestCandidates) {
					fewestCandidates = candidateCountByRegion[index];
					branchKind = 'region';
					branchIndex = index;
				}
			}
		}

		function tryQueen(row: number, col: number): void {
			const touchedBits = (0b111 << col) >> 1; // columns col-1..col+1 (bit -1 shifts out)
			const nextTouched = touchedColumns.slice();
			if (row > 0) {
				nextTouched[row - 1] |= touchedBits & allColumnsMask;
			}
			if (row < size - 1) {
				nextTouched[row + 1] |= touchedBits & allColumnsMask;
			}
			queenColumns[row] = col;
			search(placedCount + 1, usedColumns | (1 << col), usedRegions | (1 << regions[row][col]), nextTouched);
			queenColumns[row] = -1;
		}

		if (branchKind === 'row') {
			for (let col = 0; col < size && found < limit; col++) {
				if (candidatesByRow[branchIndex] & (1 << col)) {
					tryQueen(branchIndex, col);
				}
			}
		} else if (branchKind === 'column') {
			for (let row = 0; row < size && found < limit; row++) {
				if (candidatesByRow[row] & (1 << branchIndex)) {
					tryQueen(row, branchIndex);
				}
			}
		} else {
			for (const [row, col] of regionCells[branchIndex]) {
				if (found >= limit) {
					break;
				}
				if (queenColumns[row] === -1 && candidatesByRow[row] & (1 << col)) {
					tryQueen(row, col);
				}
			}
		}
	}

	search(0, 0, 0, new Array<number>(size).fill(0));
	return found;
}

function hasValidGridShape(regions: number[][], size: number): boolean {
	if (!Number.isInteger(size) || size < 1 || size > MAX_SUPPORTED_SIZE || regions.length !== size) {
		return false;
	}
	return regions.every(
		(row) => row.length === size && row.every((id) => Number.isInteger(id) && id >= 0 && id < size),
	);
}

/**
 * Counts valid solutions of a region layout, stopping early once `limit` solutions have been found.
 * Malformed layouts (wrong shape or region ids outside `0..size-1`) have zero solutions.
 */
export function countSolutions(regions: number[][], size: number, limit = 2): number {
	return searchSolutions(regions, size, limit, () => {});
}

/**
 * Returns up to `limit` valid solutions as `[row, col]` placements ordered by row.
 */
export function findSolutions(regions: number[][], size: number, limit = 2): QueenPlacement[][] {
	const solutions: QueenPlacement[][] = [];
	searchSolutions(regions, size, limit, (queenColumns) => {
		solutions.push(queenColumns.map((col, row): QueenPlacement => [row, col]));
	});
	return solutions;
}
