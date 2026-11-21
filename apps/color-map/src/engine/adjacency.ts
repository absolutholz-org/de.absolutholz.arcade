import type { SeededRng } from './prng.ts';
import type { GridCoord, RegionInfo } from './types.ts';

const ORTHOGONAL_DIRS: readonly (readonly [number, number])[] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

/**
 * Generates an irregular contiguous partition of a gridSize × gridSize board into `regionCount` regions
 * using well-spaced randomized seeds and organic flood-fill expansion.
 */
export function generateRegionGrid(
	gridSize: number,
	regionCount: number,
	minRegionCells: number,
	rng: SeededRng,
): number[][] {
	const totalCells = gridSize * gridSize;
	const safeRegionCount = Math.max(2, Math.min(regionCount, totalCells));

	for (let attempt = 0; attempt < 24; attempt += 1) {
		const grid: number[][] = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => -1));
		const seeds: GridCoord[] = [];

		// Stratified dart-throwing for balanced seed placement
		const idealSpacing = Math.sqrt(totalCells / safeRegionCount);
		let minDist = Math.max(1.5, idealSpacing * 0.65);

		while (seeds.length < safeRegionCount) {
			let placed = false;
			for (let tries = 0; tries < 60; tries += 1) {
				const row = rng.nextInt(0, gridSize - 1);
				const col = rng.nextInt(0, gridSize - 1);
				if (grid[row][col] !== -1) continue;

				let tooClose = false;
				for (const s of seeds) {
					const dist = Math.hypot(row - s.row, col - s.col);
					if (dist < minDist) {
						tooClose = true;
						break;
					}
				}
				if (!tooClose) {
					const id = seeds.length;
					grid[row][col] = id;
					seeds.push({ row, col });
					placed = true;
					break;
				}
			}
			if (!placed) {
				minDist = Math.max(1, minDist * 0.8);
			}
		}

		// Per-region frontier queues for organic flood-fill expansion
		const frontiers: GridCoord[][] = Array.from({ length: safeRegionCount }, () => []);
		const regionSizes = new Int32Array(safeRegionCount);

		const enqueueNeighbors = (row: number, col: number, regionId: number) => {
			for (const [dr, dc] of ORTHOGONAL_DIRS) {
				const nr = row + dr;
				const nc = col + dc;
				if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[nr][nc] === -1) {
					frontiers[regionId].push({ row: nr, col: nc });
				}
			}
		};

		for (let id = 0; id < safeRegionCount; id += 1) {
			regionSizes[id] = 1;
			enqueueNeighbors(seeds[id].row, seeds[id].col, id);
		}

		let assigned = safeRegionCount;
		const activeRegions: number[] = Array.from({ length: safeRegionCount }, (_, i) => i);

		while (assigned < totalCells && activeRegions.length > 0) {
			// Bias slightly toward smaller regions to avoid tiny slivers while keeping organic irregularity
			const pickIdxA = rng.nextInt(0, activeRegions.length - 1);
			const pickIdxB = rng.nextInt(0, activeRegions.length - 1);
			const regA = activeRegions[pickIdxA];
			const regB = activeRegions[pickIdxB];
			const chosenPos = regionSizes[regA] <= regionSizes[regB] ? pickIdxA : pickIdxB;
			const regionId = activeRegions[chosenPos];
			const frontier = frontiers[regionId];

			let expanded = false;
			while (frontier.length > 0) {
				// Pick a random frontier cell (swap-remove for O(1))
				const fIdx = rng.nextInt(0, frontier.length - 1);
				const cell = frontier[fIdx];
				frontier[fIdx] = frontier[frontier.length - 1];
				frontier.pop();

				if (grid[cell.row][cell.col] !== -1) continue;

				grid[cell.row][cell.col] = regionId;
				regionSizes[regionId] += 1;
				assigned += 1;
				enqueueNeighbors(cell.row, cell.col, regionId);
				expanded = true;
				break;
			}

			if (!expanded) {
				activeRegions[chosenPos] = activeRegions[activeRegions.length - 1];
				activeRegions.pop();
			}
		}

		// Verify all cells are assigned and every region meets the minimum cell count
		if (assigned === totalCells) {
			let smallest = totalCells;
			for (let id = 0; id < safeRegionCount; id += 1) {
				if (regionSizes[id] < smallest) smallest = regionSizes[id];
			}
			if (smallest >= minRegionCells || attempt >= 16) {
				return grid;
			}
		}
	}

	// Deterministic fallback (should never be reached under normal parameters)
	const fallback: number[][] = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0));
	for (let r = 0; r < gridSize; r += 1) {
		for (let c = 0; c < gridSize; c += 1) {
			fallback[r][c] = Math.min(
				safeRegionCount - 1,
				Math.floor(((r * gridSize + c) * safeRegionCount) / totalCells),
			);
		}
	}
	return fallback;
}

