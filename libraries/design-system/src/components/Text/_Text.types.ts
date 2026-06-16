import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
	typographyScale,
	fontWeights,
	SEMANTIC_VARIANTS,
	TEXT_WRAP_OPTIONS,
} from './_Text.constants';

export type TypographyScaleKey = keyof typeof typographyScale;
export type TypographyWeightKey = keyof typeof fontWeights;
export type SemanticVariant = keyof typeof SEMANTIC_VARIANTS;
export type TextWrapOption = (typeof TEXT_WRAP_OPTIONS)[number];

export interface BaseTextProps<C extends ElementType = 'div'> {
	/**
	 * The high-level semantic typography variant.
	 * @default 'base'
	 */
	variant?: SemanticVariant;
	/**
	 * Control how text wraps or truncates.
	 * @default 'pretty'
	 */
	wrap?: TextWrapOption;
	/**
	 * The HTML element or custom component to render.
	 * @default 'div'
	 */
	as?: C;
	/**
	 * Content to render inside the text component.
	 */
	children?: ReactNode;
}

export type TextProps<C extends ElementType = 'div'> = BaseTextProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseTextProps<ElementType> | 'style'>;
