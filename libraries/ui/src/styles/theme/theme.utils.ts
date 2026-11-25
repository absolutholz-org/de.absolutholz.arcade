import { themeVars } from './theme.css';
import type { ThemeColorKey, Themeset } from './theme.types';

export type { ThemeColorKey };

/**
 * Returns a type-safe CSS custom property variable for the given theme color key
 * backed by the global theme contract.
 * e.g. themeColor('surface') -> 'var(--color-surface)'
 */
export function themeColor(key: ThemeColorKey): string {
	return themeVars[key];
}

/**
 * Converts a Themeset object into a flat record of CSS custom properties.
 * e.g. { primary: { surface: 'red' } } -> { '--theme-primary-surface': 'red' }
 */
export function themesetToCssProperties(themeset: Themeset): Record<string, string> {
	const properties: Record<string, string> = {};
	for (const [themeName, themeObj] of Object.entries(themeset)) {
		if (!themeObj || typeof themeObj !== 'object') continue;
		for (const [variableName, val] of Object.entries(themeObj)) {
			if (typeof val === 'string') {
				properties[`--theme-${themeName}-${variableName}`] = val;
			}
		}
	}
	return properties;
}

/**
 * Converts a Themeset object into a raw CSS string of custom properties.
 * e.g. { primary: { surface: 'red' } } -> "--theme-primary-surface: red;\n"
 */
export function themesetToCssString(themeset: Themeset): string {
	const props = themesetToCssProperties(themeset);
	return Object.entries(props)
		.map(([key, val]) => `${key}: ${val};`)
		.join('\n');
}

/**
 * Generates the CSS custom property mapping from generic variables
 * (e.g. --color-surface) to concrete flat themeset variables (e.g. var(--theme-secondary-surface))
 * for a specific theme name block.
 */
export function getThemeMapping(themeName: keyof Themeset): Record<string, string> {
	return {
		'--color-surface': `var(--theme-${themeName}-surface)`,
		'--color-container-1': `var(--theme-${themeName}-container-1)`,
		'--color-container-2': `var(--theme-${themeName}-container-2)`,
		'--color-text-1': `var(--theme-${themeName}-text-1)`,
		'--color-text-2': `var(--theme-${themeName}-text-2)`,
		'--color-text-3': `var(--theme-${themeName}-text-3)`,
		'--color-accent': `var(--theme-${themeName}-accent)`,
		'--color-accent-contrast': `var(--theme-${themeName}-accent-contrast)`,
		'--color-accent-secondary': `var(--theme-${themeName}-accent-secondary)`,
		'--color-accent-secondary-contrast': `var(--theme-${themeName}-accent-secondary-contrast)`,
		'--color-rainbow-1': `var(--theme-${themeName}-rainbow-1)`,
		'--color-rainbow-2': `var(--theme-${themeName}-rainbow-2)`,
		'--color-rainbow-3': `var(--theme-${themeName}-rainbow-3)`,
		'--color-rainbow-4': `var(--theme-${themeName}-rainbow-4)`,
		'--color-rainbow-5': `var(--theme-${themeName}-rainbow-5)`,
		'--color-rainbow-6': `var(--theme-${themeName}-rainbow-6)`,
		'--color-rainbow-7': `var(--theme-${themeName}-rainbow-7)`,
		'--color-rainbow-8': `var(--theme-${themeName}-rainbow-8)`,
		'--color-rainbow-9': `var(--theme-${themeName}-rainbow-9)`,
		'--color-rainbow-10': `var(--theme-${themeName}-rainbow-10)`,
		'--color-rainbow-11': `var(--theme-${themeName}-rainbow-11)`,
		'--color-rainbow-12': `var(--theme-${themeName}-rainbow-12)`,
		'--color-status-success': `var(--theme-${themeName}-status-success)`,
		'--color-status-warning': `var(--theme-${themeName}-status-warning)`,
		'--color-status-danger': `var(--theme-${themeName}-status-danger)`,
		'--color-status-info': `var(--theme-${themeName}-status-info)`,
		'--color-medal-gold': `var(--theme-${themeName}-medal-gold)`,
		'--color-medal-silver': `var(--theme-${themeName}-medal-silver)`,
		'--color-medal-bronze': `var(--theme-${themeName}-medal-bronze)`,
	};
}
