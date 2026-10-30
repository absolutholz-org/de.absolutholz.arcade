import { describe, expect, it } from 'vitest';
import {
	createInitialAggregatedGameStats,
	getAggregatedGameStats,
	getGlobalStats,
	recordGameSession,
	updateAggregatedGameStats,
} from '../createGameStorage.js';
import type { GameSessionResult } from '../stats/types.js';

// In-memory test storage mock adhering to GameStorage interface
function createTestStorage() {
	const map = new Map<string, string>();
	return {
		appName: 'test',
		driverName: 'memory',
		get: async <T>(key: string): Promise<T | null> => {
			const val = map.get(key);
			return val ? (JSON.parse(val) as T) : null;
		},
		set: async <T>(key: string, value: T): Promise<void> => {
			map.set(key, JSON.stringify(value));
		},
		remove: async (key: string): Promise<void> => {
			map.delete(key);
		},
		keys: async (): Promise<string[]> => {
			return Array.from(map.keys());
		},
		clear: async (): Promise<void> => {
			map.clear();
		},
	};
}

describe('Shared Session Statistics Engine', () => {
	it('creates initial aggregated stats with zeroes', () => {
		const initial = createInitialAggregatedGameStats('sudoku');
		expect(initial).toEqual({
			gameId: 'sudoku',
			totalPlayed: 0,
			totalWon: 0,
			winRate: 0,
			totalTimeMs: 0,
			bestTimeMs: undefined,
			currentStreak: 0,
			maxStreak: 0,
			lastPlayed: null,
		});
	});

	it('updates aggregated stats correctly on win, calculating streaks and personal bests', () => {
		let stats = createInitialAggregatedGameStats('sudoku');

		const round1: GameSessionResult = {
			gameId: 'sudoku',
			timestamp: 1000,
			durationMs: 95000,
			won: true,
			difficulty: 'easy',
		};
		stats = updateAggregatedGameStats(stats, round1);
		expect(stats.totalPlayed).toBe(1);
		expect(stats.totalWon).toBe(1);
		expect(stats.winRate).toBe(100);
		expect(stats.bestTimeMs).toBe(95000);
		expect(stats.currentStreak).toBe(1);
		expect(stats.maxStreak).toBe(1);

		const round2: GameSessionResult = {
			gameId: 'sudoku',
			timestamp: 2000,
			durationMs: 75000, // faster
			won: true,
			difficulty: 'easy',
		};
		stats = updateAggregatedGameStats(stats, round2);
		expect(stats.totalPlayed).toBe(2);
		expect(stats.totalWon).toBe(2);
		expect(stats.winRate).toBe(100);
		expect(stats.bestTimeMs).toBe(75000);
		expect(stats.currentStreak).toBe(2);
		expect(stats.maxStreak).toBe(2);

		const round3: GameSessionResult = {
			gameId: 'sudoku',
			timestamp: 3000,
			durationMs: 120000,
			won: false, // loss
			difficulty: 'medium',
		};
		stats = updateAggregatedGameStats(stats, round3);
		expect(stats.totalPlayed).toBe(3);
		expect(stats.totalWon).toBe(2);
		expect(stats.winRate).toBe(67);
		expect(stats.bestTimeMs).toBe(75000);
		expect(stats.currentStreak).toBe(0); // reset streak
		expect(stats.maxStreak).toBe(2);
	});

	it('persists and retrieves sessions via recordGameSession and getAggregatedGameStats', async () => {
		const storage = createTestStorage();
		const result: GameSessionResult = {
			gameId: 'minesweeper',
			timestamp: 4000,
			durationMs: 30000,
			won: true,
			difficulty: 'simple',
		};

		const updated = await recordGameSession(result, storage);
		expect(updated.totalPlayed).toBe(1);
		expect(updated.totalWon).toBe(1);

		const fetched = await getAggregatedGameStats('minesweeper', storage);
		expect(fetched).toEqual(updated);
	});

	it('computes global stats across multiple games', async () => {
		const storageMap = new Map<string, ReturnType<typeof createTestStorage>>();
		const resolver = (id: string) => {
			let storage = storageMap.get(id);
			if (!storage) {
				storage = createTestStorage();
				storageMap.set(id, storage);
			}
			return storage;
		};

		await recordGameSession(
			{
				gameId: 'sudoku',
				timestamp: 1000,
				durationMs: 60000,
				won: true,
			},
			resolver('sudoku'),
		);

		await recordGameSession(
			{
				gameId: 'minesweeper',
				timestamp: 2000,
				durationMs: 40000,
				won: false,
			},
			resolver('minesweeper'),
		);

		const global = await getGlobalStats(['sudoku', 'minesweeper'], resolver);
		expect(global.totalGamesPlayed).toBe(2);
		expect(global.totalGamesWon).toBe(1);
		expect(global.totalPlayTimeMs).toBe(100000);
		expect(global.games.sudoku.totalWon).toBe(1);
		expect(global.games.minesweeper.totalWon).toBe(0);
	});
});
