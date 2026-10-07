import { STORAGE_KEYS } from '../../constants/storage';

export { STORAGE_KEYS };

export const SCHEME_OPTIONS = ['light', 'dark', 'system'] as const;

export const SCHEME_STORAGE_KEY = STORAGE_KEYS.SCHEME;
export const SCHEME_STORAGE_KEY_LEGACY = 'theme-scheme';
export const SCHEME_SWITCHER_NAME = 'scheme-switcher';
