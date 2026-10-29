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
			<S.ModeRow>
				<SegmentedControl
					size="sm"
					value={inputMode}
					onChange={onToggleMode}
					options={modeOptions}
					ariaLabel={t('mode.label')}
				/>
			</S.ModeRow>

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
