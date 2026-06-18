import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Theme } from '../../Theme';
import { ConfirmDialog } from './_ConfirmDialog';
import type { ConfirmDialogProps } from './_ConfirmDialog.types';

const meta = {
	component: ConfirmDialog,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Dialog/ConfirmDialog',
	argTypes: {
		isOpen: { control: 'boolean' },
		title: { control: 'text' },
		message: { control: 'text' },
		cancelText: { control: 'text' },
		confirmText: { control: 'text' },
	},
	args: {
		cancelText: 'Cancel',
		confirmText: 'Delete',
		isOpen: false,
		message: 'Are you sure you want to permanently delete this resource?',
		title: 'Confirm Deletion',
		onCancel: () => {},
		onConfirm: () => {},
	},
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfirmDialogStoryWrapper({
	triggerText = 'Open Confirm Dialog',
	...props
}: ConfirmDialogProps & { triggerText?: string }) {
	const [isOpen, setIsOpen] = useState(props.isOpen);

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

			<ConfirmDialog
				{...props}
				isOpen={isOpen}
				onCancel={() => {
					props.onCancel();
					setIsOpen(false);
				}}
				onConfirm={() => {
					props.onConfirm();
					setIsOpen(false);
				}}
			/>
		</div>
	);
}

export const Default: Story = {
	render: (args) => (
		<Theme name="primary">
			<ConfirmDialogStoryWrapper {...args} />
		</Theme>
	),
};
