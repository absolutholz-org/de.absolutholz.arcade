export type Theme = {
	surface?: string;
	'container-1'?: string;
	'container-2'?: string;
	'text-1'?: string;
	'text-2'?: string;
	'text-3'?: string;
	accent?: string;
	'accent-contrast'?: string;
	'accent-secondary'?: string;
	'accent-secondary-contrast'?: string;
	'rainbow-1'?: string;
	'rainbow-2'?: string;
	'rainbow-3'?: string;
	'rainbow-4'?: string;
	'rainbow-5'?: string;
	'rainbow-6'?: string;
	'rainbow-7'?: string;
	'rainbow-8'?: string;
	'rainbow-9'?: string;
	'rainbow-10'?: string;
	'rainbow-11'?: string;
	'rainbow-12'?: string;
};

export type ThemeColorKey = keyof Required<Theme>;

export type Themeset = {
	primary: Theme;
	secondary?: Theme;
	contrast?: Theme;
	accent?: Theme;
};

export type { ThemesetId } from './theme.constants.js';
