import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	type GameStats,
	type GameStorage,
	type StatsSyncAdapter,
	createEmptyGameStats,
	getAggregatedGameStats,
	getGameStats,
	mergeGameStats,
	reconcileAllGameStats,
	reconcileGameStats,
	recordGameStats,
	registerStatsSyncAdapter,
} from '../createGameStorage.js';

class MockMemoryStorage implements GameStorage {
	readonly appName: string;
	readonly driverName = 'memory';
	private store = new Map<string, string>();

	constructor(appName: string) {
		this.appName = appName;
	}

	async get<T>(key: string): Promise<T | null> {
		const raw = this.store.get(key);
		return raw ? (JSON.parse(raw) as T) : null;
	}

	async set<T>(key: string, value: T): Promise<void> {
		this.store.set(key, JSON.stringify(value));
	}

	async remove(key: string): Promise<void> {
		this.store.delete(key);
	}

	async keys(): Promise<string[]> {
		return Array.from(this.store.keys());
	}

	async clear(): Promise<void> {
		this.store.clear();
	}
}

describe('Stats Cloud Sync & Reconciliation', () => {
	beforeEach(() => {
		registerStatsSyncAdapter(null);
	});

	it('pushes updated stats to sync adapter when recordGameStats is called with sync enabled', async () => {
		const storage = new MockMemoryStorage('tents');
		const syncGameStats = vi.fn(async () => {});
		const adapter: StatsSyncAdapter = {
			isSyncEnabled: () => true,
			syncGameStats,
			fetchGameStats: vi.fn(async () => null),
		};
		registerStatsSyncAdapter(adapter);

		const updated = await recordGameStats(
			{
				gameId: 'tents',
				won: true,
				bucketKey: 'expert',
				playTimeSeconds: 120,
			},
			storage,
		);

		expect(syncGameStats).toHaveBeenCalledTimes(1);
		expect(syncGameStats).toHaveBeenCalledWith('tents', updated);
	});

	it('merges local and remote GameStats monotonically', () => {
		const local: GameStats = {
			schemaVersion: 1,
			gameId: 'sudoku',
			updatedAt: 1000,
			overall: {
				gamesPlayed: 3,
				gamesWon: 2,
				gamesLost: 1,
				currentStreak: 1,
				bestStreak: 2,
				bestTimeSeconds: 95,
				totalPlayTimeSeconds: 300,
				bestMoves: null,
				bestScore: null,
				flawlessWins: 1,
			},
			byBucket: {
				easy: {
					gamesPlayed: 3,
					gamesWon: 2,
					gamesLost: 1,
					currentStreak: 1,
					bestStreak: 2,
					bestTimeSeconds: 95,
					totalPlayTimeSeconds: 300,
					bestMoves: null,
					bestScore: null,
					flawlessWins: 1,
				},
			},
			lifetimeMetrics: { hintsUsed: 2 },
		};

		const remote: GameStats = {
			schemaVersion: 1,
			gameId: 'sudoku',
			updatedAt: 2000,
			overall: {
				gamesPlayed: 10,
				gamesWon: 8,
				gamesLost: 2,
				currentStreak: 4,
				bestStreak: 5,
				bestTimeSeconds: 72,
				totalPlayTimeSeconds: 900,
				bestMoves: 40,
				bestScore: 500,
				flawlessWins: 3,
			},
			byBucket: {
				hard: {
					gamesPlayed: 7,
					gamesWon: 6,
					gamesLost: 1,
					currentStreak: 4,
					bestStreak: 5,
					bestTimeSeconds: 72,
					totalPlayTimeSeconds: 600,
					bestMoves: 40,
					bestScore: 500,
					flawlessWins: 2,
				},
			},
			lifetimeMetrics: { hintsUsed: 5, cellsSolved: 400 },
		};

		const merged = mergeGameStats(local, remote);
		expect(merged.overall.gamesPlayed).toBe(10);
		expect(merged.overall.gamesWon).toBe(8);
		expect(merged.overall.currentStreak).toBe(4);
		expect(merged.overall.bestStreak).toBe(5);
		expect(merged.overall.bestTimeSeconds).toBe(72);
		expect(merged.overall.bestMoves).toBe(40);
		expect(merged.overall.bestScore).toBe(500);
		expect(merged.byBucket.easy?.gamesPlayed).toBe(3);
		expect(merged.byBucket.hard?.gamesPlayed).toBe(7);
		expect(merged.lifetimeMetrics.hintsUsed).toBe(5);
		expect(merged.lifetimeMetrics.cellsSolved).toBe(400);
	});

	it('reconciles remote stats into empty local storage and updates aggregated mirror', async () => {
		const storage = new MockMemoryStorage('sudoku');
		const remoteStats: GameStats = {
			...createEmptyGameStats('sudoku'),
			updatedAt: 5000,
			overall: {
				gamesPlayed: 4,
				gamesWon: 4,
				gamesLost: 0,
				currentStreak: 4,
				bestStreak: 4,
				bestTimeSeconds: 80,
				totalPlayTimeSeconds: 400,
				bestMoves: null,
				bestScore: null,
				flawlessWins: 2,
			},
		};

		const adapter: StatsSyncAdapter = {
			isSyncEnabled: () => true,
			fetchGameStats: vi.fn(async () => remoteStats),
			syncGameStats: vi.fn(async () => {}),
		};
		registerStatsSyncAdapter(adapter);

		const reconciled = await reconcileGameStats('sudoku', storage);
		expect(reconciled.overall.gamesPlayed).toBe(4);

		const persisted = await getGameStats('sudoku', storage);
		expect(persisted.overall.gamesPlayed).toBe(4);

		const aggregated = await getAggregatedGameStats('sudoku', storage);
		expect(aggregated.totalPlayed).toBe(4);
		expect(aggregated.totalWon).toBe(4);
	});

	it('reconciles across all provided gameIds in parallel', async () => {
		const storages = new Map<string, MockMemoryStorage>();
		const adapter: StatsSyncAdapter = {
			isSyncEnabled: () => true,
			fetchGameStats: vi.fn(async () => null),
			syncGameStats: vi.fn(async () => {}),
		};
		registerStatsSyncAdapter(adapter);

		const results = await reconcileAllGameStats(['sudoku', 'tents', 'minesweeper'], (id) => {
			const s = new MockMemoryStorage(id);
			storages.set(id, s);
			return s;
		});

		expect(Object.keys(results)).toEqual(['sudoku', 'tents', 'minesweeper']);
		expect(adapter.fetchGameStats).toHaveBeenCalledTimes(3);
	});
});