/**
 * Builds the region adjacency graph from a regionGrid.
 * Two regions are adjacent if and only if they share at least one orthogonal cell edge.
 * Regions touching only at a diagonal corner are strictly NOT adjacent.
 */
export function buildAdjacencyGraph(regionGrid: readonly (readonly number[])[], regionCount: number): number[][] {
	const rows = regionGrid.length;
	const cols = rows > 0 ? regionGrid[0].length : 0;
	const neighborSets: Set<number>[] = Array.from({ length: regionCount }, () => new Set<number>());

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			const current = regionGrid[r][c];
			if (current < 0 || current >= regionCount) continue;

			// Right orthogonal neighbor
			if (c + 1 < cols) {
				const right = regionGrid[r][c + 1];
				if (right !== current && right >= 0 && right < regionCount) {
					neighborSets[current].add(right);
					neighborSets[right].add(current);
				}
			}

			// Bottom orthogonal neighbor
			if (r + 1 < rows) {
				const down = regionGrid[r + 1][c];
				if (down !== current && down >= 0 && down < regionCount) {
					neighborSets[current].add(down);
					neighborSets[down].add(current);
				}
			}
		}
	}

	return neighborSets.map((set) => Array.from(set).sort((a, b) => a - b));
}

/**
 * Computes metadata for every region, including a pole-of-inaccessibility approximation
 * (`labelAnchor` and `anchorRadius`) so symbols, locks, and candidate dots stay centered
 * inside the widest part of each irregular region.
 */
export function buildRegionMetadata(
	regionGrid: readonly (readonly number[])[],
	adjacency: readonly (readonly number[])[],
): RegionInfo[] {
	const rows = regionGrid.length;
	const cols = rows > 0 ? regionGrid[0].length : 0;
	const regionCount = adjacency.length;

	const cellsByRegion: GridCoord[][] = Array.from({ length: regionCount }, () => []);
	const minRow = new Int32Array(regionCount).fill(rows);
	const maxRow = new Int32Array(regionCount).fill(-1);
	const minCol = new Int32Array(regionCount).fill(cols);
	const maxCol = new Int32Array(regionCount).fill(-1);

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			const id = regionGrid[r][c];
			if (id < 0 || id >= regionCount) continue;
			cellsByRegion[id].push({ row: r, col: c });
			if (r < minRow[id]) minRow[id] = r;
			if (r > maxRow[id]) maxRow[id] = r;
			if (c < minCol[id]) minCol[id] = c;
			if (c > maxCol[id]) maxCol[id] = c;
		}
	}

	// Distance-to-boundary transform for every cell inside its own region
	const distGrid: number[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
	const queue: GridCoord[] = [];

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			const id = regionGrid[r][c];
			let isBoundary = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
			if (!isBoundary) {
				for (const [dr, dc] of ORTHOGONAL_DIRS) {
					if (regionGrid[r + dr][c + dc] !== id) {
						isBoundary = true;
						break;
					}
				}
			}
			if (isBoundary) {
				distGrid[r][c] = 1;
				queue.push({ row: r, col: c });
			}
		}
	}

	let head = 0;
	while (head < queue.length) {
		const { row, col } = queue[head];
		head += 1;
		const id = regionGrid[row][col];
		const nextDist = distGrid[row][col] + 1;

		for (const [dr, dc] of ORTHOGONAL_DIRS) {
			const nr = row + dr;
			const nc = col + dc;
			if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && regionGrid[nr][nc] === id && distGrid[nr][nc] === 0) {
				distGrid[nr][nc] = nextDist;
				queue.push({ row: nr, col: nc });
			}
		}
	}

	const regions: RegionInfo[] = [];

	for (let id = 0; id < regionCount; id += 1) {
		const cells = cellsByRegion[id];
		let sumRow = 0;
		let sumCol = 0;
		for (const cell of cells) {
			sumRow += cell.row;
			sumCol += cell.col;
		}
		const centroidRow = cells.length > 0 ? sumRow / cells.length : 0;
		const centroidCol = cells.length > 0 ? sumCol / cells.length : 0;

		let bestCell: GridCoord = cells[0] ?? { row: 0, col: 0 };
		let bestDist = -1;
		let bestCentroidDist = Number.POSITIVE_INFINITY;

		for (const cell of cells) {
			const d = distGrid[cell.row][cell.col];
			const cDist = Math.hypot(cell.row - centroidRow, cell.col - centroidCol);
			if (d > bestDist || (d === bestDist && cDist < bestCentroidDist)) {
				bestDist = d;
				bestCentroidDist = cDist;
				bestCell = cell;
			}
		}

		regions.push({
			id,
			cellCount: cells.length,
			neighbors: adjacency[id],
			labelAnchor: bestCell,
			anchorRadius: Math.max(1, bestDist),
			boundingBox: {
				minRow: minRow[id],
				maxRow: maxRow[id],
				minCol: minCol[id],
				maxCol: maxCol[id],
			},
		});
	}

	return regions;
}

