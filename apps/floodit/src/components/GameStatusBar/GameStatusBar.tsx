import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
import { styled } from '@linaria/react';
import type { JSX } from 'react';

interface GameStatusBarProps {
	readonly moves: number;
	readonly maxMoves: number;
	readonly floodPercentage: number;
	readonly onRestart: () => void;
	readonly onUndo?: () => void;
	readonly canUndo?: boolean;
}

const BarContainer = styled.section`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	gap: 1rem;
	width: 100%;
	max-width: 32rem;
	margin: 0 auto 1rem;
	padding: 0.75rem 1rem;
	background: var(--arcade-surface-secondary, oklch(0.25 0.02 260));
	border-radius: 0.75rem;
`;

const StatBlock = styled.div`
	display: block;

	& > span {
		display: block;
		font-size: 0.75rem;
		opacity: 0.8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	& > strong {
		display: block;
		font-size: 1.25rem;
		font-weight: 800;
	}
`;

const ProgressTrack = styled.div`
	display: block;
	width: 100%;
	height: 0.5rem;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 0.25rem;
	overflow: hidden;
	margin-top: 0.25rem;
`;

const ProgressBar = styled.div`
	height: 100%;
	background: var(--arcade-primary, oklch(0.75 0.18 150));
	transition: width 0.2s ease-out;
`;

const ControlsBlock = styled.div`
	display: grid;
	grid-auto-flow: column;
	gap: 0.5rem;
	justify-content: end;
`;

export function GameStatusBar({
	moves,
	maxMoves,
	floodPercentage,
	onRestart,
	onUndo,
	canUndo = false,
}: GameStatusBarProps): JSX.Element {
	const { t } = useI18n('floodit');
	const movesLeft = Math.max(0, maxMoves - moves);
	const roundedPercentage = Math.round(floodPercentage);

	return (
		<BarContainer aria-label="Game progress status bar">
			<StatBlock>
				<span>{t('game.movesRemaining')}</span>
				<strong>
					{movesLeft} <small style={{ fontSize: '0.875rem', opacity: 0.7 }}>/ {maxMoves}</small>
				</strong>
			</StatBlock>

			<StatBlock style={{ textAlign: 'center' }}>
				<span>{t('game.percentageFlooded')}</span>
				<strong>{roundedPercentage}%</strong>
				<ProgressTrack
					role="progressbar"
					aria-valuenow={roundedPercentage}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={t('game.percentageFlooded')}
				>
					<ProgressBar style={{ width: `${roundedPercentage}%` }} />
				</ProgressTrack>
			</StatBlock>

			<ControlsBlock>
				{onUndo && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onUndo}
						disabled={!canUndo}
						aria-label={t('controls.undo')}
					>
						↶ {t('controls.undo')}
					</Button>
				)}
				<Button variant="secondary" size="sm" onClick={onRestart} aria-label={t('controls.restart')}>
					↺ {t('controls.restart')}
				</Button>
			</ControlsBlock>

			<VisuallyHidden aria-live="polite">
				{`${movesLeft} moves remaining. ${roundedPercentage} percent flooded.`}
			</VisuallyHidden>
		</BarContainer>
	);
}
