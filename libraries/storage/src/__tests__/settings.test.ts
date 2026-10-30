import { describe, expect, it } from 'vitest';
import {
	GAME_SETTINGS_STORAGE_KEY,
	createGameStorage,
	getGameSettings,
	saveGameSettings,
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
		const storage = createGameStorage('queens', { driver });

		// Simulate legacy persisted settings missing a newly introduced field `newFeatureToggle`
		await storage.set(GAME_SETTINGS_STORAGE_KEY, {
			highlightErrors: false,
			soundEffects: true,
		});

		const extendedDefaults: TestGameSettings = {
			...DEFAULT_TEST_SETTINGS,
			newFeatureToggle: true,
		};

		const loaded = await getGameSettings('queens', extendedDefaults, storage);

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
});
