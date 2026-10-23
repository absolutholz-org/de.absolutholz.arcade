import type { Board } from '../../engine/types.js';

export interface WaterSortBoardProps {
	board: Board;
	selectedIndex: number | null;
	showPatterns: boolean;
	fluidAnimations: boolean;
	onSelectTube: (index: number) => void;
}
