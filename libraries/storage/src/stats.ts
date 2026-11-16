import { createGameStorage } from './createGameStorage.js';
import {
	AGGREGATED_STATS_STORAGE_KEY,
	DEFAULT_REGISTERED_GAMES,
	STATS_UPDATED_EVENT,
	recordGameSession,
} from './stats/store.js';
import { getStatsSyncAdapter } from './stats/sync.js';
import type { AggregatedGameStats } from './stats/types.js';
import type { DifficultyBucketStats, GameId, GameStats, RoundStatsInput } from './types/stats.types.js';
import type { GameStorage, GameStorageOptions } from './types/storage.types.js';

/**
 * Storage key relative to the game application scope.
 * In raw storage driver, this corresponds to `arcade::[gameId]::stats`.
 */
export const GAME_STATS_STORAGE_KEY = 'stats';

/**
 * Creates an empty stats bucket.
 */
export function createEmptyDifficultyBucketStats(): DifficultyBucketStats {
	return {
		gamesPlayed: 0,
		gamesWon: 0,
		gamesLost: 0,
		currentStreak: 0,
		bestStreak: 0,
		bestTimeSeconds: null,
		totalPlayTimeSeconds: 0,
		bestMoves: null,
		bestScore: null,
		flawlessWins: 0,
	};
}

/**
 * Creates a blank GameStats document initialized to schema version 1.
 */
export function createEmptyGameStats<
	TBucketKey extends string = string,
	TCustomMetrics extends Record<string, number> = Record<string, number>,
>(gameId: GameId): GameStats<TBucketKey, TCustomMetrics> {
	return {
		schemaVersion: 1,
		gameId,
		updatedAt: Date.now(),
		overall: createEmptyDifficultyBucketStats(),
		byBucket: {},
		lifetimeMetrics: {} as TCustomMetrics,
	};
}

/**
 * Pure helper function to update a single DifficultyBucketStats instance with a round result.
 */
function updateBucketStats(
	prevBucket: DifficultyBucketStats | undefined,
	input: RoundStatsInput,
): DifficultyBucketStats {
	const current = prevBucket ?? createEmptyDifficultyBucketStats();

	const gamesPlayed = current.gamesPlayed + 1;
	const totalPlayTimeSeconds = current.totalPlayTimeSeconds + Math.max(0, input.playTimeSeconds);

	if (input.won) {
		const gamesWon = current.gamesWon + 1;
		const gamesLost = current.gamesLost;
		const currentStreak = current.currentStreak + 1;
		const bestStreak = Math.max(current.bestStreak, currentStreak);

		const bestTimeSeconds =
			current.bestTimeSeconds !== null
				? Math.min(current.bestTimeSeconds, input.playTimeSeconds)
				: input.playTimeSeconds;

		const bestMoves =
			input.moves != null
				? current.bestMoves != null
					? Math.min(current.bestMoves, input.moves)
					: input.moves
				: (current.bestMoves ?? null);

		const bestScore =
			input.score != null
				? current.bestScore != null
					? Math.max(current.bestScore, input.score)
					: input.score
				: (current.bestScore ?? null);

		const flawlessWins = current.flawlessWins + (input.isFlawless ? 1 : 0);

		return {
			gamesPlayed,
			gamesWon,
			gamesLost,
			currentStreak,
			bestStreak,
			bestTimeSeconds,
			totalPlayTimeSeconds,
			bestMoves,
			bestScore,
			flawlessWins,
		};
	}

	return {
		gamesPlayed,
		gamesWon: current.gamesWon,
		gamesLost: current.gamesLost + 1,
		currentStreak: 0,
		bestStreak: current.bestStreak,
		bestTimeSeconds: current.bestTimeSeconds,
		totalPlayTimeSeconds,
		bestMoves: current.bestMoves ?? null,
		bestScore: current.bestScore ?? null,
		flawlessWins: current.flawlessWins,
	};
}

/**
 * Pure reducer function calculating updated game statistics from previous statistics and a round result.
 */
