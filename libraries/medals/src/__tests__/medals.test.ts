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

		// Win on Hard with errors Count = 0, hints = 0 in 100s
		const result = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 100,
				levelKey: 'hard',
				roundContext: { difficulty: 'hard', errorsCount: 0, hintsUsed: 0 },
			},
			{ storage, now: 5000 },
		);

		// Unlocked: first_victory (bronze), speed_demon (gold: <= 180s), flawless_logic (gold: 0 errors on Hard)
		const unlockedIds = result.newlyUnlockedMedals.map((m) => m.id);
		expect(unlockedIds).toContain('sudoku_first_victory');
		expect(unlockedIds).toContain('sudoku_speed_demon');
		expect(unlockedIds).toContain('sudoku_flawless_logic');

		// Playing again does not re-unlock
		const secondResult = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 100,
				levelKey: 'hard',
				roundContext: { difficulty: 'hard', errorsCount: 0, hintsUsed: 0 },
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

		// 1. Play first win on Hard: 120s (<=180s on Hard -> speed demon), 0 mistakes & 0 hints on Hard -> flawless logic, first win -> first_victory
		const result1 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 120,
				levelKey: 'hard',
				roundContext: {
					difficulty: 'hard',
					mistakesCount: 0,
					errorsCount: 0,
					hintsUsed: 0,
					presetId: 'easy-1',
				},
			},
			{ storage },
		);

		expect(result1.newlyUnlockedMedals.length).toBe(5);
		const unlockedIds = result1.newlyUnlockedMedals.map((m) => m.id);
		expect(unlockedIds).toContain('sudoku_first_victory');
		expect(unlockedIds).toContain('sudoku_participation');
		expect(unlockedIds).toContain('sudoku_speed_demon');
		expect(unlockedIds).toContain('sudoku_flawless_logic');
		expect(unlockedIds).toContain('sudoku_surgical_precision');

		expect(result1.updatedState.customStats.difficulties.hard.gamesWon).toBe(1);
		expect(result1.updatedState.customStats.difficulties.hard.bestTimeSeconds).toBe(120);
		expect(result1.updatedState.customStats.completedPresetIds).toContain('easy-1');
		expect(result1.updatedState.customStats.completedPresetsWithoutHints).toContain('easy-1');

		// 2. Play second win: 200s, 2 mistakes -> unlocks living_on_edge (Standalone Silver)
		const result2 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 200,
				levelKey: 'hard',
				roundContext: {
					difficulty: 'hard',
					mistakesCount: 2,
					errorsCount: 2,
					hintsUsed: 1,
				},
			},
			{ storage },
		);

		expect(result2.newlyUnlockedMedals.length).toBe(1);
		expect(result2.newlyUnlockedMedals[0].id).toBe('sudoku_living_on_edge');
		expect(result2.newlyUnlockedMedals[0].tier).toBe('silver');
		expect(result2.updatedState.baseStats.gamesWon).toBe(2);

		// 3. Play 3rd win: streak reaches 3 -> unlocks sudoku_streak Bronze!
		const result3 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 250,
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
		expect(result3.newlyUnlockedMedals[0].id).toBe('sudoku_streak');
		expect(result3.newlyUnlockedMedals[0].tier).toBe('bronze');
		const streakProg = result3.updatedState.medalProgress.sudoku_streak;
		expect(streakProg.currentTier).toBe('bronze');
		expect(streakProg.currentProgress).toBe(3);
		expect(streakProg.nextThreshold).toBe(5);
		expect(streakProg.bronzeUnlocked).toBe(true);
		expect(streakProg.silverUnlocked).toBe(false);

		// 4. Play remaining easy presets to complete easy campaign foundations
		for (const id of ['easy-2', 'easy-3', 'easy-4', 'easy-5', 'easy-6']) {
			await recordGameResult(
				{
					gameId: 'sudoku',
					won: true,
					playTimeSeconds: 100,
					levelKey: 'easy',
					roundContext: {
						difficulty: 'easy',
						presetId: id,
						hintsUsed: 0,
					},
				},
				{ storage },
			);
		}

		const afterEasy = await getGameMedalState('sudoku', storage);
		expect(afterEasy.unlockedMedals.sudoku_campaign_foundations).toBeDefined();
		expect(afterEasy.unlockedMedals.sudoku_campaign_foundations.tier).toBe('bronze');
		const foundationsProg = afterEasy.medalProgress.sudoku_campaign_foundations;
		expect(foundationsProg.currentTier).toBe('bronze');
		expect(foundationsProg.bronzeUnlocked).toBe(true);
		expect(foundationsProg.nextThreshold).toBe(6);

		// Streak is now 8 -> should have unlocked Silver for sudoku_streak at 5
		expect(afterEasy.unlockedMedals.sudoku_streak.tier).toBe('silver');
		expect(afterEasy.medalProgress.sudoku_streak.silverUnlocked).toBe(true);
		expect(afterEasy.medalProgress.sudoku_streak.nextThreshold).toBe(10);
	});

	it('evaluates beyond_mortal and campaign_gauntlet ladder progression', async () => {
		const storage = new MockMemoryStorage('sudoku');

		// 1. Solve on Insane -> unlocks beyond_mortal and speed_demon (if <= 180s)
		const resInsane = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 150,
				levelKey: 'insane',
				roundContext: {
					difficulty: 'insane',
					mistakesCount: 0,
					hintsUsed: 0,
				},
			},
			{ storage },
		);

		const unlockedIds = resInsane.newlyUnlockedMedals.map((m) => m.id);
		expect(unlockedIds).toContain('sudoku_beyond_mortal');
		expect(unlockedIds).toContain('sudoku_first_victory');
		expect(unlockedIds).toContain('sudoku_speed_demon');
		expect(unlockedIds).toContain('sudoku_flawless_logic');

		// 2. Solve 3 Hard presets -> unlocks Bronze for sudoku_campaign_gauntlet
		for (const id of ['hard-1', 'hard-2', 'hard-3']) {
			await recordGameResult(
				{
					gameId: 'sudoku',
					won: true,
					playTimeSeconds: 200,
					levelKey: 'hard',
					roundContext: {
						difficulty: 'hard',
						presetId: id,
					},
				},
				{ storage },
			);
		}

		let state = await getGameMedalState('sudoku', storage);
		expect(state.unlockedMedals.sudoku_campaign_gauntlet).toBeDefined();
		expect(state.unlockedMedals.sudoku_campaign_gauntlet.tier).toBe('bronze');
		expect(state.medalProgress.sudoku_campaign_gauntlet.currentTier).toBe('bronze');
		expect(state.medalProgress.sudoku_campaign_gauntlet.bronzeUnlocked).toBe(true);
		expect(state.medalProgress.sudoku_campaign_gauntlet.nextThreshold).toBe(6);

		// 3. Solve remaining 3 Hard presets -> unlocks Silver for gauntlet
		for (const id of ['hard-4', 'hard-5', 'hard-6']) {
			await recordGameResult(
				{
					gameId: 'sudoku',
					won: true,
					playTimeSeconds: 200,
					levelKey: 'hard',
					roundContext: {
						difficulty: 'hard',
						presetId: id,
					},
				},
				{ storage },
			);
		}

		state = await getGameMedalState('sudoku', storage);
		expect(state.unlockedMedals.sudoku_campaign_gauntlet.tier).toBe('silver');
		expect(state.medalProgress.sudoku_campaign_gauntlet.currentTier).toBe('silver');
		expect(state.medalProgress.sudoku_campaign_gauntlet.silverUnlocked).toBe(true);

		// 4. Solve all 6 Very Hard presets -> unlocks Gold for gauntlet
		for (const id of ['veryHard-1', 'veryHard-2', 'veryHard-3', 'veryHard-4', 'veryHard-5', 'veryHard-6']) {
			await recordGameResult(
				{
					gameId: 'sudoku',
					won: true,
					playTimeSeconds: 200,
					levelKey: 'veryHard',
					roundContext: {
						difficulty: 'veryHard',
						presetId: id,
					},
				},
				{ storage },
			);
		}

		state = await getGameMedalState('sudoku', storage);
		expect(state.unlockedMedals.sudoku_campaign_gauntlet.tier).toBe('gold');
		expect(state.medalProgress.sudoku_campaign_gauntlet.currentTier).toBe('gold');
		expect(state.medalProgress.sudoku_campaign_gauntlet.goldUnlocked).toBe(true);
		expect(state.medalProgress.sudoku_campaign_gauntlet.nextThreshold).toBeNull();
	});

	it('evaluates quirky and defeat medals for Sudoku correctly', async () => {
		const storage = new MockMemoryStorage('sudoku');

		// 1. Defeat within 15 seconds -> unlocks sudoku_old_college_try (1st loss) and sudoku_speedrun_failure (<= 20s)
		const defeatRes = await recordGameResult(
			{
				gameId: 'sudoku',
				won: false,
				playTimeSeconds: 15,
				levelKey: 'hard',
				roundContext: {
					difficulty: 'hard',
					mistakesCount: 3,
				},
			},
			{ storage },
		);
		const defeatIds = defeatRes.newlyUnlockedMedals.map((m) => m.id);
		expect(defeatIds).toContain('sudoku_old_college_try');
		expect(defeatIds).toContain('sudoku_speedrun_failure');

		// 2. Second defeat -> sudoku_old_college_try should NOT unlock again
		const secondDefeat = await recordGameResult(
			{
				gameId: 'sudoku',
				won: false,
				playTimeSeconds: 10,
				levelKey: 'hard',
				roundContext: {
					difficulty: 'hard',
					mistakesCount: 3,
				},
			},
			{ storage },
		);
		const secondDefeatIds = secondDefeat.newlyUnlockedMedals.map((m) => m.id);
		expect(secondDefeatIds).not.toContain('sudoku_old_college_try');

		// 3. Victory: first win unlocks participation, pencil pusher (notes >= 60), are you sure (undos >= 10), insomnia (2-4 AM)
		const victoryRes1 = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 300,
				levelKey: 'medium',
				roundContext: {
					difficulty: 'medium',
					notesPlacedBeforeFirstDigit: 65,
					consecutiveUndosMax: 12,
					localHour: 3,
				},
			},
			{ storage },
		);
		const victory1Ids = victoryRes1.newlyUnlockedMedals.map((m) => m.id);
		expect(victory1Ids).toContain('sudoku_participation');
		expect(victory1Ids).toContain('sudoku_pencil_pusher');
		expect(victory1Ids).toContain('sudoku_are_you_sure');
		expect(victory1Ids).toContain('sudoku_insomnia');

		// 4. Analysis Paralysis (Easy puzzle won with playTimeSeconds > 1200)
		const victoryAnalysis = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 1250,
				levelKey: 'easy',
				roundContext: {
					difficulty: 'easy',
				},
			},
			{ storage },
		);
		expect(victoryAnalysis.newlyUnlockedMedals.map((m) => m.id)).toContain('sudoku_analysis_paralysis');

		// 5. Living on a Prayer (won, mistakesCount === 2, secondMistakeTimeSeconds <= 60)
		const victoryPrayer = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 250,
				levelKey: 'medium',
				roundContext: {
					difficulty: 'medium',
					mistakesCount: 2,
					secondMistakeTimeSeconds: 45,
				},
			},
			{ storage },
		);
		expect(victoryPrayer.newlyUnlockedMedals.map((m) => m.id)).toContain('sudoku_living_on_prayer');

		// 6. Surgical Precision (won, hard+, 0 notes, 0 hints, 0 mistakes)
		const victoryPrecision = await recordGameResult(
			{
				gameId: 'sudoku',
				won: true,
				playTimeSeconds: 400,
				levelKey: 'hard',
				roundContext: {
					difficulty: 'hard',
					mistakesCount: 0,
					hintsUsed: 0,
					totalNotesPlaced: 0,
				},
			},
			{ storage },
		);
		expect(victoryPrecision.newlyUnlockedMedals.map((m) => m.id)).toContain('sudoku_surgical_precision');
	});

	it('evaluates and awards all Minesweeper medals correctly', async () => {
		const storage = new MockMemoryStorage('minesweeper');

		// 1. Humorous Defeat: speedrun failure & college try
		const firstLoss = await recordGameResult(
			{
				gameId: 'minesweeper',
				won: false,
				playTimeSeconds: 2,
				levelKey: 'medium',
				sizeKey: 'md',
				roundContext: {
					flagsPlaced: 0,
					chordsUsed: 0,
					boardSize: 'medium',
					size: 'medium',
					difficulty: 'medium',
					firstMoveLoss: true,
				},
			},
			{ storage },
		);
		const lossIds = firstLoss.newlyUnlockedMedals.map((m) => m.id);
		expect(lossIds).toContain('minesweeper_college_try');
		expect(lossIds).toContain('minesweeper_speedrun_failure');

		// 2. First victory: clearance_initiated, speed_small, chord_master, flagless, tour (bronze)
		const win1 = await recordGameResult(
			{
				gameId: 'minesweeper',
				won: true,
				playTimeSeconds: 12,
				levelKey: 'medium',
				sizeKey: 'sm',
				roundContext: {
					flagsPlaced: 0,
					chordsUsed: 16,
					boardSize: 'small',
					size: 'small',
					difficulty: 'medium',
					firstMoveLoss: false,
				},
			},
			{ storage },
		);
		const win1Ids = win1.newlyUnlockedMedals.map((m) => m.id);
		expect(win1Ids).toContain('minesweeper_clearance_initiated');
		expect(win1Ids).toContain('minesweeper_speed_small');
		expect(win1Ids).toContain('minesweeper_chord_master');
		expect(win1Ids).toContain('minesweeper_tour');
		expect(win1.newlyUnlockedMedals.find((m) => m.id === 'minesweeper_tour')?.tier).toBe('bronze');

		// 3. Flagless on medium/large/extraLarge
		const winFlagless = await recordGameResult(
			{
				gameId: 'minesweeper',
				won: true,
				playTimeSeconds: 40,
				levelKey: 'medium',
				sizeKey: 'md',
				roundContext: {
					flagsPlaced: 0,
					chordsUsed: 2,
					boardSize: 'medium',
					size: 'medium',
					difficulty: 'medium',
					firstMoveLoss: false,
				},
			},
			{ storage },
		);
		expect(winFlagless.newlyUnlockedMedals.map((m) => m.id)).toContain('minesweeper_flagless');

		// 4. Tour Silver (large on hard)
		const winTourSilver = await recordGameResult(
			{
				gameId: 'minesweeper',
				won: true,
				playTimeSeconds: 50,
				levelKey: 'hard',
				sizeKey: 'lg',
				roundContext: {
					flagsPlaced: 5,
					chordsUsed: 4,
					boardSize: 'large',
					size: 'large',
					difficulty: 'hard',
					firstMoveLoss: false,
				},
			},
			{ storage },
		);
		expect(winTourSilver.newlyUnlockedMedals.find((m) => m.id === 'minesweeper_tour')?.tier).toBe('silver');

		// 5. Expert Gold & Tour Gold (extraLarge on expert in <= 90s)
		// This is also 4th win (current streak 4)
		const winTourGold = await recordGameResult(
			{
				gameId: 'minesweeper',
				won: true,
				playTimeSeconds: 75,
				levelKey: 'expert',
				sizeKey: 'xl',
				roundContext: {
					flagsPlaced: 10,
					chordsUsed: 8,
					boardSize: 'extraLarge',
					size: 'extraLarge',
					difficulty: 'expert',
					firstMoveLoss: false,
				},
			},
			{ storage },
		);
		const winGoldIds = winTourGold.newlyUnlockedMedals.map((m) => m.id);
		expect(winGoldIds).toContain('minesweeper_expert_gold');
		expect(winTourGold.newlyUnlockedMedals.find((m) => m.id === 'minesweeper_tour')?.tier).toBe('gold');

		// 6. 5th consecutive win on Medium+ -> streak silver and veteran bronze (5 wins)
		const win5 = await recordGameResult(
			{
				gameId: 'minesweeper',
				won: true,
				playTimeSeconds: 30,
				levelKey: 'medium',
				sizeKey: 'md',
				roundContext: {
					flagsPlaced: 2,
					chordsUsed: 1,
					boardSize: 'medium',
					size: 'medium',
					difficulty: 'medium',
					firstMoveLoss: false,
				},
			},
			{ storage },
		);
		const win5Medals = win5.newlyUnlockedMedals;
		expect(win5Medals.find((m) => m.id === 'minesweeper_veteran')?.tier).toBe('bronze');
		expect(win5Medals.find((m) => m.id === 'minesweeper_streak')?.tier).toBe('silver');

		// 7. Test The Ocho, Great Cascade, Flag Hoarder, Corner to Corner, Bomb Technician, Marathon
		const specialWin = await recordGameResult(
			{
				gameId: 'minesweeper',
				won: true,
				playTimeSeconds: 150,
				levelKey: 'expert',
				sizeKey: 'xl',
				roundContext: {
					flagsPlaced: 50,
					totalMines: 30, // 50 >= floor(30 * 1.5) = 45 -> flag_hoarder
					chordsUsed: 5,
					boardSize: 'extraLarge',
					size: 'extraLarge',
					difficulty: 'expert',
					firstMoveLoss: false,
					maxCascadeTiles: 25, // >= 20 -> great_cascade
					hasRevealedEight: true, // the_ocho
					cornersClearedInFirstFour: true, // corner_to_corner
					perfectFlagging: true, // bomb_technician
					safeTilesCleared: 520, // marathon bronze (>= 500)
				},
			},
			{ storage },
		);
		const specialIds = specialWin.newlyUnlockedMedals.map((m) => m.id);
		expect(specialIds).toContain('minesweeper_the_ocho');
		expect(specialIds).toContain('minesweeper_great_cascade');
		expect(specialIds).toContain('minesweeper_flag_hoarder');
		expect(specialIds).toContain('minesweeper_corner_to_corner');
		expect(specialIds).toContain('minesweeper_bomb_technician');
		expect(specialWin.newlyUnlockedMedals.find((m) => m.id === 'minesweeper_marathon')?.tier).toBe('bronze');

		// 8. Test Mine Magnet (5 consecutive defeats)
		let magnetUnlocked = false;
		for (let i = 0; i < 5; i++) {
			const lossRes = await recordGameResult(
				{
					gameId: 'minesweeper',
					won: false,
					playTimeSeconds: 10,
					levelKey: 'medium',
					sizeKey: 'md',
					roundContext: {
						flagsPlaced: 0,
						chordsUsed: 0,
						boardSize: 'medium',
						size: 'medium',
						difficulty: 'medium',
						firstMoveLoss: false,
					},
				},
				{ storage },
			);
			if (lossRes.newlyUnlockedMedals.some((m) => m.id === 'minesweeper_mine_magnet')) {
				magnetUnlocked = true;
			}
		}
		expect(magnetUnlocked).toBe(true);
	});

	it('evaluates and awards all Nonogram medals correctly', async () => {
		const storage = new MockMemoryStorage('nonogram');

		// 1. First Brushstroke + Speed Sketcher (5x5 in 18s) + Playing It Safe (15 crosses before fill)
		const res1 = await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 18,
				levelKey: 'easy',
				sizeKey: '5x5',
				roundContext: {
					difficulty: 'easy',
					size: '5x5',
					completedPuzzleId: 'easy-heart',
					mistakesCount: 0,
					hintsUsed: 0,
					crossesPlaced: 15,
					crossesBeforeFirstFill: 15,
					maxSameCellToggles: 1,
				},
			},
			{ storage, now: 1000 },
		);

		const res1Ids = res1.newlyUnlockedMedals.map((m) => m.id);
		expect(res1Ids).toContain('nonogram_first_brushstroke');
		expect(res1Ids).toContain('nonogram_speed_easy');
		expect(res1Ids).toContain('nonogram_playing_safe');

		// 2. Direct Painter + Flawless Canvas + Grand Muralist (15x15 in 150s, 0 mistakes, 0 hints, 0 crosses)
		const res2 = await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 150,
				levelKey: 'hard',
				sizeKey: '15x15',
				roundContext: {
					difficulty: 'hard',
					size: '15x15',
					completedPuzzleId: 'hard-dragon',
					mistakesCount: 0,
					hintsUsed: 0,
					crossesPlaced: 0,
					crossesBeforeFirstFill: 0,
					maxSameCellToggles: 6, // also triggers indecisive
				},
			},
			{ storage, now: 2000 },
		);

		const res2Ids = res2.newlyUnlockedMedals.map((m) => m.id);
		expect(res2Ids).toContain('nonogram_speed_hard');
		expect(res2Ids).toContain('nonogram_direct_painter');
		expect(res2Ids).toContain('nonogram_flawless_canvas');
		expect(res2Ids).toContain('nonogram_indecisive');

		// 3. College Try + Speedrun to Ruin + Abstract Expressionism on defeat
		const defeatRes = await recordGameResult(
			{
				gameId: 'nonogram',
				won: false,
				playTimeSeconds: 12,
				levelKey: 'hard',
				sizeKey: '15x15',
				roundContext: {
					difficulty: 'hard',
					size: '15x15',
					completedPuzzleId: 'hard-castle',
					mistakesCount: 3,
					hintsUsed: 0,
					crossesPlaced: 5,
					crossesBeforeFirstFill: 2,
					maxSameCellToggles: 2,
					boardFillRatioOnDefeat: 0.8,
				},
			},
			{ storage, now: 3000 },
		);

		const defeatIds = defeatRes.newlyUnlockedMedals.map((m) => m.id);
		expect(defeatIds).toContain('nonogram_college_try');
		expect(defeatIds).toContain('nonogram_speedrun_ruin');
		expect(defeatIds).toContain('nonogram_abstract');

		// 4. Test Artist ladder (Bronze at 5 wins)
		for (let i = 0; i < 2; i++) {
			await recordGameResult(
				{
					gameId: 'nonogram',
					won: true,
					playTimeSeconds: 30,
					levelKey: 'easy',
					sizeKey: '5x5',
					roundContext: {
						completedPuzzleId: `easy-dummy-${i}`,
					},
				},
				{ storage, now: 4000 + i },
			);
		}
		const artist5Res = await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 30,
				levelKey: 'easy',
				sizeKey: '5x5',
				roundContext: {
					completedPuzzleId: 'easy-dummy-final',
				},
			},
			{ storage, now: 5000 },
		);
		expect(artist5Res.newlyUnlockedMedals.some((m) => m.id === 'nonogram_artist')).toBe(true);

		// 5. Test Gallery ladder (Bronze at 10 Easy puzzles)
		// 4 easy puzzles already completed: easy-heart, easy-dummy-0, easy-dummy-1, easy-dummy-final.
		// Add 5 more in loop, then 10th is galleryRes.
		for (let i = 0; i < 5; i++) {
			await recordGameResult(
				{
					gameId: 'nonogram',
					won: true,
					playTimeSeconds: 25,
					levelKey: 'easy',
					sizeKey: '5x5',
					roundContext: {
						difficulty: 'easy',
						size: '5x5',
						completedPuzzleId: `easy-puzzle-${i}`,
					},
				},
				{ storage, now: 6000 + i },
			);
		}
		const galleryRes = await recordGameResult(
			{
				gameId: 'nonogram',
				won: true,
				playTimeSeconds: 25,
				levelKey: 'easy',
				sizeKey: '5x5',
				roundContext: {
					difficulty: 'easy',
					size: '5x5',
					completedPuzzleId: 'easy-puzzle-10',
				},
			},
			{ storage, now: 7000 },
		);
		expect(galleryRes.newlyUnlockedMedals.some((m) => m.id === 'nonogram_gallery')).toBe(true);
	});

	it('evaluates and unlocks Bridges medals correctly', async () => {
		const storage = new MockMemoryStorage('bridges');

		// 1. First victory & speed_beginner & double_trouble
		const win1 = await recordGameResult(
			{
				gameId: 'bridges',
				won: true,
				playTimeSeconds: 15,
				levelKey: 'beginner',
				sizeKey: '6x6',
				roundContext: {
					doubleBridgesDrawnBeforeSingle: true,
					bridgesDemolishedCount: 0,
					hintsUsed: 0,
					mistakesCount: 0,
					bridgeCollisionAttempts: 0,
					maxSameEdgeToggles: 1,
					completedPresetId: 'b-1',
				},
			},
			{ storage, now: 1000 },
		);

		const unlockedIds = win1.newlyUnlockedMedals.map((m) => m.id);
		expect(unlockedIds).toContain('bridges_first_span');
		expect(unlockedIds).toContain('bridges_speed_beginner');
		expect(unlockedIds).toContain('bridges_double_trouble');

		// 2. Humorous medals: college try & speedrun collapse
		const loss1 = await recordGameResult(
			{
				gameId: 'bridges',
				won: false,
				playTimeSeconds: 8,
				levelKey: 'beginner',
				sizeKey: '6x6',
				roundContext: {
					isolatedLoopCreated: true,
					bridgeCollisionAttempts: 5,
					maxSameEdgeToggles: 6,
				},
			},
			{ storage, now: 2000 },
		);

		const lossUnlockedIds = loss1.newlyUnlockedMedals.map((m) => m.id);
		expect(lossUnlockedIds).toContain('bridges_college_try');
		expect(lossUnlockedIds).toContain('bridges_speedrun_collapse');
		expect(lossUnlockedIds).toContain('bridges_bridge_to_nowhere');
		expect(lossUnlockedIds).toContain('bridges_traffic_jam');
		expect(lossUnlockedIds).toContain('bridges_indecisive_engineer');

		// 3. Flawless network on hard
		const hardWin = await recordGameResult(
			{
				gameId: 'bridges',
				won: true,
				playTimeSeconds: 120,
				levelKey: 'hard',
				sizeKey: '14x14',
				roundContext: {
					bridgesDemolishedCount: 0,
					hintsUsed: 0,
				},
			},
			{ storage, now: 3000 },
		);
		expect(hardWin.newlyUnlockedMedals.some((m) => m.id === 'bridges_flawless_network')).toBe(true);
	});
});
