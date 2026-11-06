import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';

export interface ColorFloodSettings extends Record<string, unknown> {
	showColorblindShapes: boolean;
	confirmRestart: boolean;
}

export const DEFAULT_COLOR_FLOOD_SETTINGS: ColorFloodSettings = {
	showColorblindShapes: false,
	confirmRestart: true,
};

export const COLOR_FLOOD_SETTINGS_CONFIG: GameSettingsConfig<ColorFloodSettings> = {
	gameId: 'color-flood',
	defaults: DEFAULT_COLOR_FLOOD_SETTINGS,
	fields: [
		{
			key: 'showColorblindShapes',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'color-flood.settings.showColorblindShapes.label',
				descriptionKey: 'color-flood.settings.showColorblindShapes.description',
			},
		},
		{
			key: 'confirmRestart',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'color-flood.settings.confirmRestart.label',
				descriptionKey: 'color-flood.settings.confirmRestart.description',
			},
		},
	],
};
