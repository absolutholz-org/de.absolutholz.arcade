import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import type { JSX } from 'react';
import type { CellState } from '../../engine/types';
import { CrossIcon } from '../NonogramIcons';
import * as S from './NonogramCell.styles';

export interface NonogramCellProps {
	col: number;
	row: number;
	state: CellState;
	previewState?: CellState;
	isFocused: boolean;
	isThickRight: boolean;
	isThickBottom: boolean;
	isVictory: boolean;
	onFocus: (col: number, row: number) => void;
}

export function NonogramCell({
	col,
	row,
	state,
	previewState,
	isFocused,
	isThickRight,
	isThickBottom,
	isVictory,
	onFocus,
}: NonogramCellProps): JSX.Element {
	const { t } = useI18n('nonogram');

	const displayedState = previewState ?? state;

	let ariaStateKey: TranslationKey = 'aria.cellEmpty';
	if (displayedState === 'filled') {
		ariaStateKey = 'aria.cellFilled';
	} else if (displayedState === 'crossed') {
		ariaStateKey = 'aria.cellCrossed';
	}

	const ariaLabel = t(ariaStateKey, { row: row + 1, col: col + 1 });

	return (
		<S.CellButton
			type="button"
			tabIndex={isFocused ? 0 : -1}
			aria-label={ariaLabel}
			data-col={col}
			data-row={row}
			data-state={state}
			data-preview={previewState}
			data-thick-right={isThickRight}
			data-thick-bottom={isThickBottom}
			data-victory={isVictory}
			data-focused={isFocused}
			onFocus={() => onFocus(col, row)}
		>
			{(displayedState === 'crossed' || previewState === 'crossed') && !isVictory && <CrossIcon />}
		</S.CellButton>
	);
}
