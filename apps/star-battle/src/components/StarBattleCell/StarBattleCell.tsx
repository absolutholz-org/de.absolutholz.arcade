import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX, MouseEvent, PointerEvent } from 'react';
import { StarIcon, XMarkIcon } from '../StarBattleIcons';
import * as S from './StarBattleCell.styles';
import type { StarBattleCellProps } from './StarBattleCell.types';

function renderRegionPattern(region: number): JSX.Element {
	const patternType = region % 12;
	switch (patternType) {
		case 0:
			// Diagonal stripes (\)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="3" />
					<line x1="20" y1="0" x2="40" y2="20" stroke="currentColor" strokeWidth="3" />
					<line x1="0" y1="20" x2="20" y2="40" stroke="currentColor" strokeWidth="3" />
				</svg>
			);
		case 1:
			// Three solid dots
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<circle cx="10" cy="12" r="3.5" fill="currentColor" />
					<circle cx="30" cy="12" r="3.5" fill="currentColor" />
					<circle cx="20" cy="28" r="3.5" fill="currentColor" />
				</svg>
			);
		case 2:
			// Horizontal stripes (=)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<line x1="0" y1="13" x2="40" y2="13" stroke="currentColor" strokeWidth="3" />
					<line x1="0" y1="27" x2="40" y2="27" stroke="currentColor" strokeWidth="3" />
				</svg>
			);
		case 3:
			// Two diagonal solid squares
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<rect x="8" y="8" width="9" height="9" fill="currentColor" />
					<rect x="23" y="23" width="9" height="9" fill="currentColor" />
				</svg>
			);
		case 4:
			// Wavy line (~)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<path d="M0 20 Q 10 8, 20 20 T 40 20" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		case 5:
			// Reverse diagonal stripes (/)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<line x1="40" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="3" />
					<line x1="20" y1="0" x2="0" y2="20" stroke="currentColor" strokeWidth="3" />
					<line x1="40" y1="20" x2="20" y2="40" stroke="currentColor" strokeWidth="3" />
				</svg>
			);
		case 6:
			// Hollow ring
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		case 7:
			// Vertical stripes (|||)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<line x1="10" y1="0" x2="10" y2="40" stroke="currentColor" strokeWidth="3" />
					<line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="3" />
					<line x1="30" y1="0" x2="30" y2="40" stroke="currentColor" strokeWidth="3" />
				</svg>
			);
		case 8:
			// Hollow triangle
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<polygon points="20,7 33,31 7,31" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		case 9:
			// Hollow diamond
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<polygon points="20,6 34,20 20,34 6,20" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		case 10:
			// Four corner dots (keeps center clear for X/Star)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<circle cx="9" cy="9" r="2.8" fill="currentColor" />
					<circle cx="31" cy="9" r="2.8" fill="currentColor" />
					<circle cx="9" cy="31" r="2.8" fill="currentColor" />
					<circle cx="31" cy="31" r="2.8" fill="currentColor" />
				</svg>
			);
		default:
			// Chevron (^)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true" data-pattern="true">
					<polyline points="8,26 20,12 32,26" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
	}
}

export function StarBattleCell({
	row,
	col,
	region,
	state,
	conflict,
	isFocused = false,
	showPatterns = false,
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
}: StarBattleCellProps): JSX.Element {
	const { t } = useI18n('star-battle');

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
			{showPatterns && renderRegionPattern(region)}
			{state === 'token' ? <StarIcon /> : state === 'mark' ? <XMarkIcon /> : null}
		</S.CellButton>
	);
}

export const QueensCell = StarBattleCell;
