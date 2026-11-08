import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { PAGE_CONTAINER_PADDINGS, PAGE_CONTAINER_VARIANTS } from './_PageContainer.constants';

export type PageContainerVariant = keyof typeof PAGE_CONTAINER_VARIANTS;
export type PageContainerPadding = keyof typeof PAGE_CONTAINER_PADDINGS;

export interface BasePageContainerProps<C extends ElementType = 'div'> {
	/**
	 * The layout width variant constraint.
	 * @default 'standard'
	 */
	variant?: PageContainerVariant;
	/**
	 * The horizontal padding preset.
	 * @default 'normal'
	 */
	padding?: PageContainerPadding;
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

export type PageContainerProps<C extends ElementType = 'div'> = BasePageContainerProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BasePageContainerProps<ElementType> | 'style'>;
