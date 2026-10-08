export type FieldState = 'unexplored' | 'revealed' | 'flagged' | 'questioned' | 'detonated';

export interface Cell {
	id: string;
	col: number;
	row: number;
	mine: boolean;
	state: FieldState;
	nearMineCount: number;
}

export type BoardSizeId = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BoardSizeConfig {
	id: BoardSizeId;
	columns: number;
	rows: number;
	fieldCount: number;
}

export const BOARD_SIZES: Record<BoardSizeId, BoardSizeConfig> = {
	xs: { id: 'xs', columns: 5, rows: 5, fieldCount: 25 },
	sm: { id: 'sm', columns: 7, rows: 7, fieldCount: 49 },
	md: { id: 'md', columns: 9, rows: 9, fieldCount: 81 },
	lg: { id: 'lg', columns: 11, rows: 11, fieldCount: 121 },
	xl: { id: 'xl', columns: 12, rows: 12, fieldCount: 144 },
};

export const BOARD_SIZE_LIST: BoardSizeConfig[] = [
	BOARD_SIZES.xs,
	BOARD_SIZES.sm,
	BOARD_SIZES.md,
	BOARD_SIZES.lg,
	BOARD_SIZES.xl,
];

export type DifficultyId = 'simple' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
	id: DifficultyId;
	mineRatio: number;
}

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
	simple: { id: 'simple', mineRatio: 0.1 },
	medium: { id: 'medium', mineRatio: 0.15 },
	hard: { id: 'hard', mineRatio: 0.2 },
	expert: { id: 'expert', mineRatio: 0.25 },
};

export const DIFFICULTY_LIST: DifficultyConfig[] = [
	DIFFICULTIES.simple,
	DIFFICULTIES.medium,
	DIFFICULTIES.hard,
	DIFFICULTIES.expert,
];

export function getMineCount(fieldCount: number, difficulty: DifficultyId): number {
	const config = DIFFICULTIES[difficulty] ?? DIFFICULTIES.medium;
	return Math.max(1, Math.round(fieldCount * config.mineRatio));
}

export type GameStatus = 'not_started' | 'playing' | 'paused' | 'won' | 'lost';

export interface MinesweeperSettings {
	questionMarks: boolean;
	firstClickSafe: boolean;
	fitToScreen: boolean;
}

export const DEFAULT_MINESWEEPER_SETTINGS: MinesweeperSettings = {
	questionMarks: false,
	firstClickSafe: true,
	fitToScreen: true,
};

export interface HighScoreEntry {
	id: string;
	seconds: number;
	size: BoardSizeId;
	difficulty: DifficultyId;
	fields: number;
	mines: number;
	timestamp: string;
}

export interface GameSnapshot {
	size: BoardSizeId;
	difficulty: DifficultyId;
	columns: number;
	rows: number;
	cells: Cell[];
	mineCount: number;
	elapsedSeconds: number;
	minesPlaced: boolean;
	status: GameStatus;
}
