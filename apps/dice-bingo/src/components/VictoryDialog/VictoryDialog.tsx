import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { JSX } from 'react';
import type { VictoryDialogProps } from './VictoryDialog.types.js';

export function VictoryDialog({
	isOpen,
	score,
	elapsedSeconds = 0,
	isNewBestScore = false,
	onPlayAgain,
	onClose,
	difficulty,
}: VictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('dice-bingo');
	const { t: tCommon } = useI18n('common');

	const lobbyHref = difficulty ? `/dice-bingo/${language}/?difficulty=${difficulty}` : `/dice-bingo/${language}/`;

	return (
		<SharedVictoryDialog
			isOpen={isOpen}
			onClose={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			stats={[
				{
					label: t('game.totalScore'),
					value: score,
				},
				{
					label: t('victory.time'),
					value: <Timer seconds={elapsedSeconds} size="lg" showIcon={false} />,
				},
			]}
			isNewBestTime={isNewBestScore}
			bestTimeText={t('victory.newBestScore')}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			lobbyHref={lobbyHref}
			lobbyLabel={t('controls.backToLobby')}
			secondaryActions={<a href={`/dice-bingo/${language}/medals`}>🏅 {tCommon('navigation.medals')}</a>}
		/>
	);
}
