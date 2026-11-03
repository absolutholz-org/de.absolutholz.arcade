import { type ElementType, type ForwardedRef, forwardRef } from 'react';
import { Badge } from '../Badge';
import { ClickableCard } from '../ClickableCard';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';
import * as S from './_GameCard.styles';
import type { GameCardBadge, GameCardProps } from './_GameCard.types';

function isBadgeObject(badge: unknown): badge is GameCardBadge {
	return typeof badge === 'object' && badge !== null && 'label' in badge;
}

function GameCardInner<C extends ElementType = 'a'>(
	{ title, icon, description, badge, footer, children, as, ...cardProps }: GameCardProps<C>,
	ref: ForwardedRef<HTMLElement>,
) {
	const Component = as || 'a';
	const renderedBadge = badge ? (
		isBadgeObject(badge) ? (
			<Badge variant={badge.variant || 'neutral'} size="sm">
				{badge.label}
			</Badge>
		) : (
			<Badge variant="neutral" size="sm">
				{badge}
			</Badge>
		)
	) : null;

	return (
		<ClickableCard as={Component} ref={ref} {...(cardProps as ClickableCardProps<C>)}>
			<S.Header>
				<S.Icon aria-hidden="true">{icon}</S.Icon>
				<S.Title>{title}</S.Title>
			</S.Header>
			{description && <S.Description>{description}</S.Description>}
			{children}
			{(renderedBadge || footer) && (
				<S.Footer>
					{renderedBadge}
					{footer}
				</S.Footer>
			)}
		</ClickableCard>
	);
}

/**
 * Standard direct-launch card representing a game or tool in catalog and taxonomy listings.
 * Inherits polymorphic link/button behavior, 3D elevation, and focus rings from ClickableCard.
 */
export const GameCard = forwardRef(GameCardInner as never) as unknown as <C extends ElementType = 'a'>(
	props: GameCardProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof GameCardInner>;
