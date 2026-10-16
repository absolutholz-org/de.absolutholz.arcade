import { type ElementType, type ForwardedRef, forwardRef } from 'react';
import { ClickableCard } from '../ClickableCard';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';
import * as S from './_QuickPlayCard.styles';
import type { QuickPlayCardProps } from './_QuickPlayCard.types';

function QuickPlayCardInner<C extends ElementType = 'button'>(
	{ title = 'Quick Play', subtitle, icon, children, ...cardProps }: QuickPlayCardProps<C>,
	ref: ForwardedRef<HTMLElement>,
) {
	return (
		<ClickableCard ref={ref} {...(cardProps as ClickableCardProps<C>)}>
			<S.ContentWrapper>
				{icon && <S.IconContainer aria-hidden="true">{icon}</S.IconContainer>}
				<S.TextContainer>
					<S.Title>{title}</S.Title>
					{subtitle && <S.Subtitle>{subtitle}</S.Subtitle>}
				</S.TextContainer>
			</S.ContentWrapper>
			{children}
		</ClickableCard>
	);
}

/**
 * Specialized direct-launch card representing dynamic/procedural puzzle generation.
 * Prominently features action icon branding and distinct visual differentiation.
 */
export const QuickPlayCard = forwardRef(QuickPlayCardInner as never) as unknown as <C extends ElementType = 'button'>(
	props: QuickPlayCardProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof QuickPlayCardInner>;
