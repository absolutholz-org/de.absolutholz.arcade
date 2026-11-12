import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import type { JSX } from 'react';
import type { InputMode } from '../../engine/types';
import { StarIcon, XMarkIcon } from '../StarBattleIcons';
import * as S from './StarBattleControls.styles';
import type { StarBattleControlsProps } from './StarBattleControls.types';

export function StarBattleControls({ inputMode, onToggleMode }: StarBattleControlsProps): JSX.Element {
	const { t } = useI18n('star-battle');

	const modeOptions: SegmentedControlOption<InputMode>[] = [
		{
			value: 'mark',
			label: t('mode.mark'),
			icon: <XMarkIcon />,
			ariaLabel: t('mode.markDesc'),
		},
		{
			value: 'token',
			label: t('mode.token'),
			icon: <StarIcon />,
			ariaLabel: t('mode.tokenDesc'),
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

export const QueensControls = StarBattleControls;
