/**
 * Persistence medium mode for user data and game progress.
 * - 'local': Data is stored strictly on the local device via scoped client storage.
 * - 'cloud': Data is synchronized with Firebase Firestore and cloud account services.
 */
export type StorageMode = 'local' | 'cloud';

/**
 * Public domain contract representing an active or guest user profile.
 */
export interface UserProfile {
	/**
	 * Unique identifier for the user (guest UUID or Firebase auth UID).
	 */
	readonly id: string;

	/**
	 * Public display name of the user.
	 */
	readonly displayName: string;

	/**
	 * Current storage persistence mode.
	 */
	readonly storageMode: StorageMode;

	/**
	 * Creation timestamp (milliseconds since Unix epoch).
	 */
	readonly createdAt: number;

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
 * Public domain contract representing the current authentication and sync session state.
 */
export interface UserSession {
	/**
	 * Active user profile, or null if no session has been established.
	 */
	readonly user: UserProfile | null;

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
	 * @returns The resulting UserProfile.
	 */
	signInAnonymously(): Promise<UserProfile>;

	/**
	 * Initiates OAuth sign-in with Google.
	 * Transitions storage mode to 'cloud' upon successful authentication.
	 *
	 * @returns The resulting authenticated UserProfile.
	 */
	signInWithGoogle(): Promise<UserProfile>;

	/**
	 * Registers a new user account with email and password.
	 * Transitions storage mode to 'cloud' upon successful registration.
	 *
	 * @param email User's email address.
	 * @param password User's chosen password.
	 * @param displayName Optional user display name.
	 * @returns The resulting authenticated UserProfile.
	 */
	signUpWithEmail(email: string, password: string, displayName?: string): Promise<UserProfile>;

	/**
	 * Authenticates an existing user account with email and password.
	 * Transitions storage mode to 'cloud' upon successful sign-in.
	 *
	 * @param email User's registered email address.
	 * @param password User's account password.
	 * @returns The resulting authenticated UserProfile.
	 */
	signInWithEmail(email: string, password: string): Promise<UserProfile>;

	/**
	 * Dispatches a password reset email to the specified email address.
	 *
	 * @param email User's registered email address.
	 */
	sendPasswordReset(email: string): Promise<void>;

	/**
	 * Signs out of cloud authentication and reverts the active session to a local guest profile.
	 */
	signOut(): Promise<void>;

	/**
	 * Updates the current user's profile attributes (e.g. display name).
	 *
	 * @param updates Subset of profile fields to modify.
	 * @returns The updated UserProfile.
	 */
	updateProfile(updates: { displayName: string }): Promise<UserProfile>;

	/**
	 * Updates the current user's display name.
	 *
	 * @param name New display name.
	 * @returns The updated UserProfile.
	 */
	updateDisplayName(name: string): Promise<UserProfile>;

	/**
	 * Switches the active persistence mode between 'local' and 'cloud'.
	 *
	 * @param mode Target storage mode.
	 */
	setStorageMode(mode: StorageMode): Promise<void>;
}
