import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { WakeLockToggleButton } from './_WakeLockToggleButton';

const meta: Meta<typeof WakeLockToggleButton> = {
	title: 'Controls/WakeLockToggleButton',
	component: WakeLockToggleButton,
	args: {
		isSupported: true,
		enabled: true,
		isActive: true,
		size: 'sm',
		onToggle: fn(),
	},
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof WakeLockToggleButton>;

export const Active: Story = {
	args: {
		enabled: true,
		isActive: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Wake lock is enabled by the user and actively held by the browser.',
			},
		},
	},
};

export const Off: Story = {
	args: {
		enabled: false,
		isActive: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Wake lock is turned off by the user.',
			},
		},
	},
};

export const BlockedByOS: Story = {
	args: {
		enabled: true,
		isActive: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Wake lock is enabled by the user, but rejected or released by the OS (e.g., Low Power Mode).',
			},
		},
	},
};

export const MediumSize: Story = {
	args: {
		enabled: true,
		isActive: true,
		size: 'md',
	},
	parameters: {
		docs: {
			description: {
				story: 'Medium size variant of the wake lock toggle button.',
			},
		},
	},
};
