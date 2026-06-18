import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from '.';
import { Theme } from '../Theme';

const meta = {
	component: Dialog,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Dialog',
	argTypes: {
		isOpen: {
			control: 'boolean',
			description: 'Visibility state of the dialog overlay',
		},
		title: {
			control: 'text',
			description: 'Header text displayed at the top of the dialog',
		},
		message: {
			control: 'text',
			description: 'Brief message text to render in the dialog content',
		},
		cancelText: {
			control: 'text',
			description: 'Text label for the cancel/secondary button',
		},
		confirmText: {
			control: 'text',
			description: 'Text label for the confirm/primary button',
		},
	},
	args: {
		isOpen: false,
		title: 'Confirm Deletion',
		message: 'Are you sure you want to permanently delete this item?',
		cancelText: 'Cancel',
		confirmText: 'Delete',
	},
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// A stateful wrapper to manage dialog visibility and show a trigger button
function DialogStoryWrapper({
	triggerText = 'Open Dialog',
	...props
}: React.ComponentProps<typeof Dialog> & { triggerText?: string }) {
	const [isOpen, setIsOpen] = useState(props.isOpen);

	// Sync state when Storybook controls update
	useEffect(() => {
		setIsOpen(props.isOpen);
	}, [props.isOpen]);

	return (
		<div>
			<button
				onClick={() => setIsOpen(true)}
				style={{
					padding: '12px 24px',
					backgroundColor: 'var(--color-accent)',
					color: 'var(--color-accent-contrast)',
					border: 'none',
					cursor: 'pointer',
					fontWeight: 600,
				}}
			>
				{triggerText}
			</button>

			<Dialog
				{...props}
				isOpen={isOpen}
				onCancel={() => setIsOpen(false)}
				onConfirm={() => {
					props.onConfirm?.();
					setIsOpen(false);
				}}
			/>
		</div>
	);
}

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The default Dialog displays a header title, descriptive body text, and a confirmation action footer. Click the trigger button to open.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<DialogStoryWrapper {...args} triggerText="Open Confirm Dialog" />
		</Theme>
	),
};

export const CustomContent: Story = {
	args: {
		title: 'Newsletter Subscription',
		message: 'Stay updated with our latest wooden furniture designs.',
		cancelText: 'Not Now',
		confirmText: 'Subscribe',
	},
	parameters: {
		docs: {
			description: {
				story:
					'A Dialog can render custom child components (such as input forms or stacks) directly inside its main body. Click the trigger button to open.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<DialogStoryWrapper {...args} triggerText="Open Subscription Dialog">
				<div style={{ marginTop: '16px' }}>
					<input
						type="email"
						placeholder="Enter your email"
						style={{
							width: '100%',
							padding: '8px 12px',
							border: '1px solid var(--color-container-2)',
							backgroundColor: 'var(--color-container-1)',
							color: 'var(--color-text-1)',
							boxSizing: 'border-box',
						}}
					/>
				</div>
			</DialogStoryWrapper>
		</Theme>
	),
};

export const Interactive: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Click the trigger button below to open the Dialog and test state syncing, escape dismiss, and backdrop clicks.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<DialogStoryWrapper
				{...args}
				triggerText="Open Interactive Dialog"
				onConfirm={() => alert('Confirmed deletion!')}
			/>
		</Theme>
	),
};
