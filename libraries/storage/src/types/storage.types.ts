/**
 * Low-level storage driver interface.
 * Drivers provide raw key-value access to a specific storage medium
 * (e.g., localStorage, sessionStorage, in-memory Map, IndexedDB, Firebase).
 */
export interface StorageDriver {
	/**
	 * Unique identifier name of the driver (e.g. 'local-storage', 'memory', 'session-storage').
	 */
	readonly name: string;

	/**
	 * Checks whether the underlying storage mechanism is available and writable in the current runtime environment.
	 */
	isAvailable(): boolean;

	/**
	 * Retrieves a raw string item by key.
	 */
	getItem(key: string): Promise<string | null>;

	/**
	 * Persists a raw string item by key.
	 */
	setItem(key: string, value: string): Promise<void>;

	/**
	 * Removes a specific item by key.
	 */
	removeItem(key: string): Promise<void>;

	/**
	 * Returns all raw keys currently stored in this storage medium.
	 */
	getAllKeys(): Promise<string[]>;
}

/**
 * Options for configuring a GameStorage instance.
 */
export interface GameStorageOptions {
	/**
	 * Custom driver instance. If omitted, defaults to the browser's LocalStorage driver
	 * with an automatic fallback to an in-memory driver during SSR or if storage is blocked.
	 */
	driver?: StorageDriver;
}

/**
 * Scoped, asynchronous game storage client.
 * Automatically enforces namespacing (arcade::[appName]::[key]) and JSON serialization.
 */
export interface GameStorage {
	/**
	 * The application scope identifier for this storage instance (e.g. 'sudoku').
	 */
	readonly appName: string;

	/**
	 * Name of the active underlying storage driver.
	 */
	readonly driverName: string;

	/**
	 * Retrieves and deserializes a value by relative key.
	 * Returns null if the key does not exist.
	 */
	get<T>(key: string): Promise<T | null>;

	/**
	 * Serializes and stores a value under the scoped relative key.
	 */
	set<T>(key: string, value: T): Promise<void>;

	/**
	 * Removes a stored value by relative key.
	 */
	remove(key: string): Promise<void>;

	/**
	 * Clears all stored keys belonging exclusively to this application scope,
	 * leaving all other games and arcade applications completely untouched.
	 */
	clear(): Promise<void>;

	/**
	 * Returns all relative keys currently stored for this application scope.
	 */
	keys(): Promise<string[]>;
}
