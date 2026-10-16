import type { ElementType, ReactNode } from 'react';
import type { BadgeVariant } from '../Badge/_Badge.types';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';

export interface GameSelectionCardBadge {
	label: ReactNode;
	variant?: BadgeVariant;
}

export interface GameSelectionCardBaseProps {
	/** Title of the level or preset (e.g. "Puzzle 1", "Heart", "Simple") */
	title: ReactNode;
	/** Subtitle or secondary description (e.g. "6×6 Grid") */
	subtitle?: ReactNode;
	/** Grid dimensions or parameters (e.g. "15% mines") */
	dimensions?: ReactNode;
	/** Optional status badge configuration */
	badge?: GameSelectionCardBadge;
	/** Slot for thumbnail preview, puzzle grid snippet, or artwork */
	preview?: ReactNode;
}

export type GameSelectionCardProps<C extends ElementType = 'button'> = GameSelectionCardBaseProps &
	Omit<ClickableCardProps<C>, keyof GameSelectionCardBaseProps>;
