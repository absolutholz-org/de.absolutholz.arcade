import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
	ICON_BUTTON_ACCENTS,
	ICON_BUTTON_DISPLAYS,
	ICON_BUTTON_VARIANTS,
} from './_IconButton.constants';

export type IconButtonVariant = (typeof ICON_BUTTON_VARIANTS)[number];
export type IconButtonAccent = (typeof ICON_BUTTON_ACCENTS)[number];
export type IconButtonDisplay = (typeof ICON_BUTTON_DISPLAYS)[number];

export interface BaseIconButtonProps {
	/**
	 * The visual appearance variant of the icon button.
	 * @default 'solid'
	 */
	variant?: IconButtonVariant;
	/**
	 * The accent theme color.
	 * @default 'primary'
	 */
	accent?: IconButtonAccent;
	/**
	 * Whether the button renders as an inline-flex element or a full-width block element.
	 * @default 'inline'
	 */
	display?: IconButtonDisplay;
	/**
	 * The icon element to render inside the button.
	 */
	icon: ReactNode;
	/**
	 * The accessible text label for screen readers.
	 */
	'aria-label': string;
}

// Anchor-specific props
export interface AnchorIconButtonProps extends BaseIconButtonProps {
	href: string;
}

// Button-specific props
export interface NativeIconButtonProps extends BaseIconButtonProps {
	href?: never;
}

export type ResolvedAnchorIconButtonProps = AnchorIconButtonProps &
	Omit<ComponentPropsWithoutRef<'a'>, keyof AnchorIconButtonProps | 'style'>;

export type ResolvedNativeIconButtonProps = NativeIconButtonProps &
	Omit<
		ComponentPropsWithoutRef<'button'>,
		keyof NativeIconButtonProps | 'style'
	>;

export type IconButtonProps =
	| ResolvedAnchorIconButtonProps
	| ResolvedNativeIconButtonProps;
