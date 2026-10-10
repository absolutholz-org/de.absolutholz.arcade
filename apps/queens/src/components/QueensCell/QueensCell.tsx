import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX, MouseEvent, PointerEvent } from 'react';
import { CrownIcon, XMarkIcon } from '../QueensIcons/index.js';
import * as S from './QueensCell.styles.js';
import type { QueensCellProps } from './QueensCell.types.js';

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
	onPointerDown,
	onPointerEnter,
	onPointerUp,
}: QueensCellProps): JSX.Element {
	const { t } = useI18n('queens');

	const hasConflict = !!(conflict?.row || conflict?.col || conflict?.region || conflict?.adjacency);

	const stateLabel =
		state === 'token' ? t('aria.cellToken') : state === 'mark' ? t('aria.cellMarked') : t('aria.cellEmpty');

	const conflictLabel = hasConflict
		? conflict?.row
			? t('conflicts.row')
			: conflict?.col
				? t('conflicts.col')
				: conflict?.region
					? t('conflicts.region')
					: t('conflicts.adjacency')
		: '';

	const fullAriaLabel = `${t('aria.cell', { row: row + 1, col: col + 1, region: region + 1 })}, ${stateLabel}${
		conflictLabel ? `. ${t('aria.conflictNotice', { reason: conflictLabel })}` : ''
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
			tabIndex={isFocused ? 0 : -1}
			aria-label={fullAriaLabel}
			aria-pressed={state === 'token'}
			data-state={state}
			data-region={String(region)}
			data-conflict={hasConflict ? 'true' : 'false'}
			data-border-top={borderTop}
			data-border-bottom={borderBottom}
			data-border-left={borderLeft}
			data-border-right={borderRight}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			onContextMenu={handleContextMenu}
			onPointerDown={handlePointerDown}
			onPointerEnter={handlePointerEnter}
			onPointerUp={onPointerUp}
		>
			{state === 'token' ? <CrownIcon /> : state === 'mark' ? <XMarkIcon /> : null}
		</S.CellButton>
	);
}
