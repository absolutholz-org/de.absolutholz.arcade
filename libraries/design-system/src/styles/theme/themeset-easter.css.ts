import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetEaster: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.98 0.01 300), oklch(0.12 0.02 300))',
		'container-1': 'light-dark(oklch(0.95 0.02 300), oklch(0.17 0.03 300))',
		'container-2': 'light-dark(oklch(0.9 0.03 300), oklch(0.22 0.04 300))',
		'text-1': 'light-dark(oklch(0.2 0.02 300), oklch(0.95 0.01 300))',
		'text-2': 'light-dark(oklch(0.4 0.02 300), oklch(0.8 0.02 300))',
		'text-3': 'light-dark(oklch(0.497 0.02 300), oklch(0.65 0.02 300))',
		accent: 'light-dark(oklch(0.85 0.18 90), oklch(0.88 0.16 90))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 90), oklch(0.05 0.01 90))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.97 0.02 150), oklch(0.12 0.02 150))',
		'container-1': 'light-dark(oklch(0.94 0.03 150), oklch(0.17 0.03 150))',
		'container-2': 'light-dark(oklch(0.89 0.04 150), oklch(0.22 0.04 150))',
		'text-1': 'light-dark(oklch(0.2 0.02 150), oklch(0.95 0.02 150))',
		'text-2': 'light-dark(oklch(0.4 0.02 150), oklch(0.8 0.02 150))',
		'text-3': 'light-dark(oklch(0.491 0.02 150), oklch(0.65 0.02 150))',
		accent: 'light-dark(oklch(0.72 0.15 45), oklch(0.78 0.14 45))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 45), oklch(0.05 0.01 45))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.12 0.02 300), oklch(0.1 0.04 300))',
		'container-1': 'light-dark(oklch(0.18 0.03 300), oklch(0.16 0.05 300))',
		'container-2': 'light-dark(oklch(0.24 0.04 300), oklch(0.22 0.06 300))',
		'text-1': 'light-dark(oklch(0.96 0.01 300), oklch(0.98 0.01 300))',
		'text-2': 'light-dark(oklch(0.82 0.02 300), oklch(0.85 0.02 300))',
		'text-3': 'light-dark(oklch(0.68 0.02 300), oklch(0.7 0.02 300))',
		accent: 'light-dark(oklch(0.88 0.16 90), oklch(0.86 0.18 110))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 90), oklch(0.05 0.01 110))',
	},
	accent: {
		surface: 'light-dark(oklch(0.97 0.02 350), oklch(0.12 0.02 350))',
		'container-1': 'light-dark(oklch(0.94 0.03 350), oklch(0.17 0.03 350))',
		'container-2': 'light-dark(oklch(0.89 0.04 350), oklch(0.22 0.04 350))',
		'text-1': 'light-dark(oklch(0.2 0.02 350), oklch(0.96 0.02 350))',
		'text-2': 'light-dark(oklch(0.4 0.02 350), oklch(0.8 0.02 350))',
		'text-3': 'light-dark(oklch(0.488 0.02 350), oklch(0.65 0.02 350))',
		accent: 'light-dark(oklch(0.6 0.22 340), oklch(0.7 0.2 340))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 340), oklch(0.05 0.01 340))',
	},
};

export const themesetEasterProps = themesetToCssProperties(themesetEaster);
export const themesetEasterCss = themesetToCssString(themesetEaster);
