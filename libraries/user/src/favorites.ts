import { loadConsentPreferences } from '@arcade/lib-consent';
import { CloudAdapter, type ServerSyncStorageAdapter } from './internal/adapters/cloudAdapter.js';
import { LocalAdapter, type LocalStorageAdapter } from './internal/adapters/localAdapter.js';
import { getSharedUserService } from './service.js';
import { type Unsubscribe, resolveCurrentDataTier } from './types.js';

export const FAVORITES_UPDATED_EVENT = 'arcade::favorites::updated';

export interface FavoritesManager {
	getFavorites(): readonly string[];
	isFavorite(gameId: string): boolean;
	toggleFavorite(gameId: string): Promise<void>;
	subscribe(listener: (favorites: readonly string[]) => void): Unsubscribe;
	initialize(): Promise<readonly string[]>;
	isInitialized(): boolean;
}

class DefaultFavoritesManager implements FavoritesManager {
	private favorites: string[] = [];
	private initialized = false;
	private initPromise: Promise<readonly string[]> | null = null;
	private readonly listeners = new Set<(favorites: readonly string[]) => void>();
	private readonly localAdapter: LocalStorageAdapter;
	private readonly cloudAdapter: ServerSyncStorageAdapter;

	constructor(localAdapter?: LocalStorageAdapter, cloudAdapter?: ServerSyncStorageAdapter) {
		this.localAdapter = localAdapter ?? new LocalAdapter();
		this.cloudAdapter = cloudAdapter ?? new CloudAdapter();

		if (typeof window !== 'undefined') {
			window.addEventListener(FAVORITES_UPDATED_EVENT, (event: Event) => {
				const customEvent = event as CustomEvent<{ favorites: string[] }>;
				if (customEvent.detail && Array.isArray(customEvent.detail.favorites)) {
					this.updateLocalState(customEvent.detail.favorites, false);
				}
			});

			window.addEventListener('storage', (event: StorageEvent) => {
				if (event.key?.includes('favorites')) {
					void this.refreshFromStorage();
				}
			});
		}
	}

	isInitialized(): boolean {
		return this.initialized;
	}

	getFavorites(): readonly string[] {
		return this.favorites;
	}

	isFavorite(gameId: string): boolean {
		return this.favorites.includes(gameId);
	}

	private updateLocalState(next: string[], broadcast: boolean): void {
		this.favorites = [...next];
		for (const listener of this.listeners) {
			try {
				listener(this.favorites);
			} catch (err) {
				console.error('[@arcade/lib-user] Error notifying favorites listener:', err);
			}
		}

		if (broadcast && typeof window !== 'undefined') {
			try {
				window.dispatchEvent(
					new CustomEvent(FAVORITES_UPDATED_EVENT, {
						detail: { favorites: this.favorites },
					}),
				);
			} catch {
				// Event dispatch fallback in non-browser or mock environments
			}
		}
	}

	async initialize(): Promise<readonly string[]> {
		if (this.initialized) {
			return this.favorites;
		}
		if (this.initPromise) {
			return this.initPromise;
		}

		this.initPromise = (async () => {
			try {
				// 1. Always load local favorites first (Tier 1 & 2 baseline)
				const local = await this.localAdapter.getFavorites();
				let merged = Array.isArray(local) ? [...local] : [];

				// 2. Determine ADR 0003 data tier
				const userService = getSharedUserService();
				const session = userService.getSession();
				const consent = loadConsentPreferences();
				const tier = resolveCurrentDataTier(
					session.isAuthenticated,
					consent.cloudSync,
					consent.publicBroadcast,
				);

				// 3. Tiers 3 & 4: Synchronize with Cloud Firestore
				if (tier >= 3 && session.user?.id) {
					try {
						const cloudFavs = await this.cloudAdapter.getFavorites(session.user.id);
						if (Array.isArray(cloudFavs) && cloudFavs.length > 0) {
							// Merge unique values
							merged = Array.from(new Set([...merged, ...cloudFavs]));
							await this.localAdapter.saveFavorites(merged);
							await this.cloudAdapter.saveFavorites(session.user.id, merged);
						} else if (merged.length > 0) {
							await this.cloudAdapter.saveFavorites(session.user.id, merged);
						}
					} catch (cloudErr) {
						console.warn('[@arcade/lib-user] Failed to sync favorites with cloud:', cloudErr);
					}
				}

				this.updateLocalState(merged, false);
				this.initialized = true;
				return this.favorites;
			} finally {
				this.initPromise = null;
			}
		})();

		return this.initPromise;
	}

	private async refreshFromStorage(): Promise<void> {
		try {
			const local = await this.localAdapter.getFavorites();
			if (Array.isArray(local)) {
				this.updateLocalState(local, false);
			}
		} catch {
			// Ignore read errors
		}
	}

	async toggleFavorite(gameId: string): Promise<void> {
		if (!this.initialized) {
			await this.initialize();
		}

		const exists = this.favorites.includes(gameId);
		const next = exists ? this.favorites.filter((id) => id !== gameId) : [...this.favorites, gameId];

		this.updateLocalState(next, true);

		// Persist locally (Tier 1/2)
		await this.localAdapter.saveFavorites(next);

		// Synchronize to cloud if Tier 3/4
		const userService = getSharedUserService();
		const session = userService.getSession();
		const consent = loadConsentPreferences();
		const tier = resolveCurrentDataTier(session.isAuthenticated, consent.cloudSync, consent.publicBroadcast);

		if (tier >= 3 && session.user?.id) {
			try {
				await this.cloudAdapter.saveFavorites(session.user.id, next);
			} catch (cloudErr) {
				console.warn('[@arcade/lib-user] Failed to sync updated favorites to cloud:', cloudErr);
			}
		}
	}

	subscribe(listener: (favorites: readonly string[]) => void): Unsubscribe {
		this.listeners.add(listener);
		listener(this.favorites);

		return () => {
			this.listeners.delete(listener);
		};
	}
}

let sharedFavoritesManager: FavoritesManager | null = null;

export function getFavoritesManager(
	localAdapter?: LocalStorageAdapter,
	cloudAdapter?: ServerSyncStorageAdapter,
): FavoritesManager {
	if (!sharedFavoritesManager || localAdapter || cloudAdapter) {
		const instance = new DefaultFavoritesManager(localAdapter, cloudAdapter);
		if (!sharedFavoritesManager) {
			sharedFavoritesManager = instance;
		}
		return instance;
	}
	return sharedFavoritesManager;
}

export function resetSharedFavoritesManager(): void {
	sharedFavoritesManager = null;
}
