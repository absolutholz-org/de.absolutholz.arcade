import { doSegmentsIntersect, euclideanDistance } from './geometry.ts';
import type { Point } from './types.ts';

interface Triangle {
	readonly a: number;
	readonly b: number;
	readonly c: number;
}

function isPointInCircumcircle(points: readonly Point[], tri: Triangle, pIndex: number): boolean {
	const a = points[tri.a];
	const b = points[tri.b];
	const c = points[tri.c];
	const p = points[pIndex];

	const ax = a.x - p.x;
	const ay = a.y - p.y;
	const bx = b.x - p.x;
	const by = b.y - p.y;
	const cx = c.x - p.x;
	const cy = c.y - p.y;

	const det =
		(ax * ax + ay * ay) * (bx * cy - cx * by) -
		(bx * bx + by * by) * (ax * cy - cx * ay) +
		(cx * cx + cy * cy) * (ax * by - bx * ay);

	const orient = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	return orient > 0 ? det > 1e-10 : det < -1e-10;
}

function edgeKey(u: number, v: number): string {
	return u < v ? `${u}:${v}` : `${v}:${u}`;
}

/**
 * Computes a guaranteed-planar Delaunay triangulation over 2D points using the
 * Bowyer-Watson algorithm, returning undirected index pairs `[u, v]` (`u < v`).
 */
export function delaunayTriangulate(points: readonly Point[]): [number, number][] {
	const n = points.length;
	if (n < 2) return [];
	if (n === 2) return [[0, 1]];

	const allPoints: Point[] = [...points, { x: -10, y: -10 }, { x: 10, y: -10 }, { x: 0, y: 10 }];

	const superA = n;
	const superB = n + 1;
	const superC = n + 2;

	let triangles: Triangle[] = [{ a: superA, b: superB, c: superC }];

	for (let i = 0; i < n; i += 1) {
		const badTriangles: Triangle[] = [];
		for (const tri of triangles) {
			if (isPointInCircumcircle(allPoints, tri, i)) {
				badTriangles.push(tri);
			}
		}

		const edgeCounts = new Map<string, { u: number; v: number; count: number }>();
		const recordEdge = (u: number, v: number) => {
			const key = edgeKey(u, v);
			const existing = edgeCounts.get(key);
			if (existing) {
				existing.count += 1;
			} else {
				edgeCounts.set(key, { u: Math.min(u, v), v: Math.max(u, v), count: 1 });
			}
		};

		for (const tri of badTriangles) {
			recordEdge(tri.a, tri.b);
			recordEdge(tri.b, tri.c);
			recordEdge(tri.c, tri.a);
		}

		const badSet = new Set(badTriangles);
		triangles = triangles.filter((t) => !badSet.has(t));

		for (const { u, v, count } of edgeCounts.values()) {
			if (count === 1) {
				triangles.push({ a: u, b: v, c: i });
			}
		}
	}

	const candidateMap = new Map<string, [number, number]>();
	for (const tri of triangles) {
		if (tri.a >= n || tri.b >= n || tri.c >= n) {
			continue;
		}
		const pairs: [number, number][] = [
			[Math.min(tri.a, tri.b), Math.max(tri.a, tri.b)],
			[Math.min(tri.b, tri.c), Math.max(tri.b, tri.c)],
			[Math.min(tri.a, tri.c), Math.max(tri.a, tri.c)],
		];
		for (const pair of pairs) {
			candidateMap.set(edgeKey(pair[0], pair[1]), pair);
		}
	}

	// Sort candidate edges by Euclidean length and greedily accept non-crossing edges,
	// then augment with greedy planar triangulation edges if needed to ensure full connectivity.
	const candidates = Array.from(candidateMap.values()).sort(
		([u1, v1], [u2, v2]) => euclideanDistance(points[u1], points[v1]) - euclideanDistance(points[u2], points[v2]),
	);

	const accepted: [number, number][] = [];
	const acceptedKeys = new Set<string>();

	const tryAddEdge = (u: number, v: number): boolean => {
		const key = edgeKey(u, v);
		if (acceptedKeys.has(key)) return false;
		const p1 = points[u];
		const p2 = points[v];
		for (const [eu, ev] of accepted) {
			if (u === eu || u === ev || v === eu || v === ev) continue;
			if (doSegmentsIntersect(p1, p2, points[eu], points[ev])) {
				return false;
			}
		}
		accepted.push([Math.min(u, v), Math.max(u, v)]);
		acceptedKeys.add(key);
		return true;
	};

	for (const [u, v] of candidates) {
		tryAddEdge(u, v);
	}

	// Ensure maximal planar triangulation by checking remaining pairs sorted by length
	const fallbackPairs: [number, number][] = [];
	for (let i = 0; i < n; i += 1) {
		for (let j = i + 1; j < n; j += 1) {
			if (!acceptedKeys.has(edgeKey(i, j))) {
				fallbackPairs.push([i, j]);
			}
		}
	}
	fallbackPairs.sort(
		([u1, v1], [u2, v2]) => euclideanDistance(points[u1], points[v1]) - euclideanDistance(points[u2], points[v2]),
	);
	for (const [u, v] of fallbackPairs) {
		tryAddEdge(u, v);
	}

	return accepted;
}
