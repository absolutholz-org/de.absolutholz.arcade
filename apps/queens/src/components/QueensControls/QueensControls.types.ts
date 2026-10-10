import type { InputMode } from '../../engine/types';

export interface QueensControlsProps {
	inputMode: InputMode;
	autoCross: boolean;
	canUndo: boolean;
	canRedo: boolean;
	onToggleMode: (mode: InputMode) => void;
	onToggleAutoCross: () => void;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
}
