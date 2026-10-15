import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { createGameStorage } from '@arcade/lib-storage';

import { GameLandingTemplate, OfflineToggle, useOfflineGame } from '@arcade/lib-ui';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { useEffect, useState } from 'react';
import type { Difficulty, GameSnapshot, SudokuStats } from '../../engine/types';
import * as S from './SudokuLobby.styles';
import type { SudokuLobbyProps } from './SudokuLobby.types';

const storage = createGameStorage('sudoku');
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'veryHard', 'insane', 'inhuman'];

function LobbyContent() {
	const { t, language } = useI18n('sudoku');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [stats, setStats] = useState<SudokuStats | null>(null);
	const { status, installGame, uninstallGame } = useOfflineGame('sudoku');

	useEffect(() => {
		async function loadState() {
			try {
				const game = await storage.get<GameSnapshot>('activeGame');
				if (game && !game.isComplete) {
					setActiveGame(game);
				}
				const storedStats = await storage.get<SudokuStats>('stats');
				if (storedStats) {
					setStats(storedStats);
				}
			} catch {
				// ignore
			}
		}
		loadState();
	}, []);

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}`)} • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/sudoku/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: tCommon('navigation.rules'), href: `/sudoku/${language}/rules` },
		{ label: t('stats.title'), href: `/sudoku/${language}/stats` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
		>
			<S.OfflineToolbar>
				<OfflineToggle
					gameId="sudoku"
					status={status}
					onToggle={status === 'installed' ? uninstallGame : installGame}
					onUninstall={uninstallGame}
				/>
			</S.OfflineToolbar>
			<S.DifficultySection>
				<h2>{t('controls.newGame')}</h2>
				<S.DifficultyGrid>
					{DIFFICULTIES.map((diff) => {
						const best = stats?.[diff]?.bestTimeSeconds;
						const bestLabel =
							best !== undefined && best !== null
								? `${t('status.bestTime')}: ${formatTime(best)}`
								: undefined;

						return (
							<a
								key={diff}
								href={`/sudoku/${language}/game?difficulty=${diff}&new=true`}
								className="difficulty-card"
							>
								<div>
									<div className="diff-name">{t(`difficulty.${diff}`)}</div>
									{bestLabel ? <div className="diff-best">{bestLabel}</div> : null}
								</div>
								<span className="diff-cta">{t('controls.newGame')} →</span>
							</a>
						);
					})}
				</S.DifficultyGrid>
			</S.DifficultySection>
		</GameLandingTemplate>
	);
}

export function SudokuLobby({ lang }: SudokuLobbyProps) {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
