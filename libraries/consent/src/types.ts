/**
 * Four user data tiers defined in ADR 0003.
 */
export type UserDataTier = 1 | 2 | 3 | 4;

/**
 * Contextual state for deterministic data tier evaluation.
 */
export interface UserTierResolutionContext {
	readonly isAuthenticated: boolean;
	readonly hasLocalProfile?: boolean;
}

export interface UserDataTierInfo {
	readonly tier: UserDataTier;
	readonly name: string;
	readonly descriptionKey: string;
	readonly isAuthenticated: boolean;
	readonly isCloudSynced: boolean;
	readonly isPublicBroadcast: boolean;
}

/**
 * Granular consent preferences adhering to strict opt-in privacy.
 */
export interface ConsentPreferences {
	/**
	 * Core functionality storage (IndexedDB/localStorage).
	 * Active by default and immutable for core game functioning.
	 */
	readonly essentialStorage: true;

	/**
	 * Cloud sync for cross-device persistence (Firestore private user collection).
	 * Strictly opt-in (disabled by default).
	 */
	readonly cloudSync: boolean;

	/**
	 * Public broadcasting to global leaderboards or public player cards.
	 * Strictly opt-in (disabled by default). Requires cloudSync to be true.
	 */
	readonly publicBroadcast: boolean;

	/**
	 * Optional client performance / error telemetry.
	 * Strictly opt-in (disabled by default).
	 */
	readonly analytics: boolean;

	/**
	 * Epoch timestamp when consent was granted or modified.
	 */
	readonly updatedAt: number;

	/**
	 * Schema version for future consent policy updates.
	 */
	readonly version: number;
}

/**
 * Action required on backend data when downgrading tiers.
 */
export type TierTransitionAction = 'none' | 'retain_cloud_stop_broadcast' | 'delete_cloud_retain_local';

export interface TransitionWarning {
	readonly requiresConfirmation: boolean;
	readonly action: TierTransitionAction;
	readonly warningKey: string;
}

/**
 * Custom event payload dispatched on window when consent changes.
 */
export interface ConsentUpdatedEventDetail {
	readonly preferences: ConsentPreferences;
	readonly tier: UserDataTier;
	readonly previousTier: UserDataTier;
	readonly action: TierTransitionAction;
}
