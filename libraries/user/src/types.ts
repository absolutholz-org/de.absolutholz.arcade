/**
 * Persistence medium mode for user data and game progress.
 * - 'local': Data is stored strictly on the local device via scoped client storage.
 * - 'cloud': Data is synchronized with Firebase Firestore and cloud account services.
 */
export type StorageMode = 'local' | 'cloud';

/**
 * Player avatar representation constrained to valid unicode emoji graphemes.
 */
export interface PlayerAvatar {
	type: 'emoji';
	value: string; // valid single unicode emoji grapheme
}

/**
 * Four user data tiers defined in ADR 0003:
 * - Tier 1: Unauthenticated (local only)
 * - Tier 2: Authenticated, cloudSync = false
 * - Tier 3: Authenticated, cloudSync = true, publicConsent = false
 * - Tier 4: Authenticated, cloudSync = true, publicConsent = true
 */
export type DataTier = 1 | 2 | 3 | 4;

/**
 * Pure helper mapping authentication and consent state to ADR 0003 four data tiers.
 *
 * @param isAuthenticated Whether the player is authenticated with a cloud identity.
 * @param cloudSyncEnabled Whether the player has opted into cloud synchronization.
 * @param publicConsent Whether the player has consented to public leaderboard/profile broadcasting.
 * @returns Resolved DataTier (1 | 2 | 3 | 4).
 */
export function resolveCurrentDataTier(
	isAuthenticated: boolean,
	cloudSyncEnabled: boolean,
	publicConsent: boolean,
): DataTier {
	if (!isAuthenticated) {
		return 1;
	}
	if (!cloudSyncEnabled) {
		return 2;
	}
	if (!publicConsent) {
		return 3;
	}
	return 4;
}

/**
 * Canonical fallback emoji avatar ('👾').
 */
export const DEFAULT_PLAYER_AVATAR: PlayerAvatar = {
	type: 'emoji',
	value: '👾',
};

/**
 * Canonical default fallback player display name.
 */
export const DEFAULT_PLAYER_NAME = 'Player';

/**
 * Maximum character length for player display names.
 */
export const MAX_DISPLAY_NAME_LENGTH = 24;

/**
 * Sanitizes and trims a player display name, enforcing maximum character constraints
 * and defaulting gracefully to the specified fallback.
 */
export function sanitizeDisplayName(name?: string | null, fallback = DEFAULT_PLAYER_NAME): string {
	if (!name) {
		return fallback;
	}
	const trimmed = name.trim();
	if (!trimmed) {
		return fallback;
	}
	return trimmed.slice(0, MAX_DISPLAY_NAME_LENGTH);
}

/**
 * Validates whether a string constitutes a single unicode emoji grapheme.
 */
export function isValidSingleGraphemeEmoji(value: unknown): boolean {
	if (typeof value !== 'string') {
		return false;
	}
	const trimmed = value.trim();
	if (!trimmed) {
		return false;
	}

	if (typeof Intl !== 'undefined' && Intl.Segmenter) {
		try {
			const segmenter = new Intl.Segmenter();
			const segments = Array.from(segmenter.segment(trimmed));
			return segments.length === 1;
		} catch {
			// Fall back to non-empty string check if segmenter throws
		}
	}
	return trimmed.length > 0;
}

/**
 * Sanitizes and validates a player avatar object, falling back gracefully to the default.
 */
export function sanitizePlayerAvatar(avatar?: unknown, fallback: PlayerAvatar = DEFAULT_PLAYER_AVATAR): PlayerAvatar {
	if (
		avatar &&
		typeof avatar === 'object' &&
		(avatar as PlayerAvatar).type === 'emoji' &&
		typeof (avatar as PlayerAvatar).value === 'string' &&
		isValidSingleGraphemeEmoji((avatar as PlayerAvatar).value)
	) {
		return {
			type: 'emoji',
			value: (avatar as PlayerAvatar).value.trim(),
		};
	}
	return fallback;
}

/**
 * Public domain contract representing an active or guest player profile.
 */
export interface PlayerProfile {
	/**
	 * Unique identifier for the user (guest UUID or Firebase auth UID).
	 */
	readonly id: string;

	/**
	 * Public display name of the user (trimmed, max 24 chars, default fallback 'Player').
	 */
	readonly displayName: string;

	/**
	 * Avatar representing the player.
	 */
	readonly avatar: PlayerAvatar;

