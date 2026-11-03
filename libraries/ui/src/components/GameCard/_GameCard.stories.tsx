import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameCard } from '.';

const meta = {
	component: GameCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'GameCard represents an interactive game or tool in the catalog, taxonomy, or hub listings.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/GameCard',
	args: {
		title: 'Sudoku',
		description: 'Classic 9×9 number placement puzzle with logical deduction.',
		icon: '🔢',
		href: '/sudoku/en/',
	},
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard game card with title, icon, and description as a link.',
			},
		},
	},
};

export const WithBadge: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Game card with a category taxonomy badge in the footer.',
			},
		},
	},
	args: {
		badge: 'Logic & Numbers',
	},
};

export const AsButton: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Game card rendered polymorphically as a button element.',
			},
		},
	},
	args: {
		as: 'button',
		href: undefined,
	},
};
