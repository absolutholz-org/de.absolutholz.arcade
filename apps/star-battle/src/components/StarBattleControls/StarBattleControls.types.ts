import type { InputMode } from '../../engine/types';

export interface StarBattleControlsProps {
	inputMode: InputMode;
	onToggleMode: (mode: InputMode) => void;
}

export type QueensControlsProps = StarBattleControlsProps;
