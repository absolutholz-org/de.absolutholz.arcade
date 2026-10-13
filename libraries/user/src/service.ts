import { CloudAdapter } from './internal/adapters/cloudAdapter.js';
import { LocalAdapter } from './internal/adapters/localAdapter.js';
import { initFirebase } from './internal/firebase.js';
import type { IUserService, StorageMode, Unsubscribe, UserProfile, UserServiceOptions, UserSession } from './types.js';

/**
 * Core implementation of IUserService coordinating local storage,
 * cloud synchronization, and authentication transitions.
 */
class UserService implements IUserService {
	private session: UserSession = {
		user: null,
		isAuthenticated: false,
		isCloudSynced: false,
	};

	private readonly listeners = new Set<(session: UserSession) => void>();
	private readonly localAdapter: LocalAdapter;
	private readonly cloudAdapter: CloudAdapter;
	private readonly options?: UserServiceOptions;
	private initialized = false;

	constructor(options?: UserServiceOptions, localAdapter?: LocalAdapter, cloudAdapter?: CloudAdapter) {
		this.options = options;
		this.localAdapter = localAdapter ?? new LocalAdapter();
		this.cloudAdapter = cloudAdapter ?? new CloudAdapter();
	}

	getSession(): UserSession {
		return { ...this.session };
	}

	subscribe(listener: (session: UserSession) => void): Unsubscribe {
		this.listeners.add(listener);
		// Immediately emit current state to new subscriber
		listener(this.getSession());

		return () => {
			this.listeners.delete(listener);
		};
	}

	private notifyListeners(): void {
		const snapshot = this.getSession();
		for (const listener of this.listeners) {
			try {
				listener(snapshot);
			} catch (error) {
				console.error('[@arcade/lib-user] Error in session listener:', error);
			}
		}
	}

	private updateSession(partial: Partial<UserSession>): void {
		this.session = {
			...this.session,
			...partial,
		};
		this.notifyListeners();
	}

	async initialize(): Promise<UserSession> {
		if (this.initialized) {
			return this.getSession();
		}

		// Initialize modular Firebase if config was passed
		if (this.options?.firebaseConfig) {
			initFirebase(this.options.firebaseConfig);
		}

		// Attach cloud auth state listener if cloud is available
		if (this.cloudAdapter.isAvailable()) {
			this.cloudAdapter.onAuthStateChanged(async (cloudProfile) => {
				if (cloudProfile) {
					this.updateSession({
						user: cloudProfile,
						isAuthenticated: true,
						isCloudSynced: true,
					});
					await this.localAdapter.saveProfile(cloudProfile);
				} else if (this.session.isAuthenticated) {
					// Fall back to local guest when signed out
					const guest = await this.localAdapter.getOrCreateGuestProfile();
					this.updateSession({
						user: guest,
						isAuthenticated: false,
						isCloudSynced: false,
					});
				}
			});
		}

		// Restore local state or initialize default guest profile
		const persistedProfile = await this.localAdapter.getProfile();
		const persistedMode = (await this.localAdapter.getStorageMode()) ?? this.options?.defaultStorageMode ?? 'local';

		if (persistedProfile) {
			this.updateSession({
				user: persistedProfile,
				isAuthenticated: false,
				isCloudSynced: false,
			});
		} else {
			const guest = await this.localAdapter.createGuestProfile();
			this.updateSession({
				user: guest,
				isAuthenticated: false,
				isCloudSynced: false,
			});
			await this.localAdapter.setStorageMode(persistedMode);
		}

		this.initialized = true;
		return this.getSession();
	}

	async signInAnonymously(): Promise<UserProfile> {
		if (this.cloudAdapter.isAvailable()) {
			const cloudProfile = await this.cloudAdapter.signInAnonymously();
			this.updateSession({
				user: cloudProfile,
				isAuthenticated: true,
				isCloudSynced: true,
			});
			await this.localAdapter.saveProfile(cloudProfile);
			await this.localAdapter.setStorageMode('cloud');
			return cloudProfile;
		}

		// Offline / local fallback
		const localGuest = await this.localAdapter.getOrCreateGuestProfile();
		this.updateSession({
			user: localGuest,
			isAuthenticated: false,
			isCloudSynced: false,
		});
		return localGuest;
	}

	async signInWithGoogle(): Promise<UserProfile> {
		if (!this.cloudAdapter.isAvailable()) {
			throw new Error('[@arcade/lib-user] Google sign-in failed: Firebase cloud adapter is not configured.');
		}

		const profile = await this.cloudAdapter.signInWithGoogle();
		this.updateSession({
			user: profile,
			isAuthenticated: true,
			isCloudSynced: true,
		});
		await this.localAdapter.saveProfile(profile);
		await this.localAdapter.setStorageMode('cloud');
		return profile;
	}

