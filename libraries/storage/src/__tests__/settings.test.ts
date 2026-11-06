import { describe, expect, it } from 'vitest';
import {
	DEFAULT_GLOBAL_SETTINGS,
	GAME_SETTINGS_STORAGE_KEY,
	GLOBAL_SETTINGS_APP_SCOPE,
	GLOBAL_SETTINGS_STORAGE_KEY,
	createGameStorage,
	getGameSettings,
	getGlobalSettings,
	getGlobalSettingsSync,
	saveGameSettings,
	saveGlobalSettings,
} from '../createGameStorage.js';
import { MemoryStorageDriver } from '../drivers/memoryDriver.js';

type TestGameSettings = {
	highlightErrors: boolean;
	soundEffects: boolean;
	boardTheme: 'classic' | 'modern';
	timerVisible: boolean;
	newFeatureToggle?: boolean;
};

const DEFAULT_TEST_SETTINGS: TestGameSettings = {
	highlightErrors: true,
	soundEffects: false,
	boardTheme: 'classic',
	timerVisible: true,
};

describe('Game Settings Persistence & Merging', () => {
	it('returns defaults when storage is empty', async () => {
		const driver = new MemoryStorageDriver();
		const storage = createGameStorage('sudoku', { driver });

		const settings = await getGameSettings('sudoku', DEFAULT_TEST_SETTINGS, storage);
		expect(settings).toEqual(DEFAULT_TEST_SETTINGS);
	});

	it('persists settings under arcade::[gameId]::settings and retrieves them', async () => {
		const driver = new MemoryStorageDriver();
		const storage = createGameStorage('minesweeper', { driver });

		const updatedSettings: TestGameSettings = {
			highlightErrors: false,
			soundEffects: true,
			boardTheme: 'modern',
			timerVisible: false,
		};

		await saveGameSettings('minesweeper', updatedSettings, storage);

		// Verify raw storage key namespacing
		const raw = await driver.getItem('arcade::minesweeper::settings');
		expect(raw).not.toBeNull();
		expect(JSON.parse(raw as string)).toEqual(updatedSettings);

		// Verify retrieval
		const loaded = await getGameSettings('minesweeper', DEFAULT_TEST_SETTINGS, storage);
		expect(loaded).toEqual(updatedSettings);
	});

	it('safely merges persisted values over defaults for new schema fields', async () => {
		const driver = new MemoryStorageDriver();
		const storage = createGameStorage('star-battle', { driver });

		// Simulate legacy persisted settings missing a newly introduced field `newFeatureToggle`
		await storage.set(GAME_SETTINGS_STORAGE_KEY, {
			highlightErrors: false,
			soundEffects: true,
		});

		const extendedDefaults: TestGameSettings = {
			...DEFAULT_TEST_SETTINGS,
			newFeatureToggle: true,
		};

		const loaded = await getGameSettings('star-battle', extendedDefaults, storage);

		// Preserves persisted changes while initializing missing fields from extended defaults
		expect(loaded.highlightErrors).toBe(false);
		expect(loaded.soundEffects).toBe(true);
		expect(loaded.boardTheme).toBe('classic');
		expect(loaded.timerVisible).toBe(true);
		expect(loaded.newFeatureToggle).toBe(true);
	});

	it('handles corrupt or non-object persisted data gracefully by falling back to defaults', async () => {
		const driver = new MemoryStorageDriver();
		const storage = createGameStorage('tents', { driver });

		// Manually store corrupt non-object data
		await driver.setItem('arcade::tents::settings', JSON.stringify('corrupted-string-data'));

		const loaded = await getGameSettings('tents', DEFAULT_TEST_SETTINGS, storage);
		expect(loaded).toEqual(DEFAULT_TEST_SETTINGS);
	});

	describe('Global Arcade Settings Persistence', () => {
		it('returns default global settings when storage is empty', async () => {
			const driver = new MemoryStorageDriver();
			const storage = createGameStorage(GLOBAL_SETTINGS_APP_SCOPE, { driver });

			const settings = await getGlobalSettings(storage);
			expect(settings).toEqual({
				soundEnabled: true,
				hapticsEnabled: true,
			});
		});

		it('persists and updates global settings under arcade::global::settings', async () => {
			const driver = new MemoryStorageDriver();
			const storage = createGameStorage(GLOBAL_SETTINGS_APP_SCOPE, { driver });

			const updated = await saveGlobalSettings({ soundEnabled: false }, storage);
			expect(updated).toEqual({
				soundEnabled: false,
				hapticsEnabled: true,
			});

			const raw = await driver.getItem(`arcade::${GLOBAL_SETTINGS_APP_SCOPE}::${GLOBAL_SETTINGS_STORAGE_KEY}`);
			expect(raw).not.toBeNull();
			expect(JSON.parse(raw as string)).toEqual({
				soundEnabled: false,
				hapticsEnabled: true,
			});

			const retrieved = await getGlobalSettings(storage);
			expect(retrieved).toEqual({
				soundEnabled: false,
				hapticsEnabled: true,
			});
		});

		it('falls back to default global settings when data is missing or corrupt', async () => {
			const driver = new MemoryStorageDriver();
			const storage = createGameStorage(GLOBAL_SETTINGS_APP_SCOPE, { driver });

			await driver.setItem(`arcade::${GLOBAL_SETTINGS_APP_SCOPE}::${GLOBAL_SETTINGS_STORAGE_KEY}`, 'null');
			const retrieved = await getGlobalSettings(storage);
			expect(retrieved).toEqual(DEFAULT_GLOBAL_SETTINGS);
		});
	});
});
