import type { GameStorage } from '@arcade/lib-storage';
import { getMedalDefinitionsForGame } from '../definitions/index.js';
import { updateBaseStats, updateCustomStats } from '../engine/aggregator.js';
import { evaluateAchievements } from '../engine/evaluator.js';
import { dispatchMedalUnlockedEvent } from '../events/medalEvents.js';
import { getGameMedalState, setGameMedalState } from '../storage/medalStorage.js';
import { type MedalSyncAdapter, getMedalSyncAdapter } from '../sync/syncAdapter.js';
import { enqueueMedalSync, flushMedalSyncQueue } from '../sync/syncQueue.js';
import type {
	AchievementDefinition,
	GameId,
	GameMedalState,
	GameResultPayload,
	RecordGameResultResponse,
} from '../types/index.js';

export interface RecordGameResultOptions<G extends GameId> {
	readonly storage?: GameStorage;
	readonly syncStorage?: GameStorage;
	readonly now?: number;
	readonly definitions?: readonly AchievementDefinition<G>[];
	readonly syncAdapter?: MedalSyncAdapter | null;
	readonly isOnline?: () => boolean;
}

/**
 * Universal decoupled domain entrypoint for recording game outcomes.
 *
 * 1. Updates Base Stats and Game-Specific Custom Stats in memory.
 * 2. Evaluates local achievement criteria.
 * 3. Atomically commits state to local storage (arcade::[gameId]::medals).
 * 4. Dispatches the 'medalUnlocked' window event for UI notifications.
 * 5. If Tier 3 or 4 cloud sync is active:
 *    - If online: syncs immediately to Firestore via the sync adapter.
 *    - If offline: enqueues to arcade::sync::queue for replay upon reconnect.
 */
export async function recordGameResult<G extends GameId>(
	payload: GameResultPayload<G>,
	options?: RecordGameResultOptions<G>,
): Promise<RecordGameResultResponse<G>> {
	const now = options?.now ?? Date.now();
	const priorState = await getGameMedalState(payload.gameId, options?.storage);

	// 1. In-memory base stats calculation
	const updatedBaseStats = updateBaseStats(priorState.baseStats, payload.won, payload.playTimeSeconds, now);

	// 2. In-memory custom stats & personal best comparison
	const { updatedCustom, isNewBestTime } = updateCustomStats(payload.gameId, priorState.customStats, payload);

	// 3. Local achievement evaluation
	const definitions = options?.definitions ?? getMedalDefinitionsForGame(payload.gameId);
	const { newlyUnlocked, updatedProgress } = evaluateAchievements(
		{
			priorState,
			updatedBaseStats,
			updatedCustomStats: updatedCustom,
			result: payload,
		},
		definitions,
		now,
	);

	// 4. Assemble newly unlocked map
	const unlockedMedals = { ...priorState.unlockedMedals };
	for (const unlock of newlyUnlocked) {
		unlockedMedals[unlock.id] = unlock;
	}

	const newState: GameMedalState<G> = {
		gameId: payload.gameId,
		baseStats: updatedBaseStats,
		customStats: updatedCustom,
		unlockedMedals,
		medalProgress: updatedProgress,
		schemaVersion: priorState.schemaVersion,
		updatedAt: now,
	};

	// 5. Atomic persistence to local storage (arcade::[gameId]::medals)
	await setGameMedalState(newState, options?.storage);

	// 6. Dispatch UI event if any medals were awarded
	if (newlyUnlocked.length > 0) {
		dispatchMedalUnlockedEvent(payload.gameId, newlyUnlocked);
	}

	// 7. Tier 3/4 Cloud Sync & Offline Queue coordination
	const syncAdapter = options?.syncAdapter !== undefined ? options.syncAdapter : getMedalSyncAdapter();
	if (syncAdapter?.isSyncEnabled()) {
		const isOnline = options?.isOnline ?? (() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
		if (isOnline()) {
			try {
				await syncAdapter.syncGameMedals(payload.gameId, newState);
				void flushMedalSyncQueue(syncAdapter, {
					storage: options?.syncStorage,
					isOnline,
				});
			} catch (error) {
				console.warn(
					`[@arcade/lib-medals] Online sync failed for ${payload.gameId}, enqueuing for offline replay:`,
					error,
				);
				await enqueueMedalSync(
					{
						gameId: payload.gameId,
						state: newState,
						queuedAt: now,
					},
					options?.syncStorage,
				);
			}
		} else {
			await enqueueMedalSync(
				{
					gameId: payload.gameId,
					state: newState,
					queuedAt: now,
				},
				options?.syncStorage,
			);
		}
	}

	return {
		updatedState: newState,
		newlyUnlockedMedals: newlyUnlocked,
		isNewBestTime,
	};
}
