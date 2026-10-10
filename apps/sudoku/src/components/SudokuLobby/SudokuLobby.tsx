import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { createGameStorage } from '@arcade/lib-storage';
import { Button } from '@arcade/lib-ui/components/Button';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { useEffect, useState } from 'react';
import type { Difficulty, GameSnapshot, SudokuStats } from '../../engine/types';
import * as S from './SudokuLobby.styles';
import type { SudokuLobbyProps } from './SudokuLobby.types';
import { Hero } from '@arcade/lib-ui/components/Hero';

const storage = createGameStorage('sudoku');
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'veryHard', 'insane', 'inhuman'];

function LobbyContent() {
	const { t, language } = useI18n('sudoku');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [stats, setStats] = useState<SudokuStats | null>(null);

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

	return (
		<S.LobbyContainer>
			<Hero title={t('title')} tagline={t('description')} />

			{activeGame ? (
				<S.ResumeCard>
					<div className="resume-info">
						<span className="resume-title">{t('controls.resume')}</span>
						<span className="resume-meta">
							{t(`difficulty.${activeGame.difficulty}`)} • {formatTime(activeGame.elapsedSeconds)}
						</span>
					</div>
					<Button as="a" href={`/sudoku/${language}/game?resume=true`} variant="primary" size="md">
						{t('controls.resume')}
					</Button>
				</S.ResumeCard>
			) : null}

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

			<S.QuickLinks>
				<a href={`/sudoku/${language}/rules`}>{tCommon('navigation.rules')}</a>
				<a href={`/sudoku/${language}/stats`}>{t('stats.title')}</a>
			</S.QuickLinks>
		</S.LobbyContainer>
	);
}

export function SudokuLobby({ lang }: SudokuLobbyProps) {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
