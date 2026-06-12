import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

export interface BasePageContainerProps<C extends ElementType = 'div'> {
	/**
	 * Custom max width for the page content.
	 * @default '80rem' (1280px)
	 */
	maxWidth?: string;
	/**
	 * The HTML element or custom component to render.
	 * @default 'div'
	 */
	as?: C;
	/**
	 * React children to render inside the container.
	 */
	children?: ReactNode;
}

export type PageContainerProps<C extends ElementType = 'div'> =
	BasePageContainerProps<C> &
		Omit<
			ComponentPropsWithoutRef<C>,
			keyof BasePageContainerProps<ElementType> | 'style'
		>;
