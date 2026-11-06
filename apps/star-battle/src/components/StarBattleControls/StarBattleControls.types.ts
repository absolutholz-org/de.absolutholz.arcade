import type { InputMode } from '../../engine/types';

export interface StarBattleControlsProps {
	inputMode: InputMode;
	canUndo: boolean;
	canRedo: boolean;
	onToggleMode: (mode: InputMode) => void;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
}

export type QueensControlsProps = StarBattleControlsProps;
