/** Orthogonal (up, down, left, right) neighbor offsets as `[rowOffset, colOffset]`. */
export const ORTHOGONAL_OFFSETS: readonly (readonly [number, number])[] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

/**
 * A valid layout is an N×N grid using exactly the region ids `0..N-1`, where every region is non-empty and
 * orthogonally contiguous.
 */
export function isValidRegionLayout(regions: number[][], size: number): boolean {
	if (regions.length !== size || regions.some((row) => row.length !== size)) {
		return false;
	}

	const firstCellByRegion = new Map<number, [number, number]>();
	const cellCountByRegion = new Map<number, number>();
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			const regionId = regions[row][col];
			if (!Number.isInteger(regionId) || regionId < 0 || regionId >= size) {
				return false;
			}
			if (!firstCellByRegion.has(regionId)) {
				firstCellByRegion.set(regionId, [row, col]);
			}
			cellCountByRegion.set(regionId, (cellCountByRegion.get(regionId) ?? 0) + 1);
		}
	}

	if (firstCellByRegion.size !== size) {
		return false;
	}

	for (const [regionId, [startRow, startCol]] of firstCellByRegion) {
		if (countConnectedCells(regions, size, regionId, startRow, startCol) !== cellCountByRegion.get(regionId)) {
			return false;
		}
	}
	return true;
}

function countConnectedCells(
	regions: number[][],
	size: number,
	regionId: number,
	startRow: number,
	startCol: number,
): number {
	const visited = new Set<number>([startRow * size + startCol]);
	const pending: [number, number][] = [[startRow, startCol]];

	for (let next = pending.pop(); next; next = pending.pop()) {
		const [row, col] = next;
		for (const [rowOffset, colOffset] of ORTHOGONAL_OFFSETS) {
			const neighborRow = row + rowOffset;
			const neighborCol = col + colOffset;
			const key = neighborRow * size + neighborCol;
			const isInside = neighborRow >= 0 && neighborRow < size && neighborCol >= 0 && neighborCol < size;
			if (isInside && !visited.has(key) && regions[neighborRow][neighborCol] === regionId) {
				visited.add(key);
				pending.push([neighborRow, neighborCol]);
			}
		}
	}
	return visited.size;
}
