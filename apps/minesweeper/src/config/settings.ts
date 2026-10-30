import type { GameSettingsConfig } from '@arcade/lib-ui';

export interface MinesweeperSettings extends Record<string, unknown> {
	questionMarks: boolean;
	firstClickSafe: boolean;
	fitToScreen: boolean;
}

export const DEFAULT_MINESWEEPER_SETTINGS: MinesweeperSettings = {
	questionMarks: false,
	firstClickSafe: true,
	fitToScreen: true,
};

export const MINESWEEPER_SETTINGS_CONFIG: GameSettingsConfig<MinesweeperSettings> = {
	gameId: 'minesweeper',
	defaults: DEFAULT_MINESWEEPER_SETTINGS,
	fields: [
		{
			key: 'firstClickSafe',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'minesweeper.settings.firstClickSafe.label',
				descriptionKey: 'minesweeper.settings.firstClickSafe.description',
			},
		},
		{
			key: 'questionMarks',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'minesweeper.settings.questionMarks.label',
				descriptionKey: 'minesweeper.settings.questionMarks.description',
			},
		},
		{
			key: 'fitToScreen',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'minesweeper.settings.fitToScreen.label',
				descriptionKey: 'minesweeper.settings.fitToScreen.description',
			},
		},
	],
};
