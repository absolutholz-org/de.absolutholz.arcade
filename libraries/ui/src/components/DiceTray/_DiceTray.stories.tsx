import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiceTray } from '.';

const meta = {
	title: 'Components/DiceTray',
	component: DiceTray,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'DiceTray is a responsive, accessible tabletop tray component managing 1 to 6 interactive 3D dice. It provides quick dice-count adjustments, rolling state coordination, native Web Audio sound synthesis, real-time sum aggregation, and WCAG AA live announcements.',
			},
		},
	},
	tags: ['autodocs'],
	args: {
		defaultCount: 5,
		ariaLabel: 'Tabletop Dice Tray',
	},
	argTypes: {
		onRollComplete: { action: 'onRollComplete' },
		onCountChange: { action: 'onCountChange' },
	},
} satisfies Meta<typeof DiceTray>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveDiceYahtzee: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard 5-dice tabletop tray configured for Yahtzee and poker dice games. Click dice to lock/hold them, click "Roll Dice" to reroll only unheld dice with Web Audio click synthesis, and view the updated sum total and live announcements.',
			},
		},
	},
	args: {
		defaultCount: 5,
	},
};

export const TwoDiceStandard: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Classic 2-dice configuration for traditional board games (e.g. Backgammon, Craps, Monopoly). Demonstrates instant score aggregation and pair tracking.',
			},
		},
	},
	args: {
		defaultCount: 2,
	},
};

export const SixDiceMax: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Maximum 6-dice tray configuration. Demonstrates the responsive flex-wrapping layout that keeps all 6 dice neatly arranged across mobile and desktop viewports without horizontal scrolling.',
			},
		},
	},
	args: {
		defaultCount: 6,
	},
};

export const SingleDie: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Single-die configuration for simple chance rolls, initiative checks, or coin-flip style binary decisions.',
			},
		},
	},
	args: {
		defaultCount: 1,
	},
};
