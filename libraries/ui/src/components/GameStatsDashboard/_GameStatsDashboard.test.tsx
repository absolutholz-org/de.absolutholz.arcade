import * as libStorage from '@arcade/lib-storage';
import type { GameStats } from '@arcade/lib-storage';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { GameStatsDashboard } from './_GameStatsDashboard';

const MOCK_POPULATED_STATS: GameStats = {
	schemaVersion: 1,
	gameId: 'sudoku',
	updatedAt: 1700000000000,
	overall: {
		gamesPlayed: 20,
		gamesWon: 15,
		gamesLost: 5,
		currentStreak: 3,
		bestStreak: 8,
		bestTimeSeconds: 125,
		totalPlayTimeSeconds: 3600,
		bestMoves: 42,
		bestScore: 2100,
		flawlessWins: 4,
	},
	byBucket: {
		easy: {
			gamesPlayed: 10,
			gamesWon: 10,
			gamesLost: 0,
			currentStreak: 10,
			bestStreak: 10,
			bestTimeSeconds: 125,
			totalPlayTimeSeconds: 1500,
			bestMoves: 42,
			bestScore: 2100,
			flawlessWins: 3,
		},
		hard: {
			gamesPlayed: 10,
			gamesWon: 5,
			gamesLost: 5,
			currentStreak: 0,
			bestStreak: 2,
			bestTimeSeconds: 310,
			totalPlayTimeSeconds: 2100,
			bestMoves: 60,
			bestScore: 1400,
			flawlessWins: 1,
		},
	},
	lifetimeMetrics: {},
};

const MOCK_EMPTY_STATS: GameStats = {
	schemaVersion: 1,
	gameId: 'sudoku',
	updatedAt: 1700000000000,
	overall: {
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
	},
	byBucket: {},
	lifetimeMetrics: {},
};

describe('GameStatsDashboard', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders empty state when no games have been played', () => {
		const { container } = render(
			<GameStatsDashboard gameId="sudoku" lang="en" stats={MOCK_EMPTY_STATS} playHref="/en/game" />,
		);

		const region = container.querySelector('section[aria-label]');
		expect(region).not.toBeNull();
		expect(container.textContent).toContain('No Games Recorded Yet');
		const playButton = container.querySelector('a');
		expect(playButton).not.toBeNull();
		expect(playButton?.getAttribute('href')).toBe('/en/game');
		expect(playButton?.textContent).toContain('Play Now');
	});

	it('renders summary metric cards with correct values and win rate', () => {
		const { container } = render(<GameStatsDashboard gameId="sudoku" lang="en" stats={MOCK_POPULATED_STATS} />);

		// Games played
		expect(container.textContent).toContain('20');
		expect(container.textContent).toContain('Played');

		// Win rate: 15/20 = 75%
		expect(container.textContent).toContain('75%');
		expect(container.textContent).toContain('Win Rate');

		// Current & Best Streak
		expect(container.textContent).toContain('3');
		expect(container.textContent).toContain('Current Streak');
		expect(container.textContent).toContain('8');
		expect(container.textContent).toContain('Best Streak');

		// Fastest time: 125s = 02:05
		expect(container.textContent).toContain('02:05');
	});

	it('switches between overall and bucket metrics when clicking tabs', async () => {
		const { container } = render(
			<GameStatsDashboard
				gameId="sudoku"
				lang="en"
				stats={MOCK_POPULATED_STATS}
				bucketLabels={{ easy: 'Easy', hard: 'Hard' }}
			/>,
		);

		// Initially shows overall (20 played, 75% win rate)
		expect(container.textContent).toContain('20');
		expect(container.textContent).toContain('75%');

		// Switch to Easy bucket (10 played, 100% win rate)
		const easyTab = Array.from(container.querySelectorAll('button[role="radio"]')).find((btn) =>
			btn.textContent?.includes('Easy'),
		);
		expect(easyTab).toBeDefined();

		await act(async () => {
			(easyTab as HTMLButtonElement).click();
		});

		expect(container.textContent).toContain('10');
		expect(container.textContent).toContain('100%');

		// Switch to Hard bucket (10 played, 50% win rate, 05:10 best time)
		const hardTab = Array.from(container.querySelectorAll('button[role="radio"]')).find((btn) =>
			btn.textContent?.includes('Hard'),
		);
		expect(hardTab).toBeDefined();

		await act(async () => {
			(hardTab as HTMLButtonElement).click();
		});

		expect(container.textContent).toContain('50%');
		expect(container.textContent).toContain('05:10');
	});

	it('hydrates stats asynchronously from storage when not pre-supplied', async () => {
		vi.spyOn(libStorage, 'getGameStats').mockResolvedValue(MOCK_POPULATED_STATS);

		let result: ReturnType<typeof render>;
		await act(async () => {
			result = render(<GameStatsDashboard gameId="sudoku" lang="en" />);
			await Promise.resolve();
		});

		expect(libStorage.getGameStats).toHaveBeenCalledWith('sudoku');
		expect(result?.container.textContent).toContain('20');
		expect(result?.container.textContent).toContain('75%');
	});

	it('resolves and formats compound bucket keys like easy:zen cleanly', () => {
		const compoundStats: GameStats = {
			...MOCK_POPULATED_STATS,
			gameId: 'anagram',
			byBucket: {
				'easy:zen': {
					...MOCK_POPULATED_STATS.byBucket.easy,
				},
				'hard:timed': {
					...MOCK_POPULATED_STATS.byBucket.hard,
				},
			},
		};

		const { container } = render(<GameStatsDashboard gameId="anagram" lang="en" stats={compoundStats} />);

		// Should resolve through direct translation or compound fallback: "Easy (Zen)"
		expect(container.textContent).toContain('Easy (Zen)');
		expect(container.textContent).toContain('Hard (Timed Arcade)');
	});

	it('supports localized rendering in German', () => {
		const { container } = render(<GameStatsDashboard gameId="sudoku" lang="de" stats={MOCK_POPULATED_STATS} />);

		expect(container.textContent).toContain('Statistiken');
		expect(container.textContent).toContain('Gewinnrate');
		expect(container.textContent).toContain('Gespielt');
		expect(container.textContent).toContain('Beste Serie');
	});
});
