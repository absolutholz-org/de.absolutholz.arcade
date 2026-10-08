import type { ReactNode } from 'react';
import type { TOOLBAR_ALIGNS, TOOLBAR_ORIENTATIONS, TOOLBAR_SIZES, TOOLBAR_VARIANTS } from './_Toolbar.constants';

export type ToolbarOrientation = (typeof TOOLBAR_ORIENTATIONS)[number];
export type ToolbarVariant = (typeof TOOLBAR_VARIANTS)[number];
export type ToolbarSize = (typeof TOOLBAR_SIZES)[number];
export type ToolbarAlign = (typeof TOOLBAR_ALIGNS)[number];

export interface ToolbarProps {
	/**
	 * Accessible label describing the toolbar's purpose for assistive technologies.
	 * Required by WCAG/W3C unless aria-labelledby is provided.
	 */
	'aria-label'?: string;

	/**
	 * Identifier of a visible label element describing this toolbar.
	 */
	'aria-labelledby'?: string;

	/**
	 * Content alignment along the primary axis.
	 */
	align?: ToolbarAlign;

	/**
	 * Interactive controls, separators, and groups rendered inside the toolbar.
	 */
	children?: ReactNode;

	/**
	 * Optional custom CSS class name.
	 */
	className?: string;

	/**
	 * Stretches the toolbar container to occupy 100% of available width.
	 */
	fullWidth?: boolean;

	/**
	 * Optional DOM element ID.
	 */
	id?: string;

	/**
	 * Whether arrow navigation wraps around from last-to-first and first-to-last item.
	 * Defaults to true.
	 */
	loop?: boolean;

	/**
	 * Layout orientation of the toolbar.
	 * In accordance with W3C APG, horizontal uses ArrowLeft/ArrowRight while vertical uses ArrowUp/ArrowDown.
	 * Defaults to 'horizontal'.
	 */
	orientation?: ToolbarOrientation;

	/**
	 * Sizing preset dictating padding and item spacing.
	 * Defaults to 'md'.
	 */
	size?: ToolbarSize;

	/**
	 * Visual styling preset.
	 * Defaults to 'default'.
	 */
	variant?: ToolbarVariant;
}
