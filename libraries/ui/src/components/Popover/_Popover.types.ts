import type { ReactElement, ReactNode } from 'react';
import type { POPOVER_ALIGNMENTS } from './_Popover.constants';

export type PopoverAlign = (typeof POPOVER_ALIGNMENTS)[number];

export interface PopoverProps {
	/**
	 * First child is the trigger element, the rest of the children are the popover content.
	 */
	children: [ReactElement, ...ReactNode[]];
	/**
	 * Preferred position of the popover relative to the trigger.
	 */
	align?: PopoverAlign;
	/**
	 * Callback fired when the popover opens or closes.
	 */
	onOpenChange?: (isOpen: boolean) => void;
}

declare module 'react' {
	interface HTMLAttributes<T> {
		popover?: '' | 'auto' | 'manual';
	}
	interface ButtonHTMLAttributes<T> {
		popovertarget?: string;
		popovertargetaction?: 'toggle' | 'show' | 'hide';
	}
}
