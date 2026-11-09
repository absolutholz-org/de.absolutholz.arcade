import type { Meta, StoryObj } from '@storybook/react';
import { EmojiAvatar } from './_EmojiAvatar';

const meta: Meta<typeof EmojiAvatar> = {
	title: 'Components/EmojiAvatar',
	component: EmojiAvatar,
	parameters: {
		docs: {
			description: {
				component: 'Displays an accessible player emoji avatar badge.',
			},
		},
	},
	args: {
		value: '👾',
		size: 'md',
	},
};

export default meta;
type Story = StoryObj<typeof EmojiAvatar>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard medium emoji avatar display.',
			},
		},
	},
};

export const Small: Story = {
	args: {
		size: 'sm',
		value: '🎮',
	},
	parameters: {
		docs: {
			description: {
				story: 'Small size variant for compact lists and headers.',
			},
		},
	},
};

export const Large: Story = {
	args: {
		size: 'lg',
		value: '🚀',
	},
	parameters: {
		docs: {
			description: {
				story: 'Large size variant for profile dialogues and hero cards.',
			},
		},
	},
};

export const ExtraLarge: Story = {
	args: {
		size: 'xl',
		value: '👑',
	},
	parameters: {
		docs: {
			description: {
				story: 'Extra large size variant for account settings.',
			},
		},
	},
};
