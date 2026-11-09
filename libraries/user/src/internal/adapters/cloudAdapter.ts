import {
	type User as FirebaseUser,
	GoogleAuthProvider,
	createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
	sendPasswordResetEmail as firebaseSendPasswordResetEmail,
	signInAnonymously as firebaseSignInAnonymously,
	signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
	signOut as firebaseSignOut,
	updateProfile as firebaseUpdateProfile,
	onAuthStateChanged,
	signInWithPopup,
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import {
	DEFAULT_PLAYER_AVATAR,
	DEFAULT_PLAYER_NAME,
	type PlayerAvatar,
	type PlayerProfile,
	type ProfileUpdates,
	type Unsubscribe,
	type UserPreferences,
	sanitizeDisplayName,
	sanitizePlayerAvatar,
} from '../../types.js';
import { type FirebaseServices, getFirebaseServices } from '../firebase.js';

const USERS_COLLECTION = 'users';

/**
 * Maps a low-level Firebase User and optional Firestore document data into
 * the public domain PlayerProfile contract.
 * Ensures graceful fallback when existing documents only contain displayName or lack avatar.
 */
export function mapFirebaseUserToProfile(
	user: FirebaseUser,
	firestoreData?: Partial<PlayerProfile> | Record<string, unknown> | null,
): PlayerProfile {
	const defaultDisplayName =
		user.displayName || user.email?.split('@')[0] || (user.isAnonymous ? 'Guest' : DEFAULT_PLAYER_NAME);
	const rawName = (firestoreData?.displayName as string | undefined) || defaultDisplayName;
	const displayName = sanitizeDisplayName(rawName, DEFAULT_PLAYER_NAME);
	const avatar = sanitizePlayerAvatar(firestoreData?.avatar, DEFAULT_PLAYER_AVATAR);
	const createdAt =
		(typeof firestoreData?.createdAt === 'number' ? firestoreData.createdAt : null) ||
		(user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now());
	const updatedAt = typeof firestoreData?.updatedAt === 'number' ? firestoreData.updatedAt : createdAt;

	return {
		id: user.uid,
		displayName,
		avatar,
		storageMode: 'cloud',
		createdAt,
		updatedAt,
		email: user.email ?? null,
		photoURL: user.photoURL ?? null,
	};
}

/**
 * Adapter encapsulating Firebase Auth and Cloud Firestore persistence.
 * Maps all Firebase SDK events to domain PlayerProfile instances.
 */
export class CloudAdapter {
	private services: FirebaseServices | null;

	constructor(services?: FirebaseServices | null) {
		this.services = services ?? getFirebaseServices();
	}

	/**
	 * Checks whether Firebase services are initialized and ready for cloud operations.
	 */
	isAvailable(): boolean {
		if (!this.services) {
			this.services = getFirebaseServices();
		}
		return this.services !== null;
	}

	/**
	 * Obtains active services or throws an informative error if unconfigured.
	 */
	private getActiveServices(): FirebaseServices {
		if (!this.services) {
			this.services = getFirebaseServices();
		}
		if (!this.services) {
			throw new Error('[@arcade/lib-user] Cloud services are unavailable: Firebase has not been initialized.');
		}
		return this.services;
	}

	/**
	 * Fetches user profile document from Cloud Firestore.
	 * Hydrates missing avatar and updatedAt with graceful defaults for backward compatibility.
	 */
	async getProfileDoc(uid: string): Promise<Partial<PlayerProfile> | null> {
		const { firestore } = this.getActiveServices();
		try {
			const userRef = doc(firestore, USERS_COLLECTION, uid);
			const snapshot = await getDoc(userRef);
			if (snapshot.exists()) {
				const raw = snapshot.data();
				return {
					...raw,
					displayName: sanitizeDisplayName(raw.displayName as string | undefined, DEFAULT_PLAYER_NAME),
					avatar: sanitizePlayerAvatar(raw.avatar, DEFAULT_PLAYER_AVATAR),
					updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
				} as Partial<PlayerProfile>;
			}
			return null;
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to fetch Firestore profile for ${uid}:`, error);
			return null;
		}
	}

	/**
	 * Persists user profile document to Cloud Firestore.
	 */
	async saveProfileDoc(profile: PlayerProfile): Promise<void> {
		const { firestore } = this.getActiveServices();
		try {
			const userRef = doc(firestore, USERS_COLLECTION, profile.id);
			await setDoc(
				userRef,
				{
					id: profile.id,
					displayName: sanitizeDisplayName(profile.displayName, DEFAULT_PLAYER_NAME),
					avatar: sanitizePlayerAvatar(profile.avatar, DEFAULT_PLAYER_AVATAR),
					storageMode: 'cloud',
					createdAt: profile.createdAt,
					email: profile.email ?? null,
					photoURL: profile.photoURL ?? null,
					updatedAt: profile.updatedAt || Date.now(),
				},
				{ merge: true },
			);
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to persist Firestore profile for ${profile.id}:`, error);
		}
	}

	/**
	 * Persists game medals document under /users/{uid}/gameStats/{gameId} per ADR 0004.
	 */
	async saveGameMedals(uid: string, gameId: string, state: unknown): Promise<void> {
		const { firestore } = this.getActiveServices();
		try {
			const gameRef = doc(firestore, USERS_COLLECTION, uid, 'gameStats', gameId);
			await setDoc(gameRef, state as Record<string, unknown>, { merge: true });
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to persist game medals for ${uid}/${gameId}:`, error);
		}
	}

	/**
	 * Fetches game medals document from Cloud Firestore.
	 */
	async getGameMedals<T>(uid: string, gameId: string): Promise<T | null> {
		const { firestore } = this.getActiveServices();
		try {
			const gameRef = doc(firestore, USERS_COLLECTION, uid, 'gameStats', gameId);
			const snapshot = await getDoc(gameRef);
			if (snapshot.exists()) {
				return snapshot.data() as T;
			}
			return null;
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to fetch game medals for ${uid}/${gameId}:`, error);
			return null;
		}
	}

	/**
	 * Deletes game medals documents under /users/{uid}/gameStats.
	 */
	async deleteGameMedals(uid: string, gameId?: string): Promise<void> {
		const { firestore } = this.getActiveServices();
		try {
			if (gameId) {
				const gameRef = doc(firestore, USERS_COLLECTION, uid, 'gameStats', gameId);
				await deleteDoc(gameRef);
			} else {
				const knownGames = ['sudoku', 'nonogram', 'minesweeper', 'star-battle', 'tracks'];
				await Promise.all(
					knownGames.map(async (g) => {
						const ref = doc(firestore, USERS_COLLECTION, uid, 'gameStats', g);
						await deleteDoc(ref);
					}),
				);
			}
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to delete game medals for ${uid}:`, error);
		}
	}

	/**
	 * Deletes the user profile and associated data (including medals subcollection)
	 * from Cloud Firestore when downgrading from cloud sync to local-only persistence per ADR 0003 & ADR 0004.
	 */
	async deleteUserData(uid: string): Promise<void> {
		const { firestore } = this.getActiveServices();
		try {
			await this.deleteGameMedals(uid);
			const userRef = doc(firestore, USERS_COLLECTION, uid);
			await deleteDoc(userRef);
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to delete Firestore user data for ${uid}:`, error);
		}
	}

	/**
	 * Authenticates anonymously with Firebase Auth and synchronizes the profile.
	 */
	async signInAnonymously(): Promise<PlayerProfile> {
		const { auth } = this.getActiveServices();
		const credential = await firebaseSignInAnonymously(auth);
		const existingDoc = await this.getProfileDoc(credential.user.uid);
		const profile = mapFirebaseUserToProfile(credential.user, existingDoc);
		await this.saveProfileDoc(profile);
		return profile;
	}

	/**
	 * Initiates Google OAuth popup sign-in and synchronizes profile in Firestore.
	 */
	async signInWithGoogle(): Promise<PlayerProfile> {
		const { auth } = this.getActiveServices();
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(auth, provider);
		const existingDoc = await this.getProfileDoc(credential.user.uid);
		const profile = mapFirebaseUserToProfile(credential.user, existingDoc);
		await this.saveProfileDoc(profile);
		return profile;
	}

	/**
	 * Registers a new user account with email and password, configuring optional display name.
	 */
	async signUpWithEmail(email: string, password: string, displayName?: string): Promise<PlayerProfile> {
		const { auth } = this.getActiveServices();
		const credential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
		const sanitizedName = displayName ? sanitizeDisplayName(displayName) : undefined;
		if (sanitizedName) {
			await firebaseUpdateProfile(credential.user, { displayName: sanitizedName });
		}
		const profile = mapFirebaseUserToProfile(
			credential.user,
			sanitizedName ? { displayName: sanitizedName } : null,
		);
		await this.saveProfileDoc(profile);
		return profile;
	}

	/**
	 * Authenticates an existing user account with email and password.
	 */
	async signInWithEmail(email: string, password: string): Promise<PlayerProfile> {
		const { auth } = this.getActiveServices();
		const credential = await firebaseSignInWithEmailAndPassword(auth, email, password);
		const existingDoc = await this.getProfileDoc(credential.user.uid);
		const profile = mapFirebaseUserToProfile(credential.user, existingDoc);
		await this.saveProfileDoc(profile);
		return profile;
	}

	/**
	 * Sends a password reset email to the specified email address.
	 */
	async sendPasswordReset(email: string): Promise<void> {
		const { auth } = this.getActiveServices();
		await firebaseSendPasswordResetEmail(auth, email);
	}

	/**
	 * Signs out from Firebase Auth.
	 */
	async signOut(): Promise<void> {
		const { auth } = this.getActiveServices();
		await firebaseSignOut(auth);
	}

	/**
	 * Updates the current authenticated user's profile attributes in both Firebase Auth and Firestore.
	 */
	async updateProfile(updates: ProfileUpdates): Promise<PlayerProfile> {
		const { auth, firestore } = this.getActiveServices();
		const currentUser = auth.currentUser;
		if (!currentUser) {
			throw new Error('[@arcade/lib-user] Cannot update profile: No active cloud user.');
		}

		const updatePayload: Record<string, unknown> = {
			updatedAt: Date.now(),
		};

		if (updates.displayName !== undefined) {
			const sanitized = sanitizeDisplayName(updates.displayName);
			await firebaseUpdateProfile(currentUser, { displayName: sanitized });
			updatePayload.displayName = sanitized;
		}

		if (updates.avatar !== undefined) {
			updatePayload.avatar = sanitizePlayerAvatar(updates.avatar);
		}

		const userRef = doc(firestore, USERS_COLLECTION, currentUser.uid);
		await updateDoc(userRef, updatePayload);

		const existingDoc = await this.getProfileDoc(currentUser.uid);
		return mapFirebaseUserToProfile(currentUser, existingDoc);
	}

	/**
	 * Updates the current authenticated user's display name.
	 */
	async updateDisplayName(displayName: string): Promise<PlayerProfile> {
		return this.updateProfile({ displayName });
	}

	/**
	 * Updates the current authenticated user's avatar.
	 */
	async updateAvatar(avatar: PlayerAvatar): Promise<PlayerProfile> {
		return this.updateProfile({ avatar });
	}

	/**
	 * Attaches an auth state listener, converting Firebase User objects to PlayerProfile.
	 */
	onAuthStateChanged(callback: (profile: PlayerProfile | null) => void): Unsubscribe {
		if (!this.isAvailable()) {
			return () => {};
		}

		const { auth } = this.getActiveServices();
		return onAuthStateChanged(auth, async (user) => {
			if (!user) {
				callback(null);
				return;
			}
			const existingDoc = await this.getProfileDoc(user.uid);
			callback(mapFirebaseUserToProfile(user, existingDoc));
		});
	}

	/**
	 * Fetches user preferences from Cloud Firestore.
	 */
	async getPreferences(uid: string): Promise<UserPreferences | null> {
		if (!this.isAvailable()) {
			return null;
		}
		const { firestore } = this.getActiveServices();
		try {
			const prefRef = doc(firestore, USERS_COLLECTION, uid, 'gameStats', 'preferences');
			const snapshot = await getDoc(prefRef);
			if (snapshot.exists()) {
				const data = snapshot.data();
				const customStats = data.customStats as Record<string, unknown> | undefined;
				const favorites = Array.isArray(customStats?.favorites)
					? (customStats.favorites as string[])
					: Array.isArray(data.favorites)
						? (data.favorites as string[])
						: [];
				return { favorites };
			}
			return null;
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to fetch Firestore preferences for ${uid}:`, error);
			return null;
		}
	}

	/**
	 * Persists user preferences to Cloud Firestore.
	 */
	async savePreferences(uid: string, preferences: UserPreferences): Promise<void> {
		if (!this.isAvailable()) {
			return;
		}
		const { firestore } = this.getActiveServices();
		try {
			const prefRef = doc(firestore, USERS_COLLECTION, uid, 'gameStats', 'preferences');
			await setDoc(
				prefRef,
				{
					gameId: 'preferences',
					baseStats: { updatedAt: Date.now() },
					customStats: { favorites: preferences.favorites },
					updatedAt: Date.now(),
				},
				{ merge: true },
			);
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to persist Firestore preferences for ${uid}:`, error);
		}
	}

	/**
	 * Retrieves persisted favorites list from Cloud Firestore.
	 */
	async getFavorites(uid: string): Promise<string[]> {
		const prefs = await this.getPreferences(uid);
		return prefs?.favorites ?? [];
	}

	/**
	 * Persists favorites list to Cloud Firestore.
	 */
	async saveFavorites(uid: string, favorites: string[]): Promise<void> {
		await this.savePreferences(uid, { favorites });
	}
}

export const ServerSyncStorageAdapter = CloudAdapter;
export type ServerSyncStorageAdapter = CloudAdapter;
