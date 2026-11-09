import type { Meta, StoryObj } from '@storybook/react';
import { EmojiAvatarPicker } from './_EmojiAvatarPicker';

const meta: Meta<typeof EmojiAvatarPicker> = {
	title: 'Components/EmojiAvatarPicker',
	component: EmojiAvatarPicker,
	parameters: {
		docs: {
			description: {
				component: 'Accessible popover picker allowing players to select or customize an emoji avatar badge.',
			},
		},
	},
	args: {
		value: { type: 'emoji', value: '👾' },
		onChange: () => {},
	},
};

export default meta;
type Story = StoryObj<typeof EmojiAvatarPicker>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard emoji avatar picker with default arcade space invader avatar.',
			},
		},
	},
};

export const GameControllerSelected: Story = {
	args: {
		value: { type: 'emoji', value: '🎮' },
	},
	parameters: {
		docs: {
			description: {
				story: 'Picker displaying an active video game controller avatar.',
			},
		},
	},
};

export const CustomEmojiSelected: Story = {
	args: {
		value: '🦄',
	},
	parameters: {
		docs: {
			description: {
				story: 'Picker displaying a custom unicorn emoji avatar outside the default grid.',
			},
		},
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Disabled avatar picker preventing user interaction.',
			},
		},
	},
};
