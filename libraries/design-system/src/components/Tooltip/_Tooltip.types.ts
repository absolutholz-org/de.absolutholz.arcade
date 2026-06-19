import type { ReactElement } from 'react';
import type { FLOATING_POSITIONS } from './_Tooltip.constants';

export type FloatingPosition = (typeof FLOATING_POSITIONS)[number];

export interface TooltipProps {
	children: ReactElement;
	content: string;
	position?: FloatingPosition;
}
