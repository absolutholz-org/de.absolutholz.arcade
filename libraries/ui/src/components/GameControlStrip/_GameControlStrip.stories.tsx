import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameControls } from './_GameControlStrip';
import { GAME_CONTROL_STRIP_ALIGNS } from './_GameControlStrip.constants';

const meta: Meta<typeof GameControls> = {
	title: 'Components/GameControls',
	component: GameControls,
	argTypes: {
		align: {
			control: 'select',
			options: GAME_CONTROL_STRIP_ALIGNS,
		},
		canUndo: {
			control: 'boolean',
		},
		canRedo: {
			control: 'boolean',
		},
		canRestart: {
			control: 'boolean',
		},
		canNewGame: {
			control: 'boolean',
		},
		hasActiveProgress: {
			control: 'boolean',
		},
		isComplete: {
			control: 'boolean',
		},
	},
};

export default meta;
type Story = StoryObj<typeof GameControls>;

export const Default: Story = {
	args: {
		onUndo: () => {},
		canUndo: true,
		onRedo: () => {},
		canRedo: false,
		onRestart: () => {},
		canRestart: true,
		onNewGame: () => {},
		canNewGame: true,
		hasActiveProgress: true,
		isComplete: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Centered game control toolbar with Undo and Redo separated by a vertical hairline divider from Restart and New Game. Opens a confirmation Dialog when Restart or New Game is clicked with active progress.',
			},
		},
	},
};

export const InitialBoardState: Story = {
	args: {
		onUndo: () => {},
		canUndo: false,
		onRedo: () => {},
		canRedo: false,
		onRestart: () => {},
		canRestart: false,
		onNewGame: () => {},
		canNewGame: true,
		hasActiveProgress: false,
		isComplete: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Control strip state at move 0 where Undo, Redo, and Restart are disabled, and New Game executes immediately without prompting.',
			},
		},
	},
};

export const SessionLifecycleOnly: Story = {
	args: {
		onRestart: () => {},
		canRestart: true,
		onNewGame: () => {},
		canNewGame: true,
		hasActiveProgress: true,
		isComplete: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Minimal lifecycle-only configuration (e.g., Dice Bingo) omitting Undo/Redo and the separator.',
			},
		},
	},
};
