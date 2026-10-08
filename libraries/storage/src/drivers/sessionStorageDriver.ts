import type { StorageDriver } from '../types/storage.types.js';
import { MemoryStorageDriver } from './memoryDriver.js';

/**
 * Browser SessionStorage driver for ephemeral single-session data.
 * Interacts with window.sessionStorage with automatic fallback to memory
 * when running in SSR, Node.js, or environments where storage access is blocked.
 */
export class SessionStorageDriver implements StorageDriver {
	readonly name = 'session-storage';
	private fallbackDriver = new MemoryStorageDriver();

	isAvailable(): boolean {
		if (typeof window === 'undefined' || !window.sessionStorage) {
			return false;
		}
		try {
			const testKey = '__arcade_storage_session_probe__';
			window.sessionStorage.setItem(testKey, '1');
			window.sessionStorage.removeItem(testKey);
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
			return window.sessionStorage.getItem(key);
		} catch {
			return this.fallbackDriver.getItem(key);
		}
	}

	async setItem(key: string, value: string): Promise<void> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.setItem(key, value);
		}
		try {
			window.sessionStorage.setItem(key, value);
		} catch {
			return this.fallbackDriver.setItem(key, value);
		}
	}

	async removeItem(key: string): Promise<void> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.removeItem(key);
		}
		try {
			window.sessionStorage.removeItem(key);
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
			for (let i = 0; i < window.sessionStorage.length; i += 1) {
				const key = window.sessionStorage.key(i);
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
 * Shared singleton SessionStorage driver instance.
 */
export const sessionStorageDriver = new SessionStorageDriver();
