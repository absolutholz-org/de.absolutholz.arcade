import type { GameStorage } from '@arcade/lib-storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	type GameMedalState,
	type MedalSyncAdapter,
	getGameMedalState,
	reconcileAllGameMedals,
	reconcileGameMedals,
	registerMedalSyncAdapter,
	setGameMedalState,
} from '../index.js';

class MockMemoryStorage implements GameStorage {
	readonly appName: string;
	private store = new Map<string, string>();

	constructor(appName: string) {
		this.appName = appName;
	}

	get driverName(): string {
		return 'mock-memory';
	}

	async get<T>(key: string): Promise<T | null> {
		const namespacedKey = `arcade::${this.appName}::${key}`;
		const raw = this.store.get(namespacedKey);
		if (!raw) return null;
		return JSON.parse(raw) as T;
	}

	async set<T>(key: string, value: T): Promise<void> {
		const namespacedKey = `arcade::${this.appName}::${key}`;
		this.store.set(namespacedKey, JSON.stringify(value));
	}

	async remove(key: string): Promise<void> {
		const namespacedKey = `arcade::${this.appName}::${key}`;
		this.store.delete(namespacedKey);
	}

	async keys(): Promise<string[]> {
		return Array.from(this.store.keys());
	}

	async clear(): Promise<void> {
		this.store.clear();
	}
}

