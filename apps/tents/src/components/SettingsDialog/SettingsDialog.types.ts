import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { TentsSettings } from '../../engine/types.ts';

export interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	settings: TentsSettings;
	onUpdateSettings: (next: TentsSettings) => void;
	activeLanguage: SupportedLanguageCode;
	onLanguageChange: (lang: SupportedLanguageCode) => void;
}
