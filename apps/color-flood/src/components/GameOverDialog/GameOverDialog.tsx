import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import { styled } from '@linaria/react';
import type { JSX } from 'react';
import type { GameOverDialogProps } from './GameOverDialog.types.ts';

const LossContent = styled.div`
	display: grid;
	gap: 1.5rem;
	text-align: center;
	padding: 1rem 0;
`;

const LossStats = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	background: var(--arcade-surface-secondary, oklch(0.25 0.02 260));
	padding: 1rem;
	border-radius: 0.5rem;
`;

const StatItem = styled.div`
	display: block;

	& > dt {
		font-size: 0.875rem;
		opacity: 0.8;
		margin-bottom: 0.25rem;
	}

	& > dd {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}
`;

const ActionsRow = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.75rem;
	margin-top: 0.5rem;
`;

export function GameOverDialog({
	isOpen,
	isWon,
	moves,
	maxMoves,
	floodPercentage,
	onPlayAgain,
	onNewGame,
	onClose,
	difficulty,
}: GameOverDialogProps): JSX.Element {
	const { t, language } = useI18n('color-flood');
	const { t: tCommon } = useI18n('common');

	const lobbyHref = `/color-flood/${language}/?difficulty=${difficulty}`;

	if (isWon) {
		return (
			<SharedVictoryDialog
				isOpen={isOpen}
				onClose={onClose}
				title={t('game.winTitle')}
				message={t('game.winDescription', { moves })}
				movesCount={moves}
				movesLabel={t('game.moves')}
				hasNextPuzzle={true}
				onNextPuzzle={onNewGame}
				nextPuzzleLabel={t('controls.newGame')}
				onPlayAgain={onPlayAgain}
				playAgainLabel={t('controls.restart')}
				lobbyHref={lobbyHref}
				lobbyLabel={t('controls.backToLobby')}
				secondaryActions={
					<a href={`/color-flood/${language}/medals`} style={{ textDecoration: 'none' }}>
						🏅 {tCommon('navigation.medals')}
					</a>
				}
			/>
		);
	}

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('game.lossTitle')} message={t('game.lossDescription')}>
			<LossContent>
				<LossStats as="dl">
					<StatItem>
						<dt>{t('game.moves')}</dt>
						<dd>
							{moves} / {maxMoves}
						</dd>
					</StatItem>
					<StatItem>
						<dt>{t('game.percentageFlooded')}</dt>
						<dd>{Math.round(floodPercentage)}%</dd>
					</StatItem>
				</LossStats>

				<ActionsRow>
					<Button variant="secondary" onClick={onPlayAgain}>
						{t('controls.restart')}
					</Button>
					<Button variant="primary" onClick={onNewGame}>
						{t('controls.newGame')}
					</Button>
				</ActionsRow>

				<div>
					<Button as="a" href={lobbyHref} variant="ghost">
						{t('controls.backToLobby')}
					</Button>
				</div>
			</LossContent>
		</Dialog>
	);
}
