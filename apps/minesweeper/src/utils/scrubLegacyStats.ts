import {
	type DifficultyBucketStats,
	GAME_STATS_STORAGE_KEY,
	type GameStats,
	STATS_UPDATED_EVENT,
	createGameStorage,
} from '@arcade/lib-storage';

function hasLegacyMetrics(bucket: DifficultyBucketStats): boolean {
	return bucket.bestMoves != null || bucket.flawlessWins > 0;
}

function scrubBucket(bucket: DifficultyBucketStats): DifficultyBucketStats {
	return {
		...bucket,
		bestMoves: null,
		flawlessWins: 0,
	};
}

/**
 * Removes legacy `bestMoves` and `flawlessWins` values from Minesweeper's
 * persisted stats document so deprecated metrics are not displayed.
 */
export async function scrubLegacyMinesweeperStats(): Promise<void> {
	try {
		const storage = createGameStorage('minesweeper');
		const stats = await storage.get<GameStats>(GAME_STATS_STORAGE_KEY);
		if (!stats) return;

		const overallDirty = hasLegacyMetrics(stats.overall);
		let hasDirtyBucket = false;
		const cleanedByBucket: Record<string, DifficultyBucketStats> = {};

		for (const [key, bucket] of Object.entries(stats.byBucket)) {
			if (!bucket) continue;
			if (hasLegacyMetrics(bucket)) {
				hasDirtyBucket = true;
				cleanedByBucket[key] = scrubBucket(bucket);
			} else {
				cleanedByBucket[key] = bucket;
			}
		}

		if (!overallDirty && !hasDirtyBucket) return;

		const cleanedStats: GameStats = {
			...stats,
			overall: overallDirty ? scrubBucket(stats.overall) : stats.overall,
			byBucket: cleanedByBucket,
		};

		await storage.set(GAME_STATS_STORAGE_KEY, cleanedStats);

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent(STATS_UPDATED_EVENT, { detail: { gameId: 'minesweeper' } }));
		}
	} catch {
		// Ignore storage errors gracefully
	}
}
