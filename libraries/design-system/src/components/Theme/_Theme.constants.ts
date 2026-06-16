export const THEME_NAMES = [
	'primary',
	'secondary',
	'contrast',
	'accent',
] as const;
export const DEFAULT_THEME_NAME: (typeof THEME_NAMES)[number] = 'primary';
