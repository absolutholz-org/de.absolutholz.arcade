import { type ElementType, type ForwardedRef, forwardRef } from 'react';
import * as S from './_GamesGrid.styles';
import type { GamesGridProps } from './_GamesGrid.types';

function GamesGridInner<C extends ElementType = 'div'>(
	{ as, children, className, ...restProps }: GamesGridProps<C>,
	ref: ForwardedRef<HTMLElement>,
) {
	const Component = as || 'div';
	return (
		<S.GamesGrid as={Component} ref={ref as ForwardedRef<HTMLDivElement>} className={className} {...restProps}>
			{children}
		</S.GamesGrid>
	);
}

/**
 * Responsive auto-fill grid for game cards and catalog listings.
 */
export const GamesGrid = forwardRef(GamesGridInner) as <C extends ElementType = 'div'>(
	props: GamesGridProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof GamesGridInner>;
