import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	buildAdjacencyGraph,
	buildRegionBorders,
	buildRegionFillPaths,
	buildRegionMetadata,
	generateRegionGrid,
} from './adjacency.ts';
import { createPrng } from './prng.ts';

describe('adjacency & region generation', () => {
	it('ignores diagonal-only corners and detects orthogonal shared edges', () => {
		// 2x2 checkerboard: regions 0 and 3 touch only diagonally; 1 and 2 touch only diagonally
		const checkerboard = [
			[0, 1],
			[2, 3],
		];
		const adj = buildAdjacencyGraph(checkerboard, 4);

		assert.deepEqual(adj[0], [1, 2]);
		assert.deepEqual(adj[1], [0, 3]);
		assert.deepEqual(adj[2], [0, 3]);
		assert.deepEqual(adj[3], [1, 2]);
		assert.equal(adj[0].includes(3), false);
		assert.equal(adj[1].includes(2), false);
	});

	it('generates contiguous regions covering every cell of the grid', () => {
		const rng = createPrng(42);
		const gridSize = 12;
		const regionCount = 11;
		const grid = generateRegionGrid(gridSize, regionCount, 5, rng);

		assert.equal(grid.length, gridSize);
		const cellsByRegion = new Map<number, [number, number][]>();

		for (let r = 0; r < gridSize; r += 1) {
			assert.equal(grid[r].length, gridSize);
			for (let c = 0; c < gridSize; c += 1) {
				const id = grid[r][c];
				assert.ok(id >= 0 && id < regionCount, `Invalid region ID ${id}`);
				const list = cellsByRegion.get(id) ?? [];
				list.push([r, c]);
				cellsByRegion.set(id, list);
			}
		}

		assert.equal(cellsByRegion.size, regionCount);

		// Verify each region is orthogonally contiguous via BFS
		for (const [id, cells] of cellsByRegion.entries()) {
			const visited = new Set<string>();
			const queue: [number, number][] = [cells[0]];
			visited.add(`${cells[0][0]},${cells[0][1]}`);

			while (queue.length > 0) {
				const [cr, cc] = queue.shift() as [number, number];
				for (const [dr, dc] of [
					[-1, 0],
					[1, 0],
					[0, -1],
					[0, 1],
				]) {
					const nr = cr + dr;
					const nc = cc + dc;
					const key = `${nr},${nc}`;
					if (
						nr >= 0 &&
						nr < gridSize &&
						nc >= 0 &&
						nc < gridSize &&
						grid[nr][nc] === id &&
						!visited.has(key)
					) {
						visited.add(key);
						queue.push([nr, nc]);
					}
				}
			}

			assert.equal(visited.size, cells.length, `Region ${id} is not orthogonally contiguous`);
		}
	});

	it('computes valid label anchors inside each region and non-empty SVG paths', () => {
		const rng = createPrng(123);
		const grid = generateRegionGrid(12, 10, 5, rng);
		const adj = buildAdjacencyGraph(grid, 10);
		const meta = buildRegionMetadata(grid, adj);
		const fillPaths = buildRegionFillPaths(grid, 10);
		const borders = buildRegionBorders(grid);

		assert.equal(meta.length, 10);
		assert.equal(fillPaths.length, 10);
		assert.ok(borders.internalBorderPath.length > 0);

		for (const region of meta) {
			assert.equal(
				grid[region.labelAnchor.row][region.labelAnchor.col],
				region.id,
				`Label anchor for region ${region.id} must lie inside the region`,
			);
			assert.ok(fillPaths[region.id].length > 0);
		}
	});
});
