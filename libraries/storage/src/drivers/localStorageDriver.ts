import type { StorageDriver } from '../types/storage.types.js';
import { MemoryStorageDriver } from './memoryDriver.js';

/**
 * Browser LocalStorage driver.
 * Interacts with window.localStorage with automatic fallback to memory
 * when running in SSR, Node.js, or environments where storage access is blocked.
 */
export class LocalStorageDriver implements StorageDriver {
	readonly name = 'local-storage';
	private fallbackDriver = new MemoryStorageDriver();

	isAvailable(): boolean {
		if (typeof window === 'undefined' || !window.localStorage) {
			return false;
		}
		try {
			const testKey = '__arcade_storage_probe__';
			window.localStorage.setItem(testKey, '1');
			window.localStorage.removeItem(testKey);
			return true;
		} catch {
			return false;
		}
	}

	async getItem(key: string): Promise<string | null> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.getItem(key);
		}
		try {
			return window.localStorage.getItem(key);
		} catch {
			return this.fallbackDriver.getItem(key);
		}
	}

	async setItem(key: string, value: string): Promise<void> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.setItem(key, value);
		}
		try {
			window.localStorage.setItem(key, value);
		} catch {
			return this.fallbackDriver.setItem(key, value);
		}
	}

	async removeItem(key: string): Promise<void> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.removeItem(key);
		}
		try {
			window.localStorage.removeItem(key);
		} catch {
			return this.fallbackDriver.removeItem(key);
		}
	}

	async getAllKeys(): Promise<string[]> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.getAllKeys();
		}
		try {
			const keys: string[] = [];
			for (let i = 0; i < window.localStorage.length; i += 1) {
				const key = window.localStorage.key(i);
				if (key !== null) {
					keys.push(key);
				}
			}
			return keys;
		} catch {
			return this.fallbackDriver.getAllKeys();
		}
	}
}

/**
 * Shared singleton LocalStorage driver instance.
 */
export const localStorageDriver = new LocalStorageDriver();
