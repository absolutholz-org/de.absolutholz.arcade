import { createGameStorage } from './createGameStorage.js';
import { localStorageDriver } from './drivers/localStorageDriver.js';
import type { GameId } from './types/stats.types.js';
import type { GameStorage, GameStorageOptions } from './types/storage.types.js';

/**
 * Storage key relative to the game application scope.
 * In raw storage driver, this corresponds to `arcade::[gameId]::settings`.
 */
export const GAME_SETTINGS_STORAGE_KEY = 'settings';

/**
 * Application scope and key for global arcade preferences.
 * In raw storage driver, this corresponds to `arcade::global::settings`.
 */
export const GLOBAL_SETTINGS_APP_SCOPE = 'global';
export const GLOBAL_SETTINGS_STORAGE_KEY = 'settings';

export interface ArcadeGlobalSettings {
	soundEnabled: boolean;
	hapticsEnabled: boolean;
}

export const DEFAULT_GLOBAL_SETTINGS: ArcadeGlobalSettings = {
	soundEnabled: true,
	hapticsEnabled: true,
};

function resolveGameStorage(gameId: GameId, storageOrOptions?: GameStorage | GameStorageOptions): GameStorage {
	if (storageOrOptions && 'get' in storageOrOptions && typeof (storageOrOptions as GameStorage).get === 'function') {
		return storageOrOptions as GameStorage;
	}
	return createGameStorage(gameId, storageOrOptions as GameStorageOptions | undefined);
}

function resolveGlobalStorage(storageOrOptions?: GameStorage | GameStorageOptions): GameStorage {
	if (storageOrOptions && 'get' in storageOrOptions && typeof (storageOrOptions as GameStorage).get === 'function') {
		return storageOrOptions as GameStorage;
	}
	return createGameStorage(GLOBAL_SETTINGS_APP_SCOPE, {
		driver: localStorageDriver,
		...(storageOrOptions as GameStorageOptions | undefined),
	});
}

/**
 * Synchronously retrieves global settings from localStorage if available,
 * safely falling back to DEFAULT_GLOBAL_SETTINGS.
 */
export function getGlobalSettingsSync(): ArcadeGlobalSettings {
	if (typeof window === 'undefined' || !window.localStorage) {
		return { ...DEFAULT_GLOBAL_SETTINGS };
	}
	try {
		const raw = window.localStorage.getItem(`arcade::${GLOBAL_SETTINGS_APP_SCOPE}::${GLOBAL_SETTINGS_STORAGE_KEY}`);
		if (!raw) {
			return { ...DEFAULT_GLOBAL_SETTINGS };
		}
		const parsed = JSON.parse(raw);
		return {
			...DEFAULT_GLOBAL_SETTINGS,
			...(typeof parsed === 'object' && parsed !== null ? parsed : {}),
		};
	} catch {
		return { ...DEFAULT_GLOBAL_SETTINGS };
	}
}

/**
 * Retrieves the global arcade user settings.
 * Merges persisted values over defaults with backward compatibility.
 */
export async function getGlobalSettings(
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<ArcadeGlobalSettings> {
	const storage = resolveGlobalStorage(storageOrOptions);
	const saved = await storage.get<Partial<ArcadeGlobalSettings>>(GLOBAL_SETTINGS_STORAGE_KEY);

	if (!saved || typeof saved !== 'object') {
		return { ...DEFAULT_GLOBAL_SETTINGS };
	}

	return {
		...DEFAULT_GLOBAL_SETTINGS,
		...saved,
	};
}

/**
 * Persists the global arcade user settings.
 */
export async function saveGlobalSettings(
	settings: Partial<ArcadeGlobalSettings>,
	storageOrOptions?: GameStorage | GameStorageOptions,
): Promise<ArcadeGlobalSettings> {
	const storage = resolveGlobalStorage(storageOrOptions);
	const current = await getGlobalSettings(storage);
	const updated: ArcadeGlobalSettings = {
		...current,
		...settings,
	};
	await storage.set(GLOBAL_SETTINGS_STORAGE_KEY, updated);
	return updated;
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
