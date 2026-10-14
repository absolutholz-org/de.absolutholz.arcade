import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import * as S from './HashiControls.styles.js';
import type { HashiControlsProps } from './HashiControls.types.js';

export function HashiControls({ canUndo, canRedo, onUndo, onRedo, onReset }: HashiControlsProps): JSX.Element {
	const { t } = useI18n('hashiwokakero');

	return (
		<S.ControlsContainer>
			<S.MainBar>
				<S.ActionButton
					type="button"
					onClick={onUndo}
					disabled={!canUndo}
					aria-label={t('controls.undo')}
					title={t('controls.undo')}
				>
					<span>{t('controls.undo')}</span>
				</S.ActionButton>

				<S.ActionButton
					type="button"
					onClick={onRedo}
					disabled={!canRedo}
					aria-label={t('controls.redo')}
					title={t('controls.redo')}
				>
					<span>{t('controls.redo')}</span>
				</S.ActionButton>

				<S.ActionButton
					type="button"
					onClick={onReset}
					aria-label={t('controls.reset')}
					title={t('controls.reset')}
				>
					<span>{t('controls.reset')}</span>
				</S.ActionButton>
			</S.MainBar>
		</S.ControlsContainer>
	);
}
