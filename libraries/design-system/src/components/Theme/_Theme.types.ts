import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Themeset } from '../../styles/theme/theme.types';

export interface BaseThemeProps<C extends ElementType = 'div'> {
	/**
	 * The name of the theme to apply (e.g. 'primary', 'secondary', 'contrast', 'accent')
	 */
	name?: keyof Themeset;
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
	Omit<ComponentPropsWithoutRef<C>, keyof BaseThemeProps<ElementType>>;
