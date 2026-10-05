export const SUPPORTED_LANGUAGES = [
	{ code: 'en', flag: '🇺🇸', label: 'English' },
	{ code: 'de', flag: '🇩🇪', label: 'Deutsch' },
	{ code: 'fr', flag: '🇫🇷', label: 'Français' },
	{ code: 'pt', flag: '🇧🇷', label: 'Português' },
] as const;

export const DEFAULT_LANGUAGE = 'en' as const;

export const LANGUAGE_STORAGE_KEY = 'arcade::i18n::language' as const;
