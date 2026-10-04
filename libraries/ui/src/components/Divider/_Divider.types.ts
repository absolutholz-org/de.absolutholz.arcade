import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export interface BaseDividerProps<C extends ElementType = 'div'> {
	/**
	 * The HTML element or custom component to render.
	 * @default 'div'
	 */
	as?: C;
	/**
	 * The content to display inside the divider.
	 */
	children?: ReactNode;
	/**
	 * Whether the divider should be hidden on desktop screens.
	 * @default false
	 */
	hideOnDesktop?: boolean;
}

export type DividerProps<C extends ElementType = 'div'> = BaseDividerProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseDividerProps<ElementType> | 'style'>;

// Compatibility type alias to match user's expected interface name
export type IDivider = DividerProps<'div'>;
