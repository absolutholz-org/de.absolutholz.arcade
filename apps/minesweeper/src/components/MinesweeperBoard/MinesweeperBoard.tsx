import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { CSSProperties, JSX, KeyboardEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Cell } from '../../engine/types';
import { MinesweeperCell } from '../MinesweeperCell';
import * as S from './MinesweeperBoard.styles';

export interface MinesweeperBoardProps {
	cells: Cell[];
	columns: number;
	rows: number;
	focusedCell: { col: number; row: number } | null;
	isGameOver: boolean;
	isWon: boolean;
	isFitToScreen?: boolean;
	onReveal: (col: number, row: number) => void;
	onFlag: (col: number, row: number) => void;
	onChord: (col: number, row: number) => void;
	onSetFocus: (col: number, row: number) => void;
}

export function MinesweeperBoard({
	cells,
	columns,
	rows,
	focusedCell,
	isGameOver,
	isWon,
	isFitToScreen = true,
	onReveal,
	onFlag,
	onChord,
	onSetFocus,
}: MinesweeperBoardProps): JSX.Element {
	const { t } = useI18n('minesweeper');
	const tableRef = useRef<HTMLTableElement>(null);
	const insetRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const checkScroll = useCallback(() => {
		const el = insetRef.current;
		if (!el) return;
		const { scrollLeft, scrollWidth, clientWidth } = el;
		setCanScrollLeft(scrollLeft > 4);
		setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
	}, []);

	useEffect(() => {
		if (columns && rows && isFitToScreen !== undefined) {
			checkScroll();
		}
	}, [checkScroll, columns, rows, isFitToScreen]);

	useEffect(() => {
		window.addEventListener('resize', checkScroll);
		return () => window.removeEventListener('resize', checkScroll);
	}, [checkScroll]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTableElement>) => {
			if (!focusedCell) return;
			const { col, row } = focusedCell;

			let nextCol = col;
			let nextRow = row;

			switch (e.key) {
				case 'ArrowUp':
					nextRow = Math.max(0, row - 1);
					e.preventDefault();
					break;
				case 'ArrowDown':
					nextRow = Math.min(rows - 1, row + 1);
					e.preventDefault();
					break;
				case 'ArrowLeft':
					nextCol = Math.max(0, col - 1);
					e.preventDefault();
					break;
				case 'ArrowRight':
					nextCol = Math.min(columns - 1, col + 1);
					e.preventDefault();
					break;
				case 'Home':
					nextCol = 0;
					e.preventDefault();
					break;
				case 'End':
					nextCol = columns - 1;
					e.preventDefault();
					break;
				case 'PageUp':
					nextRow = 0;
					e.preventDefault();
					break;
				case 'PageDown':
					nextRow = rows - 1;
					e.preventDefault();
					break;
				default:
					return;
			}

			if (nextCol !== col || nextRow !== row) {
				onSetFocus(nextCol, nextRow);
				const cellBtn = tableRef.current?.querySelector<HTMLButtonElement>(
					`button[aria-label*="Row ${nextRow + 1}"], button[aria-label*="Zeile ${nextRow + 1}"], button[aria-label*="Ligne ${nextRow + 1}"], button[aria-label*="Linha ${nextRow + 1}"]`,
				);
				cellBtn?.focus();
				cellBtn?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
			}
		},
		[focusedCell, columns, rows, onSetFocus],
	);

	const gridStyle: CSSProperties = {
		'--columns': columns,
		'--rows': rows,
		'--ratio': columns / rows,
	} as CSSProperties;

	return (
		<S.BoardContainer onContextMenu={(e) => e.preventDefault()}>
			<S.BoardFrame data-zoom={!isFitToScreen} style={gridStyle}>
				<S.BoardInset
					ref={insetRef}
					onScroll={checkScroll}
					data-zoom={!isFitToScreen}
					onContextMenu={(e) => e.preventDefault()}
				>
					<S.BoardTable
						ref={tableRef}
						aria-label={t('aria.boardGrid', { cols: columns, rows })}
						data-zoom={!isFitToScreen}
						onKeyDown={handleKeyDown}
						onContextMenu={(e) => e.preventDefault()}
					>
						<S.BoardBody>
							{Array.from({ length: rows }).map((_, r) => {
								const rowKey = `grid-row-${r}`;
								return (
									<S.BoardRow key={rowKey}>
										{Array.from({ length: columns }).map((__, c) => {
											const index = r * columns + c;
											const cell = cells[index];
											if (!cell) return null;

											const isFocused =
												focusedCell !== null && focusedCell.col === c && focusedCell.row === r;

											return (
												<S.BoardCellWrapper key={cell.id}>
													<MinesweeperCell
														cell={cell}
														isFocused={isFocused}
														isGameOver={isGameOver}
														isWon={isWon}
														onReveal={onReveal}
														onFlag={onFlag}
														onChord={onChord}
														onFocus={onSetFocus}
													/>
												</S.BoardCellWrapper>
											);
										})}
									</S.BoardRow>
								);
							})}
						</S.BoardBody>
					</S.BoardTable>
				</S.BoardInset>

				{!isFitToScreen && (
					<>
						<S.ScrollHintLeft data-visible={canScrollLeft} aria-label={t('aria.scrollLeft')}>
							<svg
								viewBox="0 0 24 24"
								width="1em"
								height="1em"
								fill="none"
								stroke="currentColor"
								strokeWidth={2.5}
								strokeLinecap="round"
								strokeLinejoin="round"
								focusable="false"
								aria-hidden="true"
							>
								<polyline points="15 18 9 12 15 6" />
							</svg>
						</S.ScrollHintLeft>
						<S.ScrollHintRight data-visible={canScrollRight} aria-label={t('aria.scrollRight')}>
							<svg
								viewBox="0 0 24 24"
								width="1em"
								height="1em"
								fill="none"
								stroke="currentColor"
								strokeWidth={2.5}
								strokeLinecap="round"
								strokeLinejoin="round"
								focusable="false"
								aria-hidden="true"
							>
								<polyline points="9 18 15 12 9 6" />
							</svg>
						</S.ScrollHintRight>
					</>
				)}
			</S.BoardFrame>
		</S.BoardContainer>
	);
}
