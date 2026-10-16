import { type ElementType, type ForwardedRef, forwardRef } from 'react';
import * as S from './_ClickableCard.styles';
import type { ClickableCardProps } from './_ClickableCard.types';

function ClickableCardInner<C extends ElementType = 'button'>(
	{ density = 'normal', selected = false, as, children, ...restProps }: ClickableCardProps<C>,
	ref: ForwardedRef<HTMLElement>,
) {
	const Component = as || 'button';
	const isButtonElement = Component === 'button';

	return (
		<S.ClickableCard
			ref={ref as ForwardedRef<HTMLButtonElement>}
			as={Component}
			{...(isButtonElement
				? { type: (restProps as { type?: 'button' | 'submit' | 'reset' }).type || 'button' }
				: {})}
			data-density={density}
			data-selected={selected ? 'true' : undefined}
			{...restProps}
		>
			{children}
		</S.ClickableCard>
	);
}

/**
 * Generic interactive card primitive supporting polymorphic rendering (`button`, `a`, etc.),
 * elevation states, density variants, and accessible focus outlines.
 */
export const ClickableCard = forwardRef(ClickableCardInner) as <C extends ElementType = 'button'>(
	props: ClickableCardProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof ClickableCardInner>;
