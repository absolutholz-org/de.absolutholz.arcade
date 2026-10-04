import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export interface BaseVisuallyHiddenProps<C extends ElementType = 'span'> {
	/**
	 * The HTML element or custom component to render.
	 * @default 'span'
	 */
	as?: C;
	/**
	 * React children to render inside the visually hidden component.
	 */
	children?: ReactNode;
}

export type VisuallyHiddenProps<C extends ElementType = 'span'> = BaseVisuallyHiddenProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseVisuallyHiddenProps<ElementType> | 'style'>;
