import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type { CLICKABLE_CARD_DENSITIES } from './_ClickableCard.constants';

export type ClickableCardDensity = (typeof CLICKABLE_CARD_DENSITIES)[number];

export interface BaseClickableCardProps<C extends ElementType = 'button'> {
	/**
	 * Controls the internal padding and spacing density.
	 */
	density?: ClickableCardDensity;
	/**
	 * Indicates whether the card is in a selected/active state.
	 */
	selected?: boolean;
	/**
	 * Custom element or component to render as the wrapping tag.
	 */
	as?: C;
	/**
	 * Card content.
	 */
	children?: ReactNode;
}

export type ClickableCardProps<C extends ElementType = 'button'> = BaseClickableCardProps<C> &
	Omit<ComponentPropsWithRef<C>, keyof BaseClickableCardProps<ElementType> | 'style'>;
