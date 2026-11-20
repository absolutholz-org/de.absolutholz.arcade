import type { MouseEventHandler, ReactNode } from 'react';
import type { BADGE_ELEMENTS, BADGE_SIZES, BADGE_TONES, BADGE_VARIANTS } from './_Badge.constants';

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeTone = (typeof BADGE_TONES)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];
export type BadgeElement = (typeof BADGE_ELEMENTS)[number];

interface BadgeBaseProps {
	/** Surface treatment: subtle tint, solid high-emphasis, outline, or dashed (paused/blocked/skipped). */
	variant?: BadgeVariant;
	/** Semantic color tone backed by root OKLCH light-dark() tokens. */
	tone?: BadgeTone;
	/** Scale preset (interactive variants enforce WCAG 2.2 AA touch target minimums). */
	size?: BadgeSize;
	/** Decorative icon rendered before the label (wrapped in aria-hidden="true"). */
	leadingIcon?: ReactNode;
	/** Decorative icon rendered after the label (wrapped in aria-hidden="true"). */
	trailingIcon?: ReactNode;
	/** Enables font-variant-numeric: tabular-nums for counters, scores, and history rolls. */
	tabular?: boolean;
	/** Optional visual class hook (no inline `style` prop allowed). */
	className?: string;
	id?: string;
	/** Visible badge label or content. */
	children?: ReactNode;
}

export interface StaticBadgeProps extends BadgeBaseProps {
	as?: 'span';
	/**
	 * Accessible replacement text for terse static badges (e.g. "H" -> "Heads", "12" -> "Roll: 12 (6, 6)").
	 * Renders visible children with aria-hidden="true" alongside <VisuallyHidden>,
	 * avoiding prohibited aria-label on plain <span> elements.
	 */
	screenReaderLabel?: string;
	'aria-hidden'?: boolean;
}

export interface ButtonBadgeProps extends BadgeBaseProps {
	as: 'button';
	type?: 'button' | 'submit' | 'reset';
	/** Toggle state; maps directly to native aria-pressed and active pressed styling. */
	pressed?: boolean;
	/** Native disabled state (removes from tab order). */
	disabled?: boolean;
	/** Keeps control focusable in toolbars/groups while blocking activation in JS. */
	ariaDisabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	'aria-controls'?: string;
	'aria-expanded'?: boolean;
	title?: string;
}

export interface LinkBadgeProps extends BadgeBaseProps {
	as: 'a';
	href: string;
	/** Maps to native aria-current for active taxonomy/navigation badges. */
	current?: boolean | 'page' | 'step' | 'location';
	target?: '_self' | '_blank';
	rel?: string;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	title?: string;
}

export type BadgeProps = StaticBadgeProps | ButtonBadgeProps | LinkBadgeProps;
