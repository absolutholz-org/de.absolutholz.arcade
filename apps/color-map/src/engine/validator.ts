import type { ColorIndex, ConflictSummary, RegionInfo } from './types.ts';

/**
 * Validates the current region color assignments and identifies any orthogonally
 * adjacent region pairs that share the same color.
 */
export function validateBoard(regions: readonly RegionInfo[], colors: readonly (ColorIndex | null)[]): ConflictSummary {
	const conflictingRegions = new Set<number>();
	const conflictingPairs = new Set<string>();

	for (let r = 0; r < regions.length; r += 1) {
		const color = colors[r];
		if (color === null || color === undefined) continue;

		for (const neighborId of regions[r].neighbors) {
			if (neighborId <= r) continue;
			if (colors[neighborId] === color) {
				conflictingRegions.add(r);
				conflictingRegions.add(neighborId);
				conflictingPairs.add(`${r}-${neighborId}`);
			}
		}
	}

	return {
		conflictingRegions,
		conflictingPairs,
		hasConflicts: conflictingPairs.size > 0,
	};
}

/**
 * Returns the number of regions that do not yet have a color assigned.
 */
export function countUncoloredRegions(colors: readonly (ColorIndex | null)[]): number {
	let count = 0;
	for (let i = 0; i < colors.length; i += 1) {
		if (colors[i] === null) count += 1;
	}
	return count;
}

/**
 * Returns true when every region is colored and there are zero adjacent color conflicts.
 */
export function isBoardComplete(regions: readonly RegionInfo[], colors: readonly (ColorIndex | null)[]): boolean {
	if (regions.length === 0 || colors.length !== regions.length) return false;
	if (countUncoloredRegions(colors) > 0) return false;
	return !validateBoard(regions, colors).hasConflicts;
}
