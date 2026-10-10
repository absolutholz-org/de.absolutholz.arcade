import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
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
	onDragStart,
	onDragEnter,
	onDragEnd,
	onKeyDown,
}: QueensBoardProps): JSX.Element {
	const { t } = useI18n('queens');

	return (
		<S.BoardWrapper onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
			{/* biome-ignore lint/a11y/useSemanticElements: Queens is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern */}
			<S.GridContainer
				role="grid"
				tabIndex={0}
				aria-label={t('aria.board', { size })}
				data-size={String(size)}
				onKeyDown={onKeyDown}
			>
				{Array.from({ length: size }).map((_, r) =>
					Array.from({ length: size }).map((__, c) => {
						const reg = regions[r]?.[c] ?? 0;
						const state = board[r]?.[c] ?? 'empty';
						const conflict = conflicts.get(`${r},${c}`);
						const isFocused = focusedCell?.row === r && focusedCell?.col === c;

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
								onPointerDown={onDragStart}
								onPointerEnter={onDragEnter}
								onPointerUp={onDragEnd}
							/>
						);
					}),
				)}
			</S.GridContainer>
		</S.BoardWrapper>
	);
}
