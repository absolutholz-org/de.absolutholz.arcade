import { localStorageDriver } from './drivers/localStorageDriver.js';
import type { GameStorage, GameStorageOptions, StorageDriver } from './types/storage.types.js';
import { buildStorageKey, parseStorageKey } from './utils/namespace.js';

class ScopedGameStorage implements GameStorage {
	readonly appName: string;
	private driver: StorageDriver;

	constructor(appName: string, options?: GameStorageOptions) {
		if (!appName || typeof appName !== 'string' || appName.trim().length === 0) {
			throw new Error('createGameStorage error: "appName" is required and must be a non-empty string.');
		}

		this.appName = appName.trim();
		this.driver = options?.driver ?? localStorageDriver;
	}

	get driverName(): string {
		return this.driver.name;
	}

	async get<T>(key: string): Promise<T | null> {
		const namespacedKey = buildStorageKey(this.appName, key);
		const rawValue = await this.driver.getItem(namespacedKey);

		if (rawValue === null) {
			return null;
		}

		try {
			return JSON.parse(rawValue) as T;
		} catch {
			return rawValue as unknown as T;
		}
	}

	async set<T>(key: string, value: T): Promise<void> {
		const namespacedKey = buildStorageKey(this.appName, key);
		const serialized = JSON.stringify(value);
		await this.driver.setItem(namespacedKey, serialized);
	}

	async remove(key: string): Promise<void> {
		const namespacedKey = buildStorageKey(this.appName, key);
		await this.driver.removeItem(namespacedKey);
	}

	async keys(): Promise<string[]> {
		const allKeys = await this.driver.getAllKeys();
		const relativeKeys: string[] = [];

		for (const key of allKeys) {
			const relative = parseStorageKey(this.appName, key);
			if (relative !== null) {
				relativeKeys.push(relative);
			}
		}

		return relativeKeys;
	}

	async clear(): Promise<void> {
		const relativeKeys = await this.keys();
		for (const relativeKey of relativeKeys) {
			await this.remove(relativeKey);
		}
	}
}

/**
 * Creates an asynchronous, scoped game storage client adhering to ADR 008 and ADR 012.
 * Automatically enforces the `arcade::[appName]::[key]` namespacing pattern and handles
 * JSON serialization and parsing.
 *
 * @param appName The application identifier (e.g., 'sudoku', 'minesweeper', 'hub').
 * @param options Configuration options, including custom drivers.
 * @returns An initialized GameStorage instance.
 */
export function createGameStorage(appName: string, options?: GameStorageOptions): GameStorage {
	return new ScopedGameStorage(appName, options);
}
