import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { Dialog } from './_Dialog';

const meta = {
	component: Dialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Dialog component renders an accessible modal dialog leveraging the native HTML5 `<dialog>` element and `showModal()` API, with backdrop click light-dismiss, Escape key cancellation, top-layer entry animations (`@starting-style`), and full keyboard focus trapping.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Dialog',
	argTypes: {
		isOpen: {
			control: 'boolean',
			description: 'Controls whether the modal dialog is open and visible',
		},
		title: {
			control: 'text',
			description: 'Header title text or element displayed in the dialog header',
		},
		message: {
			control: 'text',
			description: 'Optional descriptive message rendered inside the dialog body',
		},
		cancelText: {
			control: 'text',
			description: 'Label text for the secondary cancel action button',
		},
		confirmText: {
			control: 'text',
			description: 'Label text for the primary confirmation action button',
		},
		showCloseButton: {
			control: 'boolean',
			description: 'Whether to display the header close button when onCancel is provided',
		},
		closeAriaLabel: {
			control: 'text',
			description: 'Accessible label for the header close button (defaults to localized close)',
		},
	},
	args: {
		cancelText: 'Cancel',
		confirmText: 'Confirm',
		isOpen: true,
		message: 'Are you sure you want to proceed with this action? This operation cannot be undone.',
		showCloseButton: true,
		title: 'Confirmation Required',
	},
	render: (args) => {
		const [isOpen, setIsOpen] = useState(args.isOpen);

		useEffect(() => {
			setIsOpen(args.isOpen);
		}, [args.isOpen]);

		return (
			<>
				<Button variant="primary" onClick={() => setIsOpen(true)}>
					Open Dialog
				</Button>
				<Dialog
					{...args}
					isOpen={isOpen}
					onCancel={() => {
						setIsOpen(false);
						args.onCancel?.();
					}}
					onConfirm={() => {
						setIsOpen(false);
						args.onConfirm?.();
					}}
				/>
			</>
		);
	},
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard modal dialog with title, message, close button, and confirmation buttons.',
			},
		},
	},
};

export const WithCustomContent: Story = {
	args: {
		children: (
			<Stack spacing="sm">
				<Text variant="base">Please review the updated service terms before continuing your session.</Text>
				<Text variant="small">By clicking confirm, you agree to the latest compliance guidelines.</Text>
			</Stack>
		),
		confirmText: 'Accept Terms',
		message: undefined,
		title: 'Terms of Service Update',
	},
	parameters: {
		docs: {
			description: {
				story: 'Dialog rendering rich custom children within the content slot instead of a plain text message.',
			},
		},
	},
};

export const ConfirmOnly: Story = {
	args: {
		cancelText: undefined,
		confirmText: 'Understood',
		message: 'Your system preferences have been synchronized successfully across all connected devices.',
		title: 'Settings Saved',
	},
	parameters: {
		docs: {
			description: {
				story: 'Dialog displaying an informational acknowledgement with only a primary confirm button.',
			},
		},
	},
};

export const WithoutCloseButton: Story = {
	args: {
		cancelText: 'Cancel',
		confirmText: 'Proceed',
		showCloseButton: false,
		title: 'Explicit Decision Required',
	},
	parameters: {
		docs: {
			description: {
				story: 'Dialog configured with showCloseButton={false}, requiring dismissal via footer actions or Escape.',
			},
		},
	},
};

export const InsideTheme: Story = {
	decorators: [
		(Story) => (
			<Theme name="secondary">
				<div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)' }}>
					<Story />
				</div>
			</Theme>
		),
	],
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates the dialog inheriting color tokens within a themed container wrapper.',
			},
		},
	},
};
