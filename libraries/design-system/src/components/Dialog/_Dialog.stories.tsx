import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from '.';
import { Theme } from '../Theme';

const meta = {
	component: Dialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Dialog component is a native HTML5-based layout primitive that serves as a highly accessible modal foundation. It manages overlay focus trapping and escape gestures, exposing an open children slot and a flexible footer layout container.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Dialog/BaseDialog',
	argTypes: {
		children: {
			control: 'text',
			description: 'Children nodes inside the dialog content area',
		},
		footer: {
			control: false,
			description: 'Optional custom footer content (typically action buttons)',
		},
		isOpen: {
			control: 'boolean',
			description: 'Visibility state of the dialog overlay',
		},
		title: {
			control: 'text',
			description: 'Header text displayed at the top of the dialog',
		},
	},
	args: {
		children: 'This is the main content area of the dialog primitive.',
		isOpen: false,
		title: 'Dialog Title',
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
					backgroundColor: 'var(--color-accent)',
					border: 'none',
					color: 'var(--color-accent-contrast)',
					cursor: 'pointer',
					fontWeight: 600,
					padding: '12px 24px',
				}}
			>
				{triggerText}
			</button>

			<Dialog {...props} isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</div>
	);
}

export const Default: Story = {
	args: {
		children: 'This is a clean base layout example of the Dialog component.',
		footer: (
			<button
				onClick={() => alert('Footer button clicked!')}
				style={{
					backgroundColor: 'var(--color-accent)',
					border: 'none',
					color: 'var(--color-accent-contrast)',
					cursor: 'pointer',
					fontWeight: 500,
					padding: '8px 16px',
				}}
			>
				Close
			</button>
		),
	},
	parameters: {
		docs: {
			description: {
				story:
					'The default Dialog displays a header title, custom children body, and a flexible footer slot. Click the trigger button to open.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<DialogStoryWrapper {...args} triggerText="Open Dialog" />
		</Theme>
	),
};
