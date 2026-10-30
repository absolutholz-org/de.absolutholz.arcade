/**
 * TypeScript schemas for cross-game session telemetry and aggregation.
 */

export interface GameSessionResult {
	gameId: string;
	timestamp: number;
	durationMs: number;
	won: boolean;
	difficulty?: string;
	hintsUsed?: number;
	mistakes?: number;
}

export interface AggregatedGameStats {
	gameId: string;
	totalPlayed: number;
	totalWon: number;
	winRate: number;
	totalTimeMs: number;
	bestTimeMs?: number;
	currentStreak: number;
	maxStreak: number;
	lastPlayed: number | null;
}

export interface HubGlobalStats {
	totalGamesPlayed: number;
	totalGamesWon: number;
	totalPlayTimeMs: number;
	games: Record<string, AggregatedGameStats>;
}
