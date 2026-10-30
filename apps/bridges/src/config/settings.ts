import type { GameSettingsConfig } from '@arcade/lib-ui';

export interface BridgesSettings extends Record<string, unknown> {
	zenMode: boolean;
	gameMode: 'standard' | 'zen';
	highlightSatisfied: boolean;
	highlightOverflow: boolean;
}

export const DEFAULT_BRIDGES_SETTINGS: BridgesSettings = {
	zenMode: false,
	gameMode: 'standard',
	highlightSatisfied: true,
	highlightOverflow: true,
};

export const BRIDGES_SETTINGS_CONFIG: GameSettingsConfig<BridgesSettings> = {
	gameId: 'bridges',
	defaults: DEFAULT_BRIDGES_SETTINGS,
	fields: [
		{
			key: 'zenMode',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'bridges.settings.zenMode.label',
				descriptionKey: 'bridges.settings.zenMode.description',
			},
		},
		{
			key: 'highlightSatisfied',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'bridges.settings.highlightSatisfied.label',
				descriptionKey: 'bridges.settings.highlightSatisfied.description',
			},
		},
		{
			key: 'highlightOverflow',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'bridges.settings.highlightOverflow.label',
				descriptionKey: 'bridges.settings.highlightOverflow.description',
			},
		},
	],
};
