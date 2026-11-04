import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameStatusStrip } from './_GameStatusStrip';
import { GAME_STATUS_STATES } from './_GameStatusStrip.constants';

const meta: Meta<typeof GameStatusStrip> = {
	title: 'Components/GameStatusStrip',
	component: GameStatusStrip,
	argTypes: {
		statusState: {
			control: 'select',
			options: GAME_STATUS_STATES,
		},
		elapsedSeconds: {
			control: 'number',
		},
		isPaused: {
			control: 'boolean',
		},
		hideTimer: {
			control: 'boolean',
		},
	},
};

export default meta;
type Story = StoryObj<typeof GameStatusStrip>;

export const Default: Story = {
	args: {
		statusText: '18 / 18 moves remaining • 5% flooded',
		statusState: 'default',
		elapsedSeconds: 42,
		isPaused: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Standard in-progress status strip displaying move metrics alongside an active inline timer.',
			},
		},
	},
};

export const WarningState: Story = {
	args: {
		statusText: '12 crossings remaining',
		statusState: 'warning',
		elapsedSeconds: 9,
		isPaused: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Status strip highlighting unresolved hazards or crossings using semantic warning/danger tokens.',
			},
		},
	},
};

export const SolvedState: Story = {
	args: {
		statusText: 'Board Flooded! • 14 / 18 moves',
		statusState: 'solved',
		elapsedSeconds: 65,
		isPaused: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Status strip when the puzzle is solved, highlighting completion in green.',
			},
		},
	},
};
