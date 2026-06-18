/* eslint-disable no-restricted-imports */
import React from 'react';
import { Dialog } from '../_Dialog';
import * as S from '../_Dialog.styles';
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
				<S.Button $variant="primary" onClick={onAcknowledge}>
					{acknowledgeText}
				</S.Button>
			}
		>
			{message && <p style={{ margin: 0 }}>{message}</p>}
			{children}
		</Dialog>
	);
}
