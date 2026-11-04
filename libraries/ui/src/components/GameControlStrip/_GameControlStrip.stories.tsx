import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameControlStrip } from './_GameControlStrip';
import { GAME_CONTROL_STRIP_ALIGNS } from './_GameControlStrip.constants';

const meta: Meta<typeof GameControlStrip> = {
	title: 'Components/GameControlStrip',
	component: GameControlStrip,
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
		canReset: {
			control: 'boolean',
		},
		canNewPuzzle: {
			control: 'boolean',
		},
	},
};

export default meta;
type Story = StoryObj<typeof GameControlStrip>;

export const Default: Story = {
	args: {
		onUndo: () => {},
		canUndo: true,
		undoLabel: 'Undo',
		onRedo: () => {},
		canRedo: false,
		redoLabel: 'Redo',
		onReset: () => {},
		canReset: true,
		resetLabel: 'Restart',
		onNewPuzzle: () => {},
		canNewPuzzle: true,
		newPuzzleLabel: 'New Game',
		'aria-label': 'Game controls',
	},
	parameters: {
		docs: {
			description: {
				story: 'Standard bottom control bar with Undo, Redo, Restart, and New Game actions.',
			},
		},
	},
};

export const InitialBoardState: Story = {
	args: {
		onUndo: () => {},
		canUndo: false,
		undoLabel: 'Undo',
		onRedo: () => {},
		canRedo: false,
		redoLabel: 'Redo',
		onReset: () => {},
		canReset: false,
		resetLabel: 'Restart',
		onNewPuzzle: () => {},
		canNewPuzzle: true,
		newPuzzleLabel: 'New Game',
		'aria-label': 'Game controls',
	},
	parameters: {
		docs: {
			description: {
				story: 'Control strip state at move 0 where Undo, Redo, and Restart are disabled.',
			},
		},
	},
};
