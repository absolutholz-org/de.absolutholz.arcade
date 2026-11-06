import { getActiveColors } from './generator.ts';
import type { BoardState, ColorIndex, Grid } from './types.ts';

/**
 * Serializes a coordinate to a string key "row,col".
 */
export function coordKey(row: number, col: number): string {
	return `${row},${col}`;
}

/**
 * Deserializes a string key "row,col" into [row, col].
 */
export function parseCoordKey(key: string): [number, number] {
	const parts = key.split(',');
	return [Number(parts[0]), Number(parts[1])];
}

/**
 * Finds all cells connected to (0,0) matching the top-left color using BFS.
 */
export function getConnectedCluster(grid: Grid): Set<string> {
	const size = grid.length;
	if (size === 0) return new Set();

	const targetColor = grid[0][0];
	const cluster = new Set<string>();
	const queue: [number, number][] = [[0, 0]];
	cluster.add(coordKey(0, 0));

	const deltas = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	let head = 0;
	while (head < queue.length) {
		const [r, c] = queue[head++];

		for (const [dr, dc] of deltas) {
			const nr = r + dr;
			const nc = c + dc;

			if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
				const key = coordKey(nr, nc);
				if (!cluster.has(key) && grid[nr][nc] === targetColor) {
					cluster.add(key);
					queue.push([nr, nc]);
				}
			}
		}
	}

	return cluster;
}

/**
 * Builds a complete BoardState from an existing grid, current move count, and max moves.
 */
export function calculateBoardState(
	grid: Grid,
	moves: number,
	maxMoves: number,
	seed: number,
	colorCount = 6,
): BoardState {
	const size = grid.length;
	const totalCells = size * size;
	const cluster = getConnectedCluster(grid);
	const clusterSize = cluster.size;
	const floodPercentage = totalCells > 0 ? (clusterSize / totalCells) * 100 : 0;
	const isWon = clusterSize === totalCells && moves <= maxMoves;
	const isLost = !isWon && moves >= maxMoves;
	const currentColor = size > 0 && grid[0].length > 0 ? grid[0][0] : 0;
	const activeColors = getActiveColors(colorCount);

	return {
		size,
		colorCount,
		activeColors,
		grid,
		moves,
		maxMoves,
		currentColor,
		floodedCluster: cluster,
		floodPercentage,
		isWon,
		isLost,
		seed,
	};
}

/**
 * Executes a player move by choosing a new color.
 * Replaces the cluster cells with `newColor` and absorbs connected neighbors.
 */
export function applyMove(state: BoardState, newColor: ColorIndex): BoardState {
	// Cannot flood with the identical color, outside active colors, or after game completion
	if (newColor === state.currentColor || !state.activeColors.includes(newColor) || state.isWon || state.isLost) {
		return state;
	}

	const size = state.size;
	// Deep clone grid to ensure immutability
	const newGrid: ColorIndex[][] = state.grid.map((row) => [...row]);

	// Repaint all cells in the current cluster to newColor
	for (const key of state.floodedCluster) {
		const [r, c] = parseCoordKey(key);
		newGrid[r][c] = newColor;
	}

	const newMoves = state.moves + 1;
	return calculateBoardState(newGrid, newMoves, state.maxMoves, state.seed, state.colorCount);
}
