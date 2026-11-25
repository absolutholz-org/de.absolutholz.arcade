import type { Theme, Themeset } from './theme.types.js';
import { themesetToCssProperties, themesetToCssString } from './theme.utils.js';

/**
 * 12-color accessible rainbow palette ordered by perceptual separation (4 -> 6 -> 8 -> 12).
 * All values are sRGB-gamut-safe OKLCH coordinates with >= 4.5:1 contrast against surface/container-1.
 */
const rainbowBase: Partial<Theme> = {
	'rainbow-1': 'light-dark(oklch(0.52 0.21 25), oklch(0.7 0.19 25))',
	'rainbow-2': 'light-dark(oklch(0.5 0.16 255), oklch(0.72 0.14 255))',
	'rainbow-3': 'light-dark(oklch(0.5 0.14 148), oklch(0.74 0.17 148))',
	'rainbow-4': 'light-dark(oklch(0.52 0.1 85), oklch(0.78 0.15 85))',
	'rainbow-5': 'light-dark(oklch(0.5 0.2 300), oklch(0.72 0.17 300))',
	'rainbow-6': 'light-dark(oklch(0.49 0.08 195), oklch(0.75 0.12 195))',
	'rainbow-7': 'light-dark(oklch(0.52 0.13 52), oklch(0.74 0.17 52))',
	'rainbow-8': 'light-dark(oklch(0.51 0.2 345), oklch(0.73 0.2 345))',
	'rainbow-9': 'light-dark(oklch(0.5 0.12 122), oklch(0.77 0.15 122))',
	'rainbow-10': 'light-dark(oklch(0.48 0.2 275), oklch(0.7 0.15 275))',
	'rainbow-11': 'light-dark(oklch(0.5 0.2 5), oklch(0.71 0.19 5))',
	'rainbow-12': 'light-dark(oklch(0.49 0.09 225), oklch(0.74 0.14 225))',
};

/**
 * Contrast theme uses dark surfaces in both light and dark color schemes,
 * so rainbow tokens use high-lightness coordinates in both modes.
 */
const rainbowContrast: Partial<Theme> = {
	'rainbow-1': 'light-dark(oklch(0.7 0.19 25), oklch(0.7 0.19 25))',
	'rainbow-2': 'light-dark(oklch(0.72 0.14 255), oklch(0.72 0.14 255))',
	'rainbow-3': 'light-dark(oklch(0.74 0.17 148), oklch(0.74 0.17 148))',
	'rainbow-4': 'light-dark(oklch(0.78 0.15 85), oklch(0.78 0.15 85))',
	'rainbow-5': 'light-dark(oklch(0.72 0.17 300), oklch(0.72 0.17 300))',
	'rainbow-6': 'light-dark(oklch(0.75 0.12 195), oklch(0.75 0.12 195))',
	'rainbow-7': 'light-dark(oklch(0.74 0.17 52), oklch(0.74 0.17 52))',
	'rainbow-8': 'light-dark(oklch(0.73 0.2 345), oklch(0.73 0.2 345))',
	'rainbow-9': 'light-dark(oklch(0.77 0.15 122), oklch(0.77 0.15 122))',
	'rainbow-10': 'light-dark(oklch(0.7 0.15 275), oklch(0.7 0.15 275))',
	'rainbow-11': 'light-dark(oklch(0.71 0.19 5), oklch(0.71 0.19 5))',
	'rainbow-12': 'light-dark(oklch(0.74 0.14 225), oklch(0.74 0.14 225))',
};

/**
 * Semantic status tokens using OKLCH and native light-dark() (BASE-11).
 */
const statusBase: Partial<Theme> = {
	'status-success': 'light-dark(oklch(0.42 0.14 148), oklch(0.76 0.15 148))',
	'status-warning': 'light-dark(oklch(0.44 0.12 75), oklch(0.82 0.14 78))',
	'status-danger': 'light-dark(oklch(0.46 0.19 25), oklch(0.76 0.17 25))',
	'status-info': 'light-dark(oklch(0.44 0.14 245), oklch(0.76 0.14 245))',
};

/**
 * Contrast theme uses dark surfaces in both light and dark color schemes,
 * so status tokens use dark-surface-friendly coordinates in both modes.
 */
const statusContrast: Partial<Theme> = {
	'status-success': 'light-dark(oklch(0.76 0.15 148), oklch(0.76 0.15 148))',
	'status-warning': 'light-dark(oklch(0.82 0.14 78), oklch(0.82 0.14 78))',
	'status-danger': 'light-dark(oklch(0.76 0.17 25), oklch(0.76 0.17 25))',
	'status-info': 'light-dark(oklch(0.76 0.14 245), oklch(0.76 0.14 245))',
};

const themesetBase: Themeset = {
	primary: {
		surface: 'light-dark(oklch(0.98 0.005 250), oklch(0.12 0.015 250))',
		'container-1': 'light-dark(oklch(0.95 0.01 250), oklch(0.18 0.02 250))',
		'container-2': 'light-dark(oklch(0.9 0.015 250), oklch(0.24 0.02 250))',
		'text-1': 'light-dark(oklch(0.2 0.01 250), oklch(0.95 0.005 250))',
		'text-2': 'light-dark(oklch(0.4 0.01 250), oklch(0.8 0.01 250))',
		'text-3': 'light-dark(oklch(0.497 0.01 250), oklch(0.65 0.015 250))',
		accent: 'light-dark(oklch(0.52 0.2 250), oklch(0.7 0.16 250))',
		'accent-contrast': 'light-dark(oklch(0.98 0.01 250), oklch(0.05 0.01 250))',
		'accent-secondary': 'light-dark(oklch(0.55 0.18 280), oklch(0.68 0.16 280))',
		'accent-secondary-contrast': 'light-dark(oklch(0.98 0.01 280), oklch(0.05 0.01 280))',
		...rainbowBase,
		...statusBase,
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
		'accent-secondary': 'light-dark(oklch(0.6 0.18 250), oklch(0.7 0.16 250))',
		'accent-secondary-contrast': 'light-dark(oklch(0.05 0.01 250), oklch(0.05 0.01 250))',
		...rainbowBase,
		...statusBase,
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
		'accent-secondary': 'light-dark(oklch(0.55 0.18 280), oklch(0.68 0.16 280))',
		'accent-secondary-contrast': 'light-dark(oklch(0.98 0.01 280), oklch(0.05 0.01 280))',
		...rainbowContrast,
		...statusContrast,
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
		'accent-secondary': 'light-dark(oklch(0.55 0.18 280), oklch(0.68 0.16 280))',
		'accent-secondary-contrast': 'light-dark(oklch(0.98 0.01 280), oklch(0.05 0.01 280))',
		...rainbowBase,
		...statusBase,
	},
};

export const themesetBaseProps = themesetToCssProperties(themesetBase);
export const themesetBaseCss = themesetToCssString(themesetBase);
