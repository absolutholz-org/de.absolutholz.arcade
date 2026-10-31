import type { Meta, StoryObj } from '@storybook/react';
import { ErrorScreen } from './_ErrorScreen';

const meta: Meta<typeof ErrorScreen> = {
	title: 'System Pages/Unexpected Error',
	component: ErrorScreen,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		title: 'Something went wrong',
		message: 'An unexpected error occurred while loading this screen.',
		homeHref: '/',
		homeLabel: 'Return Home',
		retryLabel: 'Try Again',
	},
};

export default meta;
type Story = StoryObj<typeof ErrorScreen>;

export const Default: Story = {};

export const WithRetryAction: Story = {
	args: {
		onRetry: () => alert('Retrying operation...'),
	},
};
