import type { Meta, StoryObj } from '@storybook/react';
import { FavoriteButton } from './_FavoriteButton';

const meta = {
	title: 'Components/FavoriteButton',
	component: FavoriteButton,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The FavoriteButton component toggles game favorite status, adhering to WCAG 2.2 AA 44x44px target bounds and dark/light color schemes.',
			},
		},
	},
	tags: ['autodocs'],
	args: {
		gameId: 'sudoku',
		gameTitle: 'Sudoku',
		size: 'md',
	},
} satisfies Meta<typeof FavoriteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		gameId: 'sudoku',
		gameTitle: 'Sudoku',
		size: 'md',
	},
};

export const Small: Story = {
	args: {
		gameId: 'minesweeper',
		gameTitle: 'Minesweeper',
		size: 'sm',
	},
};
