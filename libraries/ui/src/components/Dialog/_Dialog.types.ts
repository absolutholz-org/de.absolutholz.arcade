import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Props for the Dialog component.
 */
export interface DialogProps extends Omit<ComponentPropsWithoutRef<'dialog'>, 'style' | 'title'> {
	/**
	 * Controls whether the modal dialog is open and visible.
	 */
	isOpen: boolean;
	/**
	 * Header title text or element displayed in the dialog header.
	 */
	title: ReactNode;
	/**
	 * Optional descriptive message rendered inside the dialog body.
	 */
	message?: ReactNode;
	/**
	 * Custom dialog body content rendered beneath the message.
	 */
	children?: ReactNode;
	/**
	 * Callback triggered when the dialog is dismissed (via Escape, backdrop click, cancel, or close button).
	 */
	onCancel?: () => void;
	/**
	 * Callback triggered when the primary confirmation button is clicked.
	 */
	onConfirm?: () => void;
	/**
	 * Label text for the cancel button in the footer.
	 */
	cancelText?: string;
	/**
	 * Label text for the confirm button in the footer.
	 */
	confirmText?: string;
	/**
	 * Whether to render the header close button when onCancel is provided.
	 */
	showCloseButton?: boolean;
	/**
	 * Accessible label for the header close button.
	 * If omitted, falls back to the localized translation from `@arcade/lib-i18n`.
	 */
	closeAriaLabel?: string;
	/**
	 * Optional custom HTML ID for the dialog element.
	 */
	id?: string;
}

/**
 * Compatibility alias matching the IDialog interface naming.
 */
export type IDialog = DialogProps;
