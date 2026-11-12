import type { InputMode } from '../../engine/types.js';

export interface TracksControlsProps {
	inputMode: InputMode;
	onToggleMode: (mode: InputMode) => void;
	onHint?: () => void;
}
