/**
 * Shared storage keys for design system components and browser persistence.
 * Follows ADR 012 key namespacing format: arcade::[scope]::[key].
 */
export const STORAGE_KEYS = {
	SCHEME: 'arcade::ui::scheme',
	THEMESET: 'arcade::ui::themeset',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
