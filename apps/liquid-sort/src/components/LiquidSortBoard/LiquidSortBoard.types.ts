import type { Board } from '../../engine/types.js';

export interface LiquidSortBoardProps {
	board: Board;
	selectedIndex: number | null;
	showPatterns: boolean;
	fluidAnimations: boolean;
	onSelectTube: (index: number) => void;
}
