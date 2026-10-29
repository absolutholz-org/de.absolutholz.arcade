import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import type { JSX } from 'react';
import * as S from './HashiControls.styles.js';
import type { HashiControlsProps } from './HashiControls.types.js';

export function HashiControls({ canUndo, canRedo, onUndo, onRedo, onReset }: HashiControlsProps): JSX.Element {
	const { t } = useI18n('bridges');

	return (
		<S.ControlsContainer>
			<S.ActionsRow>
				<S.ActionButton
					type="button"
					onClick={onUndo}
					disabled={!canUndo}
					aria-label={t('common.undo')}
					title={t('common.undo')}
				>
					<Icon name="undo" size="sm" />
					<span>{t('common.undo')}</span>
				</S.ActionButton>

				<S.ActionButton
					type="button"
					onClick={onRedo}
					disabled={!canRedo}
					aria-label={t('common.redo')}
					title={t('common.redo')}
				>
					<Icon name="redo" size="sm" />
					<span>{t('common.redo')}</span>
				</S.ActionButton>

				<S.ActionButton
					type="button"
					onClick={onReset}
					aria-label={t('common.restart')}
					title={t('common.restart')}
				>
					<Icon name="rotate-ccw" size="sm" />
					<span>{t('common.restart')}</span>
				</S.ActionButton>
			</S.ActionsRow>
		</S.ControlsContainer>
	);
}
