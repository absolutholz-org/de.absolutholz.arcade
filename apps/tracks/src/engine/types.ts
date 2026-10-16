export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'];

export const DIFFICULTY_GRID_SIZES: Record<DifficultyLevel, { width: number; height: number }> = {
	easy: { width: 6, height: 6 },
	medium: { width: 8, height: 8 },
	hard: { width: 8, height: 8 },
	expert: { width: 10, height: 10 },
};

export type Direction = 'N' | 'E' | 'S' | 'W';

export type TrackType = 'straight-h' | 'straight-v' | 'curve-ne' | 'curve-nw' | 'curve-se' | 'curve-sw';

export type CellState = 'empty' | 'cross' | 'candidate' | TrackType;

export type InputMode = 'track' | 'cross';

export interface GateCoord {
	row: number;
	col: number;
	side: Direction;
}

export interface FixedCell {
	row: number;
	col: number;
	track: TrackType;
}

export interface PathStep {
	row: number;
	col: number;
	track: TrackType;
	enterFrom: Direction;
	exitTo: Direction;
}

export interface StaticPuzzleDefinition {
	id: string;
	difficulty: DifficultyLevel;
	size: number;
	rowClues: number[];
	colClues: number[];
	start: GateCoord;
	end: GateCoord;
	fixedCells: FixedCell[];
	solution: PathStep[];
}

export interface BoardState {
	difficulty: DifficultyLevel;
	size: number;
	rowClues: number[];
	colClues: number[];
	start: GateCoord;
	end: GateCoord;
	fixedCells: FixedCell[];
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
	isComplete: boolean;
	orderedPath: PathStep[];
	errorCells: Set<string>;
}

export interface HistoryState {
	past: BoardState[];
	present: BoardState;
	future: BoardState[];
}

export interface TracksSettings {
	gameMode: 'standard' | 'casual';
	highlightClues: boolean;
	autoCross: boolean;
}

export const DEFAULT_SETTINGS: TracksSettings = {
	gameMode: 'standard',
	highlightClues: true,
	autoCross: false,
};

export const MAX_MISTAKES = 3;

export interface GameSnapshot {
	puzzleId: string;
	difficulty: DifficultyLevel;
	grid: CellState[][];
	elapsedSeconds: number;
	movesCount: number;
	mistakes: number;
	isComplete: boolean;
	lastPlayed: number;
	puzzleDefinition?: StaticPuzzleDefinition;
}

interface ProgressRecord {
	completed: boolean;
	bestTime?: number;
	bestMoves?: number;
	lastPlayed: number;
}

export type ProgressMap = Record<string, ProgressRecord>;
