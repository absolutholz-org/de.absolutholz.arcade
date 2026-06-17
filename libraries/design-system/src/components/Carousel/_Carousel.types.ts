import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingKey } from '../../styles/spacing/spacing.utils';
import type { CAROUSEL_VARIANTS } from './_Carousel.constants';

export type CarouselVariant = (typeof CAROUSEL_VARIANTS)[number];

export interface BaseCarouselProps<C extends ElementType = 'div'> {
	/**
	 * The layout variant of the carousel.
	 * - 'standard': Fits its container context.
	 * - 'full-bleed': Breaks out of the page content width and spans edge-to-edge of the viewport.
	 */
	variant?: CarouselVariant;
	/**
	 * The spacing gap between slides.
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
