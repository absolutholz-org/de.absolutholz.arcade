import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetMcDonalds: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.98 0.005 85), oklch(0.12 0.015 85))',
		'container-1': 'light-dark(oklch(0.94 0.01 85), oklch(0.18 0.02 85))',
		'container-2': 'light-dark(oklch(0.89 0.015 85), oklch(0.23 0.02 85))',
		'text-1': 'light-dark(oklch(0.2 0.01 85), oklch(0.95 0.005 85))',
		'text-2': 'light-dark(oklch(0.4 0.01 85), oklch(0.8 0.01 85))',
		'text-3': 'light-dark(oklch(0.49 0.01 85), oklch(0.65 0.015 85))',
		accent: 'light-dark(oklch(0.7 0.16 85), oklch(0.78 0.14 85))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 85), oklch(0.05 0.01 85))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.98 0.005 25), oklch(0.12 0.015 25))',
		'container-1': 'light-dark(oklch(0.94 0.01 25), oklch(0.18 0.02 25))',
		'container-2': 'light-dark(oklch(0.89 0.015 25), oklch(0.23 0.02 25))',
		'text-1': 'light-dark(oklch(0.2 0.01 25), oklch(0.95 0.005 25))',
		'text-2': 'light-dark(oklch(0.4 0.01 25), oklch(0.8 0.01 25))',
		'text-3': 'light-dark(oklch(0.49 0.01 25), oklch(0.65 0.015 25))',
		accent: 'light-dark(oklch(0.55 0.18 25), oklch(0.65 0.18 25))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 25), oklch(0.05 0.01 25))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.12 0.005 85), oklch(0.06 0 0))',
		'container-1': 'light-dark(oklch(0.18 0.01 85), oklch(0.14 0 0))',
		'container-2': 'light-dark(oklch(0.24 0.015 85), oklch(0.22 0 0))',
		'text-1': 'light-dark(oklch(0.98 0.005 85), oklch(1 0 0))',
		'text-2': 'light-dark(oklch(0.85 0.01 85), oklch(0.8 0 0))',
		'text-3': 'light-dark(oklch(0.7 0.015 85), oklch(0.607 0 0))',
		accent: 'light-dark(oklch(0.7 0.16 85), oklch(0.75 0.16 85))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 85), oklch(0.05 0.01 85))',
	},
	accent: {
		surface: 'light-dark(oklch(0.95 0.04 85), oklch(0.1 0.04 85))',
		'container-1': 'light-dark(oklch(0.9 0.04 85), oklch(0.16 0.05 85))',
		'container-2': 'light-dark(oklch(0.85 0.05 85), oklch(0.22 0.06 85))',
		'text-1': 'light-dark(oklch(0.15 0.04 85), oklch(0.96 0.02 85))',
		'text-2': 'light-dark(oklch(0.35 0.04 85), oklch(0.82 0.03 85))',
		'text-3': 'light-dark(oklch(0.46 0.04 85), oklch(0.68 0.03 85))',
		accent: 'light-dark(oklch(0.55 0.18 25), oklch(0.65 0.18 25))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 25), oklch(0.05 0.01 25))',
	},
};

export const themesetMcDonaldsProps =
	themesetToCssProperties(themesetMcDonalds);
export const themesetMcDonaldsCss = themesetToCssString(themesetMcDonalds);
