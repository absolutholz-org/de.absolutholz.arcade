import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { IconName } from '../Icon/_Icon.types';
import type { TOAST_POSITIONS, TOAST_VARIANTS } from './_Toast.constants';

export type ToastVariant = (typeof TOAST_VARIANTS)[number];
export type ToastPosition = (typeof TOAST_POSITIONS)[number];

export interface ToastAction {
	label: string;
	onClick: () => void;
	ariaLabel?: string;
}

export interface ToastOptions {
	/** Unique identifier. If omitted, an ID is generated automatically. */
	id?: string;
	/** Visual status variant. */
	variant?: ToastVariant;
	/** Optional title for the toast. */
	title?: string;
	/** Text message content of the toast. */
	message: string;
	/** Auto-dismiss duration in milliseconds. Set to 0 or Infinity for persistent toasts. */
	duration?: number;
	/** Optional custom icon name from the icon catalog. Overrides default variant icon. */
	icon?: IconName;
	/** Optional emoji character to display instead of an icon. */
	emoji?: string;
	/** Accessible label for the dismiss button. */
	dismissAriaLabel?: string;
	/** Optional primary action button within the toast. */
	action?: ToastAction;
	/** Callback invoked when this toast is dismissed. */
	onDismiss?: () => void;
}

export interface ToastItemData extends Omit<ToastOptions, 'id'> {
	id: string;
	createdAt: number;
}

export interface ToastState {
	active: ToastItemData[];
	queue: ToastItemData[];
	maxVisible: number;
}

export interface ToastContainerProps extends Omit<ComponentPropsWithoutRef<'aside'>, 'style'> {
	/** Screen position for the toast notification host. */
	position?: ToastPosition;
	/** Maximum number of toasts displayed simultaneously before queueing. */
	maxVisibleToasts?: number;
	/** Accessible label for dismiss buttons if not provided per-toast. */
	dismissAriaLabel?: string;
	/** Optional custom toasts list for controlled rendering (e.g. testing or Storybook). */
	toasts?: ToastItemData[];
	/** Optional custom dismiss handler when controlled. */
	onDismiss?: (id: string) => void;
}

export interface ToastItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style' | 'id' | 'title'> {
	id: string;
	variant?: ToastVariant;
	title?: string;
	message: string;
	duration?: number;
	icon?: IconName;
	emoji?: string;
	dismissAriaLabel?: string;
	action?: ToastAction;
	children?: ReactNode;
	onDismiss: (id: string) => void;
}
