import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { TracksSettings } from '../../engine/types.js';

export interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	settings: TracksSettings;
	onUpdateSettings: (next: TracksSettings) => void;
	activeLanguage: SupportedLanguageCode;
	onLanguageChange: (lang: SupportedLanguageCode) => void;
}
