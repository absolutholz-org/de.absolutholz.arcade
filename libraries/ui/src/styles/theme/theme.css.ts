/**
 * Global theme contract defining the Tier 2 generic functional variables (The App API).
 * Maps token keys directly to standard CSS variable references (e.g., 'var(--color-surface)').
 * This allows apps and components to read generic tokens without runtime CSS-in-JS overhead.
 */
export const themeVars = {
	surface: 'var(--color-surface)',
	'container-1': 'var(--color-container-1)',
	'container-2': 'var(--color-container-2)',
	'text-1': 'var(--color-text-1)',
	'text-2': 'var(--color-text-2)',
	'text-3': 'var(--color-text-3)',
	accent: 'var(--color-accent)',
	'accent-contrast': 'var(--color-accent-contrast)',
	'accent-secondary': 'var(--color-accent-secondary)',
	'accent-secondary-contrast': 'var(--color-accent-secondary-contrast)',
	'rainbow-1': 'var(--color-rainbow-1)',
	'rainbow-2': 'var(--color-rainbow-2)',
	'rainbow-3': 'var(--color-rainbow-3)',
	'rainbow-4': 'var(--color-rainbow-4)',
	'rainbow-5': 'var(--color-rainbow-5)',
	'rainbow-6': 'var(--color-rainbow-6)',
	'rainbow-7': 'var(--color-rainbow-7)',
	'rainbow-8': 'var(--color-rainbow-8)',
	'rainbow-9': 'var(--color-rainbow-9)',
	'rainbow-10': 'var(--color-rainbow-10)',
	'rainbow-11': 'var(--color-rainbow-11)',
	'rainbow-12': 'var(--color-rainbow-12)',
	'status-success': 'var(--color-status-success)',
	'status-warning': 'var(--color-status-warning)',
	'status-danger': 'var(--color-status-danger)',
	'status-info': 'var(--color-status-info)',
} as const;

export type ThemeVars = typeof themeVars;
