import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetStPatricks: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.97 0.015 140), oklch(0.14 0.03 140))',
		'container-1': 'light-dark(oklch(0.93 0.02 140), oklch(0.19 0.03 140))',
		'container-2': 'light-dark(oklch(0.88 0.03 140), oklch(0.24 0.04 140))',
		'text-1': 'light-dark(oklch(0.2 0.02 140), oklch(0.96 0.01 140))',
		'text-2': 'light-dark(oklch(0.38 0.02 140), oklch(0.8 0.015 140))',
		'text-3': 'light-dark(oklch(0.483 0.02 140), oklch(0.65 0.02 140))',
		accent: 'light-dark(oklch(0.55 0.18 140), oklch(0.65 0.18 140))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 140), oklch(0.05 0.01 140))',
		'accent-secondary': 'light-dark(oklch(0.65 0.16 80), oklch(0.72 0.14 80))',
		'accent-secondary-contrast':
			'light-dark(oklch(0.05 0.01 80), oklch(0.05 0.01 80))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.97 0.02 80), oklch(0.14 0.02 80))',
		'container-1': 'light-dark(oklch(0.93 0.03 80), oklch(0.19 0.03 80))',
		'container-2': 'light-dark(oklch(0.88 0.04 80), oklch(0.24 0.04 80))',
		'text-1': 'light-dark(oklch(0.2 0.02 80), oklch(0.95 0.02 80))',
		'text-2': 'light-dark(oklch(0.4 0.02 80), oklch(0.8 0.02 80))',
		'text-3': 'light-dark(oklch(0.482 0.02 80), oklch(0.64 0.02 80))',
		accent: 'light-dark(oklch(0.65 0.16 80), oklch(0.72 0.14 80))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 80), oklch(0.05 0.01 80))',
		'accent-secondary':
			'light-dark(oklch(0.55 0.18 140), oklch(0.65 0.18 140))',
		'accent-secondary-contrast':
			'light-dark(oklch(0.05 0.01 140), oklch(0.05 0.01 140))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.15 0.03 140), oklch(0.08 0.02 140))',
		'container-1': 'light-dark(oklch(0.22 0.04 140), oklch(0.14 0.03 140))',
		'container-2': 'light-dark(oklch(0.28 0.05 140), oklch(0.2 0.04 140))',
		'text-1': 'light-dark(oklch(0.96 0.01 140), oklch(0.98 0.01 140))',
		'text-2': 'light-dark(oklch(0.82 0.015 140), oklch(0.85 0.02 140))',
		'text-3': 'light-dark(oklch(0.68 0.02 140), oklch(0.7 0.02 140))',
		accent: 'light-dark(oklch(0.7 0.15 80), oklch(0.75 0.15 80))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 80), oklch(0.05 0.01 80))',
		'accent-secondary':
			'light-dark(oklch(0.55 0.18 140), oklch(0.65 0.18 140))',
		'accent-secondary-contrast':
			'light-dark(oklch(0.05 0.01 140), oklch(0.05 0.01 140))',
	},
	accent: {
		surface: 'light-dark(oklch(0.94 0.05 140), oklch(0.15 0.06 140))',
		'container-1': 'light-dark(oklch(0.9 0.07 140), oklch(0.2 0.08 140))',
		'container-2': 'light-dark(oklch(0.84 0.09 140), oklch(0.26 0.09 140))',
		'text-1': 'light-dark(oklch(0.18 0.06 140), oklch(0.97 0.03 140))',
		'text-2': 'light-dark(oklch(0.36 0.05 140), oklch(0.82 0.03 140))',
		'text-3': 'light-dark(oklch(0.455 0.04 140), oklch(0.68 0.03 140))',
		accent: 'light-dark(oklch(0.68 0.15 80), oklch(0.76 0.15 80))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 80), oklch(0.05 0.01 80))',
		'accent-secondary':
			'light-dark(oklch(0.55 0.18 140), oklch(0.65 0.18 140))',
		'accent-secondary-contrast':
			'light-dark(oklch(0.05 0.01 140), oklch(0.05 0.01 140))',
	},
};

export const themesetStPatricksProps =
	themesetToCssProperties(themesetStPatricks);
export const themesetStPatricksCss = themesetToCssString(themesetStPatricks);
