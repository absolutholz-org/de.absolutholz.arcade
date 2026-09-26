import type {
	ChangeEvent,
	ComponentPropsWithoutRef,
	FocusEvent,
	KeyboardEvent,
} from 'react';
import type { TEXT_AREA_RESIZE_OPTIONS } from './_TextArea.constants';

export type TextAreaResize = (typeof TEXT_AREA_RESIZE_OPTIONS)[number];

export interface BaseTextAreaProps {
	/**
	 * Controls the resize behavior of the textarea.
	 */
	resize?: TextAreaResize;
	/**
	 * Tab index for keyboard navigation.
	 */
	tabIndex?: number;
	/**
	 * Change event handler.
	 */
	onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	/**
	 * Focus event handler.
	 */
	onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
	/**
	 * Blur event handler.
	 */
	onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
	/**
	 * Key down event handler.
	 */
	onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export type TextAreaProps = BaseTextAreaProps &
	Omit<ComponentPropsWithoutRef<'textarea'>, keyof BaseTextAreaProps | 'style'>;
