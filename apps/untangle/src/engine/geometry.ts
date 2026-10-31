import type { Edge, IntersectionSummary, Point, Vertex } from './types.ts';

const EPSILON = 1e-9;

function pointsEqual(a: Point, b: Point): boolean {
	return Math.abs(a.x - b.x) <= EPSILON && Math.abs(a.y - b.y) <= EPSILON;
}

function crossProduct(o: Point, a: Point, b: Point): number {
	return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function orientation(p: Point, q: Point, r: Point): 0 | 1 | 2 {
	const val = crossProduct(p, q, r);
	if (Math.abs(val) <= EPSILON) {
		return 0;
	}
	return val > 0 ? 1 : 2;
}

function onSegment(p: Point, q: Point, r: Point): boolean {
	return (
		q.x <= Math.max(p.x, r.x) + EPSILON &&
		q.x >= Math.min(p.x, r.x) - EPSILON &&
		q.y <= Math.max(p.y, r.y) + EPSILON &&
		q.y >= Math.min(p.y, r.y) - EPSILON
	);
}

/**
 * Determines whether two closed 2D line segments [p1, p2] and [p3, p4] intersect.
 * Segments that merely share a single vertex endpoint do not count as intersecting
 * unless they overlap collinearly.
 */
export function doSegmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
	const share13 = pointsEqual(p1, p3);
	const share14 = pointsEqual(p1, p4);
	const share23 = pointsEqual(p2, p3);
	const share24 = pointsEqual(p2, p4);

	if ((share13 && share24) || (share14 && share23)) {
		return true;
	}

	if (share13 || share14 || share23 || share24) {
		const shared = share13 || share14 ? p1 : p2;
		const otherA = share13 || share14 ? p2 : p1;
		const otherB = share13 || share23 ? p4 : p3;

		if (orientation(shared, otherA, otherB) !== 0) {
			return false;
		}
		return onSegment(shared, otherA, otherB) || onSegment(shared, otherB, otherA);
	}

	const o1 = orientation(p1, p2, p3);
	const o2 = orientation(p1, p2, p4);
	const o3 = orientation(p3, p4, p1);
	const o4 = orientation(p3, p4, p2);

	if (o1 !== o2 && o3 !== o4) {
		return true;
	}

	if (o1 === 0 && onSegment(p1, p3, p2)) return true;
	if (o2 === 0 && onSegment(p1, p4, p2)) return true;
	if (o3 === 0 && onSegment(p3, p1, p4)) return true;
	if (o4 === 0 && onSegment(p3, p2, p4)) return true;

	return false;
}

export function euclideanDistance(a: Point, b: Point): number {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Computes all edge crossings and per-vertex degree/crossing telemetry.
 */
export function findIntersections(
	vertices: readonly Vertex[],
	edges: readonly Edge[],
	useTargetCoords = false,
): IntersectionSummary {
	const vertexMap = new Map<string, Point>();
	const nodeCrossingSets = new Map<string, Set<number>>();
	const nodeDegreeCounts: Record<string, number> = {};

	for (const vertex of vertices) {
		vertexMap.set(vertex.id, {
			x: useTargetCoords ? vertex.targetX : vertex.x,
			y: useTargetCoords ? vertex.targetY : vertex.y,
		});
		nodeCrossingSets.set(vertex.id, new Set<number>());
		nodeDegreeCounts[vertex.id] = 0;
	}

	for (const [u, v] of edges) {
		if (nodeDegreeCounts[u] !== undefined) nodeDegreeCounts[u] += 1;
		if (nodeDegreeCounts[v] !== undefined) nodeDegreeCounts[v] += 1;
	}

	const intersectingEdgeIndices = new Set<number>();
	let intersectionCount = 0;

	for (let i = 0; i < edges.length; i += 1) {
		const [u1, v1] = edges[i];
		if (u1 === v1) continue;
		const p1 = vertexMap.get(u1);
		const p2 = vertexMap.get(v1);
		if (!p1 || !p2) continue;

		for (let j = i + 1; j < edges.length; j += 1) {
			const [u2, v2] = edges[j];
			if (u2 === v2) continue;
			if (u1 === u2 || u1 === v2 || v1 === u2 || v1 === v2) {
				continue;
			}
			const p3 = vertexMap.get(u2);
			const p4 = vertexMap.get(v2);
			if (!p3 || !p4) continue;

			if (doSegmentsIntersect(p1, p2, p3, p4)) {
				intersectionCount += 1;
				intersectingEdgeIndices.add(i);
				intersectingEdgeIndices.add(j);
				nodeCrossingSets.get(u1)?.add(i);
				nodeCrossingSets.get(v1)?.add(i);
				nodeCrossingSets.get(u2)?.add(j);
				nodeCrossingSets.get(v2)?.add(j);
			}
		}
	}

	const nodeCrossingCounts: Record<string, number> = {};
	for (const vertex of vertices) {
		nodeCrossingCounts[vertex.id] = nodeCrossingSets.get(vertex.id)?.size ?? 0;
	}

	return {
		intersectionCount,
		intersectingEdgeIndices,
		nodeCrossingCounts,
		nodeDegreeCounts,
		isSolved: intersectionCount === 0,
	};
}
