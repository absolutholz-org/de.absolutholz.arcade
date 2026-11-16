import type { GameId, GameStats } from '../types/stats.types.js';

export interface StatsSyncAdapter {
	/**
	 * Returns true if cloud sync is actively enabled (i.e. User is in Tier 3 or Tier 4).
	 */
	isSyncEnabled(): boolean;

	/**
	 * Synchronizes per-game statistics to the cloud backend (e.g. Firestore /users/{uid}/storageStats/{gameId}).
	 */
	syncGameStats(gameId: GameId, stats: GameStats): Promise<void>;

	/**
	 * Fetches per-game statistics from the cloud backend if available.
	 */
	fetchGameStats(gameId: GameId): Promise<GameStats | null>;
}

let activeStatsSyncAdapter: StatsSyncAdapter | null = null;

export function registerStatsSyncAdapter(adapter: StatsSyncAdapter | null): void {
	activeStatsSyncAdapter = adapter;
}

export function getStatsSyncAdapter(): StatsSyncAdapter | null {
	return activeStatsSyncAdapter;
}
