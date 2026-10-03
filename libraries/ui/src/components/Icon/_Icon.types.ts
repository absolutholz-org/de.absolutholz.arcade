import type { ReactElement } from 'react';
import type { ICON_CATALOG, ICON_SIZES } from './_Icon.constants';

export type IconSize = keyof typeof ICON_SIZES;
export type IconName = keyof typeof ICON_CATALOG;

export interface IconProps {
	/**
	 * Predefined icon name from the inline SVG catalog.
	 */
	name?: IconName;
	/**
	 * An emoji character to render as an icon.
	 */
	emoji?: string;
	/**
	 * Short text character or typographical glyph (maximum 2 characters) to render as an icon.
	 */
	text?: string;
	/**
	 * Dedicated custom SVG element. Must be a valid inline SVG element.
	 */
	svg?: ReactElement;
	/**
	 * Sizing preset from the dedicated icon sizing scale.
	 * @default 'md'
	 */
	size?: IconSize;
	/**
	 * Accessible label for screen readers.
	 * When provided, the element is announced with `role="img"`.
	 * When omitted, the element is treated as decorative (`aria-hidden="true"`).
	 */
	label?: string;
}
