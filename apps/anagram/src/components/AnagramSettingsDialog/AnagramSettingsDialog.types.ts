import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export interface AnagramSettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	activeLanguage: SupportedLanguageCode;
	onLanguageChange: (lang: SupportedLanguageCode) => void;
}
