import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetClient2: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.97 0.005 40), oklch(0.12 0.01 40))',
		'container-1': 'light-dark(oklch(0.93 0.01 40), oklch(0.17 0.015 40))',
		'container-2': 'light-dark(oklch(0.88 0.015 40), oklch(0.23 0.02 40))',
		'text-1': 'light-dark(oklch(0.18 0.01 40), oklch(0.95 0.005 40))',
		'text-2': 'light-dark(oklch(0.38 0.01 40), oklch(0.8 0.01 40))',
		'text-3': 'light-dark(oklch(0.55 0.01 40), oklch(0.64 0.01 40))',
		accent: 'light-dark(oklch(0.58 0.16 40), oklch(0.68 0.16 40))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.97 0.01 90), oklch(0.12 0.015 90))',
		'container-1': 'light-dark(oklch(0.93 0.015 90), oklch(0.17 0.02 90))',
		'container-2': 'light-dark(oklch(0.88 0.02 90), oklch(0.22 0.025 90))',
		'text-1': 'light-dark(oklch(0.2 0.015 90), oklch(0.94 0.01 90))',
		'text-2': 'light-dark(oklch(0.4 0.01 90), oklch(0.79 0.01 90))',
		'text-3': 'light-dark(oklch(0.58 0.01 90), oklch(0.63 0.01 90))',
		accent: 'light-dark(oklch(0.62 0.13 80), oklch(0.72 0.13 80))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.12 0.01 40), oklch(0.06 0.005 40))',
		'container-1': 'light-dark(oklch(0.18 0.015 40), oklch(0.12 0.01 40))',
		'container-2': 'light-dark(oklch(0.24 0.02 40), oklch(0.18 0.015 40))',
		'text-1': 'light-dark(oklch(0.95 0.005 40), oklch(0.98 0.005 40))',
		'text-2': 'light-dark(oklch(0.8 0.01 40), oklch(0.85 0.01 40))',
		'text-3': 'light-dark(oklch(0.65 0.01 40), oklch(0.7 0.01 40))',
		accent: 'light-dark(oklch(0.68 0.16 40), oklch(0.75 0.15 75))',
	},
	accent: {
		surface: 'light-dark(oklch(0.95 0.04 45), oklch(0.14 0.04 45))',
		'container-1': 'light-dark(oklch(0.91 0.05 45), oklch(0.19 0.05 45))',
		'container-2': 'light-dark(oklch(0.85 0.07 45), oklch(0.25 0.06 45))',
		'text-1': 'light-dark(oklch(0.18 0.03 45), oklch(0.96 0.02 45))',
		'text-2': 'light-dark(oklch(0.38 0.03 45), oklch(0.82 0.02 45))',
		'text-3': 'light-dark(oklch(0.55 0.02 45), oklch(0.66 0.02 45))',
		accent: 'light-dark(oklch(0.62 0.18 50), oklch(0.72 0.18 50))',
	},
};

export const themesetClient2Props = themesetToCssProperties(themesetClient2);
export const themesetClient2Css = themesetToCssString(themesetClient2);
