import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { JSX } from 'react';
import type { VictoryDialogProps } from './VictoryDialog.types.js';

export function VictoryDialog({
	isOpen,
	isMastered,
	foundCount,
	totalCount,
	score,
	elapsedSeconds,
	difficulty,
	mode,
	onPlayAgain,
	onClose,
}: VictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('anagram');

	return (
		<SharedVictoryDialog
			isOpen={isOpen}
			onClose={onClose}
			title={isMastered ? t('victory.masteredTitle') : t('victory.title')}
			message={t('victory.summary', { found: String(foundCount), total: String(totalCount) })}
			elapsedSeconds={elapsedSeconds}
			stats={[
				{
					label: t('hud.score', { score: String(score) }),
					value: score,
				},
			]}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('controls.newRound')}
			statsHref={`/anagram/${language}/stats`}
			medalsHref={`/anagram/${language}/medals`}
			lobbyHref={`/anagram/${language}/?difficulty=${difficulty}&mode=${mode}`}
			lobbyLabel={t('navigation.lobby')}
		/>
	);
}
