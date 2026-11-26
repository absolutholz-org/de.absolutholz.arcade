import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import type { SudokuTokenMode } from './tokens';

export interface SudokuSettings extends Record<string, unknown> {
	highlightPeerCells: boolean;
	highlightPeerDigits: boolean;
	highlightErrors: boolean;
	autoClearNotes: boolean;
	tokenMode: SudokuTokenMode;
}

export const DEFAULT_SUDOKU_SETTINGS: SudokuSettings = {
	highlightPeerCells: true,
	highlightPeerDigits: true,
	highlightErrors: true,
	autoClearNotes: false,
	tokenMode: 'numbers',
};

export const SUDOKU_SETTINGS_CONFIG: GameSettingsConfig<SudokuSettings> = {
	gameId: 'sudoku',
	defaults: DEFAULT_SUDOKU_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: false },
	fields: [
		{
			key: 'highlightPeerCells',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'sudoku.settings.highlightPeerCells.label',
				descriptionKey: 'sudoku.settings.highlightPeerCells.description',
			},
		},
		{
			key: 'highlightPeerDigits',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'sudoku.settings.highlightPeerDigits.label',
				descriptionKey: 'sudoku.settings.highlightPeerDigits.description',
			},
		},
		{
			key: 'highlightErrors',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'sudoku.settings.highlightErrors.label',
				descriptionKey: 'sudoku.settings.highlightErrors.description',
			},
		},
		{
			key: 'autoClearNotes',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'sudoku.settings.autoClearNotes.label',
				descriptionKey: 'sudoku.settings.autoClearNotes.description',
			},
		},
		{
			key: 'tokenMode',
			control: 'segmented',
			defaultValue: 'numbers',
			availableInGame: true,
			options: [
				{ value: 'numbers', labelKey: 'sudoku.settings.tokenMode.options.numbers' },
				{ value: 'shapes', labelKey: 'sudoku.settings.tokenMode.options.shapes' },
				{ value: 'emojis', labelKey: 'sudoku.settings.tokenMode.options.emojis' },
			],
			i18n: {
				labelKey: 'sudoku.settings.tokenMode.label',
				descriptionKey: 'sudoku.settings.tokenMode.description',
			},
		},
	],
};
