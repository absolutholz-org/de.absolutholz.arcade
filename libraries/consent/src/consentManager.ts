import type {
	ConsentPreferences,
	ConsentUpdatedEventDetail,
	TierTransitionAction,
	TransitionWarning,
	UserDataTier,
} from './types.js';

export const CONSENT_STORAGE_KEY = 'arcade::consent::preferences';
export const CONSENT_EVENT_NAME = 'consentUpdated';
export const CURRENT_CONSENT_VERSION = 1;

export const DEFAULT_CONSENT_PREFERENCES: ConsentPreferences = {
	essentialStorage: true,
	cloudSync: false,
	publicBroadcast: false,
	analytics: false,
	updatedAt: 0,
	version: CURRENT_CONSENT_VERSION,
};

/**
 * Resolves the active UserDataTier based on authentication status and consent.
 */
export function resolveUserDataTier(isAuthenticated: boolean, preferences: ConsentPreferences): UserDataTier {
	if (!isAuthenticated) {
		return 1; // Tier 1: Anonymous Local
	}
	if (!preferences.cloudSync) {
		return 2; // Tier 2: Logged-In Local-Only
	}
	if (!preferences.publicBroadcast) {
		return 3; // Tier 3: Logged-In Cloud-Synced Private
	}
	return 4; // Tier 4: Logged-In Cloud-Synced Public
}

/**
 * Determines whether a tier transition requires user warning/confirmation,
 * and what cloud data action must be taken per ADR 0003.
 */
export function evaluateTransitionWarning(currentTier: UserDataTier, targetTier: UserDataTier): TransitionWarning {
	// Downgrading from Tier 4 to Tier 3: Stop public broadcasting, retain cloud data
	if (currentTier === 4 && targetTier === 3) {
		return {
			requiresConfirmation: true,
			action: 'retain_cloud_stop_broadcast',
			warningKey: 'consent.warnings.stopPublicBroadcast',
		};
	}

	// Downgrading from Tier 3 or 4 to Tier 2 or 1: Stop sync, delete remote cloud data, retain local data
	if ((currentTier === 3 || currentTier === 4) && targetTier <= 2) {
		return {
			requiresConfirmation: true,
			action: 'delete_cloud_retain_local',
			warningKey: 'consent.warnings.deleteCloudRetainLocal',
		};
	}

	return {
		requiresConfirmation: false,
		action: 'none',
		warningKey: '',
	};
}

/**
 * Loads persisted consent preferences from localStorage (SSR-safe).
 */
export function loadConsentPreferences(): ConsentPreferences {
	if (typeof window === 'undefined') {
		return DEFAULT_CONSENT_PREFERENCES;
	}

	try {
		const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
		if (!raw) {
			return DEFAULT_CONSENT_PREFERENCES;
		}
		const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
		return {
			...DEFAULT_CONSENT_PREFERENCES,
			...parsed,
			essentialStorage: true, // Immutable
			version: parsed.version ?? CURRENT_CONSENT_VERSION,
		};
	} catch {
		return DEFAULT_CONSENT_PREFERENCES;
	}
}

/**
 * Persists consent preferences, evaluates tier change, and dispatches 'consentUpdated' event.
 */
export function saveConsentPreferences(
	updates: Partial<ConsentPreferences>,
	isAuthenticated = false,
): ConsentPreferences {
	const current = loadConsentPreferences();
	const previousTier = resolveUserDataTier(isAuthenticated, current);

	// Public broadcast strictly requires cloudSync to be enabled
	const resolvedCloudSync = updates.cloudSync ?? current.cloudSync;
	const resolvedPublicBroadcast = resolvedCloudSync ? (updates.publicBroadcast ?? current.publicBroadcast) : false;

	const updated: ConsentPreferences = {
		...current,
		...updates,
		cloudSync: resolvedCloudSync,
		publicBroadcast: resolvedPublicBroadcast,
		essentialStorage: true,
		updatedAt: Date.now(),
		version: CURRENT_CONSENT_VERSION,
	};

	const newTier = resolveUserDataTier(isAuthenticated, updated);
	const { action } = evaluateTransitionWarning(previousTier, newTier);

	if (typeof window !== 'undefined') {
		try {
			window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
		} catch {
			// LocalStorage write error (e.g. quota exceeded or private mode)
		}

		const detail: ConsentUpdatedEventDetail = {
			preferences: updated,
			tier: newTier,
			previousTier,
			action,
		};

		window.dispatchEvent(new CustomEvent<ConsentUpdatedEventDetail>(CONSENT_EVENT_NAME, { detail }));
	}

	return updated;
}

/**
 * Subscribes to window consent change events (SSR-safe).
 */
export function subscribeToConsent(callback: (detail: ConsentUpdatedEventDetail) => void): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const listener = (event: Event) => {
		const customEvent = event as CustomEvent<ConsentUpdatedEventDetail>;
		if (customEvent.detail) {
			callback(customEvent.detail);
		}
	};

	window.addEventListener(CONSENT_EVENT_NAME, listener);
	return () => {
		window.removeEventListener(CONSENT_EVENT_NAME, listener);
	};
}
