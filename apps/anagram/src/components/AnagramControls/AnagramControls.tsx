import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import type { JSX } from 'react';
import * as S from './AnagramControls.styles.js';
import type { AnagramControlsProps } from './AnagramControls.types.js';

export function AnagramControls({
	canSubmit,
	isDisabled,
	isEnded,
	hasClearedBaseline: _hasClearedBaseline,
	showReveal,
	onShuffle,
	onClear,
	onSubmit,
	onReveal,
	onNewRound,
}: AnagramControlsProps): JSX.Element {
	const { t } = useI18n('anagram');

	return (
		<S.ControlsContainer>
			<S.ActionsRow>
				<S.ActionButton
					type="button"
					disabled={isDisabled || !canSubmit}
					onClick={onSubmit}
					aria-label={t('controls.submit')}
					title={t('controls.submit')}
				>
					<Icon name="check" size="sm" />
					<span>{t('controls.submit')}</span>
				</S.ActionButton>

				<S.ActionButton
					type="button"
					disabled={isDisabled}
					onClick={onShuffle}
					aria-label={t('controls.shuffle')}
					title={t('controls.shuffle')}
				>
					<Icon name="shuffle" size="sm" />
					<span>{t('controls.shuffle')}</span>
				</S.ActionButton>

				<S.ActionButton
					type="button"
					disabled={isDisabled || !canSubmit}
					onClick={onClear}
					aria-label={t('controls.clear')}
					title={t('controls.clear')}
				>
					<Icon name="undo" size="sm" />
					<span>{t('controls.clear')}</span>
				</S.ActionButton>

				{showReveal && !isEnded && (
					<S.ActionButton
						type="button"
						disabled={isDisabled}
						onClick={onReveal}
						aria-label={t('controls.reveal')}
						title={t('controls.reveal')}
					>
						<Icon name="eye" size="sm" />
						<span>{t('controls.reveal')}</span>
					</S.ActionButton>
				)}

				<S.ActionButton
					type="button"
					onClick={onNewRound}
					aria-label={t('controls.newRound')}
					title={t('controls.newRound')}
				>
					<Icon name="rotate-ccw" size="sm" />
					<span>{t('controls.newRound')}</span>
				</S.ActionButton>
			</S.ActionsRow>
		</S.ControlsContainer>
	);
}
