import { createGameStorage } from '@arcade/lib-storage';
import {
	DEFAULT_PLAYER_AVATAR,
	type IStorageAdapter,
	type PlayerProfile,
	type StorageMode,
	hydratePlayerProfile,
	serializePlayerProfile,
} from '../../types.js';

type GameStorage = ReturnType<typeof createGameStorage>;

const STORAGE_KEY_PROFILE = 'profile';
const STORAGE_KEY_MODE = 'storage_mode';

/**
 * Local storage adapter encapsulating offline user profile persistence.
 * Adheres strictly to @arcade/lib-storage conventions and ADR 012 namespacing (arcade::user::*).
 */
export class LocalAdapter implements IStorageAdapter {
	private readonly storage: GameStorage;

	constructor(storage?: GameStorage) {
		this.storage = storage ?? createGameStorage('user');
	}

	/**
	 * Retrieves and hydrates the persisted local user profile, if one exists.
	 * Gracefully defaults legacy profiles lacking avatar or updatedAt fields without throwing.
	 */
	async getProfile(): Promise<PlayerProfile | null> {
		const raw = await this.storage.get<Record<string, unknown>>(STORAGE_KEY_PROFILE);
		if (!raw) {
			return null;
		}
		return hydratePlayerProfile(raw, 'Guest');
	}

	/**
	 * Persists the serialized local user profile under the scoped namespace.
	 */
	async saveProfile(profile: PlayerProfile): Promise<void> {
		const serialized = serializePlayerProfile(profile);
		await this.storage.set<PlayerProfile>(STORAGE_KEY_PROFILE, serialized);
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
	async createGuestProfile(): Promise<PlayerProfile> {
		const guestId =
			typeof crypto !== 'undefined' && 'randomUUID' in crypto
				? `guest_${crypto.randomUUID()}`
				: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

		const now = Date.now();
		const guestProfile: PlayerProfile = {
			id: guestId,
			displayName: 'Guest',
			avatar: DEFAULT_PLAYER_AVATAR,
			storageMode: 'local',
			createdAt: now,
			updatedAt: now,
		};

		await this.saveProfile(guestProfile);
		return guestProfile;
	}

	/**
	 * Retrieves existing local guest profile or generates a new one.
	 */
	async getOrCreateGuestProfile(): Promise<PlayerProfile> {
		const existing = await this.getProfile();
		if (existing) {
			return existing;
		}
		return this.createGuestProfile();
	}
}
