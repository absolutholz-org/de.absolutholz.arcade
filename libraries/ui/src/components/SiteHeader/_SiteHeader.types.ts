import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { SITE_HEADER_VARIANTS } from './_SiteHeader.constants';

export type SiteHeaderVariant = (typeof SITE_HEADER_VARIANTS)[number];

export interface BaseSiteHeaderProps<C extends ElementType = 'header'> {
	/**
	 * The HTML element or custom component to render as the root container.
	 * @default 'header'
	 */
	as?: C;
	/**
	 * Layout variant for the header container.
	 * @default 'standard'
	 */
	variant?: SiteHeaderVariant;
	/**
	 * Brand logo element.
	 */
	brandLogo?: ReactNode;
	/**
	 * Brand application title.
	 */
	brandTitle?: ReactNode;
	/**
	 * Application home URL for the brand title link.
	 */
	brandHref?: string;
	/**
	 * Site home URL for the logo link.
	 */
	homeHref?: string;
	/**
	 * Accessible label for the home logo link.
	 * @default 'Home'
	 */
	homeAriaLabel?: string;
	/**
	 * Actions cluster (e.g. HeaderActions or switchers toolbar).
	 */
	actions?: ReactNode;
	/**
	 * Child elements rendered inside the header container.
	 */
	children?: ReactNode;
}

export type SiteHeaderProps<C extends ElementType = 'header'> = BaseSiteHeaderProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseSiteHeaderProps<ElementType> | 'style'>;
