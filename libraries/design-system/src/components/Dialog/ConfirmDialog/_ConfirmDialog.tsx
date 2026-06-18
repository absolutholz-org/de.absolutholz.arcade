/* eslint-disable no-restricted-imports */
import React from 'react';
import { Dialog } from '../_Dialog';
import * as S from '../_Dialog.styles';
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
					<S.Button $variant="secondary" onClick={onCancel}>
						{cancelText}
					</S.Button>
					<S.Button $variant="primary" onClick={onConfirm}>
						{confirmText}
					</S.Button>
				</>
			}
		>
			{message && <p style={{ margin: 0 }}>{message}</p>}
			{children}
		</Dialog>
	);
}