/**
 * Builds an SVG path string (`d`) for each region by merging contiguous horizontal cell runs,
 * avoiding hairline anti-aliasing seams between cells of the same region.
 */
export function buildRegionFillPaths(regionGrid: readonly (readonly number[])[], regionCount: number): string[] {
	const rows = regionGrid.length;
	const cols = rows > 0 ? regionGrid[0].length : 0;
	const parts: string[][] = Array.from({ length: regionCount }, () => []);

	for (let r = 0; r < rows; r += 1) {
		let c = 0;
		while (c < cols) {
			const id = regionGrid[r][c];
			let end = c + 1;
			while (end < cols && regionGrid[r][end] === id) {
				end += 1;
			}
			if (id >= 0 && id < regionCount) {
				// Slight 0.02 unit overlap eliminates subpixel gaps between adjacent rows in SVG renderers
				const w = end - c;
				parts[id].push(`M${c} ${r}h${w}v1.02h${-w}z`);
			}
			c = end;
		}
	}

	return parts.map((segments) => segments.join(''));
}

export interface RegionBorders {
	/** All internal border segments separating distinct regions */
	readonly internalBorderPath: string;
	/** Map from sorted pair key `"a-b"` (a < b) to the SVG path of their shared boundary */
	readonly sharedEdgePaths: ReadonlyMap<string, string>;
}

/**
 * Computes crisp orthogonal boundary paths separating distinct regions.
 */
export function buildRegionBorders(regionGrid: readonly (readonly number[])[]): RegionBorders {
	const rows = regionGrid.length;
	const cols = rows > 0 ? regionGrid[0].length : 0;
	const allSegments: string[] = [];
	const pairSegments = new Map<string, string[]>();

	const addEdge = (a: number, b: number, segment: string) => {
		allSegments.push(segment);
		const key = a < b ? `${a}-${b}` : `${b}-${a}`;
		const list = pairSegments.get(key);
		if (list) {
			list.push(segment);
		} else {
			pairSegments.set(key, [segment]);
		}
	};

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			const cur = regionGrid[r][c];
			if (c + 1 < cols) {
				const right = regionGrid[r][c + 1];
				if (right !== cur) {
					addEdge(cur, right, `M${c + 1} ${r}v1`);
				}
			}
			if (r + 1 < rows) {
				const down = regionGrid[r + 1][c];
				if (down !== cur) {
					addEdge(cur, down, `M${c} ${r + 1}h1`);
				}
			}
		}
	}

	const sharedEdgePaths = new Map<string, string>();
	for (const [key, segs] of pairSegments.entries()) {
		sharedEdgePaths.set(key, segs.join(''));
	}

	return {
		internalBorderPath: allSegments.join(''),
		sharedEdgePaths,
	};
}
