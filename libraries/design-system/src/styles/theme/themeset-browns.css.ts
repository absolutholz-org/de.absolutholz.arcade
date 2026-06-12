import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetBrowns: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.97 0.008 40), oklch(0.12 0.01 40))',
		'container-1': 'light-dark(oklch(0.93 0.012 40), oklch(0.17 0.015 40))',
		'container-2': 'light-dark(oklch(0.88 0.018 40), oklch(0.22 0.02 40))',
		'text-1': 'light-dark(oklch(0.18 0.01 40), oklch(0.95 0.005 40))',
		'text-2': 'light-dark(oklch(0.38 0.01 40), oklch(0.8 0.01 40))',
		'text-3': 'light-dark(oklch(0.482 0.01 40), oklch(0.64 0.01 40))',
		accent: 'light-dark(oklch(0.6 0.2 50), oklch(0.65 0.18 50))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 50), oklch(0.05 0.01 50))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.98 0.005 40), oklch(0.12 0.01 40))',
		'container-1': 'light-dark(oklch(0.94 0.01 40), oklch(0.18 0.015 40))',
		'container-2': 'light-dark(oklch(0.89 0.015 40), oklch(0.23 0.02 40))',
		'text-1': 'light-dark(oklch(0.2 0.01 40), oklch(0.94 0.01 40))',
		'text-2': 'light-dark(oklch(0.4 0.01 40), oklch(0.79 0.01 40))',
		'text-3': 'light-dark(oklch(0.49 0.01 40), oklch(0.63 0.01 40))',
		accent: 'light-dark(oklch(0.35 0.08 40), oklch(0.45 0.08 40))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 40), oklch(0.98 0.01 40))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.12 0.01 40), oklch(0.06 0.005 40))',
		'container-1': 'light-dark(oklch(0.18 0.015 40), oklch(0.12 0.01 40))',
		'container-2': 'light-dark(oklch(0.24 0.02 40), oklch(0.18 0.015 40))',
		'text-1': 'light-dark(oklch(0.95 0.005 40), oklch(0.98 0.005 40))',
		'text-2': 'light-dark(oklch(0.8 0.01 40), oklch(0.85 0.01 40))',
		'text-3': 'light-dark(oklch(0.65 0.01 40), oklch(0.7 0.01 40))',
		accent: 'light-dark(oklch(0.6 0.2 50), oklch(0.65 0.18 50))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 50), oklch(0.05 0.01 50))',
	},
	accent: {
		surface: 'light-dark(oklch(0.95 0.04 45), oklch(0.14 0.04 45))',
		'container-1': 'light-dark(oklch(0.91 0.05 45), oklch(0.19 0.05 45))',
		'container-2': 'light-dark(oklch(0.85 0.07 45), oklch(0.25 0.06 45))',
		'text-1': 'light-dark(oklch(0.18 0.03 45), oklch(0.96 0.02 45))',
		'text-2': 'light-dark(oklch(0.38 0.03 45), oklch(0.82 0.02 45))',
		'text-3': 'light-dark(oklch(0.457 0.02 45), oklch(0.66 0.02 45))',
		accent: 'light-dark(oklch(0.35 0.08 40), oklch(0.45 0.08 40))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 40), oklch(0.98 0.01 40))',
	},
};

export const themesetBrownsProps = themesetToCssProperties(themesetBrowns);
export const themesetBrownsCss = themesetToCssString(themesetBrowns);
