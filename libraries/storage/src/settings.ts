import { createGameStorage } from './createGameStorage.js';
import type { GameId } from './types/stats.types.js';
import type { GameStorage, GameStorageOptions } from './types/storage.types.js';

/**
 * Storage key relative to the game application scope.
 * In raw storage driver, this corresponds to `arcade::[gameId]::settings`.
 */
export const GAME_SETTINGS_STORAGE_KEY = 'settings';

function resolveGameStorage(gameId: GameId, storageOrOptions?: GameStorage | GameStorageOptions): GameStorage {
	if (storageOrOptions && 'get' in storageOrOptions && typeof (storageOrOptions as GameStorage).get === 'function') {
		return storageOrOptions as GameStorage;
	}
	return createGameStorage(gameId, storageOrOptions as GameStorageOptions | undefined);
}

/**
 * Retrieves the persisted settings object for a specific game under `arcade::[gameId]::settings`.
 * Merges persisted values over `defaults` to ensure any new schema fields are safely initialized.
 *
 * @param gameId The canonical game identifier.
 * @param defaults The default settings object defined by the game schema.
 * @param storageOrOptions Optional existing GameStorage instance or configuration options.
 * @returns The resolved settings object with defaults merged.
 */
export async function getGameSettings<T extends Record<string, unknown>>(
	gameId: GameId,
	defaults: T,
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<T> {
	const storage = resolveGameStorage(gameId, storageOrOptions);
	const saved = await storage.get<Partial<T>>(GAME_SETTINGS_STORAGE_KEY);

	if (!saved || typeof saved !== 'object') {
		return { ...defaults };
	}

	return {
		...defaults,
		...saved,
	};
}

/**
 * Persists the game settings object to namespaced storage under `arcade::[gameId]::settings`.
 *
 * @param gameId The canonical game identifier.
 * @param settings The settings object to persist.
 * @param storageOrOptions Optional existing GameStorage instance or configuration options.
 */
export async function saveGameSettings<T extends Record<string, unknown>>(
	gameId: GameId,
	settings: T,
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<void> {
	const storage = resolveGameStorage(gameId, storageOrOptions);
	await storage.set(GAME_SETTINGS_STORAGE_KEY, settings);
}
