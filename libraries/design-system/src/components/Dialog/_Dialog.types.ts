import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface BaseDialogProps {
	/**
	 * Text for the cancel/secondary action button.
	 */
	cancelText?: string;
	/**
	 * Children nodes inside the dialog content area.
	 */
	children?: ReactNode;
	/**
	 * Text for the confirm/primary action button.
	 */
	confirmText?: string;
	/**
	 * Optional custom HTML ID.
	 */
	id?: string;
	/**
	 * Control state representing dialog visibility.
	 */
	isOpen: boolean;
	/**
	 * Message paragraph displayed in the dialog body.
	 */
	message?: string;
	/**
	 * Callback handler fired when the dialog is dismissed or cancelled.
	 */
	onCancel: () => void;
	/**
	 * Callback handler fired when the confirm button is clicked.
	 */
	onConfirm?: () => void;
	/**
	 * Main title header text of the dialog.
	 */
	title: string;
}

export type DialogProps = BaseDialogProps &
	Omit<
		ComponentPropsWithoutRef<'dialog'>,
		keyof BaseDialogProps | 'style' | 'open'
	>;

// Compatibility type alias matching user's expected interface name
export type IDialog = DialogProps;
