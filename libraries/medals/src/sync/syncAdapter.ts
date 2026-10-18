import type { GameId, GameMedalState } from '../types/index.js';

export interface MedalSyncAdapter {
	/**
	 * Returns true if cloud sync is actively enabled (i.e. User is in Tier 3 or Tier 4).
	 */
	isSyncEnabled(): boolean;

	/**
	 * Synchronizes game medals to the cloud backend (e.g. Firestore /users/{uid}/gameStats/{gameId}).
	 */
	syncGameMedals(gameId: GameId, state: GameMedalState): Promise<void>;
}

let activeSyncAdapter: MedalSyncAdapter | null = null;

export function registerMedalSyncAdapter(adapter: MedalSyncAdapter | null): void {
	activeSyncAdapter = adapter;
}

export function getMedalSyncAdapter(): MedalSyncAdapter | null {
	return activeSyncAdapter;
}
