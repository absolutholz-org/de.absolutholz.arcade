import type { Meta, StoryObj } from '@storybook/react';
import { GameActionBar } from './_GameActionBar';

const meta = {
	title: 'Components/GameActionBar',
	component: GameActionBar,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The GameActionBar standardizes the primary action cluster (Save Offline, Favorite, and Share Game) across arcade game views inside an accessible horizontal Stack.',
			},
		},
	},
	tags: ['autodocs'],
	args: {
		gameTitle: 'Sudoku',
		isFavorited: false,
		isSavedOffline: false,
		size: 'sm',
		justify: 'start',
	},
} satisfies Meta<typeof GameActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		gameTitle: 'Sudoku',
		isFavorited: false,
		isSavedOffline: false,
	},
};

export const FavoritedAndCached: Story = {
	args: {
		gameTitle: 'Sudoku',
		isFavorited: true,
		isSavedOffline: true,
	},
};

export const Medium: Story = {
	args: {
		gameTitle: 'Minesweeper',
		isFavorited: true,
		isSavedOffline: false,
		size: 'md',
	},
};
