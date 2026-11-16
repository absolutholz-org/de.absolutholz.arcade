import type { ElementType, ReactNode } from 'react';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';

export interface GameSelectionCardBaseProps {
	/** Title of the level or preset (e.g. "Puzzle 1", "Heart", "Simple") */
	title: ReactNode;
	/** Optional open content below the title (description, preview, etc.) */
	children?: ReactNode;
	/** Optional list of brief statistics or metadata items rendered at the bottom of the card */
	metadata?: readonly ReactNode[];
}

export type GameSelectionCardProps<C extends ElementType = 'button'> = GameSelectionCardBaseProps &
	Omit<ClickableCardProps<C>, keyof GameSelectionCardBaseProps>;
