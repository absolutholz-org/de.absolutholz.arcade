import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface BaseDialogProps {
	/**
	 * Children nodes inside the dialog content area.
	 */
	children?: ReactNode;
	/**
	 * Optional custom footer content (typically action buttons).
	 */
	footer?: ReactNode;
	/**
	 * Optional custom HTML ID.
	 */
	id?: string;
	/**
	 * Control state representing dialog visibility.
	 */
	isOpen: boolean;
	/**
	 * Callback handler fired when the top-right X button, escape, or backdrop is clicked.
	 */
	onClose?: () => void;
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
