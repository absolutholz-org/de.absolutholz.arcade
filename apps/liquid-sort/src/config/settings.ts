import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';

export interface LiquidSortSettings extends Record<string, unknown> {
	colorblindPatterns: boolean;
	fluidAnimations: boolean;
}

export const DEFAULT_LIQUID_SORT_SETTINGS: LiquidSortSettings = {
	colorblindPatterns: false,
	fluidAnimations: true,
};

export const LIQUID_SORT_SETTINGS_CONFIG: GameSettingsConfig<LiquidSortSettings> = {
	gameId: 'liquid-sort',
	defaults: DEFAULT_LIQUID_SORT_SETTINGS,
	fields: [
		{
			key: 'colorblindPatterns',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'liquid-sort.settings.colorblindPatterns.label',
				descriptionKey: 'liquid-sort.settings.colorblindPatterns.description',
			},
		},
		{
			key: 'fluidAnimations',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'liquid-sort.settings.fluidAnimations.label',
				descriptionKey: 'liquid-sort.settings.fluidAnimations.description',
			},
		},
	],
};
