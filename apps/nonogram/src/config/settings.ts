import type { GameSettingsConfig } from '@arcade/lib-ui';

export interface NonogramSettings extends Record<string, unknown> {
	autoCross: boolean;
}

export const DEFAULT_NONOGRAM_SETTINGS: NonogramSettings = {
	autoCross: false,
};

export const NONOGRAM_SETTINGS_CONFIG: GameSettingsConfig<NonogramSettings> = {
	gameId: 'nonogram',
	defaults: DEFAULT_NONOGRAM_SETTINGS,
	fields: [
		{
			key: 'autoCross',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'nonogram.settings.autoCross.label',
				descriptionKey: 'nonogram.settings.autoCross.description',
			},
		},
	],
};
