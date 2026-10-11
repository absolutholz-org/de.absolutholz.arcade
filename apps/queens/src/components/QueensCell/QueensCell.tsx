import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX, MouseEvent, PointerEvent } from 'react';
import { CrownIcon, XMarkIcon } from '../QueensIcons';
import * as S from './QueensCell.styles';
import type { QueensCellProps } from './QueensCell.types';

export function QueensCell({
	row,
	col,
	region,
	state,
	conflict,
	isFocused = false,
	borderTop,
	borderBottom,
	borderLeft,
	borderRight,
	onCellClick,
	onCellDoubleClick,
	onCellContextMenu,
	onFocus,
	onPointerDown,
	onPointerEnter,
	onPointerUp,
}: QueensCellProps): JSX.Element {
	const { t } = useI18n('queens');

	const hasConflict = !!(conflict?.row || conflict?.col || conflict?.region || conflict?.adjacency);

	const stateLabel =
		state === 'token' ? t('aria.cellToken') : state === 'mark' ? t('aria.cellMarked') : t('aria.cellEmpty');

	const conflictReasons: string[] = [];
	if (conflict?.row) conflictReasons.push(t('conflicts.row'));
	if (conflict?.col) conflictReasons.push(t('conflicts.col'));
	if (conflict?.region) conflictReasons.push(t('conflicts.region'));
	if (conflict?.adjacency) conflictReasons.push(t('conflicts.adjacency'));

	const conflictText = conflictReasons.join('; ');

	const fullAriaLabel = `${t('aria.cell', { row: row + 1, col: col + 1, region: region + 1 })}: ${stateLabel}${
		conflictText ? `. ${t('aria.conflictNotice', { reason: conflictText })}` : ''
	}`;

	const handleClick = (e: MouseEvent) => {
		e.preventDefault();
		onCellClick(row, col);
	};

	const handleDoubleClick = (e: MouseEvent) => {
		e.preventDefault();
		onCellDoubleClick?.(row, col);
	};

	const handleContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		onCellContextMenu?.(row, col, e);
	};

	const handlePointerDown = (e: PointerEvent) => {
		onPointerDown?.(row, col, e);
	};

	const handlePointerEnter = (e: PointerEvent) => {
		onPointerEnter?.(row, col, e);
	};

	return (
		<S.CellButton
			type="button"
			// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
			role="gridcell"
			tabIndex={isFocused ? 0 : -1}
			aria-selected={isFocused}
			aria-rowindex={row + 1}
			aria-colindex={col + 1}
			aria-label={fullAriaLabel}
			data-row={row}
			data-col={col}
			data-state={state}
			data-region={String(region)}
			data-focused={isFocused ? 'true' : undefined}
			data-conflict={hasConflict ? 'true' : 'false'}
			data-border-top={borderTop}
			data-border-bottom={borderBottom}
			data-border-left={borderLeft}
			data-border-right={borderRight}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			onContextMenu={handleContextMenu}
			onFocus={() => onFocus?.(row, col)}
			onPointerDown={handlePointerDown}
			onPointerEnter={handlePointerEnter}
			onPointerUp={onPointerUp}
		>
			{state === 'token' ? <CrownIcon /> : state === 'mark' ? <XMarkIcon /> : null}
		</S.CellButton>
	);
}
