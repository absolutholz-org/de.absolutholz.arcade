import type {
	ComponentPropsWithoutRef,
	ReactNode,
	FocusEvent,
	KeyboardEvent,
} from 'react';
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
	/**
	 * Tab index for keyboard navigation.
	 */
	tabIndex?: number;
	/**
	 * Focus event handler.
	 */
	onFocus?: (e: FocusEvent<Element>) => void;
	/**
	 * Blur event handler.
	 */
	onBlur?: (e: FocusEvent<Element>) => void;
	/**
	 * Key down event handler.
	 */
	onKeyDown?: (e: KeyboardEvent<Element>) => void;
	/**
	 * Custom data attribute for toolbar roving tab index.
	 */
	'data-toolbar-item'?: string;
	/**
	 * Link destination if rendered as an anchor.
	 */
	href?: string;
	/**
	 * Target for anchor link destinations.
	 */
	target?: string;
	/**
	 * Relationship for anchor link destinations.
	 */
	rel?: string;
	/**
	 * Disabled state for native buttons.
	 */
	disabled?: boolean;
	/**
	 * Type for native buttons.
	 */
	type?: 'button' | 'submit' | 'reset';
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
