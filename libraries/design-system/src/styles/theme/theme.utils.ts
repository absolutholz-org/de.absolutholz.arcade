import type { Themeset } from './theme.types';

/**
 * Converts a Themeset object into a flat record of CSS custom properties.
 * e.g. { primary: { surface: 'red' } } -> { '--theme-primary-surface': 'red' }
 */
export function themesetToCssProperties(
	themeset: Themeset,
): Record<string, string> {
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
export function getThemeMapping(
	themeName: keyof Themeset,
): Record<string, string> {
	return {
		'--color-surface': `var(--theme-${themeName}-surface)`,
		'--color-container-1': `var(--theme-${themeName}-container-1)`,
		'--color-container-2': `var(--theme-${themeName}-container-2)`,
		'--color-text-1': `var(--theme-${themeName}-text-1)`,
		'--color-text-2': `var(--theme-${themeName}-text-2)`,
		'--color-text-3': `var(--theme-${themeName}-text-3)`,
		'--color-accent': `var(--theme-${themeName}-accent)`,
		'--color-accent-contrast': `var(--theme-${themeName}-accent-contrast)`,
	};
}
