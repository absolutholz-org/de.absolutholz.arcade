/* eslint-disable no-restricted-imports */
import type { BaseDialogProps } from '../_Dialog.types';

export interface ConfirmDialogProps extends Omit<
	BaseDialogProps,
	'footer' | 'onClose'
> {
	cancelText: string;
	confirmText: string;
	message: string;
	onCancel: () => void;
	onConfirm: () => void;
}
