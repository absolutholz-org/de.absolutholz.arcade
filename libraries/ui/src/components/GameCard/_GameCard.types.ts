import type { ElementType, ReactNode } from 'react';
import type { BadgeVariant } from '../Badge/_Badge.types';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';

export interface GameCardBadge {
	label: ReactNode;
	variant?: BadgeVariant;
}

export interface GameCardBaseProps {
	/** Title of the game or tool */
	title: ReactNode;
	/** Icon element or emoji character displayed in the header */
	icon: ReactNode;
	/** Description or summary of the game or tool */
	description?: ReactNode;
	/** Optional category or status badge displayed in the footer */
	badge?: ReactNode | GameCardBadge;
	/** Optional secondary play mode chip displayed alongside the category badge */
	modeBadge?: ReactNode | GameCardBadge;
	/** Optional list of badges displayed in the footer */
	badges?: readonly (ReactNode | GameCardBadge)[];
	/** Optional custom footer slot */
	footer?: ReactNode;
	/** Additional children rendered inside the card */
	children?: ReactNode;
	/** Optional unique identifier of the game for favorites toggle */
	gameId?: string;
	/** Optional flag to show/hide the favorite toggle button (default: true if gameId provided) */
	showFavorite?: boolean;
}

export type GameCardProps<C extends ElementType = 'a'> = GameCardBaseProps &
	Omit<ClickableCardProps<C>, keyof GameCardBaseProps>;
