import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Theme } from '../../Theme';
import { Button } from '../../Button';
import { AlertDialog } from './_AlertDialog';
import type { AlertDialogProps } from './_AlertDialog.types';

const meta = {
	component: AlertDialog,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Dialog/AlertDialog',
	argTypes: {
		isOpen: { control: 'boolean' },
		title: { control: 'text' },
		message: { control: 'text' },
		acknowledgeText: { control: 'text' },
	},
	args: {
		acknowledgeText: 'Understood',
		isOpen: false,
		message: 'Your modifications have been successfully saved.',
		title: 'System Notification',
		onAcknowledge: () => {},
	},
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function AlertDialogStoryWrapper({
	triggerText = 'Open Alert Dialog',
	...props
}: AlertDialogProps & { triggerText?: string }) {
	const [isOpen, setIsOpen] = useState(props.isOpen);

	useEffect(() => {
		setIsOpen(props.isOpen);
	}, [props.isOpen]);

	return (
		<div>
			<Button onClick={() => setIsOpen(true)}>{triggerText}</Button>

			<AlertDialog
				{...props}
				isOpen={isOpen}
				onAcknowledge={() => {
					props.onAcknowledge();
					setIsOpen(false);
				}}
			/>
		</div>
	);
}

export const Default: Story = {
	render: (args) => (
		<Theme name="primary">
			<AlertDialogStoryWrapper {...args} />
		</Theme>
	),
};
