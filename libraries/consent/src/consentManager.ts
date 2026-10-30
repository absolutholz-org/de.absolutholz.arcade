import type {
	ConsentPreferences,
	ConsentUpdatedEventDetail,
	TierTransitionAction,
	TransitionWarning,
	UserDataTier,
	UserTierResolutionContext,
} from './types.js';

export const CONSENT_STORAGE_KEY = 'arcade::consent::preferences';
export const CONSENT_EVENT_NAME = 'consentUpdated';
export const CONSENT_BROADCAST_CHANNEL = 'arcade::consent::channel';
export const CURRENT_CONSENT_VERSION = 1;

const CLIENT_INSTANCE_ID =
	typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `tab_${Math.random().toString(36).substring(2, 9)}`;

export const DEFAULT_CONSENT_PREFERENCES: ConsentPreferences = {
	essentialStorage: true,
	cloudSync: false,
	publicBroadcast: false,
	analytics: false,
	updatedAt: 0,
	version: CURRENT_CONSENT_VERSION,
};

/**
 * Resolves the active UserDataTier dynamically based on authentication, local profile, and consent.
 * - Tier 1: Anonymous Local (unauthenticated guest, purely local device storage)
 * - Tier 2: Local Profile (local named profile or authenticated with sync disabled)
 * - Tier 3: Cloud-Synced (Private) (authenticated with cloud sync enabled, leaderboards disabled)
 * - Tier 4: Cloud-Synced (Public) (authenticated with cloud sync and leaderboards enabled)
 */
export function resolveUserDataTier(
	contextOrAuth: boolean | UserTierResolutionContext,
	preferences: ConsentPreferences,
): UserDataTier {
	const isAuthenticated = typeof contextOrAuth === 'boolean' ? contextOrAuth : Boolean(contextOrAuth.isAuthenticated);
	const hasLocalProfile = typeof contextOrAuth === 'boolean' ? false : Boolean(contextOrAuth.hasLocalProfile);

	if (isAuthenticated) {
		if (!preferences.cloudSync) {
			return 2; // Tier 2: Logged-In Local-Only
		}
		if (!preferences.publicBroadcast) {
			return 3; // Tier 3: Cloud-Synced (Private)
		}
		return 4; // Tier 4: Cloud-Synced (Public)
	}

	return hasLocalProfile ? 2 : 1;
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
 * Persists consent preferences, enforces dependency invariants, evaluates tier changes,
 * and broadcasts updates across windows/tabs.
 */
export function saveConsentPreferences(
	updates: Partial<ConsentPreferences>,
	contextOrAuth: boolean | UserTierResolutionContext = false,
): ConsentPreferences {
	const current = loadConsentPreferences();
	const previousTier = resolveUserDataTier(contextOrAuth, current);
	const isAuthenticated = typeof contextOrAuth === 'boolean' ? contextOrAuth : Boolean(contextOrAuth.isAuthenticated);

	// Dependency Rule: Public broadcast strictly requires cloudSync to be enabled.
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

	const newTier = resolveUserDataTier(contextOrAuth, updated);
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

		// 1. Same-window custom event
		window.dispatchEvent(new CustomEvent<ConsentUpdatedEventDetail>(CONSENT_EVENT_NAME, { detail }));

		// 2. Cross-tab/window BroadcastChannel
		if (typeof BroadcastChannel !== 'undefined') {
			try {
				const channel = new BroadcastChannel(CONSENT_BROADCAST_CHANNEL);
				(channel as unknown as { unref?: () => void }).unref?.();
				channel.postMessage({ type: 'CONSENT_UPDATED', detail, senderId: CLIENT_INSTANCE_ID });
				channel.close();
			} catch {
				// BroadcastChannel fallback handled by storage event
			}
		}
	}

	return updated;
}

/**
 * Subscribes to consent changes across local component state, dialogs,
 * and other open tabs/windows via BroadcastChannel and StorageEvent.
 */
export function subscribeToConsent(
	callback: (detail: ConsentUpdatedEventDetail) => void,
	contextOrAuth: boolean | UserTierResolutionContext = false,
): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	// 1. Same-window event listener
	const listener = (event: Event) => {
		const customEvent = event as CustomEvent<ConsentUpdatedEventDetail>;
		if (customEvent.detail) {
			callback(customEvent.detail);
		}
	};
	window.addEventListener(CONSENT_EVENT_NAME, listener);

	// 2. Cross-window BroadcastChannel listener
	let channel: BroadcastChannel | null = null;
	if (typeof BroadcastChannel !== 'undefined') {
		try {
			channel = new BroadcastChannel(CONSENT_BROADCAST_CHANNEL);
			(channel as unknown as { unref?: () => void }).unref?.();
			channel.onmessage = (event: MessageEvent) => {
				if (
					event.data?.type === 'CONSENT_UPDATED' &&
					event.data.detail &&
					event.data.senderId !== CLIENT_INSTANCE_ID
				) {
					callback(event.data.detail);
				}
			};
		} catch {
			channel = null;
		}
	}

	// 3. Fallback cross-window storage event listener
	const storageListener = (event: StorageEvent) => {
		if (event.key === CONSENT_STORAGE_KEY && event.newValue) {
			try {
				const updated = loadConsentPreferences();
				const currentTier = resolveUserDataTier(contextOrAuth, updated);
				const detail: ConsentUpdatedEventDetail = {
					preferences: updated,
					tier: currentTier,
					previousTier: currentTier,
					action: 'none',
				};
				callback(detail);
			} catch {
				// Ignore parsing errors
			}
		}
	};
	window.addEventListener('storage', storageListener);

	return () => {
		window.removeEventListener(CONSENT_EVENT_NAME, listener);
		window.removeEventListener('storage', storageListener);
		if (channel) {
			channel.close();
		}
	};
}
