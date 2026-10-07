import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type MouseEvent, type SyntheticEvent, useEffect, useId, useRef } from 'react';

export interface UseDialogParams {
	id?: string;
	isOpen: boolean;
	onCancel?: () => void;
	closeAriaLabel?: string;
}

export function useDialog({ closeAriaLabel, id, isOpen, onCancel }: UseDialogParams) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const generatedId = useId();
	const dialogId = id || generatedId;
	const titleId = `${dialogId}-title`;
	const messageId = `${dialogId}-message`;

	const { t } = useI18n();
	const resolvedCloseAriaLabel = closeAriaLabel || t('actions.close');

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) {
			return;
		}

		if (isOpen) {
			if (!dialog.open && typeof dialog.showModal === 'function') {
				dialog.showModal();
			}
		} else if (dialog.open && typeof dialog.close === 'function') {
			dialog.close();
		}

		return () => {
			if (dialog.open && typeof dialog.close === 'function') {
				dialog.close();
			}
		};
	}, [isOpen]);

	const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
		if (e.target === dialogRef.current) {
			onCancel?.();
		}
	};

	const handleNativeCancel = (e: SyntheticEvent<HTMLDialogElement, Event>) => {
		e.preventDefault();
		onCancel?.();
	};

	return {
		dialogRef,
		dialogId,
		titleId,
		messageId,
		resolvedCloseAriaLabel,
		handleBackdropClick,
		handleNativeCancel,
	};
}
