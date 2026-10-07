import type { ReactElement, ReactNode } from 'react';
import type { TOOLTIP_POSITIONS } from './_Tooltip.constants';

export type TooltipPosition = (typeof TOOLTIP_POSITIONS)[number];

export interface TooltipProps {
	/**
	 * The text or content to display in the tooltip.
	 */
	content?: ReactNode;
	/**
	 * Preferred position of the tooltip relative to the trigger element.
	 */
	position?: TooltipPosition;
	/**
	 * The single child element to attach the tooltip to.
	 */
	children: ReactElement;
}

export type ITooltip = TooltipProps;
