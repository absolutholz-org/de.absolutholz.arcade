import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type { BUTTON_SIZES, BUTTON_VARIANTS } from './_Button.constants';

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface BaseButtonProps<C extends ElementType = 'button'> {
	/**
	 * Visual variant representing visual hierarchy and intent.
	 */
	variant?: ButtonVariant;
	/**
	 * Sizing preset dictating padding, font size, and min target bounds.
	 */
	size?: ButtonSize;
	/**
	 * Element rendered immediately before the main label content.
	 */
	leadingIcon?: ReactNode;
	/**
	 * Element rendered immediately after the main label content.
	 */
	trailingIcon?: ReactNode;
	/**
	 * When true, renders an icon-only square button layout.
	 * When rendering icon-only, ensure an accessible `aria-label` or `aria-labelledby` is provided.
	 */
	isIconOnly?: boolean;
	/**
	 * The HTML element or custom component to render as the wrapping element.
	 */
	as?: C;
}

export type ButtonProps<C extends ElementType = 'button'> = BaseButtonProps<C> &
	Omit<ComponentPropsWithRef<C>, keyof BaseButtonProps<ElementType> | 'style'>;
