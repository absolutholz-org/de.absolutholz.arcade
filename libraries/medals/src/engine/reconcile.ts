import type { GameStorage } from '@arcade/lib-storage';
import { getGameMedalState, setGameMedalState } from '../storage/medalStorage.js';
import { getMedalSyncAdapter } from '../sync/syncAdapter.js';
import type { GameId, GameMedalState } from '../types/index.js';
import { mergeGameMedalState } from './aggregator.js';

export const SUPPORTED_GAME_IDS: readonly GameId[] = ['sudoku', 'minesweeper', 'nonogram', 'queens', 'tracks'] as const;

/**
 * Reconciles local medal state for a single game against the cloud backend.
 * Writes the merged state to local storage and syncs back to cloud if changes occurred.
 */
export async function reconcileGameMedals<G extends GameId>(
	gameId: G,
	customStorage?: GameStorage,
): Promise<GameMedalState<G>> {
	const localState = await getGameMedalState(gameId, customStorage);
	const adapter = getMedalSyncAdapter();

	if (!adapter || !adapter.isSyncEnabled() || !adapter.fetchGameMedals) {
		return localState;
	}

	try {
		const remoteState = await adapter.fetchGameMedals(gameId);
		if (!remoteState) {
			// Remote has no state yet: push local state up to seed remote
			if (Object.keys(localState.unlockedMedals).length > 0 || (localState.baseStats.gamesPlayed ?? 0) > 0) {
				await adapter.syncGameMedals(gameId, localState);
			}
			return localState;
		}

		const merged = mergeGameMedalState(localState, remoteState as GameMedalState<G>);

		// Persist locally
		await setGameMedalState(merged, customStorage);

		// Synchronize back to cloud to guarantee both ends are identical
		await adapter.syncGameMedals(gameId, merged);

		return merged;
	} catch (error) {
		console.warn(`[@arcade/lib-medals] Failed to reconcile medals for ${gameId}:`, error);
		return localState;
	}
}

/**
 * Reconciles medals across all supported arcade games with the cloud backend.
 */
export async function reconcileAllGameMedals(customStorage?: GameStorage): Promise<Record<GameId, GameMedalState>> {
	const results = {} as Record<GameId, GameMedalState>;

	await Promise.allSettled(
		SUPPORTED_GAME_IDS.map(async (gameId) => {
			const state = await reconcileGameMedals(gameId, customStorage);
			results[gameId] = state;
		}),
	);

	return results;
}
