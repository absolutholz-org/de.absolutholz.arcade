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
	/** Optional custom footer slot */
	footer?: ReactNode;
	/** Additional children rendered inside the card */
	children?: ReactNode;
}

export type GameCardProps<C extends ElementType = 'a'> = GameCardBaseProps &
	Omit<ClickableCardProps<C>, keyof GameCardBaseProps>;
