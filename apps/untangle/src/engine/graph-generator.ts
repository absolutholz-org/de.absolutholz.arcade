import { delaunayTriangulate } from './delaunay.ts';
import { findIntersections } from './geometry.ts';
import { type BoardState, DIFFICULTY_CONFIGS, type DifficultyLevel, type Edge, type Vertex } from './types.ts';

export function createSeededRandom(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function isGraphConnected(vertexIds: readonly string[], edges: readonly Edge[]): boolean {
	if (vertexIds.length <= 1) {
		return true;
	}

	const adjacency = new Map<string, string[]>();
	for (const id of vertexIds) {
		adjacency.set(id, []);
	}
	for (const [u, v] of edges) {
		adjacency.get(u)?.push(v);
		adjacency.get(v)?.push(u);
	}

	const firstId = vertexIds[0];
	if (!firstId) {
		return true;
	}

	const visited = new Set<string>();
	const queue: string[] = [firstId];
	visited.add(firstId);

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) {
			continue;
		}
		const neighbors = adjacency.get(current) ?? [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push(neighbor);
			}
		}
	}

	return visited.size === vertexIds.length;
}

function areThreePointsCollinear(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
	const cross = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
	return Math.abs(cross) < 1e-4;
}

function generateTargetVertices(vertexCount: number, minDistance: number, rng: () => number): Vertex[] {
	const vertices: Vertex[] = [];

	for (let i = 0; i < vertexCount; i++) {
		let threshold = minDistance;
		let chosenX = 0.5;
		let chosenY = 0.5;

		for (let attempt = 0; attempt < 400; attempt++) {
			if (attempt > 0 && attempt % 40 === 0) {
				threshold *= 0.9;
			}

			// Keep the first two vertices near the interior so the convex hull never consumes too many edges
			const minBound = i < 2 ? 0.32 : 0.1;
			const maxBound = i < 2 ? 0.68 : 0.9;
			const candidateX = minBound + rng() * (maxBound - minBound);
			const candidateY = minBound + rng() * (maxBound - minBound);

			let valid = true;
			for (const existing of vertices) {
				const dist = Math.hypot(candidateX - existing.targetX, candidateY - existing.targetY);
				if (dist < threshold) {
					valid = false;
					break;
				}
			}

			if (valid && vertices.length >= 2) {
				for (let a = 0; a < vertices.length && valid; a++) {
					for (let b = a + 1; b < vertices.length; b++) {
						const va = vertices[a];
						const vb = vertices[b];
						if (
							va &&
							vb &&
							areThreePointsCollinear(
								va.targetX,
								va.targetY,
								vb.targetX,
								vb.targetY,
								candidateX,
								candidateY,
							)
						) {
							valid = false;
							break;
						}
					}
				}
			}

			chosenX = candidateX;
			chosenY = candidateY;
			if (valid) {
				break;
			}
		}

		// Slight deterministic jitter to prevent collinearity if fallback was used
		const jitterX = (rng() - 0.5) * 1e-4;
		const jitterY = (rng() - 0.5) * 1e-4;
		const finalX = Math.min(0.9, Math.max(0.1, chosenX + jitterX));
		const finalY = Math.min(0.9, Math.max(0.1, chosenY + jitterY));

		vertices.push({
			id: `v${i}`,
			x: finalX,
			y: finalY,
			targetX: finalX,
			targetY: finalY,
		});
	}

	return vertices;
}

function shuffleArray<T>(items: readonly T[], rng: () => number): T[] {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const temp = result[i];
		const randItem = result[j];
		if (temp !== undefined && randItem !== undefined) {
			result[i] = randItem;
			result[j] = temp;
		}
	}
	return result;
}

function scrambleVerticesOnCircle(
	targetVertices: readonly Vertex[],
	edges: readonly Edge[],
	minInitialCrossings: number,
	rng: () => number,
): Vertex[] {
	const count = targetVertices.length;
	let bestVertices: Vertex[] = [...targetVertices];
	let bestCrossings = -1;

	// Build an antipodal-chord ordering from BFS to guarantee high crossings if random shuffles fall short
	const adjacency = new Map<string, string[]>();
	for (const v of targetVertices) {
		adjacency.set(v.id, []);
	}
	for (const [u, v] of edges) {
		adjacency.get(u)?.push(v);
		adjacency.get(v)?.push(u);
	}

	for (let attempt = 0; attempt < 40; attempt++) {
		let permutation: number[];
		if (attempt < 32) {
			permutation = shuffleArray(
				Array.from({ length: count }, (_, idx) => idx),
				rng,
			);
		} else {
			// Place consecutive indices across the circle from one another to maximize chord intersections
			const base = shuffleArray(
				Array.from({ length: count }, (_, idx) => idx),
				rng,
			);
			permutation = new Array<number>(count);
			const half = Math.floor(count / 2);
			for (let i = 0; i < count; i++) {
				const slot = i % 2 === 0 ? Math.floor(i / 2) : half + Math.floor(i / 2);
				const item = base[i];
				if (item !== undefined) {
					permutation[slot] = item;
				}
			}
		}

		const angleOffset = rng() * Math.PI * 2;
		const candidateVertices: Vertex[] = targetVertices.map((vertex, idx) => {
			const circlePos = permutation[idx] ?? idx;
			const angle = angleOffset + (circlePos / count) * Math.PI * 2;
			const radialJitter = (rng() - 0.5) * 0.03;
			const radius = 0.38 + radialJitter;
			const x = Math.min(0.96, Math.max(0.04, 0.5 + radius * Math.cos(angle)));
			const y = Math.min(0.96, Math.max(0.04, 0.5 + radius * Math.sin(angle)));
			return {
				...vertex,
				x,
				y,
			};
		});

		const summary = findIntersections(candidateVertices, edges, false);
		if (summary.intersectionCount > bestCrossings) {
			bestCrossings = summary.intersectionCount;
			bestVertices = candidateVertices;
		}
		if (summary.intersectionCount >= minInitialCrossings) {
			return candidateVertices;
		}
	}

	return bestVertices;
}

