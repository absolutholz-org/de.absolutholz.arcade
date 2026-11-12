import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import type { JSX } from 'react';
import type { InteractionMode } from '../../engine/types';
import { CrossIcon, FillIcon } from '../NonogramIcons';
import * as S from './NonogramControls.styles';

export interface NonogramControlsProps {
	interactionMode: InteractionMode;
	onToggleMode: () => void;
	onSetMode: (mode: InteractionMode) => void;
}

export function NonogramControls({ interactionMode, onSetMode }: NonogramControlsProps): JSX.Element {
	const { t } = useI18n('nonogram');

	const modeOptions: SegmentedControlOption<InteractionMode>[] = [
		{
			value: 'fill',
			label: t('controls.fill'),
			icon: <FillIcon />,
			ariaLabel: t('controls.modeFill'),
		},
		{
			value: 'cross',
			label: t('controls.cross'),
			icon: <CrossIcon />,
			ariaLabel: t('controls.modeCross'),
		},
	];

	return (
		<S.ControlsRoot aria-label={t('aria.gameControls')}>
			{/* Mode Selector */}
			<S.ModeRow>
				<SegmentedControl
					size="sm"
					value={interactionMode}
					onChange={onSetMode}
					options={modeOptions}
					ariaLabel={t('controls.modeFill')}
				/>
			</S.ModeRow>
		</S.ControlsRoot>
	);
}
