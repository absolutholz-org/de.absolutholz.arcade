import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, useEffect, useRef } from 'react';
import { QueensCell } from '../QueensCell';
import * as S from './QueensBoard.styles';
import type { QueensBoardProps } from './QueensBoard.types';

export function QueensBoard({
	size,
	regions,
	board,
	conflicts,
	focusedCell,
	onCellClick,
	onCellDoubleClick,
	onCellContextMenu,
	onCellFocus,
	onDragStart,
	onDragEnter,
	onDragEnd,
	onKeyDown,
}: QueensBoardProps): JSX.Element {
	const { t } = useI18n('queens');
	const gridRef = useRef<HTMLDivElement>(null);

	const activeRow = focusedCell?.row ?? 0;
	const activeCol = focusedCell?.col ?? 0;

	// Synchronize DOM focus when active cell changes while focus is inside the grid
	useEffect(() => {
		if (!gridRef.current) return;
		if (gridRef.current.contains(document.activeElement)) {
			const activeBtn = document.activeElement as HTMLButtonElement | null;
			const isAlreadyFocused =
				activeBtn?.dataset?.row === String(activeRow) && activeBtn?.dataset?.col === String(activeCol);

			if (!isAlreadyFocused) {
				const cellBtn = gridRef.current.querySelector<HTMLButtonElement>(
					`button[data-row="${activeRow}"][data-col="${activeCol}"]`,
				);
				cellBtn?.focus();
			}
		}
	}, [activeRow, activeCol]);

	return (
		<S.BoardWrapper onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
			<S.SrOnly id="queens-keyboard-instructions">{t('aria.instructions')}</S.SrOnly>
			<S.GridContainer
				ref={gridRef}
				// biome-ignore lint/a11y/useSemanticElements: Queens is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
				role="grid"
				aria-label={t('aria.board', { size })}
				aria-description={t('aria.instructions')}
				aria-describedby="queens-keyboard-instructions"
				aria-rowcount={size}
				aria-colcount={size}
				data-size={String(size)}
				onKeyDown={onKeyDown}
			>
				{Array.from({ length: size }).map((_, r) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid row coordinates serve as stable keys
					// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
					<S.GridRow key={`queens-row-${r}`} role="row" aria-rowindex={r + 1}>
						{Array.from({ length: size }).map((__, c) => {
							const reg = regions[r]?.[c] ?? 0;
							const state = board[r]?.[c] ?? 'empty';
							const conflict = conflicts.get(`${r},${c}`);
							const isFocused = activeRow === r && activeCol === c;

							const borderTop = r === 0 || regions[r - 1]?.[c] !== reg ? 'thick' : 'thin';
							const borderBottom = r === size - 1 || regions[r + 1]?.[c] !== reg ? 'thick' : 'thin';
							const borderLeft = c === 0 || regions[r]?.[c - 1] !== reg ? 'thick' : 'thin';
							const borderRight = c === size - 1 || regions[r]?.[c + 1] !== reg ? 'thick' : 'thin';

							return (
								<QueensCell
									// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
									key={`queens-cell-${r}-${c}`}
									row={r}
									col={c}
									region={reg}
									state={state}
									conflict={conflict}
									isFocused={isFocused}
									borderTop={borderTop}
									borderBottom={borderBottom}
									borderLeft={borderLeft}
									borderRight={borderRight}
									onCellClick={onCellClick}
									onCellDoubleClick={onCellDoubleClick}
									onCellContextMenu={onCellContextMenu}
									onFocus={onCellFocus}
									onPointerDown={onDragStart}
									onPointerEnter={onDragEnter}
									onPointerUp={onDragEnd}
								/>
							);
						})}
					</S.GridRow>
				))}
			</S.GridContainer>
		</S.BoardWrapper>
	);
}
