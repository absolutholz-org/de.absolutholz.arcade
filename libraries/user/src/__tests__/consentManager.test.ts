import {
	DEFAULT_CONSENT_PREFERENCES,
	loadConsentPreferences,
	resolveUserDataTier,
	saveConsentPreferences,
	subscribeToConsent,
} from '@arcade/lib-consent';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Setup in-memory localStorage and window mock for Node test environment
const mockStorageMap = new Map<string, string>();
const eventListeners = new Map<string, Set<(e: Event) => void>>();

const mockLocalStorage = {
	get length() {
		return mockStorageMap.size;
	},
	clear() {
		mockStorageMap.clear();
	},
	getItem(key: string) {
		return mockStorageMap.get(key) ?? null;
	},
	key(index: number) {
		return Array.from(mockStorageMap.keys())[index] ?? null;
	},
	removeItem(key: string) {
		mockStorageMap.delete(key);
	},
	setItem(key: string, value: string) {
		mockStorageMap.set(key, value);
	},
};

const mockWindow = {
	localStorage: mockLocalStorage,
	dispatchEvent(event: Event) {
		const listeners = eventListeners.get(event.type);
		if (listeners) {
			for (const listener of listeners) {
				listener(event);
			}
		}
		return true;
	},
	addEventListener(type: string, listener: (e: Event) => void) {
		if (!eventListeners.has(type)) {
			eventListeners.set(type, new Set());
		}
		eventListeners.get(type)?.add(listener);
	},
	removeEventListener(type: string, listener: (e: Event) => void) {
		eventListeners.get(type)?.delete(listener);
	},
};

Object.defineProperty(globalThis, 'localStorage', {
	value: mockLocalStorage,
	writable: true,
	configurable: true,
});
Object.defineProperty(globalThis, 'window', {
	value: mockWindow,
	writable: true,
	configurable: true,
});

describe('Consent Manager & 4-Tier Data Policy', () => {
	beforeEach(() => {
		mockStorageMap.clear();
		eventListeners.clear();
	});

	describe('resolveUserDataTier', () => {
		it('resolves Tier 1 (Anonymous Local) when unauthenticated and has no local profile', () => {
			expect(resolveUserDataTier(false, DEFAULT_CONSENT_PREFERENCES)).toBe(1);
			expect(
				resolveUserDataTier({ isAuthenticated: false, hasLocalProfile: false }, DEFAULT_CONSENT_PREFERENCES),
			).toBe(1);
		});

		it('resolves Tier 2 (Local Profile) when unauthenticated but has a named local profile', () => {
			expect(
				resolveUserDataTier({ isAuthenticated: false, hasLocalProfile: true }, DEFAULT_CONSENT_PREFERENCES),
			).toBe(2);
		});

		it('resolves Tier 2 (Logged-In Local-Only) when authenticated but cloudSync is false', () => {
			expect(
				resolveUserDataTier(true, {
					...DEFAULT_CONSENT_PREFERENCES,
					cloudSync: false,
					publicBroadcast: false,
				}),
			).toBe(2);
			expect(
				resolveUserDataTier(
					{ isAuthenticated: true, hasLocalProfile: true },
					{
						...DEFAULT_CONSENT_PREFERENCES,
						cloudSync: false,
						publicBroadcast: true,
					},
				),
			).toBe(2);
		});

		it('resolves Tier 3 (Cloud-Synced Private) when authenticated, cloudSync is true, but publicBroadcast is false', () => {
			expect(
				resolveUserDataTier(true, {
					...DEFAULT_CONSENT_PREFERENCES,
					cloudSync: true,
					publicBroadcast: false,
				}),
			).toBe(3);
			expect(
				resolveUserDataTier(
					{ isAuthenticated: true },
					{
						...DEFAULT_CONSENT_PREFERENCES,
						cloudSync: true,
						publicBroadcast: false,
					},
				),
			).toBe(3);
		});

		it('resolves Tier 4 (Cloud-Synced Public) when authenticated, cloudSync is true, and publicBroadcast is true', () => {
			expect(
				resolveUserDataTier(true, {
					...DEFAULT_CONSENT_PREFERENCES,
					cloudSync: true,
					publicBroadcast: true,
				}),
			).toBe(4);
			expect(
				resolveUserDataTier(
					{ isAuthenticated: true, hasLocalProfile: true },
					{
						...DEFAULT_CONSENT_PREFERENCES,
						cloudSync: true,
						publicBroadcast: true,
					},
				),
			).toBe(4);
		});
	});

	describe('saveConsentPreferences invariants', () => {
		it('enforces dependency rule: publicBroadcast cannot be true if cloudSync is false', () => {
			const saved = saveConsentPreferences({ cloudSync: false, publicBroadcast: true }, true);
			expect(saved.cloudSync).toBe(false);
			expect(saved.publicBroadcast).toBe(false);
		});

		it('allows cloudSync and publicBroadcast when both are true and authenticated', () => {
			const saved = saveConsentPreferences({ cloudSync: true, publicBroadcast: true }, true);
			expect(saved.cloudSync).toBe(true);
			expect(saved.publicBroadcast).toBe(true);
			expect(loadConsentPreferences().publicBroadcast).toBe(true);
		});
	});

	describe('subscribeToConsent cross-window listener', () => {
		it('notifies listeners when consent is saved', () => {
			const listener = vi.fn();
			const unsubscribe = subscribeToConsent(listener, true);

			saveConsentPreferences({ cloudSync: true }, true);

			expect(listener).toHaveBeenCalled();
			const emission = listener.mock.calls[0][0];
			expect(emission.preferences.cloudSync).toBe(true);

			unsubscribe();
		});
	});
});
