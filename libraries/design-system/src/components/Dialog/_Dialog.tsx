import React, { useRef, useEffect, useState } from 'react';
import * as S from './_Dialog.styles';
import type { IDialog } from './_Dialog.types';

// Internal styled button component to support standard props mapping
function Button({
	variant,
	onClick,
	children,
}: {
	variant: 'primary' | 'secondary';
	onClick?: () => void;
	children: React.ReactNode;
}) {
	return (
		<S.Button $variant={variant} onClick={onClick}>
			{children}
		</S.Button>
	);
}

/**
 * Highly accessible, native-based modal Dialog component.
 */
export function Dialog({
	cancelText,
	children,
	confirmText,
	id,
	isOpen,
	message,
	onCancel,
	onConfirm,
	title,
}: IDialog) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isClosing, setIsClosing] = useState(false);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			setIsClosing(false);
			// Prevent errors if dialog is already open
			if (!dialog.open) {
				dialog.showModal();
			}
		} else {
			// Trigger closing animation first if dialog is open
			if (dialog.open && !isClosing) {
				setIsClosing(true);
			}
		}
	}, [isOpen, isClosing]);

	// Native Escape key press triggers standard onCancel event
	const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
		e.preventDefault(); // Control state manually
		onCancel();
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		// 1. Target must be the dialog element itself
		if (e.target !== dialog) return;

		// 2. Coordinate boundary check for backdrop vs element padding
		const rect = dialog.getBoundingClientRect();
		const isDialogContent =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;

		if (isDialogContent) return;

		// 3. Trigger close callback
		onCancel();
	};

	const handleAnimationEnd = (e: React.AnimationEvent<HTMLDialogElement>) => {
		// Only run logic when dialog's own animation finishes
		if (e.target !== dialogRef.current) return;

		if (isClosing) {
			setIsClosing(false);
			const dialog = dialogRef.current;
			if (dialog && dialog.open) {
				dialog.close();
			}
		}
	};

	return (
		<S.DialogBase
			id={id}
			ref={dialogRef}
			onCancel={handleCancel}
			onClick={handleBackdropClick}
			onAnimationEnd={handleAnimationEnd}
			aria-labelledby="dialog-title"
			aria-describedby={message ? 'dialog-message' : undefined}
			data-closing={isClosing ? 'true' : undefined}
			{...{ closedby: 'any' }}
		>
			<S.DialogContainer onClick={(e) => e.stopPropagation()}>
				<S.DialogHeader>
					<S.DialogTitle id="dialog-title">{title}</S.DialogTitle>
				</S.DialogHeader>

				<S.DialogContent id={message ? 'dialog-message' : undefined}>
					{message && <p>{message}</p>}
					{children}
				</S.DialogContent>

				<S.DialogFooter>
					{onCancel && cancelText && (
						<Button variant="secondary" onClick={onCancel}>
							{cancelText}
						</Button>
					)}
					{onConfirm && confirmText && (
						<Button variant="primary" onClick={onConfirm}>
							{confirmText}
						</Button>
					)}
				</S.DialogFooter>
			</S.DialogContainer>
		</S.DialogBase>
	);
}