export function updateStatsWithRound<
	TBucketKey extends string = string,
	TCustomMetrics extends Record<string, number> = Record<string, number>,
>(
	prevStats: GameStats<TBucketKey, TCustomMetrics>,
	input: RoundStatsInput<TCustomMetrics>,
): GameStats<TBucketKey, TCustomMetrics> {
	const nextOverall = updateBucketStats(prevStats.overall, input);

	const nextByBucket: Partial<Record<TBucketKey, DifficultyBucketStats>> = {
		...prevStats.byBucket,
	};

	if (input.bucketKey !== undefined && input.bucketKey.trim().length > 0) {
		const key = input.bucketKey.trim() as TBucketKey;
		nextByBucket[key] = updateBucketStats(prevStats.byBucket?.[key], input);
	}

	const nextLifetimeMetrics: Record<string, number> = {
		...(prevStats.lifetimeMetrics ?? {}),
	};

	if (input.customMetrics) {
		for (const [key, value] of Object.entries(input.customMetrics)) {
			if (typeof value === 'number' && Number.isFinite(value)) {
				nextLifetimeMetrics[key] = (nextLifetimeMetrics[key] ?? 0) + value;
			}
		}
	}

	return {
		schemaVersion: 1,
		gameId: prevStats.gameId || input.gameId,
		updatedAt: Date.now(),
		overall: nextOverall,
		byBucket: nextByBucket,
		lifetimeMetrics: nextLifetimeMetrics as TCustomMetrics,
	};
}

function resolveGameStorage(gameId: GameId, storageOrOptions?: GameStorage | GameStorageOptions): GameStorage {
	if (storageOrOptions && 'get' in storageOrOptions && typeof (storageOrOptions as GameStorage).get === 'function') {
		return storageOrOptions as GameStorage;
	}
	return createGameStorage(gameId, storageOrOptions as GameStorageOptions | undefined);
}

/**
 * Retrieves the normalized statistics document for a game from namespaced storage (`arcade::[gameId]::stats`).
 * Falls back to an empty GameStats document if no data exists.
 */
export async function getGameStats<
	TBucketKey extends string = string,
	TCustomMetrics extends Record<string, number> = Record<string, number>,
>(gameId: GameId, storageOrOptions?: GameStorage | GameStorageOptions): Promise<GameStats<TBucketKey, TCustomMetrics>> {
	const storage = resolveGameStorage(gameId, storageOrOptions);
	const rawStats = await storage.get<GameStats<TBucketKey, TCustomMetrics>>(GAME_STATS_STORAGE_KEY);

	if (!rawStats || rawStats.schemaVersion !== 1) {
		return createEmptyGameStats<TBucketKey, TCustomMetrics>(gameId);
	}

	return {
		...rawStats,
		gameId,
		overall: {
			...createEmptyDifficultyBucketStats(),
			...(rawStats.overall ?? {}),
		},
		byBucket: rawStats.byBucket ?? {},
		lifetimeMetrics: (rawStats.lifetimeMetrics ?? {}) as TCustomMetrics,
	};
}

/**
 * Records a round result to storage, applying `updateStatsWithRound` and persisting
 * under `arcade::[gameId]::stats`.
 */
export async function recordGameStats<
	TBucketKey extends string = string,
	TCustomMetrics extends Record<string, number> = Record<string, number>,