export function generatePlanarGraph(
	difficulty: DifficultyLevel,
	seed: number = Math.floor(Math.random() * 0x7fffffff),
): BoardState {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const normalizedSeed = seed >>> 0;
	const rng = createSeededRandom(normalizedSeed);

	const vertexCount = config.minVertices + Math.floor(rng() * (config.maxVertices - config.minVertices + 1));

	const minDegreeEdges = Math.ceil((2.5 * vertexCount) / 2);
	const maxDegreeEdges = Math.floor((4.0 * vertexCount) / 2);
	const desiredMinEdges = Math.max(config.minEdges, minDegreeEdges);
	const desiredMaxEdges = Math.min(config.maxEdges, maxDegreeEdges);

	let targetVertices: Vertex[] = [];
	let triangulationEdges: Edge[] = [];

	for (let graphAttempt = 0; graphAttempt < 16; graphAttempt++) {
		targetVertices = generateTargetVertices(vertexCount, config.minDistance, rng);
		const rawEdges = delaunayTriangulate(targetVertices) as unknown as readonly (readonly [
			string | number,
			string | number,
		])[];
		triangulationEdges = rawEdges.map(([u, v]) => [
			typeof u === 'number' ? (targetVertices[u]?.id ?? `v${u}`) : String(u),
			typeof v === 'number' ? (targetVertices[v]?.id ?? `v${v}`) : String(v),
		]);

		if (triangulationEdges.length >= desiredMinEdges) {
			break;
		}
	}

	const upperEdgeBound = Math.min(desiredMaxEdges, triangulationEdges.length);
	const lowerEdgeBound = Math.min(desiredMinEdges, upperEdgeBound);
	const targetEdges = lowerEdgeBound + Math.floor(rng() * Math.max(1, upperEdgeBound - lowerEdgeBound + 1));

	const vertexIds = targetVertices.map((v) => v.id);
	const degrees = new Map<string, number>();
	for (const id of vertexIds) {
		degrees.set(id, 0);
	}
	for (const [u, v] of triangulationEdges) {
		degrees.set(u, (degrees.get(u) ?? 0) + 1);
		degrees.set(v, (degrees.get(v) ?? 0) + 1);
	}

	const candidateOrder = shuffleArray(triangulationEdges, rng);
	const activeEdges: Edge[] = [...candidateOrder];

	for (let i = activeEdges.length - 1; i >= 0 && activeEdges.length > targetEdges; i--) {
		const edge = activeEdges[i];
		if (!edge) {
			continue;
		}
		const [u, v] = edge;
		const degU = degrees.get(u) ?? 0;
		const degV = degrees.get(v) ?? 0;
		if (degU <= 2 || degV <= 2) {
			continue;
		}

		const remaining = activeEdges.filter((_, idx) => idx !== i);
		if (isGraphConnected(vertexIds, remaining)) {
			activeEdges.splice(i, 1);
			degrees.set(u, degU - 1);
			degrees.set(v, degV - 1);
		}
	}

	const scrambledVertices = scrambleVerticesOnCircle(targetVertices, activeEdges, config.minInitialCrossings, rng);

	return {
		difficulty,
		seed: normalizedSeed,
		vertices: scrambledVertices,
		edges: activeEdges,
		moveCount: 0,
	};
}

export function moveVertex(
	board: BoardState,
	vertexId: string,
	x: number,
	y: number,
	incrementMove = true,
): BoardState {
	const clampedX = Math.min(0.96, Math.max(0.04, x));
	const clampedY = Math.min(0.96, Math.max(0.04, y));

	let changed = false;
	const vertices = board.vertices.map((vertex) => {
		if (vertex.id !== vertexId) {
			return vertex;
		}
		if (vertex.x === clampedX && vertex.y === clampedY) {
			return vertex;
		}
		changed = true;
		return {
			...vertex,
			x: clampedX,
			y: clampedY,
		};
	});

	if (!changed && !incrementMove) {
		return board;
	}

	return {
		...board,
		vertices,
		moveCount: incrementMove ? board.moveCount + 1 : board.moveCount,
	};
}
