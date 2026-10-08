import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import * as S from './SudokuCell.styles';
import type { SudokuCellProps } from './SudokuCell.types';

export function SudokuCell({
	cell,
	isActive,
	isPeerCell,
	isPeerDigit,
	isInvalid,
	activeDigit,
	onClick,
}: SudokuCellProps) {
	const { t } = useI18n('sudoku');

	const hasNotes = cell.value === null && cell.notes.some(Boolean);

	const ariaValue =
		cell.value !== null
			? cell.value.toString()
			: hasNotes
				? cell.notes
						.map((active, i) => (active ? i + 1 : null))
						.filter(Boolean)
						.join(', ')
				: t('aria.emptyCell');

	const accessibleLabel = t('aria.cellLabel', {
		row: cell.row + 1,
		col: cell.col + 1,
		value: ariaValue,
	});

	return (
		<S.CellButton
			type="button"
			onClick={onClick}
			tabIndex={isActive ? 0 : -1}
			data-row={cell.row}
			data-col={cell.col}
			data-clue={cell.isClue ? 'true' : 'false'}
			data-active={isActive ? 'true' : undefined}
			data-peer-cell={isPeerCell ? 'true' : undefined}
			data-peer-digit={isPeerDigit ? 'true' : undefined}
			data-invalid={isInvalid ? 'true' : undefined}
			aria-label={accessibleLabel}
		>
			{cell.value !== null ? (
				<span>{cell.value}</span>
			) : hasNotes ? (
				<div data-slot="notes">
					{([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((digit) => (
						<span
							key={digit}
							data-empty={!cell.notes[digit - 1] ? 'true' : undefined}
							data-highlighted={activeDigit === digit ? 'true' : undefined}
						>
							{digit}
						</span>
					))}
				</div>
			) : null}
		</S.CellButton>
	);
}