>(
	input: RoundStatsInput<TCustomMetrics>,
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<GameStats<TBucketKey, TCustomMetrics>> {
	const storage = resolveGameStorage(input.gameId, storageOrOptions);
	const currentStats = await getGameStats<TBucketKey, TCustomMetrics>(input.gameId, storage);
	const updatedStats = updateStatsWithRound<TBucketKey, TCustomMetrics>(currentStats, input);
	await storage.set(GAME_STATS_STORAGE_KEY, updatedStats);

	// Synchronize with cross-game session aggregator
	try {
		await recordGameSession(
			{
				gameId: input.gameId,
				timestamp: Date.now(),
				durationMs: Math.max(0, input.playTimeSeconds) * 1000,
				won: input.won,
				difficulty: input.bucketKey,
			},
			storage,
		);
	} catch {
		// Non-blocking fallback if session recording fails
	}

	// Synchronize with cloud backend if Tier 3/4 sync adapter is active
	const syncAdapter = getStatsSyncAdapter();
	if (syncAdapter?.isSyncEnabled()) {
		try {
			await syncAdapter.syncGameStats(input.gameId, updatedStats);
		} catch (error) {
			console.warn(`[@arcade/lib-storage] Failed to sync game stats for ${input.gameId}:`, error);
		}
	}

	return updatedStats;
}

function minNullable(a: number | null | undefined, b: number | null | undefined): number | null {
	if (a != null && b != null) return Math.min(a, b);
	return a ?? b ?? null;
}

function maxNullable(a: number | null | undefined, b: number | null | undefined): number | null {
	if (a != null && b != null) return Math.max(a, b);
	return a ?? b ?? null;
}

function mergeBucketStats(
	local: DifficultyBucketStats,
	remote: DifficultyBucketStats,
	preferRemoteCurrentStreak: boolean,
): DifficultyBucketStats {
	return {
		gamesPlayed: Math.max(local.gamesPlayed ?? 0, remote.gamesPlayed ?? 0),
		gamesWon: Math.max(local.gamesWon ?? 0, remote.gamesWon ?? 0),
		gamesLost: Math.max(local.gamesLost ?? 0, remote.gamesLost ?? 0),
		currentStreak: preferRemoteCurrentStreak ? (remote.currentStreak ?? 0) : (local.currentStreak ?? 0),
		bestStreak: Math.max(local.bestStreak ?? 0, remote.bestStreak ?? 0),
		bestTimeSeconds: minNullable(local.bestTimeSeconds, remote.bestTimeSeconds),
		totalPlayTimeSeconds: Math.max(local.totalPlayTimeSeconds ?? 0, remote.totalPlayTimeSeconds ?? 0),
		bestMoves: minNullable(local.bestMoves, remote.bestMoves),
		bestScore: maxNullable(local.bestScore, remote.bestScore),
		flawlessWins: Math.max(local.flawlessWins ?? 0, remote.flawlessWins ?? 0),
	};
}

/**
 * Pure monotonic merge between local and remote GameStats documents.
 */
export function mergeGameStats<
	TBucketKey extends string = string,
	TCustomMetrics extends Record<string, number> = Record<string, number>,
>(
	local: GameStats<TBucketKey, TCustomMetrics>,
	remote: GameStats<TBucketKey, TCustomMetrics>,
): GameStats<TBucketKey, TCustomMetrics> {
	const preferRemote = (remote.updatedAt ?? 0) >= (local.updatedAt ?? 0);
	const overall = mergeBucketStats(
		{ ...createEmptyDifficultyBucketStats(), ...(local.overall ?? {}) },
		{ ...createEmptyDifficultyBucketStats(), ...(remote.overall ?? {}) },
		preferRemote,
	);

	const allBucketKeys = new Set<string>([
		...Object.keys(local.byBucket ?? {}),
		...Object.keys(remote.byBucket ?? {}),
	]);
	const byBucket: Partial<Record<TBucketKey, DifficultyBucketStats>> = {};
	for (const key of allBucketKeys) {
		const l = local.byBucket?.[key as TBucketKey] ?? createEmptyDifficultyBucketStats();
		const r = remote.byBucket?.[key as TBucketKey] ?? createEmptyDifficultyBucketStats();
		byBucket[key as TBucketKey] = mergeBucketStats(l, r, preferRemote);
	}

	const allMetricKeys = new Set<string>([
		...Object.keys(local.lifetimeMetrics ?? {}),
		...Object.keys(remote.lifetimeMetrics ?? {}),
	]);
	const lifetimeMetrics: Record<string, number> = {};
	for (const key of allMetricKeys) {
		const lVal = local.lifetimeMetrics?.[key] ?? 0;
		const rVal = remote.lifetimeMetrics?.[key] ?? 0;
		lifetimeMetrics[key] = Math.max(lVal, rVal);
	}

	return {
		schemaVersion: 1,
		gameId: local.gameId || remote.gameId,
		updatedAt: Math.max(local.updatedAt ?? 0, remote.updatedAt ?? 0),
		overall,
		byBucket,
		lifetimeMetrics: lifetimeMetrics as TCustomMetrics,
	};
}

function dispatchStatsUpdatedEvent(gameId?: GameId): void {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent(STATS_UPDATED_EVENT, { detail: { gameId } }));
	}
}

