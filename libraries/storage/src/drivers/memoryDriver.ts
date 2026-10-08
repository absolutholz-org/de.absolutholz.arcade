import type { StorageDriver } from '../types/storage.types.js';

/**
 * In-memory storage driver using a JavaScript Map.
 * Provides guaranteed SSR safety, test isolation, and privacy-mode fallbacks.
 */
export class MemoryStorageDriver implements StorageDriver {
	readonly name = 'memory';
	private store = new Map<string, string>();

	isAvailable(): boolean {
		return true;
	}

	async getItem(key: string): Promise<string | null> {
		return this.store.get(key) ?? null;
	}

	async setItem(key: string, value: string): Promise<void> {
		this.store.set(key, value);
	}

	async removeItem(key: string): Promise<void> {
		this.store.delete(key);
	}

	async getAllKeys(): Promise<string[]> {
		return Array.from(this.store.keys());
	}
}

/**
 * Shared singleton in-memory driver instance.
 */
export const memoryStorageDriver = new MemoryStorageDriver();
