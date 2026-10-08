import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { GameSettings } from '../../engine/types';

export interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	settings: GameSettings;
	onUpdateSettings: (settings: GameSettings) => void;
	activeLanguage?: SupportedLanguageCode;
	onLanguageChange?: (language: SupportedLanguageCode) => void;
}
