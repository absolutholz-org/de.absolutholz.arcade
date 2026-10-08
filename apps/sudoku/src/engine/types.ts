export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'veryHard', 'insane', 'inhuman'] as const;

export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

export const TARGET_CLUE_COUNTS: Record<Difficulty, number> = {
	easy: 38,
	medium: 32,
	hard: 28,
	veryHard: 25,
	insane: 23,
	inhuman: 21,
};

export interface CellCoord {
	row: number;
	col: number;
}

export interface CellState {
	row: number;
	col: number;
	block: number;
	value: number | null;
	isClue: boolean;
	notes: boolean[];
}

export type SudokuGrid = CellState[][];

export type MoveAction =
	| {
			type: 'setValue';
			row: number;
			col: number;
			prevValue: number | null;
			nextValue: number | null;
			clearedOwnNotes?: boolean;
			prevNotes?: boolean[];
			autoClearedNotes?: { row: number; col: number; digit: number }[];
	  }
	| {
			type: 'clearValue';
			row: number;
			col: number;
			prevValue: number | null;
			prevNotes: boolean[];
	  }
	| {
			type: 'toggleNote';
			row: number;
			col: number;
			digit: number;
			prevValue: boolean;
			nextValue: boolean;
	  }
	| {
			type: 'clearNotes';
			row: number;
			col: number;
			prevNotes: boolean[];
	  };

export type KeypadLayoutMode = 'auto' | 'grid' | 'row';

export interface GameSettings {
	highlightPeerCells: boolean;
	highlightPeerDigits: boolean;
	highlightErrors: boolean;
	autoClearNotes: boolean;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
	highlightPeerCells: true,
	highlightPeerDigits: true,
	highlightErrors: true,
	autoClearNotes: false,
};

export interface GameSnapshot {
	difficulty: Difficulty;
	puzzle: SudokuGrid;
	solution: number[][];
	elapsedSeconds: number;
	history: MoveAction[];
	redoStack: MoveAction[];
	isPaused: boolean;
	isComplete: boolean;
}

export interface DifficultyStats {
	gamesPlayed: number;
	gamesWon: number;
	bestTimeSeconds: number | null;
}

export type SudokuStats = Record<Difficulty, DifficultyStats>;

export const INITIAL_DIFFICULTY_STATS: DifficultyStats = {
	gamesPlayed: 0,
	gamesWon: 0,
	bestTimeSeconds: null,
};

export const INITIAL_SUDOKU_STATS: SudokuStats = {
	easy: { ...INITIAL_DIFFICULTY_STATS },
	medium: { ...INITIAL_DIFFICULTY_STATS },
	hard: { ...INITIAL_DIFFICULTY_STATS },
	veryHard: { ...INITIAL_DIFFICULTY_STATS },
	insane: { ...INITIAL_DIFFICULTY_STATS },
	inhuman: { ...INITIAL_DIFFICULTY_STATS },
};
