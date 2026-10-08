import type { CellCoord, GameSettings, SudokuGrid } from '../../engine/types';

export interface SudokuBoardProps {
	grid: SudokuGrid;
	activeCell: CellCoord | null;
	conflicts: Set<string>;
	settings: GameSettings;
	onSelectCell: (row: number, col: number) => void;
}
