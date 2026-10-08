import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { createGameStorage } from '@arcade/lib-storage';
import { Button } from '@arcade/lib-ui/components/Button';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { useEffect, useState } from 'react';
import { type Difficulty, INITIAL_SUDOKU_STATS, type SudokuStats } from '../../engine/types';
import * as S from './SudokuStatsView.styles';
import type { SudokuStatsViewProps } from './SudokuStatsView.types';

const storage = createGameStorage('sudoku');
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'veryHard', 'insane', 'inhuman'];

function StatsContent() {
	const { t, language } = useI18n('sudoku');
	const [stats, setStats] = useState<SudokuStats>(INITIAL_SUDOKU_STATS);

	useEffect(() => {
		async function loadStats() {
			try {
				const stored = await storage.get<SudokuStats>('stats');
				if (stored) {
					setStats(stored);
				}
			} catch {
				// use initial stats
			}
		}
		loadStats();
	}, []);

	const totalGamesPlayed = DIFFICULTIES.reduce((sum, d) => sum + stats[d].gamesPlayed, 0);
	const totalGamesWon = DIFFICULTIES.reduce((sum, d) => sum + stats[d].gamesWon, 0);
	const winRate = totalGamesPlayed > 0 ? Math.round((totalGamesWon / totalGamesPlayed) * 100) : 0;

	return (
		<S.Container>
			<S.SummaryGrid>
				<div className="summary-card">
					<span className="summary-value">{totalGamesPlayed}</span>
					<span className="summary-label">{t('stats.gamesPlayed')}</span>
				</div>
				<div className="summary-card">
					<span className="summary-value">{totalGamesWon}</span>
					<span className="summary-label">{t('stats.gamesWon')}</span>
				</div>
				<div className="summary-card">
					<span className="summary-value">{winRate}%</span>
					<span className="summary-label">{t('stats.winRate')}</span>
				</div>
			</S.SummaryGrid>

			<S.BreakdownSection>
				<h2>{t('stats.title')}</h2>
				<S.BreakdownGrid>
					{DIFFICULTIES.map((diff) => {
						const diffStats = stats[diff];
						const bestTime =
							diffStats.bestTimeSeconds !== null ? formatTime(diffStats.bestTimeSeconds) : '--:--';
						return (
							<div key={diff} className="tier-card">
								<h3 className="tier-title">{t(`difficulty.${diff}`)}</h3>
								<div className="tier-rows">
									<div className="tier-row">
										<span className="label">{t('stats.gamesPlayed')}</span>
										<span className="value">{diffStats.gamesPlayed}</span>
									</div>
									<div className="tier-row">
										<span className="label">{t('stats.gamesWon')}</span>
										<span className="value">{diffStats.gamesWon}</span>
									</div>
									<div className="tier-row">
										<span className="label">{t('stats.bestTime')}</span>
										<span className="value">{bestTime}</span>
									</div>
								</div>
							</div>
						);
					})}
				</S.BreakdownGrid>
			</S.BreakdownSection>

			<S.Actions>
				<Button
					as="a"
					href={`/sudoku/${language}/`}
					variant="primary"
					size="md"
					aria-label={t('controls.backToLobby')}
				>
					{t('controls.backToLobby')}
				</Button>
			</S.Actions>
		</S.Container>
	);
}

export function SudokuStatsView({ lang }: SudokuStatsViewProps) {
	if (lang) {
		return (
			<I18nProvider language={lang}>
				<StatsContent />
			</I18nProvider>
		);
	}

	return <StatsContent />;
}
