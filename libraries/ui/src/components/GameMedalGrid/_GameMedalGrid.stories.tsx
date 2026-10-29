import type { MedalDefinition } from '@arcade/lib-medals';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameMedalGrid } from './_GameMedalGrid';

const SUDOKU_STORY_DEFINITIONS: readonly MedalDefinition<'sudoku'>[] = [
	{
		id: 'sudoku_first_victory',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.first_victory.title',
		descriptionKey: 'medals.sudoku.first_victory.desc',
		icon: 'trophy-bronze',
		target: 1,
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(updatedBaseStats.gamesWon, 1),
			target: 1,
		}),
	},
	{
		id: 'sudoku_streak',
		type: 'ladder',
		tier: 'gold',
		titleKey: 'medals.sudoku.streak.title',
		descriptionKey: 'medals.sudoku.streak.desc',
		icon: 'trophy-gold',
		thresholds: { bronze: 3, silver: 5, gold: 10 },
		evaluate: ({ updatedBaseStats }) => ({
			currentProgress: updatedBaseStats.bestStreak,
			currentTier: updatedBaseStats.bestStreak >= 3 ? 'bronze' : null,
			nextThreshold: 3,
			bronzeUnlocked: updatedBaseStats.bestStreak >= 3,
			silverUnlocked: updatedBaseStats.bestStreak >= 5,
			goldUnlocked: updatedBaseStats.bestStreak >= 10,
		}),
	},
	{
		id: 'sudoku_are_you_sure',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.are_you_sure.title',
		descriptionKey: 'medals.sudoku.are_you_sure.desc',
		icon: 'trophy-bronze',
		target: 10,
		evaluate: () => ({
			unlocked: false,
			progress: 0,
			target: 10,
		}),
	},
];

const ANAGRAM_STORY_DEFINITIONS: readonly MedalDefinition<'anagram'>[] = [
	{
		id: 'anagram_first_word',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.anagram.first_word.title',
		descriptionKey: 'medals.anagram.first_word.desc',
		icon: 'trophy-bronze',
		target: 1,
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(updatedBaseStats.gamesWon, 1),
			target: 1,
		}),
	},
];

const meta = {
	title: 'Components/Cards & Surfaces/GameMedalGrid',
	component: GameMedalGrid,
	parameters: {
		layout: 'padded',
	},
	argTypes: {
		gameId: {
			control: 'select',
			options: [
				'sudoku',
				'nonogram',
				'minesweeper',
				'queens',
				'tracks',
				'watersort',
				'bridges',
				'anagram',
				'tents',
			],
		},
		lang: {
			control: 'select',
			options: ['en', 'de', 'fr', 'pt'],
		},
	},
} satisfies Meta<typeof GameMedalGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SudokuShowcase: Story = {
	args: {
		gameId: 'sudoku',
		definitions: SUDOKU_STORY_DEFINITIONS,
		lang: 'en',
	},
	parameters: {
		docs: {
			description: {
				story: 'Renders the complete Sudoku medal showcase including standalone feats and progressive 3-tier ladders.',
			},
		},
	},
};

export const AnagramShowcaseGerman: Story = {
	args: {
		gameId: 'anagram',
		definitions: ANAGRAM_STORY_DEFINITIONS,
		lang: 'de',
	},
	parameters: {
		docs: {
			description: {
				story: 'Renders the Anagram Scramble medal showcase localized in German.',
			},
		},
	},
};
