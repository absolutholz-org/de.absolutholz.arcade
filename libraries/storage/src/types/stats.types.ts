/**
 * Canonical identifiers for games in the Arcade monorepo.
 */
export type GameId =
	| 'sudoku'
	| 'minesweeper'
	| 'nonogram'
	| 'star-battle'
	| 'bridges'
	| 'tracks'
	| 'tents'
	| 'anagram'
	| 'liquid-sort'
	| 'untangle'
	| 'net'
	| 'color-flood'
	| 'dice-bingo'
	| 'pentominoes'
	| 'tictactoe'
	| (string & {});

/**
 * Recorded entry for one of a player's fastest completed runs.
 */
export interface FastestRunEntry {
	readonly playTimeSeconds: number;
	readonly timestamp: number;
	readonly bucketKey?: string;
}

/**
 * Recorded entry for one of a player's top high scores.
 */
export interface TopScoreEntry {
	readonly score: number;
	readonly timestamp: number;
	readonly bucketKey?: string;
}

/**
 * Statistics tracked within a specific difficulty bucket or overall.
 * Adheres to ADR 0008.
 */
export interface DifficultyBucketStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly gamesLost: number;
	readonly currentStreak: number;
	readonly bestStreak: number;
	readonly bestTimeSeconds: number | null;
	readonly totalPlayTimeSeconds: number;
	readonly bestMoves?: number | null;
	readonly bestScore?: number | null;
	readonly bestCluster?: number | null;
	readonly flawlessWins: number;
	readonly fastestRuns?: readonly FastestRunEntry[];
	readonly topScores?: readonly TopScoreEntry[];
}

/**
 * Universal game statistics document adhering to ADR 0008.
 * Stored under `arcade::[gameId]::stats`.
 */
export interface GameStats<
	TBucketKey extends string = string,
	TCustomMetrics extends Record<string, number> = Record<string, number>,
> {
	readonly schemaVersion: 1;
	readonly gameId: GameId;
	readonly updatedAt: number;
	readonly overall: DifficultyBucketStats;
	readonly byBucket: Partial<Record<TBucketKey, DifficultyBucketStats>>;
	readonly lifetimeMetrics: TCustomMetrics;
}

/**
 * Input payload capturing telemetry from a completed round.
 */
export interface RoundStatsInput<TCustomMetrics extends Record<string, number> = Record<string, number>> {
	readonly gameId: GameId;
	readonly won: boolean;
	readonly bucketKey?: string;
	readonly playTimeSeconds: number;
	readonly moves?: number;
	readonly score?: number;
	readonly bestCluster?: number;
	readonly isFlawless?: boolean;
	readonly customMetrics?: TCustomMetrics;
}
