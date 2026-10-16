import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import type { JSX } from 'react';
import { CellCross, TrackStraightHorizontal } from '../TracksSvg/index.js';
import * as S from './TracksControls.styles.js';
import type { TracksControlsProps } from './TracksControls.types.js';

export function TracksControls({
	inputMode,
	canUndo,
	canRedo,
	onToggleMode,
	onHint,
	onUndo,
	onRedo,
	onReset,
}: TracksControlsProps): JSX.Element {
	const { t } = useI18n('tracks');

	return (
		<S.ControlsContainer>
			<S.MainBar>
				<S.ModeToggleGroup aria-label={t('mode.label')}>
					<S.ModeButton
						type="button"
						aria-pressed={inputMode === 'track'}
						data-active={inputMode === 'track' ? 'true' : 'false'}
						onClick={() => onToggleMode('track')}
						title={t('mode.trackDesc')}
					>
						<S.MiniIcon>
							<TrackStraightHorizontal />
						</S.MiniIcon>
						<span>{t('mode.track')}</span>
					</S.ModeButton>

					<S.ModeButton
						type="button"
						aria-pressed={inputMode === 'cross'}
						data-active={inputMode === 'cross' ? 'true' : 'false'}
						onClick={() => onToggleMode('cross')}
						title={t('mode.crossDesc')}
					>
						<S.MiniIcon>
							<CellCross />
						</S.MiniIcon>
						<span>{t('mode.cross')}</span>
					</S.ModeButton>
				</S.ModeToggleGroup>

				<S.ActionButtonGroup>
					<S.ActionButton
						type="button"
						onClick={onHint}
						aria-label={t('controls.hint')}
						title={t('controls.hintDesc')}
					>
						<span>{t('controls.hint')}</span>
					</S.ActionButton>

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
