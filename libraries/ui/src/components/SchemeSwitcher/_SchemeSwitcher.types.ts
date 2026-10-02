import type { ComponentPropsWithoutRef, ElementType } from 'react';
import type { SCHEME_OPTIONS, SCHEME_ORIENTATIONS } from './_SchemeSwitcher.constants';

export type Scheme = (typeof SCHEME_OPTIONS)[number];
export type SchemeOrientation = (typeof SCHEME_ORIENTATIONS)[number];

export interface BaseSchemeSwitcherProps<C extends ElementType = 'fieldset'> {
	/**
	 * Accessible label or title for the scheme switcher radio group.
	 */
	legend?: string;
	/**
	 * Whether to visually hide the legend while keeping it accessible to screen readers.
	 */
	hideLegend?: boolean;
	/**
	 * Layout orientation of the radio group options.
	 */
	orientation?: SchemeOrientation;
	/**
	 * The HTML element or custom component to render as the wrapping element.
	 */
	as?: C;
}

export type SchemeSwitcherProps<C extends ElementType = 'fieldset'> = BaseSchemeSwitcherProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseSchemeSwitcherProps<ElementType> | 'style'>;
