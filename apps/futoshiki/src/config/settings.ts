import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import { DEFAULT_FUTOSHIKI_SETTINGS, type FutoshikiSettings } from '../engine/types';

export const FUTOSHIKI_SETTINGS_CONFIG: GameSettingsConfig<FutoshikiSettings> = {
	gameId: 'futoshiki',
	defaults: DEFAULT_FUTOSHIKI_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: false },
	fields: [
		{
			key: 'highlightPeerCells',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'futoshiki.settings.highlightPeerCells.label',
				descriptionKey: 'futoshiki.settings.highlightPeerCells.description',
			},
		},
		{
			key: 'highlightPeerDigits',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'futoshiki.settings.highlightPeerDigits.label',
				descriptionKey: 'futoshiki.settings.highlightPeerDigits.description',
			},
		},
		{
			key: 'highlightErrors',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'futoshiki.settings.highlightErrors.label',
				descriptionKey: 'futoshiki.settings.highlightErrors.description',
			},
		},
		{
			key: 'autoClearNotes',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'futoshiki.settings.autoClearNotes.label',
				descriptionKey: 'futoshiki.settings.autoClearNotes.description',
			},
		},
	],
};
