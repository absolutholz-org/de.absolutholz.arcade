import { type GameStorage, createGameStorage } from '@arcade/lib-storage';
import type { GameId, GameMedalState } from '../types/index.js';
import { type MedalSyncAdapter, getMedalSyncAdapter } from './syncAdapter.js';

export interface SyncQueueItem {
	readonly gameId: GameId;
	readonly state: GameMedalState;
	readonly queuedAt: number;
}

export const SYNC_STORAGE_APP = 'sync';
export const SYNC_QUEUE_KEY = 'queue';

export function getSyncStorage(customStorage?: GameStorage): GameStorage {
	return customStorage ?? createGameStorage(SYNC_STORAGE_APP);
}

export async function getMedalSyncQueue(customStorage?: GameStorage): Promise<SyncQueueItem[]> {
	const storage = getSyncStorage(customStorage);
	const raw = await storage.get<SyncQueueItem[]>(SYNC_QUEUE_KEY);
	return raw ?? [];
}

export async function enqueueMedalSync(item: SyncQueueItem, customStorage?: GameStorage): Promise<void> {
	const storage = getSyncStorage(customStorage);
	const current = await getMedalSyncQueue(storage);
	const filtered = current.filter((i) => i.gameId !== item.gameId);
	filtered.push(item);
	await storage.set(SYNC_QUEUE_KEY, filtered);
}

export async function clearMedalSyncQueue(customStorage?: GameStorage): Promise<void> {
	const storage = getSyncStorage(customStorage);
	await storage.remove(SYNC_QUEUE_KEY);
}

export async function flushMedalSyncQueue(
	adapterOverride?: MedalSyncAdapter | null,
	options?: {
		storage?: GameStorage;
		isOnline?: () => boolean;
	},
): Promise<{ syncedCount: number; remainingCount: number }> {
	const adapter = adapterOverride ?? getMedalSyncAdapter();
	if (!adapter || !adapter.isSyncEnabled()) {
		return { syncedCount: 0, remainingCount: 0 };
	}

	const isOnline = options?.isOnline ?? (() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
	if (!isOnline()) {
		const current = await getMedalSyncQueue(options?.storage);
		return { syncedCount: 0, remainingCount: current.length };
	}

	const storage = getSyncStorage(options?.storage);
	const queue = await getMedalSyncQueue(storage);
	if (queue.length === 0) {
		return { syncedCount: 0, remainingCount: 0 };
	}

	const remaining: SyncQueueItem[] = [];
	let syncedCount = 0;

	for (const item of queue) {
		try {
			await adapter.syncGameMedals(item.gameId, item.state);
			syncedCount++;
		} catch (error) {
			console.warn(`[@arcade/lib-medals] Failed to flush queued sync for ${item.gameId}:`, error);
			remaining.push(item);
		}
	}

	if (remaining.length === 0) {
		await storage.remove(SYNC_QUEUE_KEY);
	} else {
		await storage.set(SYNC_QUEUE_KEY, remaining);
	}

	return { syncedCount, remainingCount: remaining.length };
}

export function initOfflineSyncBridge(
	adapterOverride?: MedalSyncAdapter | null,
	options?: { storage?: GameStorage },
): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const handleOnline = () => {
		void flushMedalSyncQueue(adapterOverride, options);
	};

	window.addEventListener('online', handleOnline);
	return () => {
		window.removeEventListener('online', handleOnline);
	};
}