	/**
	 * Current storage persistence mode.
	 */
	readonly storageMode: StorageMode;

	/**
	 * Creation timestamp (milliseconds since Unix epoch).
	 */
	readonly createdAt: number;

	/**
	 * Last updated timestamp (milliseconds since Unix epoch).
	 */
	readonly updatedAt: number;

	/**
	 * Optional email address for authenticated cloud users.
	 */
	readonly email?: string | null;

	/**
	 * Optional avatar / photo URL.
	 */
	readonly photoURL?: string | null;
}

/**
 * Alias for PlayerProfile ensuring backward compatibility with existing monorepo contracts.
 */
export type UserProfile = PlayerProfile;

/**
 * Deserializes and hydrates a raw stored profile object into a type-safe PlayerProfile,
 * ensuring robust fallback handling for legacy profiles missing avatar or updatedAt.
 */
export function hydratePlayerProfile(raw: Record<string, unknown>, fallbackName = DEFAULT_PLAYER_NAME): PlayerProfile {
	const id = typeof raw.id === 'string' && raw.id ? raw.id : 'guest_legacy';
	const displayName = sanitizeDisplayName(raw.displayName as string | undefined, fallbackName);
	const avatar = sanitizePlayerAvatar(raw.avatar, DEFAULT_PLAYER_AVATAR);
	const storageMode = (raw.storageMode === 'cloud' ? 'cloud' : 'local') as StorageMode;
	const createdAt = typeof raw.createdAt === 'number' && !Number.isNaN(raw.createdAt) ? raw.createdAt : Date.now();
	const updatedAt = typeof raw.updatedAt === 'number' && !Number.isNaN(raw.updatedAt) ? raw.updatedAt : createdAt;

	return {
		id,
		displayName,
		avatar,
		storageMode,
		createdAt,
		updatedAt,
		...(typeof raw.email === 'string' ? { email: raw.email } : raw.email === null ? { email: null } : {}),
		...(typeof raw.photoURL === 'string'
			? { photoURL: raw.photoURL }
			: raw.photoURL === null
				? { photoURL: null }
				: {}),
	};
}

/**
 * Serializes a PlayerProfile into normalized storage form.
 */
export function serializePlayerProfile(profile: PlayerProfile): PlayerProfile {
	return {
		id: profile.id,
		displayName: sanitizeDisplayName(profile.displayName),
		avatar: sanitizePlayerAvatar(profile.avatar),
		storageMode: profile.storageMode,
		createdAt: profile.createdAt,
		updatedAt: profile.updatedAt || Date.now(),
		...(profile.email !== undefined ? { email: profile.email } : {}),
		...(profile.photoURL !== undefined ? { photoURL: profile.photoURL } : {}),
	};
}

/**
 * Common storage adapter interface for player profile persistence.
 * Adheres to ADR 0003 & ADR 0008 storage abstraction.
 */
export interface IStorageAdapter {
	/**
	 * Retrieves and hydrates the persisted local user profile, applying legacy fallbacks.
	 */
	getProfile(): Promise<PlayerProfile | null>;

	/**
	 * Serializes and persists the player profile.
	 */
	saveProfile(profile: PlayerProfile): Promise<void>;

	/**
	 * Removes the stored player profile.
	 */
	clearProfile(): Promise<void>;

	/**
	 * Retrieves the persisted storage mode preference.
	 */
	getStorageMode(): Promise<StorageMode | null>;

	/**
	 * Persists the storage mode preference.
	 */
	setStorageMode(mode: StorageMode): Promise<void>;
}

/**
 * Public domain contract representing the current authentication and sync session state.
 */
export interface UserSession {
	/**
	 * Active user profile, or null if no session has been established.
	 */
	readonly user: PlayerProfile | null;

	/**
	 * Whether the current session is backed by an authenticated cloud identity.
	 */
	readonly isAuthenticated: boolean;

	/**
	 * Whether user progress and data are actively synchronized with cloud persistence.
	 */
	readonly isCloudSynced: boolean;
}

/**
 * Callback cleanup signature returned by event and state subscriptions.
 */
export type Unsubscribe = () => void;

/**
 * Configuration options for initializing the user service facade.
 * Consuming applications do not pass low-level Firebase objects here.
 */
