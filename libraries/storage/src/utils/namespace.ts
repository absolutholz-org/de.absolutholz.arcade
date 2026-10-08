export const ARCADE_STORAGE_PREFIX = 'arcade';
export const ARCADE_STORAGE_DELIMITER = '::';

/**
 * Builds a strictly namespaced storage key adhering to ADR 012:
 * `arcade::[appName]::[key]`
 *
 * @throws Error if appName or key is empty or invalid.
 */
export function buildStorageKey(appName: string, key: string): string {
	if (!appName || typeof appName !== 'string' || appName.trim().length === 0) {
		throw new Error('Storage namespacing error: "appName" is required and must be a non-empty string.');
	}
	if (!key || typeof key !== 'string' || key.trim().length === 0) {
		throw new Error('Storage namespacing error: "key" is required and must be a non-empty string.');
	}

	return `${ARCADE_STORAGE_PREFIX}${ARCADE_STORAGE_DELIMITER}${appName.trim()}${ARCADE_STORAGE_DELIMITER}${key.trim()}`;
}

/**
 * Parses a raw namespaced key and extracts the relative key if it belongs
 * to the given application scope. Returns null if the key does not match.
 */
export function parseStorageKey(appName: string, namespacedKey: string): string | null {
	const prefix = `${ARCADE_STORAGE_PREFIX}${ARCADE_STORAGE_DELIMITER}${appName}${ARCADE_STORAGE_DELIMITER}`;
	if (namespacedKey.startsWith(prefix)) {
		return namespacedKey.slice(prefix.length);
	}
	return null;
}
