import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
	BUTTON_ACCENTS,
	BUTTON_DISPLAYS,
	BUTTON_VARIANTS,
} from './_Button.constants';

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonAccent = (typeof BUTTON_ACCENTS)[number];
export type ButtonDisplay = (typeof BUTTON_DISPLAYS)[number];

export interface BaseButtonProps {
	/**
	 * The design variant of the button.
	 * @default 'solid'
	 */
	variant?: ButtonVariant;
	/**
	 * The accent theme color.
	 * @default 'primary'
	 */
	accent?: ButtonAccent;
	/**
	 * Whether the button renders as an inline-flex element or a full-width block element.
	 * @default 'inline'
	 */
	display?: ButtonDisplay;
	/**
	 * Optional icon rendered before the text.
	 */
	leadingIcon?: ReactNode;
	/**
	 * Optional icon rendered after the text.
	 */
	trailingIcon?: ReactNode;
}

// Anchor-specific props
export interface AnchorButtonProps extends BaseButtonProps {
	href: string;
}

// Button-specific props
export interface NativeButtonProps extends BaseButtonProps {
	href?: never;
}

export type ResolvedAnchorButtonProps = AnchorButtonProps &
	Omit<ComponentPropsWithoutRef<'a'>, keyof AnchorButtonProps | 'style'>;

export type ResolvedNativeButtonProps = NativeButtonProps &
	Omit<ComponentPropsWithoutRef<'button'>, keyof NativeButtonProps | 'style'>;

export type ButtonProps = ResolvedAnchorButtonProps | ResolvedNativeButtonProps;
