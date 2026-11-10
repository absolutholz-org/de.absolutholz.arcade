import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { HERO_HEADING_LEVELS } from './_Hero.constants';

export type HeroHeadingLevel = (typeof HERO_HEADING_LEVELS)[number];

export interface BaseHeroProps<C extends ElementType = 'header'> {
	/**
	 * The HTML element or custom component to render as the root container.
	 * @default 'header'
	 */
	as?: C;
	/**
	 * Optional uppercase eyebrow heading displayed directly above the primary title.
	 */
	eyebrow?: ReactNode;
	/**
	 * Primary title text or element.
	 */
	title: ReactNode;
	/**
	 * Secondary tagline or supporting description text.
	 */
	tagline?: ReactNode;
	/**
	 * Optional list of localized metadata tag strings rendered below the tagline.
	 */
	tags?: readonly string[];
	/**
	 * Accessible label for the metadata tags list.
	 */
	tagsAriaLabel?: string;
	/**
	 * Visual element such as a large Logo or icon graphic.
	 */
	logo?: ReactNode;
	/**
	 * Optional actions cluster or controls (such as GameActionBar) rendered at the bottom of the hero body.
	 */
	actions?: ReactNode;
	/**
	 * Semantic HTML heading level for the title element.
	 * @default 'h1'
	 */
	headingLevel?: HeroHeadingLevel;
}

export type HeroProps<C extends ElementType = 'header'> = BaseHeroProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseHeroProps<ElementType> | 'children' | 'style'>;