export interface UserServiceOptions {
	/**
	 * Optional custom Firebase client configuration.
	 * If omitted, the service will fall back to environment variables or local-only mode.
	 */
	readonly firebaseConfig?: {
		readonly apiKey: string;
		readonly authDomain?: string;
		readonly projectId: string;
		readonly storageBucket?: string;
		readonly messagingSenderId?: string;
		readonly appId: string;
	};

	/**
	 * Preferred initial storage mode if no existing profile is found.
	 * Defaults to 'local'.
	 */
	readonly defaultStorageMode?: StorageMode;
}

/**
 * Modifiable attributes when updating player profile state.
 */
export interface ProfileUpdates {
	readonly displayName?: string;
	readonly avatar?: PlayerAvatar;
}

/**
 * Unified facade interface for user profile, authentication lifecycle,
 * and storage mode transitions.
 */
export interface IUserService {
	/**
	 * Synchronously returns the current session snapshot.
	 */
	getSession(): UserSession;

	/**
	 * Subscribes to user session state transitions.
	 * The listener is immediately invoked with the current session snapshot.
	 *
	 * @param listener Function receiving the updated session.
	 * @returns An Unsubscribe callback to release the subscription.
	 */
	subscribe(listener: (session: UserSession) => void): Unsubscribe;

	/**
	 * Initializes the user service, restoring existing sessions from local storage
	 * and attaching cloud authentication observers.
	 *
	 * @returns The resolved initial user session.
	 */
	initialize(): Promise<UserSession>;

	/**
	 * Transitions the active session to an anonymous cloud or local guest profile.
	 *
	 * @returns The resulting PlayerProfile.
	 */
	signInAnonymously(): Promise<PlayerProfile>;

	/**
	 * Initiates OAuth sign-in with Google.
	 * Transitions storage mode to 'cloud' upon successful authentication.
	 *
	 * @returns The resulting authenticated PlayerProfile.
	 */
	signInWithGoogle(): Promise<PlayerProfile>;

	/**
	 * Registers a new user account with email and password.
	 * Transitions storage mode to 'cloud' upon successful registration.
	 *
	 * @param email User's email address.
	 * @param password User's chosen password.
	 * @param displayName Optional user display name.
	 * @returns The resulting authenticated PlayerProfile.
	 */
	signUpWithEmail(email: string, password: string, displayName?: string): Promise<PlayerProfile>;

	/**
	 * Alias for signUpWithEmail.
	 */
	signUpWithEmailPassword(email: string, password: string, displayName?: string): Promise<PlayerProfile>;

	/**
	 * Authenticates an existing user account with email and password.
	 * Transitions storage mode to 'cloud' upon successful sign-in.
	 *
	 * @param email User's registered email address.
	 * @param password User's account password.
	 * @returns The resulting authenticated PlayerProfile.
	 */
	signInWithEmail(email: string, password: string): Promise<PlayerProfile>;

	/**
	 * Alias for signInWithEmail.
	 */
	signInWithEmailPassword(email: string, password: string): Promise<PlayerProfile>;

	/**
	 * Dispatches a password reset email to the specified email address.
	 *
	 * @param email User's registered email address.
	 */
	sendPasswordReset(email: string): Promise<void>;

	/**
	 * Alias for sendPasswordReset.
	 */
	sendPasswordResetEmail(email: string): Promise<void>;

	/**
	 * Signs out of cloud authentication and reverts the active session to a local guest profile.
	 */
	signOut(): Promise<void>;

	/**
	 * Updates the current user's profile attributes (e.g. display name, avatar).
	 *
	 * @param updates Subset of profile fields to modify.
	 * @returns The updated PlayerProfile.
	 */
	updateProfile(updates: ProfileUpdates): Promise<PlayerProfile>;

	/**
	 * Updates the current user's display name.
	 *
	 * @param name New display name.
	 * @returns The updated PlayerProfile.
	 */
	updateDisplayName(name: string): Promise<PlayerProfile>;

	/**
	 * Updates the current user's player avatar.
	 *
	 * @param avatar New PlayerAvatar.
	 * @returns The updated PlayerProfile.
	 */
	updateAvatar(avatar: PlayerAvatar): Promise<PlayerProfile>;

	/**
	 * Switches the active persistence mode between 'local' and 'cloud'.
	 *
	 * @param mode Target storage mode.
	 */
	setStorageMode(mode: StorageMode): Promise<void>;
}
