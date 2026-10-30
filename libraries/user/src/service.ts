import {
	type ConsentUpdatedEventDetail,
	loadConsentPreferences,
	saveConsentPreferences,
	subscribeToConsent,
} from '@arcade/lib-consent';
import {
	clearMedalSyncQueue,
	flushMedalSyncQueue,
	initOfflineSyncBridge,
	reconcileAllGameMedals,
	registerMedalSyncAdapter,
} from '@arcade/lib-medals';
import { CloudAdapter } from './internal/adapters/cloudAdapter.js';
import { LocalAdapter } from './internal/adapters/localAdapter.js';
import { initFirebase, resolveEnvConfig } from './internal/firebase.js';
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

	private applyConsentToProfile(profile: UserProfile, isAuthenticated: boolean): UserProfile {
		const consent = loadConsentPreferences();
		const shouldSync = isAuthenticated && consent.cloudSync;
		return {
			...profile,
			storageMode: shouldSync ? 'cloud' : 'local',
		};
	}

	async initialize(): Promise<UserSession> {
		if (this.initialized) {
			return this.getSession();
		}

		// Initialize modular Firebase if config was passed or can be resolved from env
		const fbConfig = this.options?.firebaseConfig ?? resolveEnvConfig() ?? undefined;
		if (fbConfig) {
			initFirebase(fbConfig);
		}

		// Register medals sync adapter for Tier 3 & Tier 4 cloud synchronization
		registerMedalSyncAdapter({
			isSyncEnabled: () =>
				Boolean(this.session.isAuthenticated && this.session.isCloudSynced && this.session.user),
			syncGameMedals: async (gameId, state) => {
				if (this.session.user && this.cloudAdapter.isAvailable()) {
					await this.cloudAdapter.saveGameMedals(this.session.user.id, gameId, state);
				}
			},
			fetchGameMedals: async (gameId) => {
				if (this.session.user && this.cloudAdapter.isAvailable()) {
					return await this.cloudAdapter.getGameMedals(this.session.user.id, gameId);
				}
				return null;
			},
		});
		initOfflineSyncBridge();

		// Attach consent change listener to react to tier transitions and remote data purge
		if (typeof window !== 'undefined') {
			subscribeToConsent(async (detail: ConsentUpdatedEventDetail) => {
				if (detail.action === 'delete_cloud_retain_local') {
					if (this.session.user && this.session.isAuthenticated && this.cloudAdapter.isAvailable()) {
						await this.cloudAdapter.deleteUserData(this.session.user.id);
						await clearMedalSyncQueue();
					}
					await this.setStorageMode('local');
				} else if (
					detail.preferences.cloudSync &&
					this.session.isAuthenticated &&
					!this.session.isCloudSynced
				) {
					await this.setStorageMode('cloud');
					await this.syncMedalsAcrossGames();
				} else if (!detail.preferences.cloudSync && this.session.isCloudSynced) {
					await this.setStorageMode('local');
				}
			});
		}

		// Attach cloud auth state listener if cloud is available
		if (this.cloudAdapter.isAvailable()) {
			this.cloudAdapter.onAuthStateChanged(async (cloudProfile) => {
				if (cloudProfile) {
					const profile = this.applyConsentToProfile(cloudProfile, true);
					const isSynced = profile.storageMode === 'cloud';
					this.updateSession({
						user: profile,
						isAuthenticated: true,
						isCloudSynced: isSynced,
					});
					await this.localAdapter.saveProfile(profile);
					await this.localAdapter.setStorageMode(profile.storageMode);
					if (isSynced) {
						await this.syncMedalsAcrossGames();
					}
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
			const finalProfile = this.applyConsentToProfile(cloudProfile, true);
			const isSynced = finalProfile.storageMode === 'cloud';
			this.updateSession({
				user: finalProfile,
				isAuthenticated: true,
				isCloudSynced: isSynced,
			});
			await this.localAdapter.saveProfile(finalProfile);
			await this.localAdapter.setStorageMode(finalProfile.storageMode);
			return finalProfile;
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
		const finalProfile = this.applyConsentToProfile(profile, true);
		const isSynced = finalProfile.storageMode === 'cloud';
		this.updateSession({
			user: finalProfile,
			isAuthenticated: true,
			isCloudSynced: isSynced,
		});
		await this.localAdapter.saveProfile(finalProfile);
		await this.localAdapter.setStorageMode(finalProfile.storageMode);
		return finalProfile;
	}

	async signUpWithEmail(email: string, password: string, displayName?: string): Promise<UserProfile> {
		if (!this.cloudAdapter.isAvailable()) {
			throw new Error('[@arcade/lib-user] Email registration failed: Firebase cloud adapter is not configured.');
		}

		const profile = await this.cloudAdapter.signUpWithEmail(email, password, displayName);
		const finalProfile = this.applyConsentToProfile(profile, true);
		const isSynced = finalProfile.storageMode === 'cloud';
		this.updateSession({
			user: finalProfile,
			isAuthenticated: true,
			isCloudSynced: isSynced,
		});
		await this.localAdapter.saveProfile(finalProfile);
		await this.localAdapter.setStorageMode(finalProfile.storageMode);
		return finalProfile;
	}

	async signInWithEmail(email: string, password: string): Promise<UserProfile> {
		if (!this.cloudAdapter.isAvailable()) {
			throw new Error('[@arcade/lib-user] Email sign-in failed: Firebase cloud adapter is not configured.');
		}

		const profile = await this.cloudAdapter.signInWithEmail(email, password);
		const finalProfile = this.applyConsentToProfile(profile, true);
		const isSynced = finalProfile.storageMode === 'cloud';
		this.updateSession({
			user: finalProfile,
			isAuthenticated: true,
			isCloudSynced: isSynced,
		});
		await this.localAdapter.saveProfile(finalProfile);
		await this.localAdapter.setStorageMode(finalProfile.storageMode);
		return finalProfile;
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
				saveConsentPreferences(
					{ cloudSync: true },
					{
						isAuthenticated: true,
						hasLocalProfile: Boolean(updatedUser?.displayName && updatedUser.displayName !== 'Guest'),
					},
				);
				await this.syncMedalsAcrossGames();
			} else if (this.cloudAdapter.isAvailable()) {
				await this.signInAnonymously();
			}
			return;
		}

		// Switch to local mode
		if (this.session.user) {
			if (this.session.isAuthenticated && this.session.isCloudSynced && this.cloudAdapter.isAvailable()) {
				await this.cloudAdapter.deleteUserData(this.session.user.id);
			}

			const localVersion: UserProfile = {
				...this.session.user,
				storageMode: 'local',
			};
			await this.localAdapter.saveProfile(localVersion);
			this.updateSession({
				user: localVersion,
				isCloudSynced: false,
			});
			saveConsentPreferences(
				{ cloudSync: false, publicBroadcast: false },
				{
					isAuthenticated: this.session.isAuthenticated,
					hasLocalProfile: Boolean(localVersion?.displayName && localVersion.displayName !== 'Guest'),
				},
			);
		}
	}

	async syncMedalsAcrossGames(): Promise<void> {
		if (this.session.isAuthenticated && this.session.isCloudSynced && this.session.user) {
			try {
				await reconcileAllGameMedals();
			} catch (error) {
				console.warn('[@arcade/lib-user] Cross-game medal reconciliation failed:', error);
			}
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
	return new UserService(options);
}

let sharedUserServiceInstance: IUserService | null = null;

/**
 * Returns a shared, singleton instance of IUserService across all application components.
 * Ensures consistent session subscription, token state, and prevents multiple listener churn.
 */
export function getSharedUserService(options?: UserServiceOptions): IUserService {
	if (!sharedUserServiceInstance) {
		const envConfig = resolveEnvConfig() ?? undefined;
		const resolvedOptions: UserServiceOptions | undefined = options?.firebaseConfig
			? options
			: envConfig
				? { ...options, firebaseConfig: envConfig }
				: options;
		sharedUserServiceInstance = createUserService(resolvedOptions);
		if (typeof window !== 'undefined') {
			sharedUserServiceInstance.initialize().catch((err) => {
				console.error('[@arcade/lib-user] Failed to initialize shared user service:', err);
			});
		}
	} else if (options?.firebaseConfig) {
		initFirebase(options.firebaseConfig);
	}
	return sharedUserServiceInstance;
}

/**
 * Resets the shared user service singleton (primarily used for test isolation).
 */
export function resetSharedUserService(): void {
	sharedUserServiceInstance = null;
}
