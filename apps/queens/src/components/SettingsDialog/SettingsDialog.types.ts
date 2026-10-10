import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { GameSettings } from '../../engine/types.js';

export interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	settings: GameSettings;
	onUpdateSettings: (next: GameSettings) => void;
	activeLanguage: SupportedLanguageCode;
	onLanguageChange: (lang: SupportedLanguageCode) => void;
}
