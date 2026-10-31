import type { GameSettingsConfig } from '@arcade/lib-games';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameSettingsPanel } from './_GameSettingsPanel';

interface MockSettings {
	highlightPeerCells: boolean;
	highlightPeerDigits: boolean;
	highlightErrors: boolean;
	autoClearNotes: boolean;
	inputMode: 'digit-first' | 'cell-first';
	themeVariant: 'default' | 'high-contrast' | 'pastel';
}

const MOCK_CONFIG: GameSettingsConfig<MockSettings> = {
	gameId: 'sudoku',
	defaults: {
		highlightPeerCells: true,
		highlightPeerDigits: true,
		highlightErrors: true,
		autoClearNotes: false,
		inputMode: 'digit-first',
		themeVariant: 'default',
	},
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
			availableInGame: false,
			i18n: {
				labelKey: 'sudoku.settings.highlightErrors.label',
				descriptionKey: 'sudoku.settings.highlightErrors.description',
			},
		},
		{
			key: 'inputMode',
			control: 'segmented',
			defaultValue: 'digit-first',
			availableInGame: true,
			i18n: {
				labelKey: 'sudoku.settings.inputMode.label',
				descriptionKey: 'sudoku.settings.inputMode.description',
			},
			options: [
				{ value: 'digit-first', labelKey: 'Digit First' },
				{ value: 'cell-first', labelKey: 'Cell First' },
			],
		},
		{
			key: 'themeVariant',
			control: 'select',
			defaultValue: 'default',
			availableInGame: false,
			i18n: {
				labelKey: 'sudoku.settings.themeVariant.label',
				descriptionKey: 'sudoku.settings.themeVariant.description',
			},
			options: [
				{ value: 'default', labelKey: 'Default Theme' },
				{ value: 'high-contrast', labelKey: 'High Contrast' },
				{ value: 'pastel', labelKey: 'Pastel' },
			],
		},
	],
};

const meta: Meta<typeof GameSettingsPanel> = {
	title: 'Templates/Game Subpage Template/GameSettingsPanel',
	component: GameSettingsPanel,
	parameters: {
		layout: 'padded',
	},
	argTypes: {
		mode: {
			control: 'radio',
			options: ['compact', 'detailed'],
		},
		lang: {
			control: 'select',
			options: ['en', 'de', 'fr', 'pt'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof GameSettingsPanel>;

export const Compact: Story = {
	args: {
		config: MOCK_CONFIG,
		lang: 'en',
		mode: 'compact',
	},
};

export const Detailed: Story = {
	args: {
		config: MOCK_CONFIG,
		lang: 'en',
		mode: 'detailed',
		onResetProgress: () => {
			console.log('Reset progress confirmed');
		},
	},
};

export const DetailedGerman: Story = {
	args: {
		config: MOCK_CONFIG,
		lang: 'de',
		mode: 'detailed',
		onResetProgress: () => {
			console.log('Reset progress confirmed (DE)');
		},
	},
};
