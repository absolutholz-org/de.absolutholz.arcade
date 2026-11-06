import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShareDialog } from './_ShareDialog';

const meta = {
	component: ShareDialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The ShareDialog component provides a reusable modal dialog across the arcade that supports desktop QR code generation and mobile Web Share API.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Overlays/ShareDialog',
	argTypes: {
		id: {
			control: 'text',
			description: 'Unique HTML id attribute',
		},
		isOpen: {
			control: 'boolean',
			description: 'Controls whether the share dialog is visible',
		},
		onClose: {
			action: 'close',
			description: 'Callback invoked when dismissed',
		},
		title: {
			control: 'text',
			description: 'Dialog header title',
		},
		shareUrl: {
			control: 'text',
			description: 'URL to encode in QR code and share',
		},
		shareText: {
			control: 'text',
			description: 'Descriptive text for Web Share API',
		},
		copySuccessMessage: {
			control: 'text',
			description: 'Custom toast/status message on successful copy',
		},
	},
} satisfies Meta<typeof ShareDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: 'share-arcade-dialog',
		isOpen: true,
		onClose: () => {},
		title: 'Share Arcade',
		shareUrl: 'https://arcade.absolutholz.de/en/',
		shareText: 'Play classic puzzle games directly in your browser!',
	},
	parameters: {
		docs: {
			description: {
				story: 'Default share dialog presentation for the root Arcade Hub.',
			},
		},
	},
};

export const GameShare: Story = {
	args: {
		id: 'share-game-dialog',
		isOpen: true,
		onClose: () => {},
		title: 'Share Color Flood',
		shareUrl: 'https://arcade.absolutholz.de/en/games/color-flood',
		shareText: 'Play Color Flood puzzle game on Arcade!',
		copySuccessMessage: 'Game link copied to clipboard!',
	},
	parameters: {
		docs: {
			description: {
				story: 'Contextual game share dialog presentation with customized feedback message.',
			},
		},
	},
};
