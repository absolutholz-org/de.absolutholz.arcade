export const SCHEME_OPTIONS = ['light', 'dark', 'system'] as const;

export const SCHEME_LABELS: Record<(typeof SCHEME_OPTIONS)[number], string> = {
	light: 'Light',
	dark: 'Dark',
	system: 'Sync with System',
} as const;

export const SCHEME_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const SCHEME_STORAGE_KEY = 'arcade::ui::scheme';
export const SCHEME_STORAGE_KEY_LEGACY = 'theme-scheme';
export const SCHEME_SWITCHER_NAME = 'scheme-switcher';
