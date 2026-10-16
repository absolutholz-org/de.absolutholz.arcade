import type { ElementType, ReactNode } from 'react';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';

export interface QuickPlayCardBaseProps {
	/** Title of the quick play action (defaults to "Quick Play") */
	title?: ReactNode;
	/** Subtitle or descriptive subline (e.g. "Procedural board", "Infinite practice") */
	subtitle?: ReactNode;
	/** Leading action icon (e.g. dice, shuffle, spark) */
	icon?: ReactNode;
}

export type QuickPlayCardProps<C extends ElementType = 'button'> = QuickPlayCardBaseProps &
	Omit<ClickableCardProps<C>, keyof QuickPlayCardBaseProps>;
