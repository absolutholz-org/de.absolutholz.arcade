import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { JSX } from 'react';
import type { VictoryDialogProps } from './VictoryDialog.types.js';

export function VictoryDialog({
	isOpen,
	elapsedSeconds,
	movesCount,
	isNewBestTime,
	hasNextPuzzle = false,
	onNextPuzzle,
	onPlayAgain,
	onClose,
	gameMode = 'standard',
	difficulty,
}: VictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('untangle');
	const { t: tCommon } = useI18n('common');

	const lobbyHref = difficulty ? `/untangle/${language}/?difficulty=${difficulty}` : `/untangle/${language}/`;

	return (
		<SharedVictoryDialog
			isOpen={isOpen}
			onClose={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			elapsedSeconds={gameMode === 'standard' ? elapsedSeconds : undefined}
			timeLabel={t('status.time')}
			movesCount={movesCount}
			movesLabel={t('status.moves', { count: movesCount })}
			isNewBestTime={Boolean(isNewBestTime && gameMode === 'standard')}
			bestTimeText={t('status.newBestTime')}
			hasNextPuzzle={hasNextPuzzle}
			onNextPuzzle={onNextPuzzle}
			nextPuzzleLabel={t('victory.nextLevel')}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			lobbyHref={lobbyHref}
			lobbyLabel={t('controls.backToLobby')}
			secondaryActions={<a href={`/untangle/${language}/medals`}>🏅 {tCommon('navigation.medals')}</a>}
		/>
	);
}
