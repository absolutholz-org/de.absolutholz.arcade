import type { MouseEvent } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useDialog } from './_Dialog.hooks';
import * as S from './_Dialog.styles';
import type { DialogProps } from './_Dialog.types';

export function Dialog({
	cancelText,
	children,
	closeAriaLabel,
	confirmText,
	id,
	isOpen,
	message,
	onCancel,
	onConfirm,
	showCloseButton = true,
	title,
	...restProps
}: DialogProps) {
	const { dialogId, dialogRef, handleBackdropClick, handleNativeCancel, messageId, resolvedCloseAriaLabel, titleId } =
		useDialog({
			closeAriaLabel,
			id,
			isOpen,
			onCancel,
		});

	return (
		<S.DialogBase
			id={dialogId}
			ref={dialogRef}
			onCancel={handleNativeCancel}
			onClick={handleBackdropClick}
			aria-labelledby={titleId}
			aria-describedby={message ? messageId : undefined}
			{...restProps}
		>
			<S.DialogContainer onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
				<S.DialogHeader>
					<S.DialogTitle id={titleId}>{title}</S.DialogTitle>
					{showCloseButton && onCancel && (
						<Button
							variant="ghost"
							size="sm"
							isIconOnly
							onClick={onCancel}
							aria-label={resolvedCloseAriaLabel}
						>
							<Icon name="close" size="sm" />
						</Button>
					)}
				</S.DialogHeader>

				<S.DialogContent id={messageId}>
					{message && <p>{message}</p>}
					{children}
				</S.DialogContent>

				{(Boolean(cancelText) || Boolean(confirmText)) && (
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
				)}
			</S.DialogContainer>
		</S.DialogBase>
	);
}
