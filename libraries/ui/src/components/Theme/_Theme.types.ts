import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { THEME_NAMES } from './_Theme.constants';

export type ThemeName = (typeof THEME_NAMES)[number];

export interface BaseThemeProps<C extends ElementType = 'div'> {
	/**
	 * The name of the theme to apply (e.g. 'primary', 'secondary', 'contrast', 'accent')
	 * @default 'primary'
	 */
	name?: ThemeName;
	/**
	 * The HTML element or custom component to render as the wrapping element.
	 * @default 'div'
	 */
	as?: C;
	/**
	 * React children to render inside the themed block.
	 */
	children?: ReactNode;
}

export type ThemeProps<C extends ElementType = 'div'> = BaseThemeProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseThemeProps<ElementType> | 'style'>;
