import type { InputMode } from '../../engine/types';

export interface QueensControlsProps {
	inputMode: InputMode;
	canUndo: boolean;
	canRedo: boolean;
	onToggleMode: (mode: InputMode) => void;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
}
