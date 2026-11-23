import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import { DEFAULT_LASERS_SETTINGS, type LasersSettings } from '../engine/types';

export const LASERS_SETTINGS_CONFIG: GameSettingsConfig<LasersSettings> = {
	gameId: 'lasers',
	defaults: DEFAULT_LASERS_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: false },
	fields: [
		{
			key: 'showColorSymbols',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'lasers.settings.showColorSymbols.label',
				descriptionKey: 'lasers.settings.showColorSymbols.description',
			},
		},
		{
			key: 'showParCounter',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'lasers.settings.showParCounter.label',
				descriptionKey: 'lasers.settings.showParCounter.description',
			},
		},
	],
};
