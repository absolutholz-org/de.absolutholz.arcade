export type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5;

export const COLOR_COUNT = 6;
export const ALL_COLORS: readonly ColorIndex[] = [0, 1, 2, 3, 4, 5];

export type ShapeSymbol = 'circle' | 'triangle' | 'square' | 'diamond' | 'star' | 'cross';

export const COLOR_SHAPES: Record<ColorIndex, ShapeSymbol> = {
	0: 'circle',
	1: 'triangle',
	2: 'square',
	3: 'diamond',
	4: 'star',
	5: 'cross',
};

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
	readonly size: number;
	readonly colorCount: number;
	readonly maxMoves: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
	beginner: { size: 8, colorCount: 4, maxMoves: 18 },
	easy: { size: 10, colorCount: 5, maxMoves: 22 },
	medium: { size: 14, colorCount: 6, maxMoves: 26 },
	hard: { size: 18, colorCount: 6, maxMoves: 32 },
};

export interface Coordinate {
	readonly row: number;
	readonly col: number;
}

export type Grid = readonly (readonly ColorIndex[])[];

export interface BoardState {
	readonly size: number;
	readonly colorCount: number;
	readonly activeColors: readonly ColorIndex[];
	readonly grid: Grid;
	readonly moves: number;
	readonly maxMoves: number;
	readonly currentColor: ColorIndex;
	readonly floodedCluster: ReadonlySet<string>;
	readonly floodPercentage: number;
	readonly isWon: boolean;
	readonly isLost: boolean;
	readonly seed: number;
}

export interface GameSnapshot {
	readonly difficulty: Difficulty;
	readonly size: number;
	readonly colorCount: number;
	readonly grid: ColorIndex[][];
	readonly moves: number;
	readonly maxMoves: number;
	readonly seed: number;
	readonly history: ColorIndex[];
	readonly timestamp: number;
	readonly undoUsed?: boolean;
}
