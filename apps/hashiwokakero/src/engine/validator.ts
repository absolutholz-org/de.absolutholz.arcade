import type { BoardState, Bridge, Island, IslandEvaluation, IslandStatus } from './types';

/**
 * Finds unobstructed horizontal and vertical island neighbors in 4 cardinal directions.
 * Raycast stops in each direction as soon as another island is encountered.
 */
export function getOrthogonalRaycasts(islandId: string, state: BoardState): Island[] {
	const source = state.islands.find((isl) => isl.id === islandId);
	if (!source) {
		return [];
	}

	let closestNorth: Island | null = null;
	let closestSouth: Island | null = null;
	let closestWest: Island | null = null;
	let closestEast: Island | null = null;

	for (const island of state.islands) {
		if (island.id === islandId) continue;

		// Same vertical column (x matches)
		if (island.x === source.x) {
			// North: y < source.y (closest has maximum y)
			if (island.y < source.y) {
				if (!closestNorth || island.y > closestNorth.y) {
					closestNorth = island;
				}
			}
			// South: y > source.y (closest has minimum y)
			else if (island.y > source.y) {
				if (!closestSouth || island.y < closestSouth.y) {
					closestSouth = island;
				}
			}
		}

		// Same horizontal row (y matches)
		if (island.y === source.y) {
			// West: x < source.x (closest has maximum x)
			if (island.x < source.x) {
				if (!closestWest || island.x > closestWest.x) {
					closestWest = island;
				}
			}
			// East: x > source.x (closest has minimum x)
			else if (island.x > source.x) {
				if (!closestEast || island.x < closestEast.x) {
					closestEast = island;
				}
			}
		}
	}

	const neighbors: Island[] = [];
	if (closestNorth) neighbors.push(closestNorth);
	if (closestEast) neighbors.push(closestEast);
	if (closestSouth) neighbors.push(closestSouth);
	if (closestWest) neighbors.push(closestWest);

	return neighbors;
}

/**
 * Returns true if a horizontal and vertical bridge cross perpendicularly in their open interior.
 * Bridges that share an endpoint (meeting at an island) or have the same orientation do not intersect.
 */
export function bridgesIntersect(bridgeA: Bridge, bridgeB: Bridge, islands: Map<string, Island>): boolean {
	if (bridgeA.orientation === bridgeB.orientation) {
		return false;
	}

	const h = bridgeA.orientation === 'horizontal' ? bridgeA : bridgeB;
	const v = bridgeA.orientation === 'vertical' ? bridgeA : bridgeB;

	const hFrom = islands.get(h.fromId);
	const hTo = islands.get(h.toId);
	const vFrom = islands.get(v.fromId);
	const vTo = islands.get(v.toId);

	if (!hFrom || !hTo || !vFrom || !vTo) {
		return false;
	}

	const xHMin = Math.min(hFrom.x, hTo.x);
	const xHMax = Math.max(hFrom.x, hTo.x);
	const yH = hFrom.y;

	const yVMin = Math.min(vFrom.y, vTo.y);
	const yVMax = Math.max(vFrom.y, vTo.y);
	const xV = vFrom.x;

	// Perpendicular crossing requires the vertical line to pass strictly between horizontal endpoints,
	// and the horizontal line to pass strictly between vertical endpoints.
	return xHMin < xV && xV < xHMax && yVMin < yH && yH < yVMax;
}

/**
 * Verifies collinearity (same x or same y), unobstructed line-of-sight between the two islands,
 * and zero crossings with existing bridges.
 */
export function canConnect(fromId: string, toId: string, state: BoardState): boolean {
	if (fromId === toId) {
		return false;
	}

	const islandMap = new Map(state.islands.map((isl) => [isl.id, isl]));
	const islandA = islandMap.get(fromId);
	const islandB = islandMap.get(toId);

	if (!islandA || !islandB) {
		return false;
	}

	// 1. Collinearity
	const isHorizontal = islandA.y === islandB.y && islandA.x !== islandB.x;
	const isVertical = islandA.x === islandB.x && islandA.y !== islandB.y;

	if (!isHorizontal && !isVertical) {
		return false;
	}

	// 2. Unobstructed line-of-sight (no intermediate island sits on the path)
	if (isHorizontal) {
		const minX = Math.min(islandA.x, islandB.x);
		const maxX = Math.max(islandA.x, islandB.x);
		for (const other of state.islands) {
			if (other.id !== fromId && other.id !== toId && other.y === islandA.y && other.x > minX && other.x < maxX) {
				return false;
			}
		}
	} else {
		const minY = Math.min(islandA.y, islandB.y);
		const maxY = Math.max(islandA.y, islandB.y);
		for (const other of state.islands) {
			if (other.id !== fromId && other.id !== toId && other.x === islandA.x && other.y > minY && other.y < maxY) {
				return false;
			}
		}
	}

	// 3. Zero crossings with existing bridges
	const orientation = isHorizontal ? 'horizontal' : 'vertical';
	const candidateBridge: Bridge = {
		id: 'candidate',
		fromId,
		toId,
		count: 1,
		orientation,
	};

	for (const bridge of state.bridges) {
		const isSameEdge =
			(bridge.fromId === fromId && bridge.toId === toId) || (bridge.fromId === toId && bridge.toId === fromId);
		if (isSameEdge) {
			continue;
		}

		if (bridgesIntersect(candidateBridge, bridge, islandMap)) {
			return false;
		}
	}

	return true;
}

