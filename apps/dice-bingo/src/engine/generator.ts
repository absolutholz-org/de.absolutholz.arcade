import type { Board, Cell, DiceBingoSnapshot, DifficultyLevel, GridCoord } from './types.ts';

export const DIFFICULTY_SPECS: Record<DifficultyLevel, { size: number; maxTurns: number; obstacleCount: number }> = {
	easy: { size: 4, maxTurns: 16, obstacleCount: 0 },
	medium: { size: 5, maxTurns: 25, obstacleCount: 0 },
	hard: { size: 5, maxTurns: 23, obstacleCount: 2 },
};

/**
 * Simple Linear Congruential Generator for reproducible board generation.
 */
function createLcg(seed: number): () => number {
	let state = seed % 2147483647;
	if (state <= 0) state += 2147483646;
	return () => {
		state = (state * 16807) % 2147483647;
		return (state - 1) / 2147483646;
	};
}

export function pickObstacleCoords(size: number, count: number, rng: () => number = Math.random): GridCoord[] {
	if (count <= 0) return [];
	const allCoords: GridCoord[] = [];
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			// Leave center cell (2, 2) on 5x5 unblocked so "dead_center" feat is always reachable
			if (size === 5 && r === 2 && c === 2) continue;
			allCoords.push({ row: r, col: c });
		}
	}

	// Fisher-Yates shuffle to pick `count` unique coordinates
	for (let i = allCoords.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const temp = allCoords[i];
		allCoords[i] = allCoords[j];
		allCoords[j] = temp;
	}

	return allCoords.slice(0, count);
}

export function createInitialBoard(difficulty: DifficultyLevel, seed?: number): Board {
	const spec = DIFFICULTY_SPECS[difficulty];
	const rng = seed !== undefined ? createLcg(seed) : Math.random;
	const obstacleCoords = pickObstacleCoords(spec.size, spec.obstacleCount, rng);
	const obstacleSet = new Set(obstacleCoords.map((c) => `${c.row},${c.col}`));

	const board: Board = [];
	for (let r = 0; r < spec.size; r++) {
		const row: Cell[] = [];
		for (let c = 0; c < spec.size; c++) {
			const isObstacle = obstacleSet.has(`${r},${c}`);
			row.push({
				row: r,
				col: c,
				value: null,
				isObstacle,
			});
		}
		board.push(row);
	}

	return board;
}

export function createInitialSnapshot(difficulty: DifficultyLevel, seed?: number): DiceBingoSnapshot {
	const spec = DIFFICULTY_SPECS[difficulty];
	const board = createInitialBoard(difficulty, seed);

	return {
		difficulty,
		board,
		currentRoll: null,
		currentTurn: 0,
		maxTurns: spec.maxTurns,
		phase: 'ready_to_roll',
		moveHistory: [],
		isComplete: false,
		startedAt: Date.now(),
	};
}
