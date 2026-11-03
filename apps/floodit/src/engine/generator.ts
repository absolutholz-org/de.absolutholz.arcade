import { type ColorIndex, DIFFICULTY_CONFIGS, type Difficulty, type DifficultyConfig, type Grid } from './types.ts';

/**
 * Deterministic 32-bit pseudo-random number generator (Mulberry32).
 */
export function createRng(seed: number): () => number {
	let s = seed | 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Computes maximum allowed moves for an arbitrary grid size and color count.
 * Calibrated so standard 12x12 is 22, 14x14 is 25, and 16x16 is 30.
 */
export function calculateMaxMoves(size: number, colorCount = 6): number {
	// Standard formula: 25 moves for 14x14 grid with 6 colors, scaled by dimension and color ratio
	const baseline = Math.round((size * 2 * 25) / 28);
	const colorFactor = colorCount / 6;
	return Math.round(baseline * colorFactor);
}

/**
 * Returns the active subset of color indices for a given color count.
 */
export function getActiveColors(colorCount: number): readonly ColorIndex[] {
	const colors: ColorIndex[] = [];
	for (let i = 0; i < colorCount; i++) {
		colors.push(i as ColorIndex);
	}
	return colors;
}

/**
 * Generates a randomized grid of the given dimensions populated with colors 0 to colorCount - 1.
 */
export function generateGrid(size: number, rng: () => number, colorCount = 6): Grid {
	const grid: ColorIndex[][] = [];
	for (let r = 0; r < size; r++) {
		const row: ColorIndex[] = [];
		for (let c = 0; c < size; c++) {
			const color = Math.floor(rng() * colorCount) as ColorIndex;
			row.push(color);
		}
		grid.push(row);
	}
	return grid;
}

/**
 * Creates a brand new game board for the given difficulty tier and seed.
 */
export function createNewGame(
	difficulty: Difficulty,
	seed = Date.now(),
): {
	grid: Grid;
	size: number;
	colorCount: number;
	maxMoves: number;
	activeColors: readonly ColorIndex[];
	seed: number;
} {
	const config: DifficultyConfig = DIFFICULTY_CONFIGS[difficulty];
	const rng = createRng(seed);
	const grid = generateGrid(config.size, rng, config.colorCount);
	const activeColors = getActiveColors(config.colorCount);

	return {
		grid,
		size: config.size,
		colorCount: config.colorCount,
		maxMoves: config.maxMoves,
		activeColors,
		seed,
	};
}
