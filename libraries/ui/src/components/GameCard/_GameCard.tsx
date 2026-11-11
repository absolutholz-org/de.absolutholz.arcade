import { type ElementType, type ForwardedRef, type ReactNode, forwardRef } from 'react';
import { Badge } from '../Badge';
import { ClickableCard } from '../ClickableCard';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';
import { FavoriteButton } from '../FavoriteButton';
import * as S from './_GameCard.styles';
import type { GameCardBadge, GameCardProps } from './_GameCard.types';

function isBadgeObject(badge: unknown): badge is GameCardBadge {
	return typeof badge === 'object' && badge !== null && 'label' in badge;
}

function renderBadgeItem(item: ReactNode | GameCardBadge, key?: number | string) {
	if (!item) return null;
	if (isBadgeObject(item)) {
		return (
			<Badge key={key} variant={item.variant || 'neutral'} size="sm">
				{item.label}
			</Badge>
		);
	}
	return (
		<Badge key={key} variant="neutral" size="sm">
			{item}
		</Badge>
	);
}

function GameCardInner<C extends ElementType = 'a'>(
	{
		title,
		icon,
		description,
		badge,
		modeBadge,
		badges,
		footer,
		children,
		as,
		gameId,
		showFavorite = true,
		...cardProps
	}: GameCardProps<C>,
	ref: ForwardedRef<HTMLElement>,
) {
	const Component = as || 'a';
	const renderedBadges = badges
		? badges.map((item, idx) => renderBadgeItem(item, idx))
		: [
				badge ? renderBadgeItem(badge, 'primary') : null,
				modeBadge ? renderBadgeItem(modeBadge, 'mode') : null,
			].filter(Boolean);
	const hasBadges = renderedBadges.length > 0;

	const stringTitle = typeof title === 'string' ? title : '';
	const hasFavorite = Boolean(gameId && showFavorite);

	return (
		<S.CardContainer>
			<ClickableCard as={Component} ref={ref} {...(cardProps as ClickableCardProps<C>)}>
				<S.Header data-has-favorite={hasFavorite ? 'true' : undefined}>
					<S.Icon aria-hidden="true">{icon}</S.Icon>
					<S.Title>{title}</S.Title>
				</S.Header>
				{description && <S.Description>{description}</S.Description>}
				{children}
				{(hasBadges || footer) && (
					<S.Footer>
						{renderedBadges}
						{footer}
					</S.Footer>
				)}
			</ClickableCard>
			{hasFavorite && gameId && (
				<S.FavoriteWrapper
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<FavoriteButton gameId={gameId} gameTitle={stringTitle} size="sm" />
				</S.FavoriteWrapper>
			)}
		</S.CardContainer>
	);
}

/**
 * Standard direct-launch card representing a game or tool in catalog and taxonomy listings.
 * Inherits polymorphic link/button behavior, 3D elevation, and focus rings from ClickableCard.
 */
export const GameCard = forwardRef(GameCardInner as never) as unknown as <C extends ElementType = 'a'>(
	props: GameCardProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof GameCardInner>;
