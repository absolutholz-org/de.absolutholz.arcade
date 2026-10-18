/**
 * Visual status variants for toasts.
 */
export const TOAST_VARIANTS = ['info', 'success', 'warning', 'achievement'] as const;

/**
 * Screen placement options for the toast container host.
 */
export const TOAST_POSITIONS = [
	'top-right',
	'top-left',
	'bottom-right',
	'bottom-left',
	'top-center',
	'bottom-center',
] as const;

/**
 * Default auto-dismiss duration in milliseconds (7 seconds).
 * Meets the 6-8 seconds a11y requirement for reading and cognitive accessibility.
 */
export const DEFAULT_TOAST_DURATION = 7000;

/**
 * Default maximum number of visible toasts rendered concurrently.
 * Excess toasts wait in the sequential queue until earlier toasts are dismissed.
 */
export const DEFAULT_MAX_VISIBLE_TOASTS = 3;
