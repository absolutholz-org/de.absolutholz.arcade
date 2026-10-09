import type { Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

const themesetHalloween: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.97 0.01 45), oklch(0.12 0.018 300))',
		'container-1': 'light-dark(oklch(0.93 0.015 45), oklch(0.17 0.025 300))',
		'container-2': 'light-dark(oklch(0.88 0.02 45), oklch(0.23 0.03 300))',
		'text-1': 'light-dark(oklch(0.18 0.015 300), oklch(0.96 0.008 45))',
		'text-2': 'light-dark(oklch(0.38 0.015 300), oklch(0.8 0.01 45))',
		'text-3': 'light-dark(oklch(0.485 0.015 300), oklch(0.65 0.012 45))',
		accent: 'light-dark(oklch(0.62 0.21 45), oklch(0.68 0.22 45))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 45), oklch(0.05 0.01 45))',
		'accent-secondary': 'light-dark(oklch(0.5 0.22 305), oklch(0.66 0.2 305))',
		'accent-secondary-contrast': 'light-dark(oklch(0.98 0.01 305), oklch(0.05 0.01 305))',
	},
	secondary: {
		surface: 'light-dark(oklch(0.98 0.01 305), oklch(0.13 0.02 305))',
		'container-1': 'light-dark(oklch(0.94 0.015 305), oklch(0.18 0.025 305))',
		'container-2': 'light-dark(oklch(0.89 0.02 305), oklch(0.23 0.03 305))',
		'text-1': 'light-dark(oklch(0.2 0.015 305), oklch(0.95 0.01 305))',
		'text-2': 'light-dark(oklch(0.4 0.015 305), oklch(0.79 0.01 305))',
		'text-3': 'light-dark(oklch(0.49 0.015 305), oklch(0.64 0.01 305))',
		accent: 'light-dark(oklch(0.5 0.22 305), oklch(0.66 0.2 305))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 305), oklch(0.05 0.01 305))',
		'accent-secondary': 'light-dark(oklch(0.62 0.21 45), oklch(0.68 0.22 45))',
		'accent-secondary-contrast': 'light-dark(oklch(0.05 0.01 45), oklch(0.05 0.01 45))',
	},
	contrast: {
		surface: 'light-dark(oklch(0.12 0.015 300), oklch(0.06 0.01 300))',
		'container-1': 'light-dark(oklch(0.18 0.02 300), oklch(0.12 0.015 300))',
		'container-2': 'light-dark(oklch(0.24 0.025 300), oklch(0.18 0.02 300))',
		'text-1': 'light-dark(oklch(0.95 0.005 45), oklch(0.98 0.005 45))',
		'text-2': 'light-dark(oklch(0.8 0.01 45), oklch(0.85 0.01 45))',
		'text-3': 'light-dark(oklch(0.65 0.01 45), oklch(0.7 0.01 45))',
		accent: 'light-dark(oklch(0.65 0.22 45), oklch(0.72 0.22 45))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 45), oklch(0.05 0.01 45))',
		'accent-secondary': 'light-dark(oklch(0.55 0.22 305), oklch(0.7 0.2 305))',
		'accent-secondary-contrast': 'light-dark(oklch(0.98 0.01 305), oklch(0.05 0.01 305))',
	},
	accent: {
		surface: 'light-dark(oklch(0.95 0.03 45), oklch(0.14 0.035 45))',
		'container-1': 'light-dark(oklch(0.91 0.04 45), oklch(0.19 0.045 45))',
		'container-2': 'light-dark(oklch(0.85 0.05 45), oklch(0.25 0.055 45))',
		'text-1': 'light-dark(oklch(0.18 0.025 45), oklch(0.96 0.015 45))',
		'text-2': 'light-dark(oklch(0.38 0.025 45), oklch(0.82 0.015 45))',
		'text-3': 'light-dark(oklch(0.46 0.02 45), oklch(0.67 0.015 45))',
		accent: 'light-dark(oklch(0.62 0.21 45), oklch(0.68 0.22 45))',
		'accent-contrast': 'light-dark(oklch(0.05 0.01 45), oklch(0.05 0.01 45))',
		'accent-secondary': 'light-dark(oklch(0.5 0.22 305), oklch(0.66 0.2 305))',
		'accent-secondary-contrast': 'light-dark(oklch(0.98 0.01 305), oklch(0.05 0.01 305))',
	},
};

export const themesetHalloweenProps = themesetToCssProperties(themesetHalloween);
export const themesetHalloweenCss = themesetToCssString(themesetHalloween);
