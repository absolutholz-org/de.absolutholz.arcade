import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import type { JSX } from 'react';
import { type DraftRow, PEG_COLORS, type PegColorId } from '../../engine/types';
import { PegBadge } from '../PegBadge/PegBadge';
import * as S from './ColorPalette.styles';

export interface ColorPaletteProps {
	readonly colorCount: number;
	readonly draft: DraftRow;
	readonly selectedSlot: number;
	readonly allowDuplicates: boolean;
	readonly showColorShapes: boolean;
	readonly showColorNumbers: boolean;
	readonly canSubmit: boolean;
	readonly canClear: boolean;
	readonly disabled: boolean;
	readonly onPlaceColor: (colorId: PegColorId) => void;
	readonly onClearSlot: () => void;
	readonly onHint: () => void;
	readonly onSubmitGuess: () => void;
}

export function ColorPalette({
	colorCount,
	draft,
	selectedSlot,
	allowDuplicates,
	showColorShapes,
	showColorNumbers,
	canSubmit,
	canClear,
	disabled,
	onPlaceColor,
	onClearSlot,
	onHint,
	onSubmitGuess,
}: ColorPaletteProps): JSX.Element {
	const { t } = useI18n('codebreaker');
	const availableColors = PEG_COLORS.slice(0, colorCount);

	return (
		<S.PaletteSection>
			<S.ColorGrid aria-label={t('aria.paletteLabel')}>
				{availableColors.map((spec) => {
					const isUsedElsewhere =
						!allowDuplicates && draft.some((peg, idx) => peg === spec.id && idx !== selectedSlot);

					return (
						<S.ColorButton
							key={`palette-${spec.key}`}
							type="button"
							disabled={disabled || isUsedElsewhere}
							aria-label={t('aria.paletteButton', {
								color: t(`colors.${spec.key}` as 'colors.red'),
								symbol: t(`symbols.${spec.symbol}` as 'symbols.circle'),
								key: spec.numberLabel,
							})}
							onClick={() => onPlaceColor(spec.id)}
						>
							<PegBadge
								colorId={spec.id}
								size="md"
								showShape={showColorShapes}
								showNumber={showColorNumbers}
							/>
						</S.ColorButton>
					);
				})}
			</S.ColorGrid>

			<S.ActionRow aria-label={t('aria.actionsToolbar')}>
				<Button
					type="button"
					variant="outline"
					size="md"
					disabled={disabled || !canClear}
					onClick={onClearSlot}
				>
					{t('controls.clearSlot')}
				</Button>

				<Button type="button" variant="secondary" size="md" disabled={disabled} onClick={onHint}>
					{t('controls.hint')}
				</Button>

				<Button
					type="button"
					variant="primary"
					size="md"
					disabled={disabled || !canSubmit}
					onClick={onSubmitGuess}
				>
					{t('controls.submitGuess')}
				</Button>
			</S.ActionRow>
		</S.PaletteSection>
	);
}
