import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';

export interface PentominoesSettings extends Record<string, unknown> {
	showPieceLabels: boolean;
	showSurfacePatterns: boolean;
	highlightGhostValidity: boolean;
	showGridCoordinates: boolean;
}

export const DEFAULT_PENTOMINOES_SETTINGS: PentominoesSettings = {
	showPieceLabels: true,
	showSurfacePatterns: true,
	highlightGhostValidity: true,
	showGridCoordinates: true,
};

export const PENTOMINOES_SETTINGS_CONFIG: GameSettingsConfig<PentominoesSettings> = {
	gameId: 'pentominoes',
	defaults: DEFAULT_PENTOMINOES_SETTINGS,
	fields: [
		{
			key: 'showPieceLabels',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'pentominoes.settings.showPieceLabels',
				descriptionKey: 'pentominoes.settings.showPieceLabelsDescription',
			},
		},
		{
			key: 'showSurfacePatterns',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'pentominoes.settings.showSurfacePatterns',
				descriptionKey: 'pentominoes.settings.showSurfacePatternsDescription',
			},
		},
		{
			key: 'highlightGhostValidity',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'pentominoes.settings.highlightGhostValidity',
				descriptionKey: 'pentominoes.settings.highlightGhostValidityDescription',
			},
		},
		{
			key: 'showGridCoordinates',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'pentominoes.settings.showGridCoordinates',
				descriptionKey: 'pentominoes.settings.showGridCoordinatesDescription',
			},
		},
	],
};
