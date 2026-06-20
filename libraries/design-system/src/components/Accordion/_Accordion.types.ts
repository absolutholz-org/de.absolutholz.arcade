import type { ReactNode } from 'react';
import type { SpacingKey } from '../../styles/spacing';
import type { ACCORDION_VARIANTS } from './_Accordion.constants';

export type AccordionVariant = (typeof ACCORDION_VARIANTS)[number];

export interface AccordionProps {
	/**
	 * The visual style variant of the accordion container.
	 */
	variant?: AccordionVariant;
	/**
	 * The spacing gap between accordion items.
	 */
	gap?: SpacingKey;
	/**
	 * Whether only one item can be open at a time.
	 */
	exclusive?: boolean;
	/**
	 * Accordion items.
	 */
	children: ReactNode;
}

export interface AccordionItemProps {
	/**
	 * The header/trigger content of the accordion item.
	 */
	title: ReactNode;
	/**
	 * Whether the item is open by default on initial mount.
	 */
	defaultOpen?: boolean;
	/**
	 * An optional custom name identifier for the details element.
	 * If the parent Accordion has exclusive=true, this name is auto-generated
	 * to link details groups, but can be overridden here.
	 */
	name?: string;
	/**
	 * The panel content of the accordion item.
	 */
	children: ReactNode;
}
