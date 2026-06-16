import type { ElementType } from 'react';
import * as S from './_Carousel.styles';
import type { CarouselProps } from './_Carousel.types';
import {
	DEFAULT_CAROUSEL_GAP,
	DEFAULT_CAROUSEL_VARIANT,
} from './_Carousel.constants';

/**
 * A responsive, CSS-only scroll-snapping carousel component.
 * Supports standard container fitting and full-bleed edge-to-edge layouts.
 */
export function Carousel<C extends ElementType = 'div'>({
	variant = DEFAULT_CAROUSEL_VARIANT,
	gap = DEFAULT_CAROUSEL_GAP,
	as,
	children,
}: CarouselProps<C>) {
	const Component = as || 'div';

	if (variant === 'full-bleed') {
		return (
			<S.FullBleedCarousel as={Component} $gap={gap}>
				{children}
			</S.FullBleedCarousel>
		);
	}

	return (
		<S.Carousel as={Component} $gap={gap}>
			{children}
		</S.Carousel>
	);
}
