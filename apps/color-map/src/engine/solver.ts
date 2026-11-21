import type { SeededRng } from './prng.ts';
import type { ColorIndex } from './types.ts';

const ALL_MASK = 0b1111;

function popcount4(mask: number): number {
	let count = 0;
	if (mask & 1) count += 1;
	if (mask & 2) count += 1;
	if (mask & 4) count += 1;
	if (mask & 8) count += 1;
	return count;
}

function lowestColorBit(mask: number): ColorIndex {
	if (mask & 1) return 0;
	if (mask & 2) return 1;
	if (mask & 4) return 2;
	return 3;
}

/**
 * Finds a valid 4-coloring for a region adjacency graph using backtracking search
 * with Minimum Remaining Values (MRV), Degree heuristic, and bitmask forward checking.
 */
export function solveFourColoring(
	adjacency: readonly (readonly number[])[],
	rng?: SeededRng,
	initialColors?: readonly (ColorIndex | null)[],
): ColorIndex[] | null {
	const n = adjacency.length;
	const colors = new Int8Array(n).fill(-1);
	const allowed = new Uint8Array(n).fill(ALL_MASK);

	// Apply any pre-filled colors
	if (initialColors) {
		for (let r = 0; r < n; r += 1) {
			const c = initialColors[r];
			if (c !== null && c !== undefined) {
				const bit = 1 << c;
				if ((allowed[r] & bit) === 0) return null;
				colors[r] = c;
				allowed[r] = bit;
				for (const nb of adjacency[r]) {
					if (colors[nb] === c) return null;
					allowed[nb] &= ~bit;
					if (allowed[nb] === 0) return null;
				}
			}
		}
	}

	let remaining = 0;
	for (let r = 0; r < n; r += 1) {
		if (colors[r] === -1) remaining += 1;
	}

	// Precompute per-region color trial order for balanced color distribution when rng is provided
	const colorOrders: ColorIndex[][] = Array.from({ length: n }, () => {
		const order: ColorIndex[] = [0, 1, 2, 3];
		return rng ? rng.shuffle(order) : order;
	});

	let nodes = 0;
	const maxNodes = 100000;

	const backtrack = (uncoloredLeft: number): boolean => {
		if (uncoloredLeft === 0) return true;
		nodes += 1;
		if (nodes > maxNodes) return false;

		// Select uncolored region with MRV, breaking ties by highest uncolored degree
		let bestRegion = -1;
		let bestChoices = 5;
		let bestDegree = -1;

		for (let r = 0; r < n; r += 1) {
			if (colors[r] !== -1) continue;
			const mask = allowed[r];
			const choices = popcount4(mask);
			if (choices === 0) return false;

			if (choices < bestChoices) {
				bestChoices = choices;
				bestRegion = r;
				let deg = 0;
				for (const nb of adjacency[r]) {
					if (colors[nb] === -1) deg += 1;
				}
				bestDegree = deg;
				if (choices === 1) break;
			} else if (choices === bestChoices) {
				let deg = 0;
				for (const nb of adjacency[r]) {
					if (colors[nb] === -1) deg += 1;
				}
				if (deg > bestDegree) {
					bestDegree = deg;
					bestRegion = r;
				}
			}
		}

		if (bestRegion === -1) return false;

		const mask = allowed[bestRegion];
		const order = colorOrders[bestRegion];
		const neighbors = adjacency[bestRegion];

		for (let i = 0; i < 4; i += 1) {
			const c = order[i];
			const bit = 1 << c;
			if ((mask & bit) === 0) continue;

			colors[bestRegion] = c;
			const changedNeighbors: number[] = [];
			let deadEnd = false;

			for (let j = 0; j < neighbors.length; j += 1) {
				const nb = neighbors[j];
				if (colors[nb] === -1 && (allowed[nb] & bit) !== 0) {
					allowed[nb] &= ~bit;
					changedNeighbors.push(nb);
					if (allowed[nb] === 0) {
						deadEnd = true;
						break;
					}
				}
			}

			if (!deadEnd && backtrack(uncoloredLeft - 1)) {
				return true;
			}

			// Restore forward-checked neighbor domains
			for (let j = 0; j < changedNeighbors.length; j += 1) {
				allowed[changedNeighbors[j]] |= bit;
			}
			colors[bestRegion] = -1;
		}

		return false;
	};

	if (!backtrack(remaining)) {
		return null;
	}

	return Array.from(colors, (c) => c as ColorIndex);
}

export interface CountSolutionsResult {
	readonly count: number;
	readonly aborted: boolean;
}

/**
 * Counts valid 4-coloring completions of `givens` up to `limit` (default 2),
 * stopping early as soon as `count >= limit`.
 * Uses naked-single unit propagation + MRV + degree heuristic for sub-millisecond performance.
 */
