export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'] as const;

export const DIFFICULTY_GRID_SIZES: Record<DifficultyLevel, { width: number; height: number; defaultTents: number }> = {
	easy: { width: 6, height: 6, defaultTents: 5 },
	medium: { width: 8, height: 8, defaultTents: 8 },
	hard: { width: 10, height: 10, defaultTents: 12 },
	expert: { width: 12, height: 12, defaultTents: 18 },
};

export type FixedCellType = 'empty' | 'tree';
export type PlayerMark = 'none' | 'tent' | 'grass';

export interface CellCoord {
	row: number;
	col: number;
}

export interface CellState {
	fixed: FixedCellType;
	mark: PlayerMark;
}

export interface PuzzleDefinition {
	id: string;
	difficulty: DifficultyLevel;
	size: number;
	trees: CellCoord[];
	rowClues: number[];
	colClues: number[];
	solution?: CellCoord[];
}

export interface BoardState {
	id: string;
	difficulty: DifficultyLevel;
	size: number;
	trees: CellCoord[];
	rowClues: number[];
	colClues: number[];
	grid: CellState[][];
}

export type LineStatus = 'under' | 'satisfied' | 'overflow';

export interface LineEvaluation {
	current: number;
	target: number;
	status: LineStatus;
}

export interface BoardEvaluation {
	rows: LineEvaluation[];
	cols: LineEvaluation[];
	satisfiedLines: number;
	totalLines: number;
	touchingTents: Set<string>;
	unpairedTents: Set<string>;
	unpairedTrees: Set<string>;
	treeToTentMatching: Map<string, string>;
	isBipartitePerfect: boolean;
	isSolved: boolean;
}

export interface HistoryState {
	past: BoardState[];
	present: BoardState;
	future: BoardState[];
	grassPlacedCount: number;
	moveCount: number;
}

export interface TentsSettings {
	autoGrass: boolean;
	highlightViolations: boolean;
	highlightClues: boolean;
}

export const DEFAULT_SETTINGS: TentsSettings = {
	autoGrass: false,
	highlightViolations: true,
	highlightClues: true,
};

export interface PuzzleProgress {
	completed: boolean;
	bestTime?: number;
	lastPlayed?: number;
}

export type ProgressMap = Record<string, PuzzleProgress>;

export interface GameSnapshot {
	puzzleId: string;
	difficulty: DifficultyLevel;
	size: number;
	board: BoardState;
	elapsedSeconds: number;
	grassPlacedCount: number;
	moveCount: number;
	isComplete: boolean;
	lastPlayed: number;
	puzzleDefinition?: PuzzleDefinition;
}
