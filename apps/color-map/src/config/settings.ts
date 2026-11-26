import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import { type ColorMapSettings, DEFAULT_COLOR_MAP_SETTINGS } from '../engine/types';

export const COLOR_MAP_SETTINGS_CONFIG: GameSettingsConfig<ColorMapSettings> = {
	gameId: 'color-map',
	defaults: DEFAULT_COLOR_MAP_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: false },
	fields: [
		{
			key: 'highlightConflicts',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'color-map.settings.highlightConflicts.label',
				descriptionKey: 'color-map.settings.highlightConflicts.description',
			},
		},
		{
			key: 'showColorblindShapes',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'color-map.settings.showColorblindShapes.label',
				descriptionKey: 'color-map.settings.showColorblindShapes.description',
			},
		},
		{
			key: 'autoClearCandidates',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'color-map.settings.autoClearCandidates.label',
				descriptionKey: 'color-map.settings.autoClearCandidates.description',
			},
		},
	],
};
