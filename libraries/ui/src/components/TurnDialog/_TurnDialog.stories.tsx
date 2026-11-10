import type { Meta, StoryObj } from '@storybook/react-vite';
import { TurnDialog } from './_TurnDialog';

const meta = {
	component: TurnDialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The TurnDialog component provides an accessible turn handoff modal for turn-based games. In local pass-and-play, it presents an OK/Ready action. In online multiplayer, it displays a waiting state without an action button.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Layouts/Game Layout/TurnDialog',
	argTypes: {
		isOpen: {
			control: 'boolean',
			description: 'Controls whether the turn dialog is visible',
		},
		playerName: {
			control: 'text',
			description: 'Name of the active player',
		},
		playerMark: {
			control: 'text',
			description: 'Mark or symbol of the active player',
		},
		isWaiting: {
			control: 'boolean',
			description: 'Whether waiting for remote player in online multiplayer',
		},
		onConfirm: {
			action: 'confirm',
			description: 'Callback when player acknowledges the turn dialog',
		},
	},
} satisfies Meta<typeof TurnDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PassAndPlay: Story = {
	args: {
		isOpen: true,
		playerName: 'Player 2',
		playerMark: 'O',
		isWaiting: false,
		onConfirm: () => {},
	},
};

export const WaitingForOpponent: Story = {
	args: {
		isOpen: true,
		playerName: 'Player 2',
		playerMark: 'O',
		isWaiting: true,
	},
};
