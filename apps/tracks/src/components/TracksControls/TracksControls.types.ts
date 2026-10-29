import type { InputMode } from '../../engine/types.js';

export interface TracksControlsProps {
	inputMode: InputMode;
	canUndo: boolean;
	canRedo: boolean;
	onToggleMode: (mode: InputMode) => void;
	onHint?: () => void;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
}
