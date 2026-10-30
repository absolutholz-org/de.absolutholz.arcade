import { type GameStorage, createGameStorage } from '../createGameStorage.js';
import type { AggregatedGameStats, GameSessionResult, HubGlobalStats } from './types.js';

export const STATS_UPDATED_EVENT = 'arcade:stats-updated';
export const AGGREGATED_STATS_STORAGE_KEY = 'aggregated_stats';

export const DEFAULT_REGISTERED_GAMES: readonly string[] = [
	'sudoku',
	'nonogram',
	'minesweeper',
	'queens',
	'bridges',
	'tracks',
	'tents',
	'anagram',
	'watersort',
];

/**
 * Creates empty aggregated stats for a game identifier.
 */
export function createInitialAggregatedGameStats(gameId: string): AggregatedGameStats {
	return {
		gameId,
		totalPlayed: 0,
		totalWon: 0,
		winRate: 0,
		totalTimeMs: 0,
		bestTimeMs: undefined,
		currentStreak: 0,
		maxStreak: 0,
		lastPlayed: null,
	};
}

/**
 * Pure reducer calculating next AggregatedGameStats from previous state and a session outcome.
 */
export function updateAggregatedGameStats(prev: AggregatedGameStats, result: GameSessionResult): AggregatedGameStats {
	const totalPlayed = prev.totalPlayed + 1;
	const totalWon = prev.totalWon + (result.won ? 1 : 0);
	const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;
	const totalTimeMs = prev.totalTimeMs + Math.max(0, result.durationMs);

	let bestTimeMs = prev.bestTimeMs;
	if (result.won) {
		bestTimeMs = prev.bestTimeMs !== undefined ? Math.min(prev.bestTimeMs, result.durationMs) : result.durationMs;
	}

	const currentStreak = result.won ? prev.currentStreak + 1 : 0;
	const maxStreak = Math.max(prev.maxStreak, currentStreak);
	const lastPlayed = result.timestamp;

	return {
		gameId: result.gameId,
		totalPlayed,
		totalWon,
		winRate,
		totalTimeMs,
		bestTimeMs,
		currentStreak,
		maxStreak,
		lastPlayed,
	};
}

/**
 * Retrieves the aggregated statistics for a specific game, falling back to legacy ADR 0008 storage if present.
 */
export async function getGameStats(gameId: string, customStorage?: GameStorage): Promise<AggregatedGameStats> {
	const storage = customStorage ?? createGameStorage(gameId);

	// 1. Check scoped storage for aggregated stats
	let stats = await storage.get<AggregatedGameStats>(AGGREGATED_STATS_STORAGE_KEY);

	// 2. Check localStorage for alternative key names
	if (!stats && typeof window !== 'undefined' && window.localStorage) {
		const altKeys = [`arcade:stats:${gameId}`, `arcade::${gameId}::aggregated_stats`, `arcade:stats_${gameId}`];
		for (const key of altKeys) {
			const raw = window.localStorage.getItem(key);
			if (raw) {
				try {
					stats = JSON.parse(raw) as AggregatedGameStats;
					break;
				} catch {
					// Ignore invalid JSON
				}
			}
		}
	}

	// 3. Fallback to ADR 0008 telemetry (arcade::[gameId]::stats) if available
	if (!stats || stats.totalPlayed === 0) {
		try {
			const rawAdrStats = await storage.get<{
				overall?: {
					gamesPlayed?: number;
					gamesWon?: number;
					totalPlayTimeSeconds?: number;
					bestTimeSeconds?: number | null;
					currentStreak?: number;
					bestStreak?: number;
				};
				updatedAt?: number;
			}>('stats');

			if (rawAdrStats?.overall && (rawAdrStats.overall.gamesPlayed ?? 0) > 0) {
				const overall = rawAdrStats.overall;
				const played = overall.gamesPlayed ?? 0;
				const won = overall.gamesWon ?? 0;
				stats = {
					gameId,
					totalPlayed: played,
					totalWon: won,
					winRate: played > 0 ? Math.round((won / played) * 100) : 0,
					totalTimeMs: (overall.totalPlayTimeSeconds ?? 0) * 1000,
					bestTimeMs: overall.bestTimeSeconds != null ? overall.bestTimeSeconds * 1000 : undefined,
					currentStreak: overall.currentStreak ?? 0,
					maxStreak: overall.bestStreak ?? 0,
					lastPlayed: rawAdrStats.updatedAt ?? null,
				};
			}
		} catch {
			// Ignore ADR 0008 read errors
		}
	}

	return stats ?? createInitialAggregatedGameStats(gameId);
}

