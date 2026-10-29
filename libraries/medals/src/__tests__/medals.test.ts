import type { GameStorage } from '@arcade/lib-storage';
import { describe, expect, it } from 'vitest';
import {
	type AchievementDefinition,
	type GameId,
	type GameMedalState,
	type MedalTier,
	type MedalUnlockedEventDetail,
	type SyncQueueItem,
	getGameMedalState,
	getMedalDefinitionsForGame,
	mergeGameMedalState,
	recordGameResult,
	registerMedalDefinitions,
	updateBaseStats,
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

const MOCK_SUDOKU_DEFINITIONS: readonly AchievementDefinition<'sudoku'>[] = [
	{
		id: 'sudoku_first_victory',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.sudoku.first_victory.title',
		descriptionKey: 'medals.sudoku.first_victory.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'sudoku_speed_demon',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.sudoku.speed_demon.title',
		descriptionKey: 'medals.sudoku.speed_demon.desc',
		icon: 'sparkles',
		evaluate: ({ result }) => ({
			unlocked: Boolean(result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 180),
		}),
	},
	{
		id: 'sudoku_flawless_logic',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.sudoku.flawless_logic.title',
		descriptionKey: 'medals.sudoku.flawless_logic.desc',
		icon: 'star',
		evaluate: ({ result }) => ({
			unlocked: Boolean(
				result.won &&
					result.roundContext?.errorsCount === 0 &&
					(result.roundContext?.hintsUsed === 0 || result.roundContext?.hintsUsed === undefined),
			),
		}),
	},
	{
		id: 'sudoku_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.sudoku.streak.title',
		descriptionKey: 'medals.sudoku.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => {
			const streak = updatedBaseStats.bestStreak;
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 3;

			if (streak >= 10) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (streak >= 5) {
				currentTier = 'silver';
				nextThreshold = 10;
			} else if (streak >= 3) {
				currentTier = 'bronze';
				nextThreshold = 5;
			}

			return {
				currentProgress: streak,
				currentTier,
				nextThreshold,
				bronzeUnlocked: streak >= 3,
				silverUnlocked: streak >= 5,
				goldUnlocked: streak >= 10,
			};
		},
	},
];

const MOCK_NONOGRAM_DEFINITIONS: readonly AchievementDefinition<'nonogram'>[] = [
	{
		id: 'nonogram_first_brushstroke',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.nonogram.first_brushstroke.title',
		descriptionKey: 'medals.nonogram.first_brushstroke.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
];

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

	it('registers and retrieves medal definitions via runtime registry', () => {
		registerMedalDefinitions('sudoku', MOCK_SUDOKU_DEFINITIONS);
		expect(getMedalDefinitionsForGame('sudoku')).toEqual(MOCK_SUDOKU_DEFINITIONS);
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
			{ storage, now: 1000, definitions: MOCK_SUDOKU_DEFINITIONS },
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
			{ storage, now: 2000, definitions: MOCK_SUDOKU_DEFINITIONS },
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
			{ storage, now: 3000, definitions: MOCK_SUDOKU_DEFINITIONS },
		);

		expect(res3.isNewBestTime).toBe(true);
		expect(res3.updatedState.customStats.difficulties.easy.bestTimeSeconds).toBe(95);
	});

	it('evaluates and unlocks standalone and ladder medals', async () => {
		const storage = new MockMemoryStorage('sudoku');

		// Win 1 on Hard with errorsCount = 0, hints = 0 in 100s
		const result = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 100,
				levelKey: 'hard',
				roundContext: { difficulty: 'hard', errorsCount: 0, hintsUsed: 0 },
			},
			{ storage, now: 5000, definitions: MOCK_SUDOKU_DEFINITIONS },
		);

		const unlockedIds = result.newlyUnlockedMedals.map((m) => m.id);
		expect(unlockedIds).toContain('sudoku_first_victory');
		expect(unlockedIds).toContain('sudoku_speed_demon');
		expect(unlockedIds).toContain('sudoku_flawless_logic');

		// Playing again does not re-unlock standalone medals
		const secondResult = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 100,
				levelKey: 'hard',
				roundContext: { difficulty: 'hard', errorsCount: 0, hintsUsed: 0 },
			},
			{ storage, now: 6000, definitions: MOCK_SUDOKU_DEFINITIONS },
		);
		expect(secondResult.newlyUnlockedMedals.length).toBe(0);

		// Win 3 unlocks bronze ladder tier on sudoku_streak
		const thirdResult = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 200,
				levelKey: 'easy',
			},
			{ storage, now: 7000, definitions: MOCK_SUDOKU_DEFINITIONS },
		);
		expect(thirdResult.newlyUnlockedMedals.length).toBe(1);
		expect(thirdResult.newlyUnlockedMedals[0].id).toBe('sudoku_streak');
		expect(thirdResult.newlyUnlockedMedals[0].tier).toBe('bronze');
		expect(thirdResult.updatedState.medalProgress.sudoku_streak.bronzeUnlocked).toBe(true);
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
			{ storage: storageA, now: 1000, definitions: MOCK_NONOGRAM_DEFINITIONS },
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
			{ storage: storageB, now: 2000, definitions: MOCK_NONOGRAM_DEFINITIONS },
		);
		const resB = await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 80,
				levelKey: 'puzzle_2',
			},
			{ storage: storageB, now: 3000, definitions: MOCK_NONOGRAM_DEFINITIONS },
		);

		const merged = mergeGameMedalState(resA.updatedState, resB.updatedState);

		expect(merged.baseStats.gamesWon).toBe(2);
		expect(merged.customStats.puzzles.puzzle_1.bestTimeSeconds).toBe(40);
		expect(merged.customStats.puzzles.puzzle_2.bestTimeSeconds).toBe(80);
		expect(merged.unlockedMedals.nonogram_first_brushstroke).toBeDefined();
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
			{ storage, now: 1000, definitions: MOCK_SUDOKU_DEFINITIONS },
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
			{ storage, syncStorage, syncAdapter, isOnline: () => true, definitions: MOCK_SUDOKU_DEFINITIONS },
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
			{ storage, syncStorage, syncAdapter, isOnline: () => true, definitions: MOCK_SUDOKU_DEFINITIONS },
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
			{ storage, syncStorage, syncAdapter, isOnline: () => false, definitions: MOCK_SUDOKU_DEFINITIONS },
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
			{ storage, syncStorage, syncAdapter, isOnline: () => false, definitions: MOCK_SUDOKU_DEFINITIONS },
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
});
