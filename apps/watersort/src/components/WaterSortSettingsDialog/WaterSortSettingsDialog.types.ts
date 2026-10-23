export interface WaterSortSettings {
	colorblindPatterns: boolean;
	fluidAnimations: boolean;
}

export interface WaterSortSettingsDialogProps {
	isOpen: boolean;
	settings: WaterSortSettings;
	onClose: () => void;
	onUpdateSettings: (settings: WaterSortSettings) => void;
}
