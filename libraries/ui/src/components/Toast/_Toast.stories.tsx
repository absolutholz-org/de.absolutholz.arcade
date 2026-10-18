import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastContainer } from '.';
import { Button } from '../Button';
import { TOAST_POSITIONS, TOAST_VARIANTS } from './_Toast.constants';
import { toast } from './_Toast.functions';
import type { ToastItemData } from './_Toast.types';

const meta = {
	component: ToastContainer,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'ToastContainer acts as the universal, accessible notification host. It renders a persistent polite ARIA live region (`role="status"`, `aria-live="polite"`) that never interrupts user interaction or steals keyboard focus, automatically pauses timers upon hover and focus, and smoothly stacks or queues multiple notifications.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Toast',
	argTypes: {
		position: {
			control: 'select',
			options: TOAST_POSITIONS,
			description: 'Screen anchor position for the notification stack.',
		},
		maxVisibleToasts: {
			control: 'number',
			description: 'Maximum visible toasts displayed before queueing.',
		},
	},
	args: {
		position: 'top-right',
		maxVisibleToasts: 3,
	},
} satisfies Meta<typeof ToastContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleInfo: ToastItemData[] = [
	{
		id: 'sample-info',
		variant: 'info',
		title: 'Game Saved',
		message: 'Your progress has been safely stored locally on this device.',
		createdAt: Date.now(),
		duration: 0,
	},
];

const sampleSuccess: ToastItemData[] = [
	{
		id: 'sample-success',
		variant: 'success',
		title: 'Sync Complete',
		message: 'Your statistics were synchronized with your cloud profile.',
		createdAt: Date.now(),
		duration: 0,
	},
];

const sampleWarning: ToastItemData[] = [
	{
		id: 'sample-warning',
		variant: 'warning',
		title: 'Offline Mode Active',
		message: 'Network connection lost. Changes are being cached locally.',
		createdAt: Date.now(),
		duration: 0,
	},
];

const sampleAchievement: ToastItemData[] = [
	{
		id: 'sample-achievement',
		variant: 'achievement',
		title: 'Achievement Unlocked!',
		message: 'Speed Demon: Solved the daily puzzle in under 3 minutes.',
		createdAt: Date.now(),
		duration: 0,
	},
];

const sampleQueue: ToastItemData[] = [
	{
		id: 'queue-1',
		variant: 'achievement',
		title: 'Clean Sweep',
		message: 'Cleared a level without using hints.',
		createdAt: Date.now(),
		duration: 0,
	},
	{
		id: 'queue-2',
		variant: 'success',
		title: 'High Score!',
		message: 'New personal best recorded: 14,200 points.',
		createdAt: Date.now(),
		duration: 0,
	},
	{
		id: 'queue-3',
		variant: 'info',
		title: 'Daily Challenge Ready',
		message: 'A new daily challenge is available for Sudoku.',
		createdAt: Date.now(),
		duration: 0,
	},
];

export const Info: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Informational status notification for non-blocking asynchronous updates.',
			},
		},
	},
	args: {
		toasts: sampleInfo,
	},
};

export const Success: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Confirmation notification confirming successful completion of an action.',
			},
		},
	},
	args: {
		toasts: sampleSuccess,
	},
};

export const Warning: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Warning toast highlighting non-fatal system conditions or degraded states.',
			},
		},
	},
	args: {
		toasts: sampleWarning,
	},
};

export const Achievement: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Celebratory achievement toast with radiant golden accent and trophy icon.',
			},
		},
	},
	args: {
		toasts: sampleAchievement,
	},
};

export const MultipleStacked: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Multiple notifications demonstrating vertical non-overlapping layout and gap spacing.',
			},
		},
	},
	args: {
		toasts: sampleQueue,
	},
};

export const InteractiveTriggers: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Interactive buttons demonstrating programmatic calls to the universal toast controller.',
			},
		},
	},
	render: (args) => (
		<div style={{ padding: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
			<ToastContainer {...args} />
			<Button
				variant="secondary"
				size="sm"
				onClick={() =>
					toast.info('Game preferences saved.', {
						title: 'Settings',
					})
				}
			>
				Trigger Info
			</Button>
			<Button
				variant="secondary"
				size="sm"
				onClick={() =>
					toast.success('Scores synchronized across devices.', {
						title: 'Cloud Sync',
					})
				}
			>
				Trigger Success
			</Button>
			<Button
				variant="secondary"
				size="sm"
				onClick={() =>
					toast.warning('Offline storage is approaching device quota.', {
						title: 'Storage Warning',
					})
				}
			>
				Trigger Warning
			</Button>
			<Button
				variant="primary"
				size="sm"
				onClick={() =>
					toast.achievement('Grandmaster: Completed Hard grid in under 5 minutes!', {
						title: 'Medal Unlocked',
					})
				}
			>
				Trigger Achievement
			</Button>
		</div>
	),
};