	async signUpWithEmail(email: string, password: string, displayName?: string): Promise<UserProfile> {
		if (!this.cloudAdapter.isAvailable()) {
			throw new Error('[@arcade/lib-user] Email registration failed: Firebase cloud adapter is not configured.');
		}

		const profile = await this.cloudAdapter.signUpWithEmail(email, password, displayName);
		this.updateSession({
			user: profile,
			isAuthenticated: true,
			isCloudSynced: true,
		});
		await this.localAdapter.saveProfile(profile);
		await this.localAdapter.setStorageMode('cloud');
		return profile;
	}

	async signInWithEmail(email: string, password: string): Promise<UserProfile> {
		if (!this.cloudAdapter.isAvailable()) {
			throw new Error('[@arcade/lib-user] Email sign-in failed: Firebase cloud adapter is not configured.');
		}

		const profile = await this.cloudAdapter.signInWithEmail(email, password);
		this.updateSession({
			user: profile,
			isAuthenticated: true,
			isCloudSynced: true,
		});
		await this.localAdapter.saveProfile(profile);
		await this.localAdapter.setStorageMode('cloud');
		return profile;
	}

	async sendPasswordReset(email: string): Promise<void> {
		if (!this.cloudAdapter.isAvailable()) {
			throw new Error('[@arcade/lib-user] Password reset failed: Firebase cloud adapter is not configured.');
		}

		await this.cloudAdapter.sendPasswordReset(email);
	}

	async signOut(): Promise<void> {
		if (this.session.isAuthenticated && this.cloudAdapter.isAvailable()) {
			await this.cloudAdapter.signOut();
		}

		const guestProfile = await this.localAdapter.createGuestProfile();
		await this.localAdapter.setStorageMode('local');
		this.updateSession({
			user: guestProfile,
			isAuthenticated: false,
			isCloudSynced: false,
		});
	}

	async updateProfile(updates: { displayName: string }): Promise<UserProfile> {
		const trimmedName = updates.displayName.trim();
		if (!trimmedName) {
			throw new Error('[@arcade/lib-user] Display name cannot be empty.');
		}

		if (this.session.isAuthenticated && this.cloudAdapter.isAvailable()) {
			const updated = await this.cloudAdapter.updateDisplayName(trimmedName);
			this.updateSession({ user: updated });
			await this.localAdapter.saveProfile(updated);
			return updated;
		}

		const current = this.session.user ?? (await this.localAdapter.getOrCreateGuestProfile());
		const updatedLocal: UserProfile = {
			...current,
			displayName: trimmedName,
		};

		await this.localAdapter.saveProfile(updatedLocal);
		this.updateSession({ user: updatedLocal });
		return updatedLocal;
	}

	async updateDisplayName(name: string): Promise<UserProfile> {
		return this.updateProfile({ displayName: name });
	}

	async setStorageMode(mode: StorageMode): Promise<void> {
		await this.localAdapter.setStorageMode(mode);

		if (mode === 'cloud') {
			if (this.session.isAuthenticated) {
				const current = this.session.user;
				const updatedUser: UserProfile | null = current ? { ...current, storageMode: 'cloud' } : null;
				if (updatedUser) {
					await this.localAdapter.saveProfile(updatedUser);
				}
				this.updateSession({
					user: updatedUser,
					isCloudSynced: true,
				});
			} else if (this.cloudAdapter.isAvailable()) {
				await this.signInAnonymously();
			}
			return;
		}

		// Switch to local mode
		if (this.session.user) {
			const localVersion: UserProfile = {
				...this.session.user,
				storageMode: 'local',
			};
			await this.localAdapter.saveProfile(localVersion);
			this.updateSession({
				user: localVersion,
				isCloudSynced: false,
			});
		}
	}
}

/**
 * Factory function creating an instance of IUserService.
 * Provides a clean boundary preventing internal adapters or Firebase SDK instances from leaking.
 *
 * @param options Configuration options for initializing user persistence and cloud identity.
 * @returns An initialized IUserService facade.
 */
export function createUserService(options?: UserServiceOptions): IUserService {
	const resolvedOptions: UserServiceOptions = {
		...options,
		firebaseConfig: options?.firebaseConfig ?? {
			apiKey: import.meta.env?.PUBLIC_FIREBASE_API_KEY,
			authDomain: import.meta.env?.PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: import.meta.env?.PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: import.meta.env?.PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: import.meta.env?.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: import.meta.env?.PUBLIC_FIREBASE_APP_ID,
		},
	};

	return new UserService(resolvedOptions);
}
