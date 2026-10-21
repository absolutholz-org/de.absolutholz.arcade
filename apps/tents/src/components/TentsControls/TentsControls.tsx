import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import type { JSX } from 'react';
import * as S from './TentsControls.styles.js';
import type { TentsControlsProps } from './TentsControls.types.js';

export function TentsControls({
	inputMode,
	canUndo,
	canRedo,
	onToggleMode,
	onHint,
	onUndo,
	onRedo,
	onReset,
}: TentsControlsProps): JSX.Element {
	const { t } = useI18n('tents');

	return (
		<S.ControlsContainer>
			<S.MainBar>
				<S.ModeToggleGroup aria-label={t('mode.label')}>
					<S.ModeButton
						type="button"
						aria-pressed={inputMode === 'tent'}
						data-active={inputMode === 'tent' ? 'true' : 'false'}
						onClick={() => onToggleMode('tent')}
						title={t('mode.tentDesc')}
					>
						<S.MiniIcon>⛺</S.MiniIcon>
						<span>{t('mode.tent')}</span>
					</S.ModeButton>

					<S.ModeButton
						type="button"
						aria-pressed={inputMode === 'grass'}
						data-active={inputMode === 'grass' ? 'true' : 'false'}
						onClick={() => onToggleMode('grass')}
						title={t('mode.grassDesc')}
					>
						<S.MiniIcon>🌿</S.MiniIcon>
						<span>{t('mode.grass')}</span>
					</S.ModeButton>
				</S.ModeToggleGroup>

				<S.ActionButtonGroup>
					{onHint && (
						<S.ActionButton
							type="button"
							onClick={onHint}
							aria-label={t('controls.hint')}
							title={t('controls.hintDesc')}
						>
							<span>{t('controls.hint')}</span>
						</S.ActionButton>
					)}

					<S.ActionButton
						type="button"
						data-icon-only="true"
						onClick={onUndo}
						disabled={!canUndo}
						aria-label={t('controls.undo')}
						title={t('controls.undo')}
					>
						<Icon name="undo" size="sm" />
					</S.ActionButton>

					<S.ActionButton
						type="button"
						data-icon-only="true"
						onClick={onRedo}
						disabled={!canRedo}
						aria-label={t('controls.redo')}
						title={t('controls.redo')}
					>
						<Icon name="redo" size="sm" />
					</S.ActionButton>

					<S.ActionButton
						type="button"
						data-icon-only="true"
						onClick={onReset}
						aria-label={t('controls.reset')}
						title={t('controls.reset')}
					>
						<Icon name="rotate-ccw" size="sm" />
					</S.ActionButton>
				</S.ActionButtonGroup>
			</S.MainBar>
		</S.ControlsContainer>
	);
}
