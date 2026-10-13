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
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { Unsubscribe, UserProfile } from '../../types.js';
import { type FirebaseServices, getFirebaseServices } from '../firebase.js';

const USERS_COLLECTION = 'users';

/**
 * Maps a low-level Firebase User and optional Firestore document data into
 * the public domain UserProfile contract.
 */
export function mapFirebaseUserToProfile(user: FirebaseUser, firestoreData?: Partial<UserProfile> | null): UserProfile {
	const defaultDisplayName = user.displayName || user.email?.split('@')[0] || (user.isAnonymous ? 'Guest' : 'Player');

	return {
		id: user.uid,
		displayName: firestoreData?.displayName || defaultDisplayName,
		storageMode: 'cloud',
		createdAt:
			firestoreData?.createdAt ||
			(user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now()),
		email: user.email ?? null,
		photoURL: user.photoURL ?? null,
	};
}

/**
 * Adapter encapsulating Firebase Auth and Cloud Firestore persistence.
 * Maps all Firebase SDK events to domain UserProfile instances.
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
	 */
	async getProfileDoc(uid: string): Promise<Partial<UserProfile> | null> {
		const { firestore } = this.getActiveServices();
		try {
			const userRef = doc(firestore, USERS_COLLECTION, uid);
			const snapshot = await getDoc(userRef);
			if (snapshot.exists()) {
				return snapshot.data() as Partial<UserProfile>;
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
	async saveProfileDoc(profile: UserProfile): Promise<void> {
		const { firestore } = this.getActiveServices();
		try {
			const userRef = doc(firestore, USERS_COLLECTION, profile.id);
			await setDoc(
				userRef,
				{
					id: profile.id,
					displayName: profile.displayName,
					storageMode: 'cloud',
					createdAt: profile.createdAt,
					email: profile.email ?? null,
					photoURL: profile.photoURL ?? null,
					updatedAt: Date.now(),
				},
				{ merge: true },
			);
		} catch (error) {
			console.warn(`[@arcade/lib-user] Failed to persist Firestore profile for ${profile.id}:`, error);
		}
	}

	/**
	 * Authenticates anonymously with Firebase Auth and synchronizes the profile.
	 */
	async signInAnonymously(): Promise<UserProfile> {
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
	async signInWithGoogle(): Promise<UserProfile> {
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
	async signUpWithEmail(email: string, password: string, displayName?: string): Promise<UserProfile> {
		const { auth } = this.getActiveServices();
		const credential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
		const trimmedName = displayName?.trim();
		if (trimmedName) {
			await firebaseUpdateProfile(credential.user, { displayName: trimmedName });
		}
		const profile = mapFirebaseUserToProfile(credential.user, trimmedName ? { displayName: trimmedName } : null);
		await this.saveProfileDoc(profile);
		return profile;
	}

	/**
	 * Authenticates an existing user account with email and password.
	 */
	async signInWithEmail(email: string, password: string): Promise<UserProfile> {
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
	 * Updates the current authenticated user's display name in both Firebase Auth and Firestore.
	 */
	async updateDisplayName(displayName: string): Promise<UserProfile> {
		const { auth, firestore } = this.getActiveServices();
		const currentUser = auth.currentUser;
		if (!currentUser) {
			throw new Error('[@arcade/lib-user] Cannot update profile: No active cloud user.');
		}

		await firebaseUpdateProfile(currentUser, { displayName });
		const userRef = doc(firestore, USERS_COLLECTION, currentUser.uid);
		await updateDoc(userRef, { displayName, updatedAt: Date.now() });

		const existingDoc = await this.getProfileDoc(currentUser.uid);
		return mapFirebaseUserToProfile(currentUser, existingDoc);
	}

	/**
	 * Attaches an auth state listener, converting Firebase User objects to UserProfile.
	 */
	onAuthStateChanged(callback: (profile: UserProfile | null) => void): Unsubscribe {
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
}
