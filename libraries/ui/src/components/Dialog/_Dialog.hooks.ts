import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type MouseEvent, type SyntheticEvent, useEffect, useId, useRef } from 'react';

export interface UseDialogParams {
	id?: string;
	isOpen: boolean;
	onCancel?: () => void;
	closeAriaLabel?: string;
	backAriaLabel?: string;
}

export function useDialog({ backAriaLabel, closeAriaLabel, id, isOpen, onCancel }: UseDialogParams) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const generatedId = useId();
	const dialogId = id || generatedId;
	const titleId = `${dialogId}-title`;
	const messageId = `${dialogId}-message`;

	const { t } = useI18n();
	const resolvedCloseAriaLabel = closeAriaLabel || t('actions.close');
	const resolvedBackAriaLabel = backAriaLabel || t('actions.back');

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) {
			return;
		}

		if (isOpen) {
			if (!dialog.open && typeof dialog.showModal === 'function') {
				dialog.showModal();
			}
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			const visualViewport = window.visualViewport;
			const syncVisualViewport = () => {
				if (!visualViewport) {
					return;
				}
				dialog.style.setProperty('--dialog-vv-height', `${visualViewport.height}px`);
				dialog.style.setProperty('--dialog-vv-top', `${visualViewport.offsetTop}px`);
				dialog.style.setProperty(
					'--dialog-vv-bottom-offset',
					`${visualViewport.offsetTop + visualViewport.height}px`,
				);

				const active = document.activeElement;
				if (active instanceof HTMLElement && dialog.contains(active)) {
					active.scrollIntoView({ block: 'nearest' });
				}
			};

			if (visualViewport) {
				syncVisualViewport();
				visualViewport.addEventListener('resize', syncVisualViewport);
				visualViewport.addEventListener('scroll', syncVisualViewport);
			}

			return () => {
				if (visualViewport) {
					visualViewport.removeEventListener('resize', syncVisualViewport);
					visualViewport.removeEventListener('scroll', syncVisualViewport);
					dialog.style.removeProperty('--dialog-vv-height');
					dialog.style.removeProperty('--dialog-vv-top');
					dialog.style.removeProperty('--dialog-vv-bottom-offset');
				}
				document.body.style.overflow = originalOverflow;
				if (dialog.open && typeof dialog.close === 'function') {
					dialog.close();
				}
			};
		}
		if (dialog.open && typeof dialog.close === 'function') {
			dialog.close();
		}
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
		resolvedBackAriaLabel,
		handleBackdropClick,
		handleNativeCancel,
	};
}
