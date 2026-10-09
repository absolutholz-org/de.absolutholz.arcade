import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export interface BreadcrumbItem {
	/**
	 * Visual and accessible text content for this breadcrumb item.
	 * Optional when `isHome` is true (defaults to the localized home label).
	 */
	label?: ReactNode;

	/**
	 * Destination URL for the breadcrumb link.
	 * When omitted or when the item represents the current page without an explicit link,
	 * rendered as non-navigable text.
	 */
	href?: string;

	/**
	 * Whether this item represents the Arcade home link (renders the Logo).
	 */
	isHome?: boolean;

	/**
	 * Explicitly marks this item as representing the current active page (`aria-current="page"`).
	 * If no item in the trail specifies `isCurrent`, the last item defaults to current.
	 */
	isCurrent?: boolean;

	/**
	 * Accessible label override for assistive technologies on this specific item.
	 */
	'aria-label'?: string;
}

export interface BaseBreadcrumbProps<C extends ElementType = 'nav'> {
	/**
	 * The HTML element or custom component to render as the outer landmark container.
	 * @default 'nav'
	 */
	as?: C;

	/**
	 * The sequence of breadcrumb items forming the hierarchical navigation trail.
	 */
	items: BreadcrumbItem[];

	/**
	 * Convenient shortcut for the Arcade home link URL.
	 * When provided, automatically prepends the Arcade home link (with Logo)
	 * if not already present in `items`.
	 */
	homeHref?: string;

	/**
	 * Custom accessible label for the Arcade home link.
	 * Defaults to the localized home label from `@arcade/lib-i18n` ('navigation.home').
	 */
	homeLabel?: string;

	/**
	 * Accessible name for the breadcrumb navigation landmark.
	 * Defaults to the localized string from `@arcade/lib-i18n` ('navigation.breadcrumb').
	 */
	'aria-label'?: string;

	/**
	 * Element ID referencing an accessible label for the navigation landmark.
	 */
	'aria-labelledby'?: string;
}

export type BreadcrumbProps<C extends ElementType = 'nav'> = BaseBreadcrumbProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseBreadcrumbProps<ElementType> | 'style'>;

export interface ProcessedBreadcrumbItem extends BreadcrumbItem {
	key: string;
	isCurrent: boolean;
	resolvedLabel: ReactNode;
}

export interface UseBreadcrumbOptions {
	items: BreadcrumbItem[];
	homeHref?: string;
	homeLabel?: string;
	'aria-label'?: string;
	'aria-labelledby'?: string;
}

export interface UseBreadcrumbReturn {
	items: ProcessedBreadcrumbItem[];
	resolvedAriaLabel?: string;
}
