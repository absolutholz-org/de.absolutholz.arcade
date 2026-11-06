export interface LiquidSortSettings {
	colorblindPatterns: boolean;
	fluidAnimations: boolean;
}

export interface LiquidSortSettingsDialogProps {
	isOpen: boolean;
	settings: LiquidSortSettings;
	onClose: () => void;
	onUpdateSettings: (settings: LiquidSortSettings) => void;
}
