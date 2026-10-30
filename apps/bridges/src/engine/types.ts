export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface Island {
	id: string;
	x: number;
	y: number;
	target: number;
}

export type BridgeOrientation = 'horizontal' | 'vertical';

export interface Bridge {
	id: string;
	fromId: string;
	toId: string;
	count: 1 | 2;
	orientation: BridgeOrientation;
}

export interface BoardState {
	islands: Island[];
	bridges: Bridge[];
	difficulty: DifficultyLevel;
	width: number;
	height: number;
}

export type IslandStatus = 'under' | 'satisfied' | 'overflow';

export interface IslandEvaluation {
	status: IslandStatus;
	current: number;
	target: number;
}

export interface HistoryState {
	past: BoardState[];
	present: BoardState;
	future: BoardState[];
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['beginner', 'easy', 'medium', 'hard', 'expert'];

export const DIFFICULTY_GRID_SIZES: Record<DifficultyLevel, { width: number; height: number }> = {
	beginner: { width: 6, height: 6 },
	easy: { width: 8, height: 8 },
	medium: { width: 10, height: 10 },
	hard: { width: 14, height: 14 },
	expert: { width: 18, height: 18 },
};

export interface HashiSettings {
	zenMode?: boolean;
	gameMode: 'standard' | 'zen';
	highlightSatisfied: boolean;
	highlightOverflow: boolean;
}

export const DEFAULT_SETTINGS: HashiSettings = {
	zenMode: false,
	gameMode: 'standard',
	highlightSatisfied: true,
	highlightOverflow: true,
};

export interface GameSnapshot {
	puzzleId: string;
	difficulty: DifficultyLevel;
	islands: Island[];
	bridges: Bridge[];
	elapsedSeconds: number;
	isComplete: boolean;
	lastPlayed: number;
}

export interface ProgressRecord {
	completed: boolean;
	bestTime?: number;
	lastPlayed: number;
}

export type ProgressMap = Record<string, ProgressRecord>;
