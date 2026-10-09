import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { MARKDOWN_CONTENT_VARIANTS } from './_MarkdownContent.constants';

export type MarkdownContentVariant = keyof typeof MARKDOWN_CONTENT_VARIANTS;

export interface BaseMarkdownContentProps<C extends ElementType = 'article'> {
	/**
	 * Width constraint variant for the prose container.
	 * @default 'standard'
	 */
	variant?: MarkdownContentVariant;
	/**
	 * The semantic HTML tag or component to render as the root container.
	 * @default 'article'
	 */
	as?: C;
	/**
	 * Rendered Markdown or semantic HTML content.
	 */
	children?: ReactNode;
}

export type MarkdownContentProps<C extends ElementType = 'article'> = BaseMarkdownContentProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseMarkdownContentProps<ElementType> | 'style'>;
