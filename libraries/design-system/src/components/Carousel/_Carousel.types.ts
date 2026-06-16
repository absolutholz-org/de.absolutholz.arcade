import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingKey } from '../../styles/spacing/spacing.utils';

export type CarouselVariant = 'standard' | 'full-bleed';

export interface BaseCarouselProps<C extends ElementType = 'div'> {
	/**
	 * The layout variant of the carousel.
	 * - 'standard': Fits its container context.
	 * - 'full-bleed': Breaks out of the page content width and spans edge-to-edge of the viewport.
	 * @default 'standard'
	 */
	variant?: CarouselVariant;
	/**
	 * The spacing gap between slides.
	 * @default 'md'
	 */
	gap?: SpacingKey;
	/**
	 * The HTML element or custom component to render as the scroll container.
	 * @default 'div'
	 */
	as?: C;
	/**
	 * React children to render as slides inside the carousel.
	 */
	children?: ReactNode;
}

export type CarouselProps<C extends ElementType = 'div'> =
	BaseCarouselProps<C> &
		Omit<
			ComponentPropsWithoutRef<C>,
			keyof BaseCarouselProps<ElementType> | 'style'
		>;
