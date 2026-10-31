import type { GameStats } from '@arcade/lib-storage';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameStatsDashboard } from './_GameStatsDashboard';

const SAMPLE_POPULATED_STATS: GameStats = {
	schemaVersion: 1,
	gameId: 'sudoku',
	updatedAt: Date.now(),
	overall: {
		gamesPlayed: 48,
		gamesWon: 36,
		gamesLost: 12,
		currentStreak: 4,
		bestStreak: 9,
		bestTimeSeconds: 114,
		totalPlayTimeSeconds: 14280,
		bestMoves: 34,
		bestScore: 2850,
		flawlessWins: 14,
	},
	byBucket: {
		easy: {
			gamesPlayed: 20,
			gamesWon: 19,
			gamesLost: 1,
			currentStreak: 12,
			bestStreak: 12,
			bestTimeSeconds: 114,
			totalPlayTimeSeconds: 4200,
			bestMoves: 34,
			bestScore: 2850,
			flawlessWins: 10,
		},
		medium: {
			gamesPlayed: 18,
			gamesWon: 12,
			gamesLost: 6,
			currentStreak: 2,
			bestStreak: 5,
			bestTimeSeconds: 245,
			totalPlayTimeSeconds: 5800,
			bestMoves: 46,
			bestScore: 2100,
			flawlessWins: 3,
		},
		hard: {
			gamesPlayed: 10,
			gamesWon: 5,
			gamesLost: 5,
			currentStreak: 0,
			bestStreak: 3,
			bestTimeSeconds: 480,
			totalPlayTimeSeconds: 4280,
			bestMoves: 68,
			bestScore: 1650,
			flawlessWins: 1,
		},
	},
	lifetimeMetrics: {
		hintsUsed: 8,
		undosUsed: 22,
	},
};

const SAMPLE_EMPTY_STATS: GameStats = {
	schemaVersion: 1,
	gameId: 'sudoku',
	updatedAt: Date.now(),
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

const meta: Meta<typeof GameStatsDashboard> = {
	title: 'Templates/Game Subpage Template/GameStatsDashboard',
	component: GameStatsDashboard,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
	},
};

export default meta;
type Story = StoryObj<typeof GameStatsDashboard>;

export const Default: Story = {
	args: {
		gameId: 'sudoku',
		lang: 'en',
		stats: SAMPLE_POPULATED_STATS,
		bucketLabels: {
			easy: 'Easy',
			medium: 'Medium',
			hard: 'Hard',
		},
	},
};

export const EmptyState: Story = {
	args: {
		gameId: 'sudoku',
		lang: 'en',
		stats: SAMPLE_EMPTY_STATS,
		playHref: '/en/game',
	},
};

export const GermanLocale: Story = {
	args: {
		gameId: 'sudoku',
		lang: 'de',
		stats: SAMPLE_POPULATED_STATS,
		bucketLabels: {
			easy: 'Leicht',
			medium: 'Mittel',
			hard: 'Schwer',
		},
	},
};

export const WithoutBuckets: Story = {
	args: {
		gameId: 'queens',
		lang: 'en',
		stats: {
			...SAMPLE_POPULATED_STATS,
			gameId: 'queens',
			byBucket: {},
		},
	},
};
