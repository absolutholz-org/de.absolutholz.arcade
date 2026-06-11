import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
	typographyScale,
	fontWeights,
	SEMANTIC_VARIANTS,
} from './_Text.constants';

export type TypographyScaleKey = keyof typeof typographyScale;
export type TypographyWeightKey = keyof typeof fontWeights;
export type SemanticVariant = keyof typeof SEMANTIC_VARIANTS;

export interface BaseTextProps<C extends ElementType = 'span'> {
	/**
	 * The high-level semantic typography variant.
	 * @default 'base'
	 */
	variant?: SemanticVariant;
	/**
	 * The HTML element or custom component to render.
	 * @default 'span'
	 */
	as?: C;
	/**
	 * Content to render inside the text component.
	 */
	children?: ReactNode;
}

export type TextProps<C extends ElementType = 'span'> = BaseTextProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseTextProps<ElementType> | 'style'>;
