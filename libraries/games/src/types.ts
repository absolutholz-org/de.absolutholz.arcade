/**
 * Canonical identifiers for all games in the Arcade monorepo.
 */
export type GameId =
	| 'sudoku'
	| 'minesweeper'
	| 'nonogram'
	| 'queens'
	| 'bridges'
	| 'tracks'
	| 'tents'
	| 'anagram'
	| 'watersort';

/**
 * Visual and media assets associated with a game.
 */
export interface GameAssets {
	/**
	 * Primary emoji icon representing the game (e.g. 🔢, 💣, 🎨, 👑, 🌉, 🚂).
	 * Used for offline lists, badges, and quick teaser previews.
	 */
	readonly icon: string;
	/**
	 * Path or identifier for hero banner artwork.
	 */
	readonly heroImage?: string;
	/**
	 * Path or identifier for thematic background or wallpaper patterns.
	 */
	readonly backgroundImage?: string;
}

/**
 * Definition representing a game in the Arcade monorepo.
 */
export interface GameDefinition {
	/**
	 * Unique identifier matching the game's route segment and storage namespace.
	 */
	readonly id: GameId;
	/**
	 * Default fallback display name.
	 */
	readonly name: string;
	/**
	 * Root route for the game application.
	 */
	readonly route: `/${GameId}`;
	/**
	 * Visual assets representing the game.
	 */
	readonly assets: GameAssets;
	/**
	 * Translation namespace in `@arcade/lib-i18n`.
	 */
	readonly i18nNamespace: GameId;
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
	readonly flawlessWins: number;
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
	readonly isFlawless?: boolean;
	readonly customMetrics?: TCustomMetrics;
}
