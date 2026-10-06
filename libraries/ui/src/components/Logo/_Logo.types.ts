import type { ComponentPropsWithoutRef, ElementType } from 'react';
import type { LOGO_SIZES } from './_Logo.constants';

export type LogoSize = keyof typeof LOGO_SIZES;

export interface BaseLogoProps<C extends ElementType = 'span'> {
	/**
	 * The HTML element to render (strictly presentational container).
	 * @default 'span'
	 */
	as?: C;
	/**
	 * Sizing preset from the dedicated logo sizing scale.
	 * @default 'md'
	 */
	size?: LogoSize;
	/**
	 * Accessible label for screen readers.
	 * When provided, the element is announced with `role="img"`.
	 * When omitted, the element is treated as decorative (`aria-hidden="true"`).
	 */
	label?: string;
}

export type LogoProps<C extends ElementType = 'span'> = BaseLogoProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseLogoProps<ElementType> | 'style'>;
