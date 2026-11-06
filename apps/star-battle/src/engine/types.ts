export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'expert'] as const;

export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

export const GRID_SIZES: Record<Difficulty, number> = {
	easy: 6,
	medium: 8,
	hard: 10,
	expert: 12,
};

export type CellState = 'empty' | 'mark' | 'token';

export type InputMode = 'mark' | 'token';

export interface CellCoord {
	row: number;
	col: number;
}

export interface CellConflict {
	row?: boolean;
	col?: boolean;
	region?: boolean;
	adjacency?: boolean;
}

/** A star position as `[row, col]`. */
export type StarPlacement = [number, number];
export type QueenPlacement = StarPlacement;

export interface StarBattlePuzzle {
	id: string;
	difficulty: Difficulty;
	size: number;
	regions: number[][];
	solution: StarPlacement[];
}

export type QueensPuzzle = StarBattlePuzzle;

export type MoveAction =
	| {
			type: 'setCell';
			row: number;
			col: number;
			prev: CellState;
			next: CellState;
			autoCrossed?: { row: number; col: number; prev: CellState }[];
	  }
	| {
			type: 'dragBatch';
			cells: { row: number; col: number; prev: CellState; next: CellState }[];
	  }
	| {
			type: 'reset';
			board: CellState[][];
	  };

export interface GameSettings {
	autoCross: boolean;
	defaultMode: InputMode;
}

export const DEFAULT_SETTINGS: GameSettings = {
	autoCross: true,
	defaultMode: 'mark',
};

export interface PuzzleProgress {
	completed: boolean;
	bestTime?: number;
	lastPlayed?: number;
}

export type ProgressMap = Record<string, PuzzleProgress>;

export interface GameSnapshot {
	puzzleId: string;
	difficulty: Difficulty;
	size: number;
	board: CellState[][];
	elapsedSeconds: number;
	history: MoveAction[];
	redoStack: MoveAction[];
	isComplete: boolean;
	inputMode: InputMode;
	puzzleDefinition?: StarBattlePuzzle;
}
