import { describe, expect, it } from 'vitest';
import {
	GAME_STATS_STORAGE_KEY,
	createEmptyDifficultyBucketStats,
	createEmptyGameStats,
	createGameStorage,
	getGameStats,
	recordGameStats,
	updateStatsWithRound,
} from '../createGameStorage.js';
import { MemoryStorageDriver } from '../drivers/memoryDriver.js';
import type { GameStats, RoundStatsInput } from '../types/stats.types.js';

describe('Game Statistics Contract & Reducer', () => {
	describe('createEmptyGameStats & createEmptyDifficultyBucketStats', () => {
		it('creates an empty difficulty bucket with zeroes and nulls', () => {
			const bucket = createEmptyDifficultyBucketStats();
			expect(bucket).toEqual({
				gamesPlayed: 0,
				gamesWon: 0,
				gamesLost: 0,
				currentStreak: 0,
				bestStreak: 0,
				bestTimeSeconds: null,
				totalPlayTimeSeconds: 0,
				bestMoves: null,
				bestScore: null,
				flawlessWins: 0,
			});
		});

		it('creates empty game stats initialized to schemaVersion 1', () => {
			const empty = createEmptyGameStats('sudoku');
			expect(empty.schemaVersion).toBe(1);
			expect(empty.gameId).toBe('sudoku');
			expect(empty.overall.gamesPlayed).toBe(0);
			expect(empty.byBucket).toEqual({});
			expect(empty.lifetimeMetrics).toEqual({});
			expect(typeof empty.updatedAt).toBe('number');
		});
	});

	describe('updateStatsWithRound (Pure Reducer)', () => {
		it('initializes stats correctly on first-game win', () => {
			const initial = createEmptyGameStats('sudoku');
			const round: RoundStatsInput = {
				gameId: 'sudoku',
				won: true,
				bucketKey: 'easy',
				playTimeSeconds: 120,
				moves: 45,
				score: 1500,
				isFlawless: true,
				customMetrics: { undosUsed: 0, hintsUsed: 0 },
			};

			const updated = updateStatsWithRound(initial, round);

			// Overall checks
			expect(updated.overall.gamesPlayed).toBe(1);
			expect(updated.overall.gamesWon).toBe(1);
			expect(updated.overall.gamesLost).toBe(0);
			expect(updated.overall.currentStreak).toBe(1);
			expect(updated.overall.bestStreak).toBe(1);
			expect(updated.overall.bestTimeSeconds).toBe(120);
			expect(updated.overall.totalPlayTimeSeconds).toBe(120);
			expect(updated.overall.bestMoves).toBe(45);
			expect(updated.overall.bestScore).toBe(1500);
			expect(updated.overall.flawlessWins).toBe(1);

			// Bucket checks
			const easyBucket = updated.byBucket.easy;
			expect(easyBucket).toBeDefined();
			expect(easyBucket).toEqual(updated.overall);

			// Lifetime metrics
			expect(updated.lifetimeMetrics).toEqual({ undosUsed: 0, hintsUsed: 0 });
		});

		it('resets current streak on loss while preserving bestStreak and best records', () => {
			const initial = createEmptyGameStats('minesweeper');

			// Round 1: Win
			const win1 = updateStatsWithRound(initial, {
				gameId: 'minesweeper',
				won: true,
				bucketKey: 'medium',
				playTimeSeconds: 60,
				moves: 20,
				score: 500,
			});

			// Round 2: Win again (streak 2)
			const win2 = updateStatsWithRound(win1, {
				gameId: 'minesweeper',
				won: true,
				bucketKey: 'medium',
				playTimeSeconds: 50,
				moves: 18,
				score: 600,
			});

			expect(win2.overall.currentStreak).toBe(2);
			expect(win2.overall.bestStreak).toBe(2);
			expect(win2.overall.bestTimeSeconds).toBe(50);
			expect(win2.overall.bestMoves).toBe(18);
			expect(win2.overall.bestScore).toBe(600);

			// Round 3: Loss
			const loss = updateStatsWithRound(win2, {
				gameId: 'minesweeper',
				won: false,
				bucketKey: 'medium',
				playTimeSeconds: 30,
				moves: 10,
				score: 100,
			});

			expect(loss.overall.gamesPlayed).toBe(3);
			expect(loss.overall.gamesWon).toBe(2);
			expect(loss.overall.gamesLost).toBe(1);
			expect(loss.overall.currentStreak).toBe(0);
			expect(loss.overall.bestStreak).toBe(2);
			// Best records and total play time
			expect(loss.overall.bestTimeSeconds).toBe(50);
			expect(loss.overall.bestMoves).toBe(18);
			expect(loss.overall.bestScore).toBe(600);
			expect(loss.overall.totalPlayTimeSeconds).toBe(140); // 60 + 50 + 30

			// Bucket matches overall
			expect(loss.byBucket.medium?.currentStreak).toBe(0);
			expect(loss.byBucket.medium?.bestStreak).toBe(2);
		});

		it('handles multiple bucket updates without cross-bucket contamination', () => {
			let stats = createEmptyGameStats('tracks');

			// Round 1: Easy win
			stats = updateStatsWithRound(stats, {
				gameId: 'tracks',
				won: true,
				bucketKey: 'easy',
				playTimeSeconds: 40,
				moves: 10,
			});

			// Round 2: Hard loss
			stats = updateStatsWithRound(stats, {
				gameId: 'tracks',
				won: false,
				bucketKey: 'hard',
				playTimeSeconds: 100,
				moves: 35,
			});

			// Check easy bucket
			expect(stats.byBucket.easy?.gamesPlayed).toBe(1);
			expect(stats.byBucket.easy?.gamesWon).toBe(1);
			expect(stats.byBucket.easy?.gamesLost).toBe(0);
			expect(stats.byBucket.easy?.currentStreak).toBe(1);
			expect(stats.byBucket.easy?.bestTimeSeconds).toBe(40);
			expect(stats.byBucket.easy?.bestMoves).toBe(10);

			// Check hard bucket
			expect(stats.byBucket.hard?.gamesPlayed).toBe(1);
			expect(stats.byBucket.hard?.gamesWon).toBe(0);
			expect(stats.byBucket.hard?.gamesLost).toBe(1);
			expect(stats.byBucket.hard?.currentStreak).toBe(0);
			expect(stats.byBucket.hard?.bestTimeSeconds).toBeNull();
			expect(stats.byBucket.hard?.bestMoves).toBeNull();

			// Check overall bucket aggregates both
			expect(stats.overall.gamesPlayed).toBe(2);
			expect(stats.overall.gamesWon).toBe(1);
			expect(stats.overall.gamesLost).toBe(1);
			expect(stats.overall.currentStreak).toBe(0);
			expect(stats.overall.bestStreak).toBe(1);
			expect(stats.overall.totalPlayTimeSeconds).toBe(140);
		});

		it('handles edge cases (null moves/scores, empty initial storage, missing bucketKey)', () => {
			const initial = createEmptyGameStats('queens');

			// Win with null moves, null score, no bucketKey, not flawless
			const win = updateStatsWithRound(initial, {
				gameId: 'queens',
				won: true,
				playTimeSeconds: 85,
				moves: undefined,
				score: undefined,
				isFlawless: false,
			});

			expect(win.overall.gamesPlayed).toBe(1);
			expect(win.overall.bestMoves).toBeNull();
			expect(win.overall.bestScore).toBeNull();
			expect(win.overall.flawlessWins).toBe(0);
			expect(win.byBucket).toEqual({});

			// Subsequent win with defined moves and score
			const win2 = updateStatsWithRound(win, {
				gameId: 'queens',
				won: true,
				playTimeSeconds: 90,
				moves: 25,
				score: 300,
			});

			expect(win2.overall.bestMoves).toBe(25);
			expect(win2.overall.bestScore).toBe(300);

			// Next win with worse moves (30) and better score (400)
			const win3 = updateStatsWithRound(win2, {
				gameId: 'queens',
				won: true,
				playTimeSeconds: 60,
				moves: 30,
				score: 400,
			});

			expect(win3.overall.bestMoves).toBe(25); // Math.min(25, 30) = 25
			expect(win3.overall.bestScore).toBe(400); // Math.max(300, 400) = 400
			expect(win3.overall.bestTimeSeconds).toBe(60); // Math.min(85, 60) = 60
		});

		it('accumulates customMetrics cleanly into lifetimeMetrics', () => {
			let stats = createEmptyGameStats('anagram');

			stats = updateStatsWithRound(stats, {
				gameId: 'anagram',
				won: true,
				playTimeSeconds: 30,
				customMetrics: { wordsFound: 12, bonuses: 2 },
			});

			stats = updateStatsWithRound(stats, {
				gameId: 'anagram',
				won: true,
				playTimeSeconds: 40,
				customMetrics: { wordsFound: 15, bonuses: 1, hintsUsed: 3 },
			});

			expect(stats.lifetimeMetrics).toEqual({
				wordsFound: 27,
				bonuses: 3,
				hintsUsed: 3,
			});
		});

		it('does not mutate input previous stats object', () => {
			const initial = createEmptyGameStats('nonogram');
			const frozen = Object.freeze({
				...initial,
				overall: Object.freeze({ ...initial.overall }),
				byBucket: Object.freeze({ ...initial.byBucket }),
				lifetimeMetrics: Object.freeze({ ...initial.lifetimeMetrics }),
			});

			expect(() => {
				updateStatsWithRound(frozen as GameStats, {
					gameId: 'nonogram',
					won: true,
					bucketKey: '10x10',
					playTimeSeconds: 45,
				});
			}).not.toThrow();
		});
	});

	describe('Storage Persistence (getGameStats & recordGameStats)', () => {
		it('returns empty stats document on empty initial storage', async () => {
			const driver = new MemoryStorageDriver();
			const storage = createGameStorage('sudoku', { driver });

			const stats = await getGameStats('sudoku', storage);
			expect(stats.schemaVersion).toBe(1);
			expect(stats.gameId).toBe('sudoku');
			expect(stats.overall.gamesPlayed).toBe(0);
			expect(stats.byBucket).toEqual({});
		});

		it('records round results into storage and persists under arcade::[gameId]::stats', async () => {
			const driver = new MemoryStorageDriver();
			const storage = createGameStorage('tents', { driver });

			// Record round 1
			const result1 = await recordGameStats(
				{
					gameId: 'tents',
					won: true,
					bucketKey: '8x8',
					playTimeSeconds: 75,
					moves: 14,
					score: 850,
					isFlawless: true,
				},
				storage,
			);

			expect(result1.overall.gamesPlayed).toBe(1);
			expect(result1.overall.gamesWon).toBe(1);
			expect(result1.byBucket['8x8']?.bestTimeSeconds).toBe(75);

			// Verify direct raw driver key
			const rawStored = await driver.getItem('arcade::tents::stats');
			expect(rawStored).not.toBeNull();
			const parsed = JSON.parse(rawStored as string);
			expect(parsed.gameId).toBe('tents');
			expect(parsed.overall.gamesWon).toBe(1);

			// Read via getGameStats
			const readStats = await getGameStats('tents', storage);
			expect(readStats.overall.gamesPlayed).toBe(1);
			expect(readStats.byBucket['8x8']?.flawlessWins).toBe(1);

			// Record round 2 (loss)
			const result2 = await recordGameStats(
				{
					gameId: 'tents',
					won: false,
					bucketKey: '8x8',
					playTimeSeconds: 25,
				},
				storage,
			);

			expect(result2.overall.gamesPlayed).toBe(2);
			expect(result2.overall.gamesLost).toBe(1);
			expect(result2.overall.currentStreak).toBe(0);
			expect(result2.overall.bestStreak).toBe(1);

			// Fetch again to verify persistence
			const reloaded = await getGameStats('tents', storage);
			expect(reloaded.overall.gamesPlayed).toBe(2);
			expect(reloaded.overall.gamesLost).toBe(1);
		});

		it('recovers gracefully from corrupted or invalid schema data', async () => {
			const driver = new MemoryStorageDriver();
			const storage = createGameStorage('bridges', { driver });

			// Write invalid data
			await storage.set(GAME_STATS_STORAGE_KEY, { schemaVersion: 999, invalid: true });

			const stats = await getGameStats('bridges', storage);
			expect(stats.schemaVersion).toBe(1);
			expect(stats.overall.gamesPlayed).toBe(0);
		});
	});
});
