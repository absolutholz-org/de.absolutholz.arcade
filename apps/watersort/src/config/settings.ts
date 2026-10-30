import type { GameSettingsConfig } from '@arcade/lib-ui';

export interface WaterSortSettings extends Record<string, unknown> {
	colorblindPatterns: boolean;
	fluidAnimations: boolean;
}

export const DEFAULT_WATERSORT_SETTINGS: WaterSortSettings = {
	colorblindPatterns: false,
	fluidAnimations: true,
};

export const WATERSORT_SETTINGS_CONFIG: GameSettingsConfig<WaterSortSettings> = {
	gameId: 'watersort',
	defaults: DEFAULT_WATERSORT_SETTINGS,
	fields: [
		{
			key: 'colorblindPatterns',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'watersort.settings.colorblindPatterns.label',
				descriptionKey: 'watersort.settings.colorblindPatterns.description',
			},
		},
		{
			key: 'fluidAnimations',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'watersort.settings.fluidAnimations.label',
				descriptionKey: 'watersort.settings.fluidAnimations.description',
			},
		},
	],
};
