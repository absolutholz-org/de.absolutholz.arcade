import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FAVORITES_UPDATED_EVENT, getFavoritesManager, resetSharedFavoritesManager } from '../favorites.js';
import { LocalStorageAdapter } from '../internal/adapters/localAdapter.js';
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
});
