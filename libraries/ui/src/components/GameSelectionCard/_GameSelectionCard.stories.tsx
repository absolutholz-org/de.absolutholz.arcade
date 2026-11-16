import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameSelectionCard } from '.';

const meta = {
	component: GameSelectionCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'GameSelectionCard is the standard direct-launch card for deterministic puzzle presets and difficulty levels.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Templates/Game Landing Template/GameSelectionCard',
	args: {
		title: 'Easy',
		children: 'Gentle starting board with plenty of initial clues',
	},
} satisfies Meta<typeof GameSelectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard level card with title and open content.',
			},
		},
	},
};

export const WithMetadata: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Level card displaying brief statistics in the metadata footer with a unified separator.',
			},
		},
	},
	args: {
		title: 'Easy',
		children: 'Gentle starting board with plenty of initial clues',
		metadata: ['2/6 Completed', 'Best: 01:24'],
	},
};

export const AsAnchorLink: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Card rendered polymorphically as an anchor element (`as="a"`).',
			},
		},
	},
	args: {
		as: 'a',
		href: '#puzzle-1',
		title: 'Temple of Bridges',
		children: <div style={{ fontSize: '2rem', paddingBlock: '0.5rem' }}>🌉</div>,
		metadata: ['Completed', 'Best: 00:48'],
	},
};
