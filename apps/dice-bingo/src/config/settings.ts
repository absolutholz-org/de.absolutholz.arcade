import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';

export interface DiceBingoSettings extends Record<string, unknown> {
	confirmRestart: boolean;
	highlightPotentialLines: boolean;
	showPointPreview: boolean;
}

export const DEFAULT_DICE_BINGO_SETTINGS: DiceBingoSettings = {
	confirmRestart: true,
	highlightPotentialLines: true,
	showPointPreview: true,
};

export const DICE_BINGO_SETTINGS_CONFIG: GameSettingsConfig<DiceBingoSettings> = {
	gameId: 'dice-bingo',
	defaults: DEFAULT_DICE_BINGO_SETTINGS,
	fields: [
		{
			key: 'confirmRestart',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'dice-bingo.settings.confirmRestart.label',
				descriptionKey: 'dice-bingo.settings.confirmRestart.description',
			},
		},
		{
			key: 'highlightPotentialLines',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'dice-bingo.settings.highlightPotentialLines.label',
				descriptionKey: 'dice-bingo.settings.highlightPotentialLines.description',
			},
		},
		{
			key: 'showPointPreview',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'dice-bingo.settings.showPointPreview.label',
				descriptionKey: 'dice-bingo.settings.showPointPreview.description',
			},
		},
	],
};
