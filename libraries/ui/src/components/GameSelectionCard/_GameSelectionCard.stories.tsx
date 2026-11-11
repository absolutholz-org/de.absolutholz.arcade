import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameSelectionCard } from '.';

const meta = {
	component: GameSelectionCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'GameSelectionCard is the standard direct-launch card for deterministic puzzle presets and campaign levels.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Templates/Game Landing Template/GameSelectionCard',
	args: {
		title: 'Puzzle 1',
		subtitle: 'Standard Level',
	},
} satisfies Meta<typeof GameSelectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard preset level without badge or preview.',
			},
		},
	},
};

export const CompletedLevel: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Completed puzzle showing a success status badge.',
			},
		},
	},
	args: {
		title: 'Heart Pattern',
		subtitle: '15% mines',
		badge: {
			label: 'Completed',
			variant: 'success',
		},
	},
};

export const WithPreviewSlot: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Card displaying a visual preview slot for level thumbnail or piece artwork.',
			},
		},
	},
	args: {
		title: 'Temple of Bridges',
		subtitle: '2 Islands',
		badge: {
			label: 'Best: 00:48',
			variant: 'neutral',
		},
		preview: <span style={{ fontSize: '2rem' }}>🌉</span>,
	},
};