/**
 * Cycles bridge count between two islands: 0 -> 1 -> 2 -> 0.
 * Returns a new immutable BoardState.
 */
export function toggleBridge(fromId: string, toId: string, state: BoardState): BoardState {
	if (fromId === toId) {
		return state;
	}

	const existingIndex = state.bridges.findIndex(
		(b) => (b.fromId === fromId && b.toId === toId) || (b.fromId === toId && b.toId === fromId),
	);

	if (existingIndex >= 0) {
		const existing = state.bridges[existingIndex];
		if (existing.count === 1) {
			// 1 -> 2
			const updatedBridge: Bridge = { ...existing, count: 2 };
			const newBridges = [...state.bridges];
			newBridges[existingIndex] = updatedBridge;
			return { ...state, bridges: newBridges };
		}

		// 2 -> 0 (remove)
		const newBridges = state.bridges.filter((_, idx) => idx !== existingIndex);
		return { ...state, bridges: newBridges };
	}

	// 0 -> 1: Must verify connection feasibility
	if (!canConnect(fromId, toId, state)) {
		return state;
	}

	const islandMap = new Map(state.islands.map((isl) => [isl.id, isl]));
	const islandA = islandMap.get(fromId);
	const islandB = islandMap.get(toId);
	if (!islandA || !islandB) {
		return state;
	}

	const orientation = islandA.y === islandB.y ? 'horizontal' : 'vertical';
	const [minId, maxId] = fromId < toId ? [fromId, toId] : [toId, fromId];
	const newBridge: Bridge = {
		id: `bridge-${minId}-${maxId}`,
		fromId: minId,
		toId: maxId,
		count: 1,
		orientation,
	};

	return {
		...state,
		bridges: [...state.bridges, newBridge],
	};
}

/**
 * Calculates current bridge count and completion status for an island.
 */
export function getIslandStatus(islandId: string, state: BoardState): IslandEvaluation {
	const island = state.islands.find((isl) => isl.id === islandId);
	if (!island) {
		return { status: 'under', current: 0, target: 0 };
	}

	let current = 0;
	for (const bridge of state.bridges) {
		if (bridge.fromId === islandId || bridge.toId === islandId) {
			current += bridge.count;
		}
	}

	let status: IslandStatus = 'under';
	if (current === island.target) {
		status = 'satisfied';
	} else if (current > island.target) {
		status = 'overflow';
	}

	return {
		status,
		current,
		target: island.target,
	};
}

/**
 * Evaluates whether the board meets the victory conditions:
 * Condition 1: Every island has current === target.
 * Condition 2: All islands form a single connected component via the bridges.
 */
export function checkVictory(state: BoardState): boolean {
	if (state.islands.length === 0) {
		return false;
	}

	const islandMap = new Map(state.islands.map((isl) => [isl.id, isl]));

	// Verify no illegal bridge crossings exist
	for (let i = 0; i < state.bridges.length; i++) {
		for (let j = i + 1; j < state.bridges.length; j++) {
			if (bridgesIntersect(state.bridges[i], state.bridges[j], islandMap)) {
				return false;
			}
		}
	}

	// Condition 1: Every island has current === target
	for (const island of state.islands) {
		const { status } = getIslandStatus(island.id, state);
		if (status !== 'satisfied') {
			return false;
		}
	}

	// Condition 2: Graph connectivity check (BFS verifying all islands form a single component)
	const adj = new Map<string, string[]>();
	for (const island of state.islands) {
		adj.set(island.id, []);
	}

	for (const bridge of state.bridges) {
		if (bridge.count > 0) {
			adj.get(bridge.fromId)?.push(bridge.toId);
			adj.get(bridge.toId)?.push(bridge.fromId);
		}
	}

	const visited = new Set<string>();
	const queue: string[] = [state.islands[0].id];
	visited.add(state.islands[0].id);

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) break;
		const neighbors = adj.get(current) ?? [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push(neighbor);
			}
		}
	}

	return visited.size === state.islands.length;
}
