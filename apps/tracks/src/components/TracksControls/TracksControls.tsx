import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import type { JSX } from 'react';
import type { InputMode } from '../../engine/types.js';
import { CellCross, TrackStraightHorizontal } from '../TracksSvg/index.js';
import * as S from './TracksControls.styles.js';
import type { TracksControlsProps } from './TracksControls.types.js';

export function TracksControls({ inputMode, onToggleMode }: TracksControlsProps): JSX.Element {
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
		</S.ControlsContainer>
	);
}
