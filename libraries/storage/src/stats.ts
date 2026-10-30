import { createGameStorage } from './createGameStorage.js';
import { recordGameSession } from './stats/store.js';
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

	return updatedStats;
}
