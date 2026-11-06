import { createGameStorage } from './createGameStorage.js';
import type { GameId } from './types/stats.types.js';
import type { GameStorage, GameStorageOptions } from './types/storage.types.js';

/**
 * Storage key relative to the game application scope.
 * In raw storage driver, this corresponds to `arcade::[gameId]::lastConfig`.
 */
export const LAST_GAME_CONFIG_STORAGE_KEY = 'lastConfig';

function resolveGameStorage(gameId: GameId, storageOrOptions?: GameStorage | GameStorageOptions): GameStorage {
	if (storageOrOptions && 'get' in storageOrOptions && typeof (storageOrOptions as GameStorage).get === 'function') {
		return storageOrOptions as GameStorage;
	}
	return createGameStorage(gameId, storageOrOptions as GameStorageOptions | undefined);
}

/**
 * Retrieves the last selected game configuration for a specific game under `arcade::[gameId]::lastConfig`.
 *
 * @param gameId The canonical game identifier.
 * @param storageOrOptions Optional existing GameStorage instance or configuration options.
 * @returns The persisted configuration object, or null if none is saved.
 */
export async function getLastGameConfig<T = Record<string, unknown>>(
	gameId: GameId,
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<T | null> {
	const storage = resolveGameStorage(gameId, storageOrOptions);
	const saved = await storage.get<T>(LAST_GAME_CONFIG_STORAGE_KEY);

	if (!saved || typeof saved !== 'object') {
		return null;
	}

	return saved;
}

/**
 * Persists the last selected game configuration object to namespaced storage under `arcade::[gameId]::lastConfig`.
 *
 * @param gameId The canonical game identifier.
 * @param config The configuration object to persist.
 * @param storageOrOptions Optional existing GameStorage instance or configuration options.
 */
export async function saveLastGameConfig<T = Record<string, unknown>>(
	gameId: GameId,
	config: T,
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<void> {
	const storage = resolveGameStorage(gameId, storageOrOptions);
	await storage.set(LAST_GAME_CONFIG_STORAGE_KEY, config);
}
