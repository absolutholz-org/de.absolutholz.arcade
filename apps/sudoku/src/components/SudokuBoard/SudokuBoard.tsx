import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useMemo } from 'react';
import { SudokuCell } from '../SudokuCell/SudokuCell';
import * as S from './SudokuBoard.styles';
import type { SudokuBoardProps } from './SudokuBoard.types';

export function SudokuBoard({ grid, activeCell, conflicts, settings, onSelectCell }: SudokuBoardProps) {
	const { t } = useI18n('sudoku');

	const activeCellValue = activeCell ? grid[activeCell.row][activeCell.col].value : null;

	const activeBlock = activeCell ? Math.floor(activeCell.row / 3) * 3 + Math.floor(activeCell.col / 3) : null;

	const blocks = useMemo(() => {
		return Array.from({ length: 9 }, (_, blockIndex) => {
			const blockRow = Math.floor(blockIndex / 3);
			const blockCol = blockIndex % 3;
			const cells = [];
			for (let r = 0; r < 3; r++) {
				for (let c = 0; c < 3; c++) {
					cells.push(grid[blockRow * 3 + r][blockCol * 3 + c]);
				}
			}
			return { blockIndex, cells };
		});
	}, [grid]);

	return (
		// biome-ignore lint/a11y/useSemanticElements: Sudoku is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
		<S.BoardContainer id="sudoku-board" role="grid" aria-label={t('aria.boardGrid')}>
			{blocks.map(({ blockIndex, cells }) => (
				<S.BlockContainer
					key={blockIndex}
					role="presentation"
					data-active-block={activeBlock === blockIndex ? 'true' : undefined}
				>
					{cells.map((cell) => {
						const r = cell.row;
						const c = cell.col;
						const isActive = activeCell?.row === r && activeCell?.col === c;

						const isPeerCell =
							settings.highlightPeerCells &&
							activeCell !== null &&
							!isActive &&
							(activeCell.row === r || activeCell.col === c || cell.block === activeBlock);

						const isPeerDigit =
							settings.highlightPeerDigits &&
							activeCellValue !== null &&
							!isActive &&
							cell.value === activeCellValue;

						const isInvalid = settings.highlightErrors && conflicts.has(`${r},${c}`);

						return (
							<SudokuCell
								key={`cell-${cell.row}-${cell.col}`}
								cell={cell}
								isActive={isActive}
								isPeerCell={isPeerCell}
								isPeerDigit={isPeerDigit}
								isInvalid={isInvalid}
								activeDigit={activeCellValue}
								onClick={() => onSelectCell(r, c)}
							/>
						);
					})}
				</S.BlockContainer>
			))}
		</S.BoardContainer>
	);
}
