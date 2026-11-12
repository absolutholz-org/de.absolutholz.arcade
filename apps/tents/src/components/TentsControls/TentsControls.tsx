import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import type { JSX } from 'react';
import { GrassIcon, TentIcon } from '../TentsIcons/index.js';
import * as S from './TentsControls.styles.js';
import type { TentsControlsProps } from './TentsControls.types.js';

export function TentsControls({ inputMode, onToggleMode }: TentsControlsProps): JSX.Element {
	const { t } = useI18n('tents');

	const modeOptions: SegmentedControlOption<'tent' | 'grass'>[] = [
		{
			value: 'tent',
			label: t('mode.tent'),
			icon: <TentIcon />,
			ariaLabel: t('mode.tentDesc'),
		},
		{
			value: 'grass',
			label: t('mode.grass'),
			icon: <GrassIcon />,
			ariaLabel: t('mode.grassDesc'),
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
