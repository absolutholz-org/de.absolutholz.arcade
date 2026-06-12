import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetOsu: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.98 0.002 25), oklch(0.12 0.005 25))',
		'container-1': 'light-dark(oklch(0.94 0.004 25), oklch(0.18 0.008 25))',
		'container-2': 'light-dark(oklch(0.89 0.006 25), oklch(0.23 0.01 25))',
		'text-1': 'light-dark(oklch(0.18 0.002 25), oklch(0.95 0.002 25))',
		'text-2': 'light-dark(oklch(0.38 0.003 25), oklch(0.8 0.003 25))',
		'text-3': 'light-dark(oklch(0.49 0.004 25), oklch(0.64 0.004 25))',
		accent: 'light-dark(oklch(0.55 0.22 25), oklch(0.62 0.22 25))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 25), oklch(0.05 0.01 25))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.98 0.002 25), oklch(0.12 0.005 25))',
		'container-1': 'light-dark(oklch(0.94 0.004 25), oklch(0.18 0.008 25))',
		'container-2': 'light-dark(oklch(0.89 0.006 25), oklch(0.23 0.01 25))',
		'text-1': 'light-dark(oklch(0.2 0.002 25), oklch(0.94 0.002 25))',
		'text-2': 'light-dark(oklch(0.4 0.003 25), oklch(0.79 0.003 25))',
		'text-3': 'light-dark(oklch(0.49 0.004 25), oklch(0.63 0.004 25))',
		accent: 'light-dark(oklch(0.548 0.01 25), oklch(0.65 0.01 25))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 25), oklch(0.05 0.01 25))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.12 0.005 25), oklch(0.06 0.002 25))',
		'container-1': 'light-dark(oklch(0.18 0.008 25), oklch(0.12 0.005 25))',
		'container-2': 'light-dark(oklch(0.24 0.01 25), oklch(0.18 0.008 25))',
		'text-1': 'light-dark(oklch(0.95 0.002 25), oklch(0.98 0.002 25))',
		'text-2': 'light-dark(oklch(0.8 0.003 25), oklch(0.85 0.003 25))',
		'text-3': 'light-dark(oklch(0.65 0.004 25), oklch(0.7 0.004 25))',
		accent: 'light-dark(oklch(0.55 0.22 25), oklch(0.62 0.22 25))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 25), oklch(0.05 0.01 25))',
	},
	accent: {
		surface: 'light-dark(oklch(0.95 0.02 25), oklch(0.14 0.02 25))',
		'container-1': 'light-dark(oklch(0.91 0.03 25), oklch(0.19 0.03 25))',
		'container-2': 'light-dark(oklch(0.85 0.04 25), oklch(0.25 0.04 25))',
		'text-1': 'light-dark(oklch(0.18 0.02 25), oklch(0.96 0.02 25))',
		'text-2': 'light-dark(oklch(0.38 0.02 25), oklch(0.82 0.02 25))',
		'text-3': 'light-dark(oklch(0.459 0.02 25), oklch(0.66 0.02 25))',
		accent: 'light-dark(oklch(0.548 0.01 25), oklch(0.65 0.01 25))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 25), oklch(0.05 0.01 25))',
	},
};

export const themesetOsuProps = themesetToCssProperties(themesetOsu);
export const themesetOsuCss = themesetToCssString(themesetOsu);
