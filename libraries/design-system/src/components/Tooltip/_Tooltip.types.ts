import { type ReactElement, type ReactNode } from 'react';

export type FloatingPosition = 'top' | 'right' | 'bottom' | 'left';

export interface ITooltip {
	/** The text or content to display in the tooltip */
	content?: string | ReactNode;
	/** Preferred position of the tooltip relative to the child */
	position?: 'top' | 'right' | 'bottom' | 'left';
	/** The single child element to attach the tooltip to */
	children: ReactElement;
}
