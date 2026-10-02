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
} as const;

export type ThemeVars = typeof themeVars;
