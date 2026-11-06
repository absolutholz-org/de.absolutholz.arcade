import type { LogEntry } from './types.js';

export const DB_NAME = 'arcade_diagnostics';
export const DB_VERSION = 1;
export const STORE_NAME = 'logs';
export const DEFAULT_RETENTION_DAYS = 7;
const MS_PER_DAY = 86_400_000;

let dbPromise: Promise<IDBDatabase | null> | null = null;

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function transactionDone(tx: IDBTransaction): Promise<void> {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error);
	});
}

function deleteOlderThan(db: IDBDatabase, retentionDays: number): Promise<number> {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		const index = tx.objectStore(STORE_NAME).index('by_timestamp');
		const range = IDBKeyRange.upperBound(Date.now() - retentionDays * MS_PER_DAY);
		let deleted = 0;
		const cursorRequest = index.openCursor(range);
		cursorRequest.onsuccess = () => {
			const cursor = cursorRequest.result;
			if (cursor) {
				cursor.delete();
				deleted += 1;
				cursor.continue();
			}
		};
		tx.oncomplete = () => resolve(deleted);
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error);
	});
}

/**
 * Opens (once) the diagnostics database. Resolves `null` when IndexedDB is
 * unavailable or blocked (e.g. private browsing). Lazily prunes stale logs.
 */
export function openDatabase(): Promise<IDBDatabase | null> {
	if (dbPromise) return dbPromise;
	dbPromise = new Promise<IDBDatabase | null>((resolve) => {
		try {
			if (typeof indexedDB === 'undefined') {
				resolve(null);
				return;
			}
			const request = indexedDB.open(DB_NAME, DB_VERSION);
			request.onupgradeneeded = () => {
				const db = request.result;
				const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
				store.createIndex('by_timestamp', 'timestamp');
				store.createIndex('by_source', 'source');
				store.createIndex('by_level', 'level');
			};
			request.onsuccess = () => {
				const db = request.result;
				db.onversionchange = () => {
					db.close();
					dbPromise = null;
				};
				resolve(db);
				// Lazy, non-blocking cleanup.
				deleteOlderThan(db, DEFAULT_RETENTION_DAYS).catch(() => undefined);
			};
			request.onerror = () => resolve(null);
			request.onblocked = () => resolve(null);
		} catch {
			resolve(null);
		}
	});
	return dbPromise;
}

/** Appends an entry. Never throws. */
export async function addLogEntry(entry: LogEntry): Promise<void> {
	try {
		const db = await openDatabase();
		if (!db) return;
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).add(entry);
		await transactionDone(tx);
	} catch {
		// Logging must never break the host application.
	}
}

/** Deletes entries older than `retentionDays`. Resolves the number removed (0 on failure). */
export async function pruneStaleLogs(retentionDays = DEFAULT_RETENTION_DAYS): Promise<number> {
	try {
		const db = await openDatabase();
		if (!db) return 0;
		return await deleteOlderThan(db, retentionDays);
	} catch {
		return 0;
	}
}

/** Reads entries with `timestamp >= sinceTimestamp`, ordered ascending by time. */
export async function readLogsSince(sinceTimestamp: number): Promise<LogEntry[]> {
	try {
		const db = await openDatabase();
		if (!db) return [];
		const tx = db.transaction(STORE_NAME, 'readonly');
		const index = tx.objectStore(STORE_NAME).index('by_timestamp');
		return await requestToPromise<LogEntry[]>(index.getAll(IDBKeyRange.lowerBound(sinceTimestamp)));
	} catch {
		return [];
	}
}

/** Removes every entry. Never throws. */
export async function clearLogStore(): Promise<void> {
	try {
		const db = await openDatabase();
		if (!db) return;
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).clear();
		await transactionDone(tx);
	} catch {
		// ignore
	}
}

/** Closes the cached connection and forgets it. Intended for tests. */
export async function resetDatabaseConnection(): Promise<void> {
	const pending = dbPromise;
	dbPromise = null;
	const db = pending ? await pending : null;
	db?.close();
}
