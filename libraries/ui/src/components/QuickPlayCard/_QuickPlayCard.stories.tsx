import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuickPlayCard } from '.';

const meta = {
	component: QuickPlayCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'QuickPlayCard is a specialized direct-launch card representing on-the-fly random puzzle generation.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/QuickPlayCard',
	args: {
		title: 'Quick Play',
		subtitle: 'Random procedural board',
		icon: <span>🎲</span>,
	},
} satisfies Meta<typeof QuickPlayCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default quick play card with dice icon and random procedural board subline.',
			},
		},
	},
};

export const InfinitePractice: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Customized title and spark icon for infinite practice mode.',
			},
		},
	},
	args: {
		title: 'Infinite Practice',
		subtitle: 'Non-stop generated puzzles',
		icon: <span>⚡</span>,
	},
};
