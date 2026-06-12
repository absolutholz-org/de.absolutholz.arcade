import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetBase: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.98 0.005 250), oklch(0.12 0.015 250))',
		'container-1': 'light-dark(oklch(0.95 0.01 250), oklch(0.18 0.02 250))',
		'container-2': 'light-dark(oklch(0.9 0.015 250), oklch(0.24 0.02 250))',
		'text-1': 'light-dark(oklch(0.2 0.01 250), oklch(0.95 0.005 250))',
		'text-2': 'light-dark(oklch(0.4 0.01 250), oklch(0.8 0.01 250))',
		'text-3': 'light-dark(oklch(0.497 0.01 250), oklch(0.65 0.015 250))',
		accent: 'light-dark(oklch(0.6 0.18 250), oklch(0.7 0.16 250))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 250), oklch(0.05 0.01 250))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.98 0.005 280), oklch(0.12 0.015 280))',
		'container-1': 'light-dark(oklch(0.94 0.01 280), oklch(0.18 0.02 280))',
		'container-2': 'light-dark(oklch(0.89 0.015 280), oklch(0.23 0.02 280))',
		'text-1': 'light-dark(oklch(0.22 0.01 280), oklch(0.93 0.005 280))',
		'text-2': 'light-dark(oklch(0.42 0.01 280), oklch(0.78 0.01 280))',
		'text-3': 'light-dark(oklch(0.49 0.01 280), oklch(0.63 0.015 280))',
		accent: 'light-dark(oklch(0.55 0.18 280), oklch(0.68 0.16 280))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 280), oklch(0.05 0.01 280))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.15 0.015 250), oklch(0.05 0 0))',
		'container-1': 'light-dark(oklch(0.22 0.02 250), oklch(0.15 0 0))',
		'container-2': 'light-dark(oklch(0.28 0.02 250), oklch(0.22 0 0))',
		'text-1': 'light-dark(oklch(0.98 0.005 250), oklch(1 0 0))',
		'text-2': 'light-dark(oklch(0.85 0.01 250), oklch(0.8 0 0))',
		'text-3': 'light-dark(oklch(0.7 0.015 250), oklch(0.607 0 0))',
		accent: 'light-dark(oklch(0.7 0.16 250), oklch(0.8 0.15 260))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 250), oklch(0.05 0.01 260))',
	},
	accent: {
		surface: 'light-dark(oklch(0.94 0.03 250), oklch(0.1 0.04 250))',
		'container-1': 'light-dark(oklch(0.9 0.04 250), oklch(0.16 0.05 250))',
		'container-2': 'light-dark(oklch(0.85 0.05 250), oklch(0.22 0.06 250))',
		'text-1': 'light-dark(oklch(0.15 0.04 250), oklch(0.96 0.02 250))',
		'text-2': 'light-dark(oklch(0.35 0.04 250), oklch(0.82 0.03 250))',
		'text-3': 'light-dark(oklch(0.46 0.04 250), oklch(0.68 0.03 250))',
		accent: 'light-dark(oklch(0.52 0.22 250), oklch(0.75 0.18 250))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 250), oklch(0.05 0.01 250))',
	},
};

export const themesetBaseProps = themesetToCssProperties(themesetBase);
export const themesetBaseCss = themesetToCssString(themesetBase);
