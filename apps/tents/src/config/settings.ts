import type { GameSettingsConfig } from '@arcade/lib-ui';

export interface TentsSettings extends Record<string, unknown> {
	autoGrass: boolean;
	highlightViolations: boolean;
	highlightClues: boolean;
}

export const DEFAULT_TENTS_SETTINGS: TentsSettings = {
	autoGrass: false,
	highlightViolations: true,
	highlightClues: true,
};

export const TENTS_SETTINGS_CONFIG: GameSettingsConfig<TentsSettings> = {
	gameId: 'tents',
	defaults: DEFAULT_TENTS_SETTINGS,
	fields: [
		{
			key: 'autoGrass',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'tents.settings.autoGrass.label',
				descriptionKey: 'tents.settings.autoGrass.description',
			},
		},
		{
			key: 'highlightViolations',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'tents.settings.highlightViolations.label',
				descriptionKey: 'tents.settings.highlightViolations.description',
			},
		},
		{
			key: 'highlightClues',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'tents.settings.highlightClues.label',
				descriptionKey: 'tents.settings.highlightClues.description',
			},
		},
	],
};
