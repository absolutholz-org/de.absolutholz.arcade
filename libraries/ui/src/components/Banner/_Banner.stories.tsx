import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '.';
import { Button } from '../Button';
import { BANNER_VARIANTS } from './_Banner.constants';

const meta = {
	component: Banner,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The Banner component displays prominent informational status messages, warnings, confirmations, and alerts. It supports four semantic variants (success, info, warning, danger), container queries for responsive layout, and an optional action slot.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Cards & Surfaces/Banner',
	argTypes: {
		variant: {
			control: 'select',
			options: BANNER_VARIANTS,
			description: 'Visual status variant indicating semantic intent and color accent.',
		},
		statusLabel: {
			control: 'text',
			description: 'Explicit indicator label for the status type (e.g. SUCCESS, INFO, WARNING, DANGER).',
		},
		message: {
			control: 'text',
			description: 'Detailed informative message body rendered within the banner.',
		},
		action: {
			control: false,
			description: 'Optional trailing action control (e.g. button or link).',
		},
	},
	args: {
		variant: 'info',
		statusLabel: 'INFO',
		message: 'Waiting for others to vote...',
	},
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Neutral informational banner communicating non-blocking status updates.',
			},
		},
	},
	args: {
		variant: 'info',
		statusLabel: 'INFO',
		message: 'Waiting for others to vote...',
	},
};

export const Success: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Success banner indicating positive completion of an operation, shown with an action button.',
			},
		},
	},
	args: {
		variant: 'success',
		statusLabel: 'SUCCESS',
		message: 'Everyone is ready!',
		action: (
			<Button variant="secondary" size="sm">
				Reveal Now
			</Button>
		),
	},
};

export const Warning: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Warning banner indicating a potential problem or degraded connection status.',
			},
		},
	},
	args: {
		variant: 'warning',
		statusLabel: 'WARNING',
		message: 'Connection lost. Trying to reconnect...',
	},
};

export const Danger: Story = {
	parameters: {
		docs: {
			description: {
				story: 'High-urgency danger banner announcing an unrecoverable failure using ARIA alert role.',
			},
		},
	},
	args: {
		variant: 'danger',
		statusLabel: 'DANGER',
		message: 'Connection failed. Please try again later.',
	},
};
