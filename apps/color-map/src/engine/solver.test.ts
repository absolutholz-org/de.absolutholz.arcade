import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildAdjacencyGraph, generateRegionGrid } from './adjacency.ts';
import { createPrng } from './prng.ts';
import { countSolutions, solveFourColoring } from './solver.ts';
import type { ColorIndex } from './types.ts';

describe('4-coloring solver & solution counter', () => {
	it('finds a conflict-free 4-coloring for a K4 clique', () => {
		const k4 = [
			[1, 2, 3],
			[0, 2, 3],
			[0, 1, 3],
			[0, 1, 2],
		];
		const coloring = solveFourColoring(k4, createPrng(7));
		assert.ok(coloring !== null);
		assert.equal(new Set(coloring).size, 4);
	});

	it('returns null for a non-4-colorable K5 graph', () => {
		const k5 = [
			[1, 2, 3, 4],
			[0, 2, 3, 4],
			[0, 1, 3, 4],
			[0, 1, 2, 4],
			[0, 1, 2, 3],
		];
		const coloring = solveFourColoring(k5);
		assert.equal(coloring, null);
	});

	it('correctly counts unique vs multiple completions and stops early at limit', () => {
		const k4 = [
			[1, 2, 3],
			[0, 2, 3],
			[0, 1, 3],
			[0, 1, 2],
		];

		// 3 of 4 fixed => unique solution (1)
		const uniqueCheck = countSolutions(k4, [0, 1, 2, null], 2);
		assert.equal(uniqueCheck.count, 1);
		assert.equal(uniqueCheck.aborted, false);

		// 2 of 4 fixed => 2 valid completions
		const multiCheck = countSolutions(k4, [0, 1, null, null], 2);
		assert.equal(multiCheck.count, 2);

		// Conflicting givens => 0 solutions
		const invalidCheck = countSolutions(k4, [0, 0, null, null], 2);
		assert.equal(invalidCheck.count, 0);
	});

	it('solves large planar region graphs (50 regions on 32x32) with zero conflicts', () => {
		const rng = createPrng(999);
		const grid = generateRegionGrid(32, 48, 9, rng);
		const adj = buildAdjacencyGraph(grid, 48);
		const coloring = solveFourColoring(adj, rng);

		assert.ok(coloring !== null);
		assert.equal(coloring.length, 48);

		for (let r = 0; r < adj.length; r += 1) {
			const c: ColorIndex = coloring[r];
			assert.ok(c >= 0 && c <= 3);
			for (const nb of adj[r]) {
				assert.notEqual(coloring[nb], c, `Adjacent regions ${r} and ${nb} share color ${c}`);
			}
		}
	});
});
