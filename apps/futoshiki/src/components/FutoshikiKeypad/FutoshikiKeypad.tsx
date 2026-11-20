import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import * as S from './FutoshikiKeypad.styles';

export interface FutoshikiKeypadProps {
	readonly size: number;
	readonly digitCounts: Readonly<Record<number, number>>;
	readonly isNotesMode: boolean;
	readonly disabled: boolean;
	readonly onDigitPress: (digit: number) => void;
	readonly onToggleNotes: () => void;
	readonly onErase: () => void;
	readonly onHint: () => void;
}

export function FutoshikiKeypad({
	size,
	digitCounts,
	isNotesMode,
	disabled,
	onDigitPress,
	onToggleNotes,
	onErase,
	onHint,
}: FutoshikiKeypadProps): JSX.Element {
	const { t } = useI18n('futoshiki');
	const digits = Array.from({ length: size }, (_, i) => i + 1);

	return (
		<S.KeypadContainer>
			<Toolbar fullWidth variant="ghost" size="sm" align="center" aria-label={t('aria.digitsToolbar')}>
				<S.DigitsRow data-size={String(size)}>
					{digits.map((digit) => {
						const remaining = Math.max(0, size - (digitCounts[digit] ?? 0));
						const isComplete = !isNotesMode && remaining === 0;
						return (
							<S.DigitButton
								key={`keypad-digit-${digit}`}
								type="button"
								disabled={disabled}
								data-complete={isComplete ? 'true' : 'false'}
								aria-label={
									isNotesMode
										? t('aria.keypadNoteDigit', { digit })
										: t('aria.keypadDigit', { digit })
								}
								onClick={() => onDigitPress(digit)}
							>
								<span>{digit}</span>
								<span data-slot="count" aria-hidden="true">
									{remaining}
								</span>
							</S.DigitButton>
						);
					})}
				</S.DigitsRow>
			</Toolbar>

			<Toolbar fullWidth variant="ghost" size="sm" align="center" aria-label={t('aria.actionsToolbar')}>
				<S.ActionsRow>
					<S.ModeButton
						type="button"
						data-active={isNotesMode ? 'true' : undefined}
						aria-pressed={isNotesMode}
						aria-label={isNotesMode ? t('controls.notesOn') : t('controls.notesOff')}
						disabled={disabled}
						onClick={onToggleNotes}
					>
						<Icon name="pencil" size="sm" />
						<span>{isNotesMode ? t('controls.notesOn') : t('controls.notes')}</span>
					</S.ModeButton>

					<S.ModeButton type="button" disabled={disabled} onClick={onErase} aria-label={t('controls.erase')}>
						<Icon name="eraser" size="sm" />
						<span>{t('controls.erase')}</span>
					</S.ModeButton>

					<S.ModeButton type="button" disabled={disabled} onClick={onHint} aria-label={t('controls.hint')}>
						<Icon name="sparkles" size="sm" />
						<span>{t('controls.hint')}</span>
					</S.ModeButton>
				</S.ActionsRow>
			</Toolbar>
		</S.KeypadContainer>
	);
}
