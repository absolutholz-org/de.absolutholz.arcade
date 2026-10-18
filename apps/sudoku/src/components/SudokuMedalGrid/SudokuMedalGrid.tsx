import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type MedalProgress, type MedalTier, getGameMedalState, subscribeToMedalUnlocked } from '@arcade/lib-medals';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { useCallback, useEffect, useState } from 'react';
import * as S from './SudokuMedalGrid.styles';
import type { SudokuMedalDefinitionItem, SudokuMedalGridProps } from './SudokuMedalGrid.types';

interface HydratedMedalItem extends SudokuMedalDefinitionItem {
	readonly isUnlocked: boolean;
	readonly unlockedAt?: number;
	readonly progress?: MedalProgress;
}

function SudokuMedalGridContent({
	lang,
	staticMedals = [],
}: {
	lang: SupportedLanguageCode;
	staticMedals?: readonly SudokuMedalDefinitionItem[];
}) {
	const { t: tMedals } = useI18n('medals');
	const { t: tSudoku } = useI18n('sudoku');

	const [medals, setMedals] = useState<readonly HydratedMedalItem[]>(() =>
		staticMedals.map((item) => ({
			...item,
			isUnlocked: false,
		})),
	);

	const hydrateMedals = useCallback(async () => {
		try {
			const state = await getGameMedalState('sudoku');
			setMedals((prev) =>
				prev.map((item) => {
					const unlock = state.unlockedMedals[item.id];
					const progress = state.medalProgress[item.id];
					return {
						...item,
						isUnlocked: Boolean(unlock),
						unlockedAt: unlock?.unlockedAt,
						progress: progress ?? (item.target ? { current: 0, target: item.target } : undefined),
					};
				}),
			);
		} catch (error) {
			console.error('Failed to hydrate Sudoku medals:', error);
		}
	}, []);

	useEffect(() => {
		hydrateMedals();
		const unsubscribe = subscribeToMedalUnlocked((detail) => {
			if (detail.gameId === 'sudoku') {
				hydrateMedals();
			}
		});
		return unsubscribe;
	}, [hydrateMedals]);

	const unlockedCount = medals.filter((m) => m.isUnlocked).length;
	const goldCount = medals.filter((m) => m.isUnlocked && m.tier === 'gold').length;
	const silverCount = medals.filter((m) => m.isUnlocked && m.tier === 'silver').length;
	const bronzeCount = medals.filter((m) => m.isUnlocked && m.tier === 'bronze').length;

	return (
		<div className={S.Container}>
			{/* Top Summary Bar */}
			<section className={S.TrophyBar} aria-label={tMedals('showcase.trophiesSummary')}>
				<div className={S.TrophyCard}>
					<span className={S.TrophyCount}>
						{unlockedCount} / {medals.length}
					</span>
					<span className={S.TrophyLabel}>{tMedals('showcase.trophiesSummary')}</span>
				</div>
				<div className={S.TrophyCard} data-tier="gold">
					<span className={S.TrophyCount}>{goldCount}</span>
					<span className={S.TrophyLabel}>{tMedals('showcase.tiers.gold')}</span>
				</div>
				<div className={S.TrophyCard} data-tier="silver">
					<span className={S.TrophyCount}>{silverCount}</span>
					<span className={S.TrophyLabel}>{tMedals('showcase.tiers.silver')}</span>
				</div>
				<div className={S.TrophyCard} data-tier="bronze">
					<span className={S.TrophyCount}>{bronzeCount}</span>
					<span className={S.TrophyLabel}>{tMedals('showcase.tiers.bronze')}</span>
				</div>
			</section>

			{/* Static/Hydrated Medals Grid */}
			<div className={S.MedalsGrid}>
				{medals.map((item) => {
					const progress = item.progress;
					const hasProgress = Boolean(progress && progress.target > 0);
					const currentProgress = progress?.current ?? 0;
					const targetProgress = progress?.target ?? 0;
					const percent =
						hasProgress && targetProgress > 0
							? Math.min(100, Math.round((currentProgress / targetProgress) * 100))
							: 0;

					return (
						<article
							key={item.id}
							className={S.MedalCard}
							data-status={item.isUnlocked ? 'unlocked' : 'locked'}
							data-tier={item.tier}
						>
							<div className={S.MedalHeader}>
								<div className={S.MedalBadge} data-tier={item.tier} aria-hidden="true">
									{item.isUnlocked ? (
										<Icon name="trophy" size="md" />
									) : (
										<Icon name="lock" size="md" />
									)}
								</div>
								<div className={S.MedalMeta}>
									<span className={S.MedalTierBadge}>
										{tMedals(`showcase.tiers.${item.tier}` as `showcase.tiers.${MedalTier}`)}
									</span>
									<h2 className={S.MedalTitle}>{item.title}</h2>
								</div>
							</div>

							<p className={S.MedalDescription}>{item.description}</p>

							<div className={S.MedalFooter}>
								{item.isUnlocked && item.unlockedAt ? (
									<span className={S.UnlockedDate}>
										{tMedals('showcase.status.unlockedOn', {
											date: new Date(item.unlockedAt).toLocaleDateString(lang),
										})}
									</span>
								) : hasProgress ? (
									<div className={S.ProgressContainer}>
										<div className={S.ProgressBarTrack}>
											<div className={S.ProgressBarFill} style={{ width: `${percent}%` }} />
										</div>
										<span className={S.ProgressLabel}>
											{currentProgress} / {targetProgress} ({percent}%)
										</span>
									</div>
								) : (
									<span className={S.ProgressLabel}>{tMedals('showcase.status.locked')}</span>
								)}
							</div>
						</article>
					);
				})}
			</div>

			<div className={S.Actions}>
				<Button
					as="a"
					href={`/sudoku/${lang}/`}
					variant="primary"
					size="md"
					aria-label={tSudoku('controls.backToLobby')}
				>
					{tSudoku('controls.backToLobby')}
				</Button>
			</div>
		</div>
	);
}

export function SudokuMedalGrid({ lang, staticMedals }: SudokuMedalGridProps) {
	return (
		<I18nProvider language={lang}>
			<SudokuMedalGridContent lang={lang} staticMedals={staticMedals} />
		</I18nProvider>
	);
}
