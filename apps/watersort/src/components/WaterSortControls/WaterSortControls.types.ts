export interface WaterSortControlsProps {
	canUndo: boolean;
	canRedo: boolean;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
	onHint: () => void;
}
