import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { HERO_ALIGN_OPTIONS, HERO_HEADING_LEVELS } from './_Hero.constants';

export type HeroAlign = (typeof HERO_ALIGN_OPTIONS)[number];
export type HeroHeadingLevel = (typeof HERO_HEADING_LEVELS)[number];

export interface BaseHeroProps<C extends ElementType = 'header'> {
	/**
	 * The HTML element or custom component to render as the root container.
	 * @default 'header'
	 */
	as?: C;
	/**
	 * Primary title text or element.
	 */
	title: ReactNode;
	/**
	 * Secondary tagline or supporting description text.
	 */
	tagline?: ReactNode;
	/**
	 * Visual element such as a large Logo or icon graphic.
	 */
	logo?: ReactNode;
	/**
	 * Visual alignment layout of the hero content.
	 * @default 'left'
	 */
	align?: HeroAlign;
	/**
	 * Semantic HTML heading level for the title element.
	 * @default 'h1'
	 */
	headingLevel?: HeroHeadingLevel;
	/**
	 * Optional extra content, such as action buttons, links, or children.
	 */
	children?: ReactNode;
}

export type HeroProps<C extends ElementType = 'header'> = BaseHeroProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseHeroProps<ElementType> | 'style'>;