async function syncAggregatedStatsMirror(stats: GameStats, storage: GameStorage): Promise<void> {
	const played = stats.overall.gamesPlayed ?? 0;
	if (played <= 0) return;

	const won = stats.overall.gamesWon ?? 0;
	const aggregated: AggregatedGameStats = {
		gameId: stats.gameId,
		totalPlayed: played,
		totalWon: won,
		winRate: played > 0 ? Math.round((won / played) * 100) : 0,
		totalTimeMs: (stats.overall.totalPlayTimeSeconds ?? 0) * 1000,
		bestTimeMs: stats.overall.bestTimeSeconds != null ? stats.overall.bestTimeSeconds * 1000 : undefined,
		currentStreak: stats.overall.currentStreak ?? 0,
		maxStreak: stats.overall.bestStreak ?? 0,
		lastPlayed: stats.updatedAt ?? null,
	};

	await storage.set(AGGREGATED_STATS_STORAGE_KEY, aggregated);

	if (typeof window !== 'undefined' && window.localStorage) {
		try {
			const serialized = JSON.stringify(aggregated);
			window.localStorage.setItem(`arcade:stats:${stats.gameId}`, serialized);
			window.localStorage.setItem(`arcade::${stats.gameId}::aggregated_stats`, serialized);
		} catch {
			// Ignore storage mirror write issues
		}
	}
}

/**
 * Reconciles local per-game statistics with the cloud backend when Tier 3/4 sync is enabled.
 */
export async function reconcileGameStats(
	gameId: GameId,
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<GameStats> {
	const storage = resolveGameStorage(gameId, storageOrOptions);
	const localStats = await getGameStats(gameId, storage);
	const adapter = getStatsSyncAdapter();

	if (!adapter || !adapter.isSyncEnabled()) {
		return localStats;
	}

	try {
		const remoteStats = await adapter.fetchGameStats(gameId);
		if (!remoteStats) {
			if ((localStats.overall.gamesPlayed ?? 0) > 0) {
				await adapter.syncGameStats(gameId, localStats);
			}
			return localStats;
		}

		const merged = mergeGameStats(localStats, remoteStats);
		await storage.set(GAME_STATS_STORAGE_KEY, merged);
		await syncAggregatedStatsMirror(merged, storage);
		dispatchStatsUpdatedEvent(gameId);

		// Push merged back if local had newer or higher values not yet on remote
		if (
			merged.updatedAt !== remoteStats.updatedAt ||
			merged.overall.gamesPlayed !== remoteStats.overall?.gamesPlayed
		) {
			await adapter.syncGameStats(gameId, merged);
		}

		return merged;
	} catch (error) {
		console.warn(`[@arcade/lib-storage] Failed to reconcile stats for ${gameId}:`, error);
		return localStats;
	}
}

/**
 * Reconciles per-game statistics across all registered arcade games with the cloud backend.
 */
export async function reconcileAllGameStats(
	gameIds: readonly GameId[] = DEFAULT_REGISTERED_GAMES,
	customStorageResolver?: (gameId: GameId) => GameStorage,
): Promise<Record<string, GameStats>> {
	const results: Record<string, GameStats> = {};

	await Promise.allSettled(
		gameIds.map(async (gameId) => {
			const storage = customStorageResolver ? customStorageResolver(gameId) : undefined;
			results[gameId] = await reconcileGameStats(gameId, storage);
		}),
	);

	dispatchStatsUpdatedEvent();

	return results;
}
