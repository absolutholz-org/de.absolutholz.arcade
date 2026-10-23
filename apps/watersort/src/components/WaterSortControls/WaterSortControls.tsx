import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import type { JSX } from 'react';
import * as S from './WaterSortControls.styles.js';
import type { WaterSortControlsProps } from './WaterSortControls.types.js';

export function WaterSortControls({
	canUndo,
	canRedo,
	onUndo,
	onRedo,
	onReset,
	onHint,
}: WaterSortControlsProps): JSX.Element {
	const { t } = useI18n('watersort');

	return (
		<div className={S.controlsDock} role="toolbar" aria-label="Game controls">
			<Button
				variant="outline"
				size="sm"
				disabled={!canUndo}
				onClick={onUndo}
				leadingIcon={<Icon name="undo" size="sm" />}
				aria-label={t('controls.undo')}
			>
				{t('controls.undo')}
			</Button>

			<Button
				variant="outline"
				size="sm"
				disabled={!canRedo}
				onClick={onRedo}
				leadingIcon={<Icon name="redo" size="sm" />}
				aria-label={t('controls.redo')}
			>
				{t('controls.redo')}
			</Button>

			<Button
				variant="outline"
				size="sm"
				onClick={onReset}
				leadingIcon={<Icon name="rotate-ccw" size="sm" />}
				aria-label={t('controls.reset')}
			>
				{t('controls.reset')}
			</Button>

			<Button variant="primary" size="sm" onClick={onHint} aria-label={t('controls.hint')}>
				{t('controls.hint')}
			</Button>
		</div>
	);
}
