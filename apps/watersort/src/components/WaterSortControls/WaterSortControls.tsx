import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import type { JSX } from 'react';
import * as S from './WaterSortControls.styles.js';
import type { WaterSortControlsProps } from './WaterSortControls.types.js';

export function WaterSortControls({ canUndo, onUndo, onReset }: WaterSortControlsProps): JSX.Element {
	const { t } = useI18n('common');

	return (
		<S.ControlsContainer>
			<S.ActionsRow>
				<S.ActionButton
					type="button"
					onClick={onUndo}
					disabled={!canUndo}
					aria-label={t('undo')}
					title={t('undo')}
				>
					<Icon name="undo" size="sm" />
					<span>{t('undo')}</span>
				</S.ActionButton>

				<S.ActionButton type="button" onClick={onReset} aria-label={t('restart')} title={t('restart')}>
					<Icon name="rotate-ccw" size="sm" />
					<span>{t('restart')}</span>
				</S.ActionButton>
			</S.ActionsRow>
		</S.ControlsContainer>
	);
}
