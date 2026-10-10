export type DifficultyId = 'easy' | 'medium' | 'hard';

export type CellState = 'empty' | 'filled' | 'crossed';

export type GameStatus = 'not_started' | 'playing' | 'paused' | 'won';

export type InteractionMode = 'fill' | 'cross';

export interface BoardCell {
	id: string;
	col: number;
	row: number;
	state: CellState;
}

export interface NonogramPuzzle {
	id: string;
	titleKey: string;
	difficulty: DifficultyId;
	width: number;
	height: number;
	color: string;
	grid: number[];
	rowClues: number[][];
	colClues: number[][];
}

export interface NonogramSettings {
	autoCross: boolean;
}

export const DEFAULT_NONOGRAM_SETTINGS: NonogramSettings = {
	autoCross: false,
};

export interface MoveAction {
	col: number;
	row: number;
	previousState: CellState;
	nextState: CellState;
}

export interface StrokeHistory {
	actions: MoveAction[];
}

export interface GameSnapshot {
	puzzleId: string;
	cells: CellState[];
	elapsedSeconds: number;
	moves: number;
	status: GameStatus;
}

export interface PuzzleRecord {
	puzzleId: string;
	solved: boolean;
	bestTime: number;
	bestMoves: number;
	timestamp: string;
}
