import { type ElementType, type ForwardedRef, forwardRef } from 'react';
import { Badge } from '../Badge';
import { ClickableCard } from '../ClickableCard';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';
import * as S from './_GameSelectionCard.styles';
import type { GameSelectionCardProps } from './_GameSelectionCard.types';

function GameSelectionCardInner<C extends ElementType = 'button'>(
	{ title, subtitle, dimensions, badge, preview, children, ...cardProps }: GameSelectionCardProps<C>,
	ref: ForwardedRef<HTMLElement>,
) {
	return (
		<ClickableCard ref={ref} {...(cardProps as ClickableCardProps<C>)}>
			{preview && <S.PreviewContainer>{preview}</S.PreviewContainer>}
			<S.Header>
				<S.Title>{title}</S.Title>
				{badge && (
					<Badge variant={badge.variant || 'neutral'} size="sm">
						{badge.label}
					</Badge>
				)}
			</S.Header>
			{(subtitle || dimensions) && (
				<S.Metadata>
					{subtitle && <span>{subtitle}</span>}
					{subtitle && dimensions && <span aria-hidden="true">•</span>}
					{dimensions && <span>{dimensions}</span>}
				</S.Metadata>
			)}
			{children}
		</ClickableCard>
	);
}

/**
 * Standard direct-launch card for deterministic levels and puzzle presets.
 * Entire card surface is interactive, inheriting hover elevation and focus rings from ClickableCard.
 */
export const GameSelectionCard = forwardRef(GameSelectionCardInner as never) as unknown as <
	C extends ElementType = 'button',
>(
	props: GameSelectionCardProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof GameSelectionCardInner>;