describe('Medals Reconciliation Engine', () => {
	beforeEach(() => {
		registerMedalSyncAdapter(null);
	});

	it('returns local state untouched if sync adapter is not registered or disabled', async () => {
		const storage = new MockMemoryStorage('sudoku');
		const localState = await getGameMedalState('sudoku', storage);
		localState.unlockedMedals.sudoku_first_win = {
			id: 'sudoku_first_win',
			tier: 'bronze',
			unlockedAt: 1000,
		};
		await setGameMedalState(localState, storage);

		const result = await reconcileGameMedals('sudoku', storage);
		expect(result.unlockedMedals.sudoku_first_win).toBeDefined();
		expect(Object.keys(result.unlockedMedals)).toHaveLength(1);
	});

	it('reconciles local medals with remote cloud medals bidirectionally', async () => {
		const storage = new MockMemoryStorage('sudoku');

		// 1. Laptop state (1 local medal earned)
		const laptopState = await getGameMedalState('sudoku', storage);
		laptopState.baseStats.gamesPlayed = 2;
		laptopState.baseStats.gamesWon = 1;
		laptopState.baseStats.bestStreak = 1;
		laptopState.unlockedMedals.sudoku_first_win = {
			id: 'sudoku_first_win',
			tier: 'bronze',
			unlockedAt: 2000,
		};
		await setGameMedalState(laptopState, storage);

		// 2. Remote/Phone state (3 medals earned on phone)
		const remoteMedalState: GameMedalState<'sudoku'> = {
			gameId: 'sudoku',
			baseStats: {
				gamesPlayed: 10,
				gamesWon: 8,
				totalPlayTimeSeconds: 600,
				currentStreak: 4,
				bestStreak: 4,
				lastPlayedAt: 5000,
			},
			customStats: {
				difficulties: {
					easy: { gamesPlayed: 5, gamesWon: 5, bestTimeSeconds: 120, currentStreak: 5, bestStreak: 5 },
					medium: { gamesPlayed: 5, gamesWon: 3, bestTimeSeconds: 300, currentStreak: 3, bestStreak: 3 },
					hard: { gamesPlayed: 0, gamesWon: 0, bestTimeSeconds: null, currentStreak: 0, bestStreak: 0 },
					veryHard: { gamesPlayed: 0, gamesWon: 0, bestTimeSeconds: null, currentStreak: 0, bestStreak: 0 },
					insane: { gamesPlayed: 0, gamesWon: 0, bestTimeSeconds: null, currentStreak: 0, bestStreak: 0 },
					inhuman: { gamesPlayed: 0, gamesWon: 0, bestTimeSeconds: null, currentStreak: 0, bestStreak: 0 },
					expert: { gamesPlayed: 0, gamesWon: 0, bestTimeSeconds: null, currentStreak: 0, bestStreak: 0 },
				},
				completedPresetIds: ['preset-1', 'preset-2'],
				completedPresetsWithoutHints: ['preset-1'],
			},
			unlockedMedals: {
				sudoku_first_win: { id: 'sudoku_first_win', tier: 'bronze', unlockedAt: 1000 },
				sudoku_speed_demon: { id: 'sudoku_speed_demon', tier: 'gold', unlockedAt: 3000 },
				sudoku_purist: { id: 'sudoku_purist', tier: 'silver', unlockedAt: 4000 },
			},
			medalProgress: {},
			schemaVersion: 1,
			updatedAt: 5000,
		};

		let pushedState: GameMedalState | null = null;
		const syncAdapter: MedalSyncAdapter = {
			isSyncEnabled: () => true,
			fetchGameMedals: vi.fn(async () => remoteMedalState),
			syncGameMedals: vi.fn(async (_gameId, state) => {
				pushedState = state;
			}),
		};
		registerMedalSyncAdapter(syncAdapter);

		// Reconcile
		const reconciled = await reconcileGameMedals('sudoku', storage);

		// Assert that laptop now has all 3 medals
		expect(Object.keys(reconciled.unlockedMedals)).toHaveLength(3);
		expect(reconciled.unlockedMedals.sudoku_first_win?.unlockedAt).toBe(1000); // Earliest unlock preserved
		expect(reconciled.unlockedMedals.sudoku_speed_demon).toBeDefined();
		expect(reconciled.unlockedMedals.sudoku_purist).toBeDefined();

		// Assert stats merged monotonically
		expect(reconciled.baseStats.gamesPlayed).toBe(10);
		expect(reconciled.baseStats.gamesWon).toBe(8);
		expect(reconciled.baseStats.bestStreak).toBe(4);

		// Assert local storage was updated
		const persistedLocal = await getGameMedalState('sudoku', storage);
		expect(Object.keys(persistedLocal.unlockedMedals)).toHaveLength(3);

		// Assert remote sync was called with merged result
		expect(syncAdapter.syncGameMedals).toHaveBeenCalled();
		expect(pushedState).toBeDefined();
		expect(Object.keys((pushedState as unknown as GameMedalState).unlockedMedals)).toHaveLength(3);
	});

	it('pushes local state to remote if remote is empty', async () => {
		const storage = new MockMemoryStorage('minesweeper');
		const localState = await getGameMedalState('minesweeper', storage);
		localState.baseStats.gamesPlayed = 3;
		localState.unlockedMedals.minesweeper_first_win = {
			id: 'minesweeper_first_win',
			tier: 'bronze',
			unlockedAt: 1500,
		};
		await setGameMedalState(localState, storage);

		let pushedState: GameMedalState | null = null;
		const syncAdapter: MedalSyncAdapter = {
			isSyncEnabled: () => true,
			fetchGameMedals: vi.fn(async () => null),
			syncGameMedals: vi.fn(async (_gameId, state) => {
				pushedState = state;
			}),
		};
		registerMedalSyncAdapter(syncAdapter);

		const result = await reconcileGameMedals('minesweeper', storage);
		expect(result.unlockedMedals.minesweeper_first_win).toBeDefined();
		expect(syncAdapter.syncGameMedals).toHaveBeenCalled();
		expect(pushedState).toBeDefined();
	});

	it('reconciles across all supported games in parallel', async () => {
		const storage = new MockMemoryStorage('sudoku');
		const syncAdapter: MedalSyncAdapter = {
			isSyncEnabled: () => true,
			fetchGameMedals: vi.fn(async () => null),
			syncGameMedals: vi.fn(async () => {}),
		};
		registerMedalSyncAdapter(syncAdapter);

		const allResults = await reconcileAllGameMedals(storage);
		expect(allResults.sudoku).toBeDefined();
		expect(allResults.minesweeper).toBeDefined();
		expect(allResults.nonogram).toBeDefined();
		expect(allResults.queens).toBeDefined();
		expect(allResults.tracks).toBeDefined();
		expect(syncAdapter.fetchGameMedals).toHaveBeenCalledTimes(5);
	});
});
