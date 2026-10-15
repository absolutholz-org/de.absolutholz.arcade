import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { HashiSettings } from '../../engine/types.js';

export interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	settings: HashiSettings;
	onUpdateSettings: (settings: HashiSettings) => void;
	activeLanguage: SupportedLanguageCode;
	onLanguageChange: (lang: SupportedLanguageCode) => void;
}
