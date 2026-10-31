import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findIntersections } from './geometry.ts';
import { generatePlanarGraph, isGraphConnected, moveVertex } from './graph-generator.ts';
import { DIFFICULTY_CONFIGS, DIFFICULTY_LEVELS } from './types.ts';

describe('generatePlanarGraph', () => {
	const seeds = [42, 1337, 20261031, 987654321];

	for (const difficulty of DIFFICULTY_LEVELS) {
		describe(`difficulty: ${difficulty}`, () => {
			const config = DIFFICULTY_CONFIGS[difficulty];

			for (const seed of seeds) {
				it(`generates valid planar puzzle with seed ${seed}`, () => {
					const board = generatePlanarGraph(difficulty, seed);

					// Vertex and edge bounds
					assert.ok(
						board.vertices.length >= config.minVertices && board.vertices.length <= config.maxVertices,
						`Expected vertex count in [${config.minVertices}, ${config.maxVertices}], got ${board.vertices.length}`,
					);
					assert.ok(
						board.edges.length >= config.minEdges && board.edges.length <= config.maxEdges,
						`Expected edge count in [${config.minEdges}, ${config.maxEdges}], got ${board.edges.length}`,
					);

					// Average degree within [2.5, 4.0]
					const averageDegree = (2 * board.edges.length) / board.vertices.length;
					assert.ok(
						averageDegree >= 2.5 && averageDegree <= 4.0,
						`Expected average degree in [2.5, 4.0], got ${averageDegree}`,
					);

					// Single connected component
					const vertexIds = board.vertices.map((v) => v.id);
					assert.equal(isGraphConnected(vertexIds, board.edges), true);

					// Target positions are completely untangled (0 crossings)
					const targetSummary = findIntersections(board.vertices, board.edges, true);
					assert.equal(targetSummary.intersectionCount, 0);
					assert.equal(targetSummary.isSolved, true);

					// Every vertex has degree >= 2
					for (const id of vertexIds) {
						assert.ok(
							(targetSummary.nodeDegreeCounts[id] ?? 0) >= 2,
							`Expected vertex ${id} to have degree >= 2`,
						);
					}

					// Scrambled initial positions meet minimum crossing threshold
					const initialSummary = findIntersections(board.vertices, board.edges, false);
					assert.ok(
						initialSummary.intersectionCount >= config.minInitialCrossings,
						`Expected initial crossings >= ${config.minInitialCrossings}, got ${initialSummary.intersectionCount}`,
					);
					assert.equal(initialSummary.isSolved, false);
				});
			}
		});
	}

	it('is deterministically reproducible for identical seeds', () => {
		const boardA = generatePlanarGraph('medium', 77777);
		const boardB = generatePlanarGraph('medium', 77777);
		assert.deepEqual(boardA, boardB);
	});

	it('clamps moved vertex coordinates and increments moveCount', () => {
		const board = generatePlanarGraph('easy', 101);
		const firstVertex = board.vertices[0];
		assert.ok(firstVertex);
		const vertexId = firstVertex.id;
		const updated = moveVertex(board, vertexId, 1.5, -0.2, true);
		const moved = updated.vertices.find((v) => v.id === vertexId);
		assert.ok(moved);
		assert.equal(moved.x, 0.96);
		assert.equal(moved.y, 0.04);
		assert.equal(updated.moveCount, 1);
	});
});
