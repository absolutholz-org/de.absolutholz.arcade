import type { Meta, StoryObj } from '@storybook/react';
import { OfflineScreen } from './_OfflineScreen';

const meta: Meta<typeof OfflineScreen> = {
	title: 'System Pages/Offline',
	component: OfflineScreen,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		title: "You're Offline",
		message: "This content hasn't been cached for offline play yet. Check your connection to load it.",
		homeHref: '/',
		homeLabel: 'Play Cached Games',
		retryLabel: 'Retry Connection',
	},
};

export default meta;
type Story = StoryObj<typeof OfflineScreen>;

export const Default: Story = {};

export const WithRetryAction: Story = {
	args: {
		onRetry: () => alert('Checking connection...'),
	},
};
