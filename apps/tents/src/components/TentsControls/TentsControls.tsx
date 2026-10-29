import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import type { JSX } from 'react';
import { GrassIcon, TentIcon } from '../TentsIcons/index.js';
import * as S from './TentsControls.styles.js';
import type { TentsControlsProps } from './TentsControls.types.js';

export function TentsControls({
	inputMode,
	canUndo,
	canRedo,
	onToggleMode,
	onUndo,
	onRedo,
	onReset,
}: TentsControlsProps): JSX.Element {
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
