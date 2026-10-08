/**
 * Allowed orientations for the Toolbar component in accordance with W3C WAI-ARIA APG.
 */
export const TOOLBAR_ORIENTATIONS = ['horizontal', 'vertical'] as const;

/**
 * Visual styling presets for the Toolbar container.
 */
export const TOOLBAR_VARIANTS = ['default', 'outline', 'elevated', 'ghost'] as const;

/**
 * Sizing presets dictating toolbar padding and control gaps.
 */
export const TOOLBAR_SIZES = ['sm', 'md', 'lg'] as const;

/**
 * Content alignment options along the toolbar's primary axis.
 */
export const TOOLBAR_ALIGNS = ['start', 'center', 'end', 'between'] as const;

/**
 * CSS selector matching all interactive focusable controls eligible for roving tabindex.
 */
export const TOOLBAR_FOCUSABLE_SELECTOR = [
	'button:not([disabled])',
	'a[href]',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[role="button"]:not([aria-disabled="true"])',
	'[role="checkbox"]:not([aria-disabled="true"])',
	'[role="switch"]:not([aria-disabled="true"])',
	'[role="menuitem"]:not([aria-disabled="true"])',
	'[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-disabled="true"])',
].join(', ');
