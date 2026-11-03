import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';

export interface FloodItSettings extends Record<string, unknown> {
	showColorblindShapes: boolean;
	confirmRestart: boolean;
}

export const DEFAULT_FLOODIT_SETTINGS: FloodItSettings = {
	showColorblindShapes: false,
	confirmRestart: true,
};

export const FLOODIT_SETTINGS_CONFIG: GameSettingsConfig<FloodItSettings> = {
	gameId: 'floodit',
	defaults: DEFAULT_FLOODIT_SETTINGS,
	fields: [
		{
			key: 'showColorblindShapes',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'floodit.settings.showColorblindShapes.label',
				descriptionKey: 'floodit.settings.showColorblindShapes.description',
			},
		},
		{
			key: 'confirmRestart',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'floodit.settings.confirmRestart.label',
				descriptionKey: 'floodit.settings.confirmRestart.description',
			},
		},
	],
};
