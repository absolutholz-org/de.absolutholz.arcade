/* eslint-disable no-restricted-imports */
import React from 'react';
import { Button } from '../../Button';
import { Dialog } from '../_Dialog';
import type { AlertDialogProps } from './_AlertDialog.types';

export function AlertDialog({
	children,
	isOpen,
	message,
	title,
	acknowledgeText,
	onAcknowledge,
}: AlertDialogProps) {
	return (
		<Dialog
			isOpen={isOpen}
			title={title}
			onClose={onAcknowledge}
			footer={
				<Button accent="primary" onClick={onAcknowledge}>
					{acknowledgeText}
				</Button>
			}
		>
			{message && <p style={{ margin: 0 }}>{message}</p>}
			{children}
		</Dialog>
	);
}
