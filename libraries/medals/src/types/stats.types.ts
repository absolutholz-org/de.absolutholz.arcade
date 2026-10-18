/**
 * Universal Base Stats tracked across all arcade games.
 * Stored as aggregates to respect GDPR data minimization (ADR 0004).
 */
export interface BaseGameStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly totalPlayTimeSeconds: number;
	readonly currentStreak: number;
	readonly bestStreak: number;
	readonly lastPlayedAt: number;
}

export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuDifficultyStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly bestTimeSeconds: number | null;
	readonly currentStreak: number;
	readonly bestStreak: number;
}

export interface SudokuCustomStats {
	readonly difficulties: Record<SudokuDifficulty, SudokuDifficultyStats>;
}

export interface NonogramPuzzleRecord {
	readonly completed: boolean;
	readonly bestTimeSeconds: number | null;
	readonly completedWithoutErrors: boolean;
}

export interface NonogramCustomStats {
	readonly puzzles: Record<string, NonogramPuzzleRecord>;
}

export type MinesweeperDifficulty = 'beginner' | 'intermediate' | 'expert';

export interface MinesweeperDifficultyStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly bestTimeSeconds: number | null;
	readonly currentStreak: number;
	readonly bestStreak: number;
}

export interface MinesweeperCustomStats {
	readonly difficulties: Record<MinesweeperDifficulty, MinesweeperDifficultyStats>;
}

export interface QueensCustomStats {
	readonly boards: Record<string, { completed: boolean; bestTimeSeconds: number | null }>;
}

export interface TracksCustomStats {
	readonly grids: Record<string, { completed: boolean; bestTimeSeconds: number | null }>;
}

/**
 * Game-to-Custom-Stats mapping registry.
 * Strictly maps every game to its strongly typed custom state.
 */
export interface GameCustomStatsMap {
	sudoku: SudokuCustomStats;
	nonogram: NonogramCustomStats;
	minesweeper: MinesweeperCustomStats;
	queens: QueensCustomStats;
	tracks: TracksCustomStats;
}

export type GameId = keyof GameCustomStatsMap;
