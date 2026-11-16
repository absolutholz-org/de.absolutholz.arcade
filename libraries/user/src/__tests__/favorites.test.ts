import { saveConsentPreferences } from '@arcade/lib-consent';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FAVORITES_UPDATED_EVENT, getFavoritesManager, resetSharedFavoritesManager } from '../favorites.js';
import type { ServerSyncStorageAdapter } from '../internal/adapters/cloudAdapter.js';
import { LocalStorageAdapter } from '../internal/adapters/localAdapter.js';
import { getSharedUserService, resetSharedUserService } from '../service.js';
import type { UserPreferences } from '../types.js';

describe('LocalStorageAdapter favorites', () => {
	let adapter: LocalStorageAdapter;

	beforeEach(() => {
		resetSharedFavoritesManager();
		adapter = new LocalStorageAdapter();
	});

	it('returns an empty array when no preferences or favorites exist', async () => {
		const favorites = await adapter.getFavorites();
		expect(favorites).toEqual([]);
	});

	it('persists and retrieves favorites array', async () => {
		await adapter.saveFavorites(['sudoku', 'minesweeper']);
		const favorites = await adapter.getFavorites();
		expect(favorites).toEqual(['sudoku', 'minesweeper']);

		const prefs = await adapter.getPreferences();
		expect(prefs.favorites).toEqual(['sudoku', 'minesweeper']);
	});

	it('persists and retrieves user preferences with favorites', async () => {
		const newPrefs: UserPreferences = {
			favorites: ['nonogram'],
		};
		await adapter.savePreferences(newPrefs);

		const result = await adapter.getPreferences();
		expect(result.favorites).toEqual(['nonogram']);

		const favs = await adapter.getFavorites();
		expect(favs).toEqual(['nonogram']);
	});
});

describe('FavoritesManager', () => {
	let adapter: LocalStorageAdapter;

	beforeEach(() => {
		resetSharedFavoritesManager();
		adapter = new LocalStorageAdapter();
	});

	it('toggles favorites on and off and notifies subscribers', async () => {
		const manager = getFavoritesManager(adapter);
		await manager.initialize();

		const listener = vi.fn();
		const unsubscribe = manager.subscribe(listener);

		expect(manager.isFavorite('sudoku')).toBe(false);

		await manager.toggleFavorite('sudoku');
		expect(manager.isFavorite('sudoku')).toBe(true);
		expect(manager.getFavorites()).toContain('sudoku');

		await manager.toggleFavorite('sudoku');
		expect(manager.isFavorite('sudoku')).toBe(false);
		expect(manager.getFavorites()).not.toContain('sudoku');

		unsubscribe();
	});

	it('syncs cloud favorites when user session resolves to cloud-synced after initialization', async () => {
		resetSharedUserService();
		saveConsentPreferences({ cloudSync: true, publicBroadcast: false }, true);
		await adapter.saveFavorites([]);

		const cloudAdapter = {
			getFavorites: vi.fn(async () => ['tents', 'sudoku']),
			saveFavorites: vi.fn(async () => {}),
		} as unknown as ServerSyncStorageAdapter;

		const manager = getFavoritesManager(adapter, cloudAdapter);
		await manager.initialize();

		expect(manager.getFavorites()).toEqual([]);

		// Simulate late auth resolution on UserService
		const userService = getSharedUserService();
		(userService as unknown as { updateSession: (p: unknown) => void }).updateSession({
			isAuthenticated: true,
			isCloudSynced: true,
			user: {
				id: 'woody-123',
				displayName: 'Woody',
				avatar: '🪵',
				storageMode: 'cloud',
				createdAt: 1,
				updatedAt: 1,
			},
		});

		await vi.waitFor(() => {
			expect(manager.getFavorites()).toEqual(['tents', 'sudoku']);
		});
		expect(cloudAdapter.getFavorites).toHaveBeenCalledWith('woody-123');
	});
});
