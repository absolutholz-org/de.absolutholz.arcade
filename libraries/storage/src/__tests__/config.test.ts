import { describe, expect, it } from 'vitest';
import {
	LAST_GAME_CONFIG_STORAGE_KEY,
	createGameStorage,
	getLastGameConfig,
	saveLastGameConfig,
} from '../createGameStorage.js';
import { MemoryStorageDriver } from '../drivers/memoryDriver.js';

interface TestAnagramConfig {
	vocab: 'en' | 'de' | 'fr' | 'pt';
	mode: 'zen' | 'timed';
	difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

interface TestSudokuConfig {
	difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
}

describe('Game Config Persistence', () => {
	it('returns null when storage is empty', async () => {
		const driver = new MemoryStorageDriver();
		const storage = createGameStorage('sudoku', { driver });

		const config = await getLastGameConfig<TestSudokuConfig>('sudoku', storage);
		expect(config).toBeNull();
	});

	it('returns null when stored item is not an object', async () => {
		const driver = new MemoryStorageDriver();
		await driver.setItem('arcade::sudoku::lastConfig', 'not-json-string');
		const storage = createGameStorage('sudoku', { driver });

		const config = await getLastGameConfig<TestSudokuConfig>('sudoku', storage);
		expect(config).toBeNull();
	});

	it('persists config under arcade::[gameId]::lastConfig and retrieves it', async () => {
		const driver = new MemoryStorageDriver();
		const storage = createGameStorage('anagram', { driver });

		const testConfig: TestAnagramConfig = {
			vocab: 'de',
			mode: 'timed',
			difficulty: 'expert',
		};

		await saveLastGameConfig('anagram', testConfig, storage);

		// Verify raw storage key namespacing
		const raw = await driver.getItem(`arcade::anagram::${LAST_GAME_CONFIG_STORAGE_KEY}`);
		expect(raw).not.toBeNull();
		expect(JSON.parse(raw as string)).toEqual(testConfig);

		// Verify retrieval via getLastGameConfig
		const loaded = await getLastGameConfig<TestAnagramConfig>('anagram', storage);
		expect(loaded).toEqual(testConfig);
	});

	it('overwrites previous config on new save', async () => {
		const driver = new MemoryStorageDriver();
		const storage = createGameStorage('sudoku', { driver });

		await saveLastGameConfig('sudoku', { difficulty: 'easy' }, storage);
		let loaded = await getLastGameConfig<TestSudokuConfig>('sudoku', storage);
		expect(loaded?.difficulty).toBe('easy');

		await saveLastGameConfig('sudoku', { difficulty: 'master' }, storage);
		loaded = await getLastGameConfig<TestSudokuConfig>('sudoku', storage);
		expect(loaded?.difficulty).toBe('master');
	});

	it('resolves storage options when passed options instead of GameStorage instance', async () => {
		const driver = new MemoryStorageDriver();
		await saveLastGameConfig('tents', { difficulty: 'hard' }, { driver });

		const loaded = await getLastGameConfig<{ difficulty: string }>('tents', { driver });
		expect(loaded).toEqual({ difficulty: 'hard' });
	});
});
