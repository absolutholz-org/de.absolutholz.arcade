import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Timer } from '../Timer';
import * as S from './_VictoryDialog.styles';
import type { VictoryDialogProps } from './_VictoryDialog.types';

export function VictoryDialog({
	bestTimeText,
	children,
	elapsedSeconds,
	hasNextPuzzle = false,
	id,
	isNewBestTime = false,
	isOpen,
	lobbyHref,
	lobbyLabel,
	message,
	movesCount,
	movesLabel,
	nextPuzzleLabel,
	onClose,
	onLobby,
	onNextPuzzle,
	onPlayAgain,
	playAgainLabel,
	secondaryActions,
	showCloseButton = true,
	stats,
	timeLabel,
	title,
}: VictoryDialogProps) {
	const { t } = useI18n();

	const resolvedTitle = title || t('app.title');
	const resolvedTimeLabel = timeLabel || 'TIME';
	const resolvedMovesLabel = movesLabel || 'MOVES';
	const resolvedPlayAgain = playAgainLabel || 'Play Again';
	const resolvedLobby = lobbyLabel || 'Lobby';
	const resolvedNextPuzzle = nextPuzzleLabel || 'Next Puzzle';

	const hasTime = elapsedSeconds !== undefined;
	const hasMoves = movesCount !== undefined;
	const statItemsCount = (hasTime ? 1 : 0) + (hasMoves ? 1 : 0) + (stats?.length ?? 0);
	const columnCount = Math.min(Math.max(statItemsCount, 1), 3);

	const showSplitActions = Boolean(onPlayAgain || lobbyHref || onLobby);

	return (
		<Dialog
			id={id}
			isOpen={isOpen}
			onCancel={onClose}
			title={resolvedTitle}
			message={message}
			showCloseButton={showCloseButton}
		>
			<S.VictoryContent>
				{children && <S.VisualSlot>{children}</S.VisualSlot>}

				{statItemsCount > 0 && (
					<S.StatsGrid data-columns={columnCount}>
						{hasTime && (
							<S.StatCard>
								<span data-slot="label">{resolvedTimeLabel}</span>
								<Timer seconds={elapsedSeconds} size="lg" showIcon={false} />
							</S.StatCard>
						)}

						{hasMoves && (
							<S.StatCard>
								<span data-slot="label">{resolvedMovesLabel}</span>
								<span data-slot="value">{movesCount}</span>
							</S.StatCard>
						)}

						{stats?.map((stat) => (
							<S.StatCard key={stat.label}>
								<span data-slot="label">{stat.label}</span>
								<span data-slot="value">{stat.value}</span>
							</S.StatCard>
						))}
					</S.StatsGrid>
				)}

				{isNewBestTime && <S.BestTimeBadge>{bestTimeText || 'New Best Time!'}</S.BestTimeBadge>}

				<S.Actions>
					{hasNextPuzzle && onNextPuzzle && (
						<S.PrimaryAction>
							<Button variant="primary" size="md" onClick={onNextPuzzle}>
								{resolvedNextPuzzle}
							</Button>
						</S.PrimaryAction>
					)}

					{showSplitActions && (
						<S.SplitActions>
							{onPlayAgain && (
								<Button
									variant={hasNextPuzzle && onNextPuzzle ? 'secondary' : 'primary'}
									size="md"
									onClick={onPlayAgain}
								>
									{resolvedPlayAgain}
								</Button>
							)}

							{lobbyHref ? (
								<Button as="a" href={lobbyHref} variant="secondary" size="md">
									{resolvedLobby}
								</Button>
							) : onLobby ? (
								<Button variant="secondary" size="md" onClick={onLobby}>
									{resolvedLobby}
								</Button>
							) : null}
						</S.SplitActions>
					)}

					{secondaryActions && <S.SecondaryActions>{secondaryActions}</S.SecondaryActions>}
				</S.Actions>
			</S.VictoryContent>
		</Dialog>
	);
}
