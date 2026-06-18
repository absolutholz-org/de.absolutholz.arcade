/* eslint-disable no-restricted-imports */
import type { BaseDialogProps } from '../_Dialog.types';

export interface AlertDialogProps extends Omit<
	BaseDialogProps,
	'footer' | 'onClose'
> {
	acknowledgeText: string;
	onAcknowledge: () => void;
	message: string;
}