/**
 * Records a completed game session, aggregates metrics, persists to storage,
 * and broadcasts the standard 'arcade:stats-updated' event.
 */
export async function recordGameSession(
	result: GameSessionResult,
	customStorage?: GameStorage,
): Promise<AggregatedGameStats> {
	const current = await getGameStats(result.gameId, customStorage);
	const updated = updateAggregatedGameStats(current, result);

	const storage = customStorage ?? createGameStorage(result.gameId);
	await storage.set(AGGREGATED_STATS_STORAGE_KEY, updated);

	// Mirror to localStorage for synchronous access and cross-tab storage events
	if (typeof window !== 'undefined' && window.localStorage) {
		try {
			const serialized = JSON.stringify(updated);
			window.localStorage.setItem(`arcade:stats:${result.gameId}`, serialized);
			window.localStorage.setItem(`arcade::${result.gameId}::aggregated_stats`, serialized);
		} catch {
			// Ignore storage write issues
		}
	}

	// Dispatch custom event for reactive in-app re-renders
	if (typeof window !== 'undefined') {
		const detail = { gameId: result.gameId, result };
		window.dispatchEvent(new CustomEvent(STATS_UPDATED_EVENT, { detail }));
	}

	return updated;
}

/**
 * Aggregates statistics across all registered arcade games.
 */
export async function getGlobalStats(
	gameIds: readonly string[] = DEFAULT_REGISTERED_GAMES,
	customStorageResolver?: (gameId: string) => GameStorage,
): Promise<HubGlobalStats> {
	const gamesRecord: Record<string, AggregatedGameStats> = {};
	let totalGamesPlayed = 0;
	let totalGamesWon = 0;
	let totalPlayTimeMs = 0;

	for (const id of gameIds) {
		const storage = customStorageResolver ? customStorageResolver(id) : undefined;
		const gameStats = await getGameStats(id, storage);
		gamesRecord[id] = gameStats;
		totalGamesPlayed += gameStats.totalPlayed;
		totalGamesWon += gameStats.totalWon;
		totalPlayTimeMs += gameStats.totalTimeMs;
	}

	return {
		totalGamesPlayed,
		totalGamesWon,
		totalPlayTimeMs,
		games: gamesRecord,
	};
}

/**
 * Subscribes to stats updates from custom events and cross-tab storage changes.
 */
export function subscribeToStatsUpdated(listener: (detail?: { gameId?: string }) => void): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const handler = (event: Event) => {
		const customEvent = event as CustomEvent<{ gameId?: string }>;
		listener(customEvent.detail);
	};

	const storageHandler = (event: StorageEvent) => {
		if (!event.key) return;
		if (event.key.includes('stats')) {
			let gameId: string | undefined;
			if (event.key.startsWith('arcade:stats:')) {
				gameId = event.key.slice('arcade:stats:'.length);
			} else if (event.key.startsWith('arcade::') && event.key.includes('::')) {
				gameId = event.key.split('::')[1];
			}
			listener({ gameId });
		}
	};

	window.addEventListener(STATS_UPDATED_EVENT, handler);
	window.addEventListener('storage', storageHandler);

	return () => {
		window.removeEventListener(STATS_UPDATED_EVENT, handler);
		window.removeEventListener('storage', storageHandler);
	};
}
