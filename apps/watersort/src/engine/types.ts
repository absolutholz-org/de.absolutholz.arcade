export const TUBE_CAPACITY = 4;

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'expert'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_CONFIG: Record<DifficultyLevel, { readonly colorCount: number; readonly emptyTubes: number }> =
	{
		easy: { colorCount: 4, emptyTubes: 2 },
		medium: { colorCount: 6, emptyTubes: 2 },
		hard: { colorCount: 8, emptyTubes: 2 },
		expert: { colorCount: 10, emptyTubes: 2 },
	};

export type ColorId = number;

/** Segments ordered from the bottom (index 0) to the open top of the tube. */
export type Tube = readonly ColorId[];
export type Board = readonly Tube[];

export interface Move {
	readonly from: number;
	readonly to: number;
}

export interface HistoryState {
	readonly past: readonly Board[];
	readonly present: Board;
	readonly future: readonly Board[];
}

export interface GameSnapshot {
	readonly difficulty: DifficultyLevel;
	readonly seed: number;
	readonly history: HistoryState;
	readonly moves: number;
	readonly elapsedSeconds: number;
	readonly hintsUsed: number;
	readonly undosUsed: number;
	readonly parMoves?: number;
	readonly maxConsecutiveTubeCompletions?: number;
	readonly usedBufferTubes?: readonly number[];
	readonly isComplete?: boolean;
}

export interface PuzzleProgress {
	readonly completed: boolean;
	readonly bestTime?: number;
	readonly bestMoves?: number;
	readonly lastPlayed: number;
}

export type ProgressMap = Record<string, PuzzleProgress>;
