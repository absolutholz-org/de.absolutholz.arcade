import type { ComponentPropsWithoutRef } from 'react';
import type { ICON_SIZES, ICON_CATALOG } from './_Icon.constants';

export type IconSize = keyof typeof ICON_SIZES;
export type IconName = keyof typeof ICON_CATALOG;

export interface BaseIconProps {
	/**
	 * The size key of the icon.
	 * @default 'md'
	 */
	size?: IconSize;
	/**
	 * Optional accessible label describing the icon.
	 * If provided, the icon is marked as informative (role="img" and aria-label).
	 * If omitted, the icon is marked as decorative (aria-hidden="true").
	 */
	label?: string;
}

/**
 * Union to enforce mutually exclusive icon definition.
 * You must provide either a catalog name OR an emoji.
 */
export type IconSourceProps =
	| {
			/**
			 * The name of the icon in the local SVG catalog.
			 */
			name: IconName;
			emoji?: never;
	  }
	| {
			name?: never;
			/**
			 * The emoji character to render.
			 */
			emoji: string;
	  };

export type IconProps = BaseIconProps &
	IconSourceProps &
	Omit<
		ComponentPropsWithoutRef<'span'>,
		keyof BaseIconProps | keyof IconSourceProps | 'style'
	>;
