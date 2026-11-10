import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';

export interface TicTacToeSettings extends Record<string, unknown> {
	highlightWinningLine: boolean;
	showCellCoordinates: boolean;
}

export const DEFAULT_TICTACTOE_SETTINGS: TicTacToeSettings = {
	highlightWinningLine: true,
	showCellCoordinates: false,
};

export const TICTACTOE_SETTINGS_CONFIG: GameSettingsConfig<TicTacToeSettings> = {
	gameId: 'tictactoe',
	defaults: DEFAULT_TICTACTOE_SETTINGS,
	fields: [
		{
			key: 'highlightWinningLine',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'tictactoe.settings.highlightWinningLine.label',
				descriptionKey: 'tictactoe.settings.highlightWinningLine.description',
			},
		},
		{
			key: 'showCellCoordinates',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'tictactoe.settings.showCellCoordinates.label',
				descriptionKey: 'tictactoe.settings.showCellCoordinates.description',
			},
		},
	],
};
