import type { GameStorage } from '@arcade/lib-storage';
import { describe, expect, it } from 'vitest';
import {
	type GameId,
	type GameMedalState,
	type MedalUnlockedEventDetail,
	type SyncQueueItem,
	getGameMedalState,
	mergeGameMedalState,
	recordGameResult,
	updateBaseStats,
	updateCustomStats,
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

describe('@arcade/lib-medals Foundation', () => {
	it('initializes default state on first read', async () => {
		const storage = new MockMemoryStorage('sudoku');
		const state = await getGameMedalState('sudoku', storage);

		expect(state.gameId).toBe('sudoku');
		expect(state.baseStats.gamesPlayed).toBe(0);
		expect(state.baseStats.gamesWon).toBe(0);
		expect(state.customStats.difficulties.expert.bestTimeSeconds).toBeNull();
		expect(Object.keys(state.unlockedMedals).length).toBe(0);
	});

	it('correctly aggregates base stats on win and loss', () => {
		const initial = {
			gamesPlayed: 0,
			gamesWon: 0,
			totalPlayTimeSeconds: 0,
			currentStreak: 0,
			bestStreak: 0,
			lastPlayedAt: 0,
		};

		const won = updateBaseStats(initial, true, 45, 1000);
		expect(won.gamesPlayed).toBe(1);
		expect(won.gamesWon).toBe(1);
		expect(won.totalPlayTimeSeconds).toBe(45);
		expect(won.currentStreak).toBe(1);
		expect(won.bestStreak).toBe(1);

		const wonAgain = updateBaseStats(won, true, 30, 2000);
		expect(wonAgain.currentStreak).toBe(2);
		expect(wonAgain.bestStreak).toBe(2);

		const lost = updateBaseStats(wonAgain, false, 20, 3000);
		expect(lost.gamesPlayed).toBe(3);
		expect(lost.gamesWon).toBe(2);
		expect(lost.currentStreak).toBe(0);
		expect(lost.bestStreak).toBe(2);
	});

	it('detects and stores level/puzzle best times in memory without session logs', async () => {
		const storage = new MockMemoryStorage('sudoku');

		// First win: 120 seconds
		const res1 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 120,
				levelKey: 'easy',
			},
			{ storage, now: 1000 },
		);

		expect(res1.isNewBestTime).toBe(true);
		expect(res1.updatedState.customStats.difficulties.easy.bestTimeSeconds).toBe(120);

		// Second win: 150 seconds (slower)
		const res2 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 150,
				levelKey: 'easy',
			},
			{ storage, now: 2000 },
		);

		expect(res2.isNewBestTime).toBe(false);
		expect(res2.updatedState.customStats.difficulties.easy.bestTimeSeconds).toBe(120);

		// Third win: 95 seconds (faster)
		const res3 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 95,
				levelKey: 'easy',
			},
			{ storage, now: 3000 },
		);

		expect(res3.isNewBestTime).toBe(true);
		expect(res3.updatedState.customStats.difficulties.easy.bestTimeSeconds).toBe(95);
	});

	it('evaluates and unlocks medals (bronze, gold)', async () => {
		const storage = new MockMemoryStorage('sudoku');

		// Win with errors Count = 0 in 100s
		const result = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 100,
				levelKey: 'medium',
				roundContext: { errorsCount: 0 },
			},
			{ storage, now: 5000 },
		);

		// Unlocked: first_win (bronze), speed_demon (gold: <= 180s), flawless (gold: 0 errors)
		const unlockedIds = result.newlyUnlockedMedals.map((m) => m.id);
		expect(unlockedIds).toContain('sudoku_first_win');
		expect(unlockedIds).toContain('sudoku_speed_demon');
		expect(unlockedIds).toContain('sudoku_flawless');

		// Playing again does not re-unlock
		const secondResult = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 100,
				levelKey: 'medium',
				roundContext: { errorsCount: 0 },
			},
			{ storage, now: 6000 },
		);
		expect(secondResult.newlyUnlockedMedals.length).toBe(0);
	});

	it('merges states field-by-field during conflict resolution (Option A)', async () => {
		const storageA = new MockMemoryStorage('nonogram');
		const storageB = new MockMemoryStorage('nonogram');

		// Device A solves puzzle 1 in 50s
		const resA = await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 50,
				levelKey: 'puzzle_1',
				roundContext: { errorsCount: 0 },
			},
			{ storage: storageA, now: 1000 },
		);

		// Device B solves puzzle 1 in 40s and puzzle 2 in 80s
		await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 40,
				levelKey: 'puzzle_1',
				roundContext: { errorsCount: 0 },
			},
			{ storage: storageB, now: 2000 },
		);
		const resB = await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 80,
				levelKey: 'puzzle_2',
			},
			{ storage: storageB, now: 3000 },
		);

		const merged = mergeGameMedalState(resA.updatedState, resB.updatedState);

		expect(merged.baseStats.gamesWon).toBe(2);
		expect(merged.customStats.puzzles.puzzle_1.bestTimeSeconds).toBe(40);
		expect(merged.customStats.puzzles.puzzle_2.bestTimeSeconds).toBe(80);
		expect(merged.unlockedMedals.nonogram_first_solve).toBeDefined();
	});

	it('dispatches medalUnlocked custom event on window when medals are earned', async () => {
		const target = new EventTarget();
		const originalWindow = (globalThis as unknown as { window?: unknown }).window;
		Object.defineProperty(globalThis, 'window', {
			value: target,
			writable: true,
			configurable: true,
		});

		const storage = new MockMemoryStorage('sudoku');
		let eventFired = false;
		let receivedDetail: MedalUnlockedEventDetail | null = null;

		const listener = (event: Event) => {
			eventFired = true;
			receivedDetail = (event as CustomEvent<MedalUnlockedEventDetail>).detail;
		};

		window.addEventListener('medalUnlocked', listener);

		await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 50,
				levelKey: 'easy',
				roundContext: { errorsCount: 0 },
			},
			{ storage, now: 1000 },
		);

		window.removeEventListener('medalUnlocked', listener);

		if (originalWindow !== undefined) {
			Object.defineProperty(globalThis, 'window', {
				value: originalWindow,
				writable: true,
				configurable: true,
			});
		} else {
			(globalThis as unknown as { window?: unknown }).window = undefined;
		}

		expect(eventFired).toBe(true);
		expect(receivedDetail?.gameId).toBe('sudoku');
		expect(receivedDetail?.medals.length).toBeGreaterThan(0);
	});

	it('does not trigger cloud sync or queue for Tier 1 and Tier 2 (sync disabled)', async () => {
		const storage = new MockMemoryStorage('sudoku');
		const syncStorage = new MockMemoryStorage('sync');
		let syncCalled = false;

		const syncAdapter = {
			isSyncEnabled: () => false, // Tier 1 or 2
			syncGameMedals: async () => {
				syncCalled = true;
			},
		};

		await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 60,
				levelKey: 'easy',
			},
			{ storage, syncStorage, syncAdapter, isOnline: () => true },
		);

		expect(syncCalled).toBe(false);
		const queue = await syncStorage.get('queue');
		expect(queue).toBeNull();
	});

	it('triggers cloud sync immediately when online for Tier 3 and Tier 4', async () => {
		const storage = new MockMemoryStorage('sudoku');
		const syncStorage = new MockMemoryStorage('sync');
		let syncedGameId: GameId | null = null;
		let syncedState: GameMedalState | null = null;

		const syncAdapter = {
			isSyncEnabled: () => true, // Tier 3 or 4
			syncGameMedals: async (gameId: GameId, state: GameMedalState) => {
				syncedGameId = gameId;
				syncedState = state;
			},
		};

		await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 60,
				levelKey: 'easy',
			},
			{ storage, syncStorage, syncAdapter, isOnline: () => true },
		);

		expect(syncedGameId).toBe('sudoku');
		expect(syncedState).toBeDefined();
		expect(syncedState?.baseStats.gamesWon).toBe(1);

		const queue = await syncStorage.get('queue');
		expect(queue).toBeNull();
	});

	it('enqueues to sync queue when offline for Tier 3 and Tier 4, and flushes upon reconnecting', async () => {
		const storage = new MockMemoryStorage('sudoku');
		const syncStorage = new MockMemoryStorage('sync');
		let syncedCount = 0;

		const syncAdapter = {
			isSyncEnabled: () => true, // Tier 3 or 4
			syncGameMedals: async () => {
				syncedCount++;
			},
		};

		// 1. Play while offline
		await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 60,
				levelKey: 'easy',
			},
			{ storage, syncStorage, syncAdapter, isOnline: () => false },
		);

		expect(syncedCount).toBe(0);
		const queued = await syncStorage.get<SyncQueueItem[]>('queue');
		expect(queued).not.toBeNull();
		expect(queued?.length).toBe(1);
		expect(queued?.[0].gameId).toBe('sudoku');

		// 2. Play another while offline
		await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 40,
				levelKey: 'easy',
			},
			{ storage, syncStorage, syncAdapter, isOnline: () => false },
		);
		// Upsert per gameId keeps queue at 1 item with updated state
		const queued2 = await syncStorage.get<SyncQueueItem[]>('queue');
		expect(queued2?.length).toBe(1);
		expect(queued2?.[0].state.baseStats.gamesWon).toBe(2);

		// 3. Network restores: flush queue
		const { flushMedalSyncQueue } = await import('../sync/syncQueue.js');
		const flushResult = await flushMedalSyncQueue(syncAdapter, {
			storage: syncStorage,
			isOnline: () => true,
		});

		expect(flushResult.syncedCount).toBe(1);
		expect(flushResult.remainingCount).toBe(0);
		expect(syncedCount).toBe(1);

		const finalQueue = await syncStorage.get('queue');
		expect(finalQueue).toBeNull();
	});

	it('evaluates and unlocks Sudoku pilot achievements end-to-end', async () => {
		const storage = new MockMemoryStorage('sudoku');

		// 1. Play first win: 120s, easy difficulty, 0 mistakes
		const result1 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 120,
				levelKey: 'easy',
				roundContext: {
					difficulty: 'easy',
					mistakesCount: 0,
					errorsCount: 0,
					hintsUsed: 0,
				},
			},
			{ storage },
		);

		expect(result1.newlyUnlockedMedals.length).toBe(3);
		const unlockedIds = result1.newlyUnlockedMedals.map((m) => m.id);
		expect(unlockedIds).toContain('sudoku_first_win');
		expect(unlockedIds).toContain('sudoku_speed_demon');
		expect(unlockedIds).toContain('sudoku_flawless');

		expect(result1.updatedState.customStats.difficulties.easy.gamesWon).toBe(1);
		expect(result1.updatedState.customStats.difficulties.easy.bestTimeSeconds).toBe(120);

		// 2. Play second win: 200s (too slow for speed demon), 2 mistakes (not flawless)
		const result2 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 200,
				levelKey: 'easy',
				roundContext: {
					difficulty: 'easy',
					mistakesCount: 2,
					errorsCount: 2,
					hintsUsed: 0,
				},
			},
			{ storage },
		);

		// No new medals unlocked
		expect(result2.newlyUnlockedMedals.length).toBe(0);
		expect(result2.updatedState.baseStats.gamesWon).toBe(2);
		expect(result2.updatedState.customStats.difficulties.easy.gamesWon).toBe(2);
		// Best time remains 120s
		expect(result2.updatedState.customStats.difficulties.easy.bestTimeSeconds).toBe(120);

		// 3. Play 3rd win to unlock streak medal
		const result3 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 150,
				levelKey: 'easy',
				roundContext: {
					difficulty: 'easy',
					mistakesCount: 1,
					hintsUsed: 0,
				},
			},
			{ storage },
		);

		expect(result3.newlyUnlockedMedals.length).toBe(1);
		expect(result3.newlyUnlockedMedals[0].id).toBe('sudoku_win_streak_3');
	});
});
