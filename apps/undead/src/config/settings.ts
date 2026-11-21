import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import { DEFAULT_UNDEAD_SETTINGS, type UndeadSettings } from '../engine/types';

export const UNDEAD_SETTINGS_CONFIG: GameSettingsConfig<UndeadSettings> = {
	gameId: 'undead',
	defaults: DEFAULT_UNDEAD_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: true },
	fields: [
		{
			key: 'highlightErrors',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'undead.settings.highlightErrors.label',
				descriptionKey: 'undead.settings.highlightErrors.description',
			},
		},
		{
			key: 'showRayPreview',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'undead.settings.showRayPreview.label',
				descriptionKey: 'undead.settings.showRayPreview.description',
			},
		},
		{
			key: 'showClueProgress',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'undead.settings.showClueProgress.label',
				descriptionKey: 'undead.settings.showClueProgress.description',
			},
		},
		{
			key: 'autoMarkCompletedClues',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'undead.settings.autoMarkCompletedClues.label',
				descriptionKey: 'undead.settings.autoMarkCompletedClues.description',
			},
		},
	],
};
