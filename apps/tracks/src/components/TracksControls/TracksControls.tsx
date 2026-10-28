import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import type { JSX } from 'react';
import type { InputMode } from '../../engine/types.js';
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

	const modeOptions: SegmentedControlOption<InputMode>[] = [
		{
			value: 'track',
			label: t('mode.track'),
			icon: <TrackStraightHorizontal />,
			ariaLabel: t('mode.trackDesc'),
		},
		{
			value: 'cross',
			label: t('mode.cross'),
			icon: <CellCross />,
			ariaLabel: t('mode.crossDesc'),
		},
	];

	return (
		<S.ControlsContainer>
			<S.MainBar>
				<SegmentedControl
					size="sm"
					value={inputMode}
					onChange={onToggleMode}
					options={modeOptions}
					ariaLabel={t('mode.label')}
				/>

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
		</S.ControlsContainer>
	);
}
