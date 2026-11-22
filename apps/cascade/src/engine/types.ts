export const PERFECT_CLEAR_BONUS = 1000;
export const MEGA_CLUSTER_THRESHOLD = 10;

export type TileColor = 0 | 1 | 2 | 3 | 4;

export type Difficulty = 'beginner' | 'easy' | 'normal' | 'hard' | 'expert';

export const DIFFICULTIES: readonly Difficulty[] = ['beginner', 'easy', 'normal', 'hard', 'expert'] as const;

export interface DifficultyConfig {
	readonly id: Difficulty;
	readonly colorCount: 3 | 4 | 5;
	readonly cols: number;
	readonly rows: number;
}

export const DIFFICULTY_CONFIGS: Readonly<Record<Difficulty, DifficultyConfig>> = {
	beginner: { id: 'beginner', colorCount: 3, cols: 5, rows: 5 },
	easy: { id: 'easy', colorCount: 3, cols: 10, rows: 5 },
	normal: { id: 'normal', colorCount: 3, cols: 15, rows: 10 },
	hard: { id: 'hard', colorCount: 4, cols: 15, rows: 10 },
	expert: { id: 'expert', colorCount: 4, cols: 20, rows: 15 },
};

export interface Tile {
	readonly id: number;
	readonly color: TileColor;
}

/** 2D grid indexed as board[row][col], where row 0 is top and row (ROWS - 1) is bottom. */
export type Board = (Tile | null)[][];

export interface CellCoord {
	readonly row: number;
	readonly col: number;
}

export interface RemovedTileInfo {
	readonly id: number;
	readonly color: TileColor;
	readonly row: number;
	readonly col: number;
}

export interface MoveResult {
	readonly board: Board;
	readonly removedTiles: readonly RemovedTileInfo[];
	readonly clusterSize: number;
	readonly pointsAwarded: number;
	readonly perfectClearBonus: number;
	readonly remainingTiles: number;
	readonly isGameOver: boolean;
	readonly isPerfectClear: boolean;
	readonly orphanTiles: readonly CellCoord[];
}

export interface GameStateSnapshot {
	readonly board: Board;
	readonly score: number;
	readonly movesCount: number;
	readonly maxClusterCleared: number;
	readonly remainingTiles: number;
}

export interface GameSnapshot {
	readonly difficulty: Difficulty;
	readonly seed: number;
	readonly board: Board;
	readonly score: number;
	readonly movesCount: number;
	readonly undosUsed: number;
	readonly maxClusterCleared: number;
	readonly elapsedSeconds: number;
	readonly status: 'playing' | 'paused' | 'completed';
	readonly history: readonly GameStateSnapshot[];
	readonly historyIndex: number;
	readonly savedAt: number;
}

export interface CascadeSettings extends Record<string, unknown> {
	showTileSymbols: boolean;
	showHoverPreview: boolean;
}

export const DEFAULT_CASCADE_SETTINGS: CascadeSettings = {
	showTileSymbols: true,
	showHoverPreview: false,
};