export function countSolutions(
	adjacency: readonly (readonly number[])[],
	givens: readonly (ColorIndex | null)[],
	limit = 2,
	maxNodes = 25000,
): CountSolutionsResult {
	const n = adjacency.length;
	const colors = new Int8Array(n).fill(-1);
	const allowed = new Uint8Array(n).fill(ALL_MASK);

	for (let r = 0; r < n; r += 1) {
		const g = givens[r];
		if (g !== null) {
			const bit = 1 << g;
			if ((allowed[r] & bit) === 0) {
				return { count: 0, aborted: false };
			}
			colors[r] = g;
			allowed[r] = bit;
			for (const nb of adjacency[r]) {
				if (colors[nb] === g) {
					return { count: 0, aborted: false };
				}
				allowed[nb] &= ~bit;
				if (allowed[nb] === 0) {
					return { count: 0, aborted: false };
				}
			}
		}
	}

	let uncolored = 0;
	for (let r = 0; r < n; r += 1) {
		if (colors[r] === -1) uncolored += 1;
	}

	let found = 0;
	let nodes = 0;
	let aborted = false;

	const search = (uncoloredLeft: number): void => {
		if (found >= limit || aborted) return;
		if (uncoloredLeft === 0) {
			found += 1;
			return;
		}

		nodes += 1;
		if (nodes > maxNodes) {
			aborted = true;
			return;
		}

		// Unit propagation (naked singles) with trail for O(1) rollback
		const assignedTrail: number[] = [];
		const maskTrailRegion: number[] = [];
		const maskTrailBit: number[] = [];
		let remaining = uncoloredLeft;
		let contradiction = false;

		let progressed = true;
		while (progressed && !contradiction && remaining > 0) {
			progressed = false;
			for (let r = 0; r < n; r += 1) {
				if (colors[r] !== -1) continue;
				const mask = allowed[r];
				if (mask === 0) {
					contradiction = true;
					break;
				}
				// Power of two check => exactly 1 allowed color
				if ((mask & (mask - 1)) === 0) {
					const c = lowestColorBit(mask);
					colors[r] = c;
					assignedTrail.push(r);
					remaining -= 1;
					progressed = true;

					const neighbors = adjacency[r];
					for (let j = 0; j < neighbors.length; j += 1) {
						const nb = neighbors[j];
						if (colors[nb] === -1 && (allowed[nb] & mask) !== 0) {
							allowed[nb] &= ~mask;
							maskTrailRegion.push(nb);
							maskTrailBit.push(mask);
							if (allowed[nb] === 0) {
								contradiction = true;
								break;
							}
						}
					}
					if (contradiction) break;
				}
			}
		}

		if (!contradiction) {
			if (remaining === 0) {
				found += 1;
			} else {
				// Pick MRV + highest uncolored degree variable
				let bestRegion = -1;
				let bestChoices = 5;
				let bestDegree = -1;

				for (let r = 0; r < n; r += 1) {
					if (colors[r] !== -1) continue;
					const choices = popcount4(allowed[r]);
					if (choices < bestChoices) {
						bestChoices = choices;
						bestRegion = r;
						let deg = 0;
						for (const nb of adjacency[r]) {
							if (colors[nb] === -1) deg += 1;
						}
						bestDegree = deg;
					} else if (choices === bestChoices) {
						let deg = 0;
						for (const nb of adjacency[r]) {
							if (colors[nb] === -1) deg += 1;
						}
						if (deg > bestDegree) {
							bestDegree = deg;
							bestRegion = r;
						}
					}
				}

				if (bestRegion !== -1) {
					const mask = allowed[bestRegion];
					const neighbors = adjacency[bestRegion];

					for (let c = 0; c < 4; c += 1) {
						const bit = 1 << c;
						if ((mask & bit) === 0) continue;

						colors[bestRegion] = c;
						const branchChanged: number[] = [];
						let deadEnd = false;

						for (let j = 0; j < neighbors.length; j += 1) {
							const nb = neighbors[j];
							if (colors[nb] === -1 && (allowed[nb] & bit) !== 0) {
								allowed[nb] &= ~bit;
								branchChanged.push(nb);
								if (allowed[nb] === 0) {
									deadEnd = true;
									break;
								}
							}
						}

						if (!deadEnd) {
							search(remaining - 1);
						}

						for (let j = 0; j < branchChanged.length; j += 1) {
							allowed[branchChanged[j]] |= bit;
						}
						colors[bestRegion] = -1;

						if (found >= limit || aborted) break;
					}
				}
			}
		}

		// Undo unit propagation trail
		for (let i = maskTrailRegion.length - 1; i >= 0; i -= 1) {
			allowed[maskTrailRegion[i]] |= maskTrailBit[i];
		}
		for (let i = assignedTrail.length - 1; i >= 0; i -= 1) {
			colors[assignedTrail[i]] = -1;
		}
	};

	search(uncolored);
	return { count: found, aborted };
}
