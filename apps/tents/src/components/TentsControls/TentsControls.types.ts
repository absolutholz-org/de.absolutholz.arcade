export interface TentsControlsProps {
	inputMode: 'tent' | 'grass';
	canUndo: boolean;
	canRedo: boolean;
	onToggleMode: (mode: 'tent' | 'grass') => void;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
	onHint?: () => void;
}
