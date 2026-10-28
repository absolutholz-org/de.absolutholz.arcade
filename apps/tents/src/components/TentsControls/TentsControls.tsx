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
	onHint,
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
			<S.MainBar>
				<SegmentedControl
					size="sm"
					value={inputMode}
					onChange={onToggleMode}
					options={modeOptions}
					ariaLabel={t('mode.label')}
				/>

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
