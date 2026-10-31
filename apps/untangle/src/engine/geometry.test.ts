import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { doSegmentsIntersect, findIntersections } from './geometry.ts';
import type { Edge, Vertex } from './types.ts';

describe('doSegmentsIntersect', () => {
	it('detects proper crossing segments', () => {
		const result = doSegmentsIntersect(
			{ x: 0.1, y: 0.1 },
			{ x: 0.9, y: 0.9 },
			{ x: 0.1, y: 0.9 },
			{ x: 0.9, y: 0.1 },
		);
		assert.equal(result, true);
	});

	it('returns false for disjoint segments', () => {
		const result = doSegmentsIntersect(
			{ x: 0.1, y: 0.1 },
			{ x: 0.3, y: 0.3 },
			{ x: 0.6, y: 0.6 },
			{ x: 0.9, y: 0.8 },
		);
		assert.equal(result, false);
	});

	it('returns false for parallel non-overlapping segments', () => {
		const result = doSegmentsIntersect(
			{ x: 0.1, y: 0.2 },
			{ x: 0.8, y: 0.2 },
			{ x: 0.1, y: 0.5 },
			{ x: 0.8, y: 0.5 },
		);
		assert.equal(result, false);
	});

	it('returns true for collinear overlapping segments', () => {
		const result = doSegmentsIntersect(
			{ x: 0.1, y: 0.2 },
			{ x: 0.6, y: 0.2 },
			{ x: 0.4, y: 0.2 },
			{ x: 0.9, y: 0.2 },
		);
		assert.equal(result, true);
	});

	it('returns false for segments sharing an endpoint without overlapping', () => {
		const shared = { x: 0.5, y: 0.5 };
		const result = doSegmentsIntersect({ x: 0.1, y: 0.1 }, shared, shared, { x: 0.9, y: 0.1 });
		assert.equal(result, false);
	});

	it('returns true for collinear segments sharing an endpoint and overlapping in the same direction', () => {
		const shared = { x: 0.2, y: 0.2 };
		const result = doSegmentsIntersect(shared, { x: 0.8, y: 0.8 }, shared, { x: 0.5, y: 0.5 });
		assert.equal(result, true);
	});

	it('returns true for T-junction where an endpoint lies in the interior of another segment', () => {
		const result = doSegmentsIntersect(
			{ x: 0.1, y: 0.5 },
			{ x: 0.9, y: 0.5 },
			{ x: 0.5, y: 0.5 },
			{ x: 0.5, y: 0.9 },
		);
		assert.equal(result, true);
	});
});

describe('findIntersections', () => {
	const vertices: readonly Vertex[] = [
		{ id: 'v0', x: 0.1, y: 0.1, targetX: 0.1, targetY: 0.1 },
		{ id: 'v1', x: 0.9, y: 0.9, targetX: 0.9, targetY: 0.1 },
		{ id: 'v2', x: 0.1, y: 0.9, targetX: 0.9, targetY: 0.9 },
		{ id: 'v3', x: 0.9, y: 0.1, targetX: 0.1, targetY: 0.9 },
	];

	const edges: readonly Edge[] = [
		['v0', 'v1'],
		['v2', 'v3'],
		['v0', 'v2'],
	];

	it('computes crossing counts, intersectingEdgeIndices, nodeCrossingCounts, nodeDegreeCounts, and isSolved', () => {
		const currentSummary = findIntersections(vertices, edges, false);
		assert.equal(currentSummary.intersectionCount, 1);
		assert.equal(currentSummary.isSolved, false);
		assert.equal(currentSummary.intersectingEdgeIndices.has(0), true);
		assert.equal(currentSummary.intersectingEdgeIndices.has(1), true);
		assert.equal(currentSummary.intersectingEdgeIndices.has(2), false);
		assert.equal(currentSummary.nodeCrossingCounts.v0, 1);
		assert.equal(currentSummary.nodeCrossingCounts.v1, 1);
		assert.equal(currentSummary.nodeCrossingCounts.v2, 1);
		assert.equal(currentSummary.nodeCrossingCounts.v3, 1);
		assert.equal(currentSummary.nodeDegreeCounts.v0, 2);
		assert.equal(currentSummary.nodeDegreeCounts.v1, 1);
		assert.equal(currentSummary.nodeDegreeCounts.v2, 2);
		assert.equal(currentSummary.nodeDegreeCounts.v3, 1);

		const targetSummary = findIntersections(vertices, edges, true);
		assert.equal(targetSummary.intersectionCount, 0);
		assert.equal(targetSummary.isSolved, true);
		assert.equal(targetSummary.intersectingEdgeIndices.size, 0);
		assert.equal(targetSummary.nodeCrossingCounts.v0, 0);
	});
});
