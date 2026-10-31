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

export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'veryHard' | 'insane' | 'inhuman' | 'expert';

export interface SudokuDifficultyStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly bestTimeSeconds: number | null;
	readonly currentStreak: number;
	readonly bestStreak: number;
}

export interface SudokuCustomStats {
	readonly difficulties: Record<SudokuDifficulty, SudokuDifficultyStats>;
	readonly completedPresetIds?: string[];
	readonly completedPresetsWithoutHints?: string[];
}

export interface NonogramPuzzleRecord {
	readonly completed: boolean;
	readonly bestTimeSeconds: number | null;
	readonly completedWithoutErrors: boolean;
	readonly difficulty?: string;
	readonly size?: string;
}

export interface NonogramCustomStats {
	readonly puzzles: Record<string, NonogramPuzzleRecord>;
	readonly completedEasyPuzzles?: string[];
	readonly completedMediumPuzzles?: string[];
	readonly completedHardPuzzles?: string[];
	readonly currentMediumStreak?: number;
	readonly currentHardStreak?: number;
	readonly bestMediumStreak?: number;
	readonly bestHardStreak?: number;
}

export type MinesweeperDifficulty = 'simple' | 'medium' | 'hard' | 'expert' | 'beginner' | 'intermediate';

export interface MinesweeperDifficultyStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly bestTimeSeconds: number | null;
	readonly currentStreak: number;
	readonly bestStreak: number;
}

export interface MinesweeperCustomStats {
	readonly difficulties: Record<MinesweeperDifficulty, MinesweeperDifficultyStats>;
	readonly lifetimeSafeTilesCleared?: number;
	readonly currentLossStreak?: number;
}

export interface QueensCustomStats {
	readonly boards: Record<string, { completed: boolean; bestTimeSeconds: number | null }>;
	readonly completedPresetIds?: string[];
	readonly currentMediumStreak?: number;
	readonly currentHardStreak?: number;
	readonly bestMediumStreak?: number;
	readonly bestHardStreak?: number;
}

export interface TracksCustomStats {
	readonly grids: Record<string, { completed: boolean; bestTimeSeconds: number | null }>;
	readonly completedPresetIds?: string[];
	readonly currentMediumStreak?: number;
	readonly currentHardStreak?: number;
	readonly bestMediumStreak?: number;
	readonly bestHardStreak?: number;
}

export type BridgesDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface BridgesDifficultyStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly bestTimeSeconds: number | null;
	readonly currentStreak: number;
	readonly bestStreak: number;
}

export interface BridgesCustomStats {
	readonly difficulties: Record<BridgesDifficulty, BridgesDifficultyStats>;
	readonly completedPresetIds?: string[];
	readonly currentMediumStreak?: number;
	readonly currentHardStreak?: number;
	readonly bestMediumStreak?: number;
	readonly bestHardStreak?: number;
}

export type TentsDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface TentsDifficultyStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly bestTimeSeconds: number | null;
	readonly currentStreak: number;
	readonly bestStreak: number;
}

export interface TentsCustomStats {
	readonly difficulties?: Record<TentsDifficulty, TentsDifficultyStats>;
	readonly completedPresetIds?: string[];
	readonly totalTentsPitched?: number;
	readonly currentMediumStreak?: number;
	readonly currentHardStreak?: number;
	readonly bestMediumStreak?: number;
	readonly bestHardStreak?: number;
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
	bridges: BridgesCustomStats;
	tents: TentsCustomStats;
	anagram: AnagramCustomStats;
	watersort: WaterSortCustomStats;
	untangle: UntangleCustomStats;
}

export interface UntangleCustomStats {
	readonly easyWins?: number;
	readonly mediumWins?: number;
	readonly hardWins?: number;
	readonly winsWithoutUndo?: number;
}

export interface WaterSortCustomStats {
	readonly easyWins?: number;
	readonly mediumWins?: number;
	readonly hardWins?: number;
	readonly expertWins?: number;
	readonly winsWithoutUndo?: number;
	readonly moves?: number;
	readonly hintsUsed?: number;
	readonly undosUsed?: number;
	readonly parMoves?: number;
	readonly maxConsecutiveTubeCompletions?: number;
	readonly emptyBuffersUsed?: number;
}

export interface AnagramCustomStats {
	readonly totalWordsFound?: number;
	readonly expertWins?: number;
	readonly moves?: number;
	readonly hintsUsed?: number;
	readonly undosUsed?: number;
	readonly languagesPlayed?: Record<string, number>;
	readonly expertLanguagesWon?: readonly string[];
}

export type GameId = keyof GameCustomStatsMap;
