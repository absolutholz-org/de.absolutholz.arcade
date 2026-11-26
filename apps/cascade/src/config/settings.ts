import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import { type CascadeSettings, DEFAULT_CASCADE_SETTINGS } from '../engine/types';

export const CASCADE_SETTINGS_CONFIG: GameSettingsConfig<CascadeSettings> = {
	gameId: 'cascade',
	defaults: DEFAULT_CASCADE_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: false },
	fields: [
		{
			key: 'showTileSymbols',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'cascade.settings.showTileSymbols.label',
				descriptionKey: 'cascade.settings.showTileSymbols.description',
			},
		},
		{
			key: 'showTileShapes',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'cascade.settings.showTileShapes.label',
				descriptionKey: 'cascade.settings.showTileShapes.description',
			},
		},
		{
			key: 'showHoverPreview',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'cascade.settings.showHoverPreview.label',
				descriptionKey: 'cascade.settings.showHoverPreview.description',
			},
		},
	],
};
