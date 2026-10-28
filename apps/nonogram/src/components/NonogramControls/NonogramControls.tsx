import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import type { JSX } from 'react';
import type { InteractionMode } from '../../engine/types';
import { CrossIcon, FillIcon } from '../NonogramIcons';
import * as S from './NonogramControls.styles';

export interface NonogramControlsProps {
	interactionMode: InteractionMode;
	canUndo: boolean;
	canRedo: boolean;
	onToggleMode: () => void;
	onSetMode: (mode: InteractionMode) => void;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
}

export function NonogramControls({
	interactionMode,
	canUndo,
	canRedo,
	onSetMode,
	onUndo,
	onRedo,
	onReset,
}: NonogramControlsProps): JSX.Element {
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
			{/* Top row: Mode Selector */}
			<S.ModeRow>
				<SegmentedControl
					size="sm"
					value={interactionMode}
					onChange={onSetMode}
					options={modeOptions}
					ariaLabel={t('controls.modeFill')}
				/>
			</S.ModeRow>

			{/* Bottom row: Undo / Redo / Restart Action Group */}
			<S.ActionGroup>
				<S.ActionButton type="button" onClick={onUndo} disabled={!canUndo} aria-label={t('common.undo')}>
					<Icon name="undo" size="sm" />
					<span>{t('common.undo')}</span>
				</S.ActionButton>

				<S.ActionButton type="button" onClick={onRedo} disabled={!canRedo} aria-label={t('common.redo')}>
					<Icon name="redo" size="sm" />
					<span>{t('common.redo')}</span>
				</S.ActionButton>

				<S.ActionButton type="button" onClick={onReset} aria-label={t('common.restart')}>
					<Icon name="rotate-ccw" size="sm" />
					<span>{t('common.restart')}</span>
				</S.ActionButton>
			</S.ActionGroup>
		</S.ControlsRoot>
	);
}
