import { getStaticPuzzle } from './puzzles.ts';
import { type BoardState, type Bridge, DIFFICULTY_GRID_SIZES, type DifficultyLevel, type Island } from './types.ts';
import { bridgesIntersect, canConnect, checkVictory } from './validator.ts';

const TARGET_ISLAND_RANGES: Record<DifficultyLevel, { min: number; max: number }> = {
	beginner: { min: 4, max: 6 },
	easy: { min: 6, max: 10 },
	medium: { min: 10, max: 16 },
	hard: { min: 16, max: 24 },
	expert: { min: 24, max: 36 },
};

/**
 * 32-bit deterministic Mulberry32 PRNG.
 */
function createMulberry32(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Checks whether coordinate (x, y) falls strictly in the interior of any bridge.
 */
function isInsideBridgeInterior(x: number, y: number, bridges: Bridge[], islandMap: Map<string, Island>): boolean {
	for (const b of bridges) {
		const from = islandMap.get(b.fromId);
		const to = islandMap.get(b.toId);
		if (!from || !to) continue;

		if (b.orientation === 'horizontal') {
			if (y === from.y && x > Math.min(from.x, to.x) && x < Math.max(from.x, to.x)) {
				return true;
			}
		} else {
			if (x === from.x && y > Math.min(from.y, to.y) && y < Math.max(from.y, to.y)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Single attempt at generating a valid Hashiwokakero puzzle.
 */
function tryGenerateSingle(difficulty: DifficultyLevel, rng: () => number): BoardState | null {
	const { width, height } = DIFFICULTY_GRID_SIZES[difficulty];
	const range = TARGET_ISLANDRANGES(difficulty);
	const targetCount = Math.floor(rng() * (range.max - range.min + 1)) + range.min;

	const islands: Island[] = [];
	const solutionBridges: Bridge[] = [];
	const grid: (Island | null)[][] = Array.from({ length: height }, () => Array(width).fill(null));

	// 1. Initial root island
	const startX = Math.floor(rng() * (width - 2)) + 1;
	const startY = Math.floor(rng() * (height - 2)) + 1;
	const root: Island = { id: 'isl-1', x: startX, y: startY, target: 0 };
	islands.push(root);
	grid[startY][startX] = root;

	const directions = [
		{ dx: 1, dy: 0, orientation: 'horizontal' as const },
		{ dx: -1, dy: 0, orientation: 'horizontal' as const },
		{ dx: 0, dy: 1, orientation: 'vertical' as const },
		{ dx: 0, dy: -1, orientation: 'vertical' as const },
	];

	// 2. Grow spanning tree
	let attempts = 0;
	while (islands.length < targetCount && attempts < 400) {
		attempts++;
		const islandMap = new Map(islands.map((i) => [i.id, i]));
		const source = islands[Math.floor(rng() * islands.length)];

		// Find unused directions from this source island
		const usedDirs = new Set<string>();
		for (const b of solutionBridges) {
			if (b.fromId === source.id || b.toId === source.id) {
				const peerId = b.fromId === source.id ? b.toId : b.fromId;
				const peer = islandMap.get(peerId);
				if (peer) {
					if (peer.y === source.y) {
						usedDirs.add(peer.x > source.x ? '1,0' : '-1,0');
					} else {
						usedDirs.add(peer.y > source.y ? '0,1' : '0,-1');
					}
				}
			}
		}

		const availableDirs = directions.filter((d) => !usedDirs.has(`${d.dx},${d.dy}`));
		if (availableDirs.length === 0) continue;
		availableDirs.sort(() => rng() - 0.5);

		for (const dir of availableDirs) {
			const maxDist =
				dir.dx !== 0
					? dir.dx > 0
						? width - 1 - source.x
						: source.x
					: dir.dy > 0
						? height - 1 - source.y
						: source.y;
			if (maxDist < 2) continue;

			const validDistances: number[] = [];
			for (let d = 2; d <= Math.min(maxDist, 6); d++) {
				const nx = source.x + dir.dx * d;
				const ny = source.y + dir.dy * d;

				// Cell must be unoccupied
				if (grid[ny][nx] !== null) break;
				if (isInsideBridgeInterior(nx, ny, solutionBridges, islandMap)) break;

				// Maintain minimum 1 empty cell orthogonally (no adjacent islands at distance 1)
				const adjOffsets = [
					{ dx: 1, dy: 0 },
					{ dx: -1, dy: 0 },
					{ dx: 0, dy: 1 },
					{ dx: 0, dy: -1 },
				];
				let hasAdjacentIsland = false;
				for (const off of adjOffsets) {
					const ax = nx + off.dx;
					const ay = ny + off.dy;
					if (ax >= 0 && ax < width && ay >= 0 && ay < height && grid[ay][ax] !== null) {
						hasAdjacentIsland = true;
						break;
					}
				}
				if (hasAdjacentIsland) continue;

				// Bridge must not cross any existing perpendicular bridge
				const tempIsland: Island = { id: 'temp', x: nx, y: ny, target: 0 };
				const tempIslandMap = new Map(islandMap);
				tempIslandMap.set('temp', tempIsland);

				const candBridge: Bridge = {
					id: 'cand',
					fromId: source.id,
					toId: 'temp',
					count: 1,
					orientation: dir.orientation,
				};

				let crosses = false;
				for (const eb of solutionBridges) {
					if (bridgesIntersect(candBridge, eb, tempIslandMap)) {
						crosses = true;
						break;
					}
				}
				if (crosses) break;

				validDistances.push(d);
			}

			if (validDistances.length > 0) {
				const chosenDist = validDistances[Math.floor(rng() * validDistances.length)];
				const nx = source.x + dir.dx * chosenDist;
				const ny = source.y + dir.dy * chosenDist;
				const newId = `isl-${islands.length + 1}`;
				const newIsland: Island = { id: newId, x: nx, y: ny, target: 0 };
				islands.push(newIsland);
				grid[ny][nx] = newIsland;

				const count = (rng() < 0.5 ? 1 : 2) as 1 | 2;
				solutionBridges.push({
					id: `b-${source.id}-${newId}`,
					fromId: source.id,
					toId: newId,
					count,
					orientation: dir.orientation,
				});
				break;
			}
		}
	}

	if (islands.length < range.min) {
		return null;
	}

	// 3. Add optional cross bridges between existing islands to form cycles
	const existingPairSet = new Set<string>();
	for (const b of solutionBridges) {
		const pair = [b.fromId, b.toId].sort().join('-');
		existingPairSet.add(pair);
	}

	for (let i = 0; i < islands.length; i++) {
		for (let j = i + 1; j < islands.length; j++) {
			const a = islands[i];
			const b = islands[j];
			const pair = [a.id, b.id].sort().join('-');
			if (existingPairSet.has(pair)) continue;

			if (canConnect(a.id, b.id, { islands, bridges: solutionBridges, difficulty, width, height })) {
				if (rng() < 0.25) {
					const orientation = a.y === b.y ? 'horizontal' : 'vertical';
					const count = (rng() < 0.5 ? 1 : 2) as 1 | 2;
					solutionBridges.push({
						id: `b-${a.id}-${b.id}`,
						fromId: a.id,
						toId: b.id,
						count,
						orientation,
					});
					existingPairSet.add(pair);
				}
			}
		}
	}

	// 4. Calculate island target numbers from solution bridges
	for (const isl of islands) {
		let total = 0;
		for (const b of solutionBridges) {
			if (b.fromId === isl.id || b.toId === isl.id) {
				total += b.count;
			}
		}
		isl.target = total;
	}

	// 5. Verify that the generated puzzle satisfies all victory rules
	const solutionState: BoardState = {
		islands,
		bridges: solutionBridges,
		difficulty,
		width,
		height,
	};

	if (!checkVictory(solutionState)) {
		return null;
	}

	return {
		islands,
		bridges: [],
		difficulty,
		width,
		height,
	};
}

function TARGET_ISLANDRANGES(difficulty: DifficultyLevel): { min: number; max: number } {
	return TARGET_ISLAND_RANGES[difficulty] ?? TARGET_ISLAND_RANGES.beginner;
}

/**
 * Procedurally generates a solvable Hashiwokakero puzzle board.
 * Uses a deterministic PRNG when seed is specified.
 * Falls back to getStaticPuzzle if procedural generation fails after retries.
 */
export function generatePuzzle(difficulty: DifficultyLevel, seed?: number): BoardState {
	const rng =
		seed !== undefined
			? createMulberry32(seed)
			: createMulberry32((Date.now() ^ (Math.random() * 0x100000000)) >>> 0);

	const MAX_RETRIES = 20;
	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		const board = tryGenerateSingle(difficulty, rng);
		if (board) {
			return board;
		}
	}

	// Fallback to static catalog on failure
	return getStaticPuzzle(difficulty);
}
