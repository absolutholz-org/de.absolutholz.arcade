/* eslint-disable no-restricted-imports */
import React from 'react';
import { Button } from '../../Button';
import { Dialog } from '../_Dialog';
import type { ConfirmDialogProps } from './_ConfirmDialog.types';

export function ConfirmDialog({
	children,
	isOpen,
	message,
	title,
	cancelText,
	confirmText,
	onCancel,
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<Dialog
			isOpen={isOpen}
			title={title}
			onClose={onCancel}
			footer={
				<>
					<Button variant="outlined" accent="primary" onClick={onCancel}>
						{cancelText}
					</Button>
					<Button accent="primary" onClick={onConfirm}>
						{confirmText}
					</Button>
				</>
			}
		>
			{message && <p style={{ margin: 0 }}>{message}</p>}
			{children}
		</Dialog>
	);
}
