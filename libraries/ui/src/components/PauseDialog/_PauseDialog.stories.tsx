import type { Meta, StoryObj } from '@storybook/react-vite';
import { PauseDialog } from './_PauseDialog';

const meta = {
	component: PauseDialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The PauseDialog component provides a standardized, accessible in-game pause dialog across all Arcade games, presenting localized copy and primary Resume and secondary Restart actions.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Overlays & Feedback/PauseDialog',
	argTypes: {
		isOpen: {
			control: 'boolean',
			description: 'Controls whether the pause dialog is visible',
		},
		onResume: {
			action: 'resume',
			description: 'Callback triggered when clicking Resume or closing',
		},
		onRestart: {
			action: 'restart',
			description: 'Callback triggered when clicking Restart',
		},
	},
} satisfies Meta<typeof PauseDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isOpen: true,
		onResume: () => {},
		onRestart: () => {},
	},
};
