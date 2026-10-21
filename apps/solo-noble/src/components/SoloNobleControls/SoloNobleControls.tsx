import { Icon } from '@arcade/lib-ui/components/Icon';
import type { GameStatus } from '../../engine/types.js';
import * as S from './SoloNobleControls.styles.js';

export interface SoloNobleControlsProps {
	pegsRemaining: number;
	movesCount: number;
	status: GameStatus;
	canUndo: boolean;
	canRedo: boolean;
	onUndo: () => void;
	onRedo: () => void;
	onReset: () => void;
	labels: {
		pegsRemaining: string;
		movesCount: string;
		undo: string;
		redo: string;
		reset: string;
		statusReady: string;
		statusWon: string;
		statusStuck: string;
	};
}

export function SoloNobleControls({
	pegsRemaining,
	movesCount,
	status,
	canUndo,
	canRedo,
	onUndo,
	onRedo,
	onReset,
	labels,
}: SoloNobleControlsProps) {
	return (
		<S.ControlsContainer>
			<S.StatsBar>
				<S.StatItem>
					<S.StatLabel>{labels.pegsRemaining}</S.StatLabel>
					<S.StatValue>{pegsRemaining}</S.StatValue>
				</S.StatItem>
				<S.StatItem>
					<S.StatLabel>{labels.movesCount}</S.StatLabel>
					<S.StatValue>{movesCount}</S.StatValue>
				</S.StatItem>
			</S.StatsBar>

			{status === 'ready' && <S.StatusBanner data-status="ready">{labels.statusReady}</S.StatusBanner>}
			{status === 'won' && <S.StatusBanner data-status="won">{labels.statusWon}</S.StatusBanner>}
			{status === 'stuck' && <S.StatusBanner data-status="stuck">{labels.statusStuck}</S.StatusBanner>}

			<S.ButtonRow>
				<S.ActionButton type="button" disabled={!canUndo} onClick={onUndo}>
					<Icon name="undo" size="sm" />
					{labels.undo}
				</S.ActionButton>
				<S.ActionButton type="button" disabled={!canRedo} onClick={onRedo}>
					<Icon name="redo" size="sm" />
					{labels.redo}
				</S.ActionButton>
				<S.ActionButton type="button" data-variant="primary" onClick={onReset}>
					<Icon name="refresh-cw" size="sm" />
					{labels.reset}
				</S.ActionButton>
			</S.ButtonRow>
		</S.ControlsContainer>
	);
}
