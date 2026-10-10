import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
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

	return (
		<S.ControlsRoot aria-label={t('aria.gameControls')}>
			{/* Mobile / Touch Fill vs Cross Mode Selector */}
			<S.ModeToggleGroup aria-label={t('controls.modeFill')}>
				<Button
					type="button"
					variant={interactionMode === 'fill' ? 'primary' : 'ghost'}
					size="sm"
					onClick={() => onSetMode('fill')}
					aria-label={t('controls.modeFill')}
					aria-pressed={interactionMode === 'fill'}
				>
					<FillIcon />
					<span>{t('controls.fill')}</span>
				</Button>

				<Button
					type="button"
					variant={interactionMode === 'cross' ? 'primary' : 'ghost'}
					size="sm"
					onClick={() => onSetMode('cross')}
					aria-label={t('controls.modeCross')}
					aria-pressed={interactionMode === 'cross'}
				>
					<CrossIcon />
					<span>{t('controls.cross')}</span>
				</Button>
			</S.ModeToggleGroup>

			{/* Undo / Redo / Reset Action Group */}
			<S.ActionGroup>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onUndo}
					disabled={!canUndo}
					aria-label={t('controls.undo')}
				>
					<Icon name="undo" size="sm" />
				</Button>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onRedo}
					disabled={!canRedo}
					aria-label={t('controls.redo')}
				>
					<Icon name="redo" size="sm" />
				</Button>

				<Button type="button" variant="ghost" size="sm" onClick={onReset} aria-label={t('controls.resetBoard')}>
					<Icon name="rotate-ccw" size="sm" />
				</Button>
			</S.ActionGroup>
		</S.ControlsRoot>
	);
}
