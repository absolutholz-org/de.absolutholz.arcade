import type { ElementType } from 'react';
import * as S from './_Carousel.styles';
import type { CarouselProps } from './_Carousel.types';

/**
 * A responsive, CSS-only scroll-snapping carousel component.
 * Supports standard container fitting and full-bleed edge-to-edge layouts.
 */
export function Carousel<C extends ElementType = 'div'>({
	variant = 'standard',
	gap = 'md',
	as,
	scrollButtons = false,
	scrollPrevIcon = '‹',
	scrollPrevLabel = 'Previous slide',
	scrollNextIcon = '›',
	scrollNextLabel = 'Next slide',
	children,
	...props
}: CarouselProps<C>) {
	const Component = as || 'div';

	const attributes = {
		'data-scroll-prev': scrollPrevIcon,
		'data-scroll-prev-label': scrollPrevLabel,
		'data-scroll-next': scrollNextIcon,
		'data-scroll-next-label': scrollNextLabel,
	};

	if (variant === 'full-bleed') {
		return (
			<S.FullBleedCarousel
				as={Component}
				$gap={gap}
				$scrollButtons={scrollButtons}
				{...attributes}
				{...props}
			>
				{children}
			</S.FullBleedCarousel>
		);
	}

	return (
		<S.Carousel
			as={Component}
			$gap={gap}
			$scrollButtons={scrollButtons}
			{...attributes}
			{...props}
		>
			{children}
		</S.Carousel>
	);
}
