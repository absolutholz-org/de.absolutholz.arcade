import { createGameStorage } from '@arcade/lib-storage';
import type { StorageMode, UserProfile } from '../../types.js';

type GameStorage = ReturnType<typeof createGameStorage>;

const STORAGE_KEY_PROFILE = 'profile';
const STORAGE_KEY_MODE = 'storage_mode';

/**
 * Local storage adapter encapsulating offline user profile persistence.
 * Adheres strictly to @arcade/lib-storage conventions and ADR 012 namespacing (arcade::user::*).
 */
export class LocalAdapter {
	private readonly storage: GameStorage;

	constructor(storage?: GameStorage) {
		this.storage = storage ?? createGameStorage('user');
	}

	/**
	 * Retrieves the persisted local user profile, if one exists.
	 */
	async getProfile(): Promise<UserProfile | null> {
		return this.storage.get<UserProfile>(STORAGE_KEY_PROFILE);
	}

	/**
	 * Persists the local user profile.
	 */
	async saveProfile(profile: UserProfile): Promise<void> {
		await this.storage.set<UserProfile>(STORAGE_KEY_PROFILE, profile);
	}

	/**
	 * Removes the stored local user profile.
	 */
	async clearProfile(): Promise<void> {
		await this.storage.remove(STORAGE_KEY_PROFILE);
	}

	/**
	 * Retrieves the persisted storage mode preference.
	 */
	async getStorageMode(): Promise<StorageMode | null> {
		return this.storage.get<StorageMode>(STORAGE_KEY_MODE);
	}

	/**
	 * Persists the storage mode preference.
	 */
	async setStorageMode(mode: StorageMode): Promise<void> {
		await this.storage.set<StorageMode>(STORAGE_KEY_MODE, mode);
	}

	/**
	 * Creates and persists a fresh guest user profile with local storage mode.
	 */
	async createGuestProfile(): Promise<UserProfile> {
		const guestId =
			typeof crypto !== 'undefined' && 'randomUUID' in crypto
				? `guest_${crypto.randomUUID()}`
				: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

		const guestProfile: UserProfile = {
			id: guestId,
			displayName: 'Guest',
			storageMode: 'local',
			createdAt: Date.now(),
		};

		await this.saveProfile(guestProfile);
		return guestProfile;
	}

	/**
	 * Retrieves existing local guest profile or generates a new one.
	 */
	async getOrCreateGuestProfile(): Promise<UserProfile> {
		const existing = await this.getProfile();
		if (existing) {
			return existing;
		}
		return this.createGuestProfile();
	}
}
