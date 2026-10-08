import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import * as S from './SudokuKeypad.styles';
import type { SudokuKeypadProps } from './SudokuKeypad.types';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function SudokuKeypad({
	digitCounts,
	isNotesMode,
	canUndo,
	canRedo,
	layout = 'auto',
	onDigitPress,
	onToggleNotes,
	onErase,
	onUndo,
	onRedo,
}: SudokuKeypadProps) {
	const { t } = useI18n('sudoku');

	return (
		<S.KeypadContainer>
			<S.ActionsRow>
				<S.ActionButton type="button" onClick={onUndo} disabled={!canUndo} aria-label={t('controls.undo')}>
					<Icon name="undo" size="sm" />
					<span>{t('controls.undo')}</span>
				</S.ActionButton>

				<S.ActionButton type="button" onClick={onRedo} disabled={!canRedo} aria-label={t('controls.redo')}>
					<Icon name="redo" size="sm" />
					<span>{t('controls.redo')}</span>
				</S.ActionButton>

				<S.ActionButton type="button" onClick={onErase} aria-label={t('controls.erase')}>
					<Icon name="eraser" size="sm" />
					<span>{t('controls.erase')}</span>
				</S.ActionButton>

				<S.ActionButton
					type="button"
					onClick={onToggleNotes}
					data-active={isNotesMode ? 'true' : undefined}
					aria-pressed={isNotesMode}
					aria-label={isNotesMode ? t('controls.notesOn') : t('controls.notesOff')}
				>
					<Icon name="pencil" size="sm" />
					<span>{isNotesMode ? t('controls.notesOn') : t('controls.notes')}</span>
				</S.ActionButton>
			</S.ActionsRow>

			<S.DigitsGrid data-layout={layout}>
				{DIGITS.map((digit) => {
					const count = digitCounts[digit] || 0;
					const isComplete = count >= 9;
					const remaining = Math.max(0, 9 - count);

					return (
						<S.DigitButton
							key={digit}
							type="button"
							onClick={() => onDigitPress(digit)}
							disabled={isComplete}
							data-complete={isComplete ? 'true' : undefined}
							aria-label={t('aria.keypadDigit', { digit })}
						>
							<span>{digit}</span>
							<span data-slot="count">{remaining}</span>
						</S.DigitButton>
					);
				})}
			</S.DigitsGrid>
		</S.KeypadContainer>
	);
}
