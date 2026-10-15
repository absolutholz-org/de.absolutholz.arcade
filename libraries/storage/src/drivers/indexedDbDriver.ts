import type { StorageDriver } from '../types/storage.types.js';
import { localStorageDriver } from './localStorageDriver.js';

const DB_NAME = 'arcade_storage';
const STORE_NAME = 'keyval';
const DB_VERSION = 1;

/**
 * Asynchronous IndexedDB storage driver.
 * Stores key-value pairs with virtually unlimited capacity compared to localStorage.
 * Automatically falls back to localStorageDriver when running in SSR, private browsing
 * with blocked databases, or unsupported runtime environments.
 */
export class IndexedDBDriver implements StorageDriver {
	readonly name = 'indexed-db';
	private fallbackDriver: StorageDriver;
	private dbPromise: Promise<IDBDatabase> | null = null;

	constructor(fallback?: StorageDriver) {
		this.fallbackDriver = fallback ?? localStorageDriver;
	}

	isAvailable(): boolean {
		if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
			return false;
		}
		return true;
	}

	private getDB(): Promise<IDBDatabase> {
		if (this.dbPromise) {
			return this.dbPromise;
		}

		this.dbPromise = new Promise((resolve, reject) => {
			if (!this.isAvailable()) {
				reject(new Error('IndexedDB is not available'));
				return;
			}

			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = () => {
				reject(request.error || new Error('Failed to open IndexedDB'));
			};
		});

		return this.dbPromise;
	}

	async getItem(key: string): Promise<string | null> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.getItem(key);
		}

		try {
			const db = await this.getDB();
			return await new Promise<string | null>((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, 'readonly');
				const store = transaction.objectStore(STORE_NAME);
				const request = store.get(key);

				request.onsuccess = () => {
					resolve((request.result as string) ?? null);
				};
				request.onerror = () => {
					reject(request.error);
				};
			});
		} catch {
			return this.fallbackDriver.getItem(key);
		}
	}

	async setItem(key: string, value: string): Promise<void> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.setItem(key, value);
		}

		try {
			const db = await this.getDB();
			await new Promise<void>((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, 'readwrite');
				const store = transaction.objectStore(STORE_NAME);
				const request = store.put(value, key);

				request.onsuccess = () => {
					resolve();
				};
				request.onerror = () => {
					reject(request.error);
				};
			});
		} catch {
			return this.fallbackDriver.setItem(key, value);
		}
	}

	async removeItem(key: string): Promise<void> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.removeItem(key);
		}

		try {
			const db = await this.getDB();
			await new Promise<void>((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, 'readwrite');
				const store = transaction.objectStore(STORE_NAME);
				const request = store.delete(key);

				request.onsuccess = () => {
					resolve();
				};
				request.onerror = () => {
					reject(request.error);
				};
			});
		} catch {
			return this.fallbackDriver.removeItem(key);
		}
	}

	async getAllKeys(): Promise<string[]> {
		if (!this.isAvailable()) {
			return this.fallbackDriver.getAllKeys();
		}

		try {
			const db = await this.getDB();
			return await new Promise<string[]>((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, 'readonly');
				const store = transaction.objectStore(STORE_NAME);
				const request = store.getAllKeys();

				request.onsuccess = () => {
					const keys = (request.result as (string | number)[]).map(String);
					resolve(keys);
				};
				request.onerror = () => {
					reject(request.error);
				};
			});
		} catch {
			return this.fallbackDriver.getAllKeys();
		}
	}
}

/**
 * Shared singleton IndexedDB driver instance with automatic LocalStorage fallback.
 */
export const indexedDbDriver = new IndexedDBDriver();
