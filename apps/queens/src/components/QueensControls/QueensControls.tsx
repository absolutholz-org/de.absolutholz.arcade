import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Switch } from '@arcade/lib-ui/components/Switch';
import type { JSX } from 'react';
import { CrownIcon, XMarkIcon } from '../QueensIcons/index.js';
import * as S from './QueensControls.styles.js';
import type { QueensControlsProps } from './QueensControls.types.js';

export function QueensControls({
	inputMode,
	autoCross,
	canUndo,
	canRedo,
	onToggleMode,
	onToggleAutoCross,
	onUndo,
	onRedo,
	onReset,
}: QueensControlsProps): JSX.Element {
	const { t } = useI18n('queens');

	return (
		<S.ControlsContainer>
			<S.MainBar>
				<S.ModeToggleGroup aria-label={t('mode.label')}>
					<S.ModeButton
						type="button"
						aria-pressed={inputMode === 'mark'}
						data-active={inputMode === 'mark' ? 'true' : 'false'}
						onClick={() => onToggleMode('mark')}
						title={t('mode.markDesc')}
					>
						<XMarkIcon />
						<span>{t('mode.mark')}</span>
					</S.ModeButton>

					<S.ModeButton
						type="button"
						aria-pressed={inputMode === 'token'}
						data-active={inputMode === 'token' ? 'true' : 'false'}
						onClick={() => onToggleMode('token')}
						title={t('mode.tokenDesc')}
					>
						<CrownIcon />
						<span>{t('mode.token')}</span>
					</S.ModeButton>
				</S.ModeToggleGroup>

				<S.ActionButtonGroup>
					<S.ActionButton
						type="button"
						onClick={onUndo}
						disabled={!canUndo}
						aria-label={t('controls.undo')}
						title={t('controls.undo')}
					>
						<Icon name="undo" size="sm" />
					</S.ActionButton>

					<S.ActionButton
						type="button"
						onClick={onRedo}
						disabled={!canRedo}
						aria-label={t('controls.redo')}
						title={t('controls.redo')}
					>
						<Icon name="redo" size="sm" />
					</S.ActionButton>

					<S.ActionButton
						type="button"
						onClick={onReset}
						aria-label={t('controls.reset')}
						title={t('controls.reset')}
					>
						<Icon name="rotate-ccw" size="sm" />
					</S.ActionButton>
				</S.ActionButtonGroup>
			</S.MainBar>

			<S.HelperRow>
				<Switch
					id="queens-auto-cross"
					label={t('controls.autoCross')}
					checked={autoCross}
					onChange={onToggleAutoCross}
					size="sm"
				/>
				<span>{t('controls.autoCrossDesc')}</span>
			</S.HelperRow>
		</S.ControlsContainer>
	);
}
