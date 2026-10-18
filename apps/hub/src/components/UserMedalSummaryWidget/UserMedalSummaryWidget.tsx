import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type GameId, getGameMedalState, subscribeToMedalUnlocked } from '@arcade/lib-medals';
import { createUserService } from '@arcade/lib-user';
import { useCallback, useEffect, useState } from 'react';
import * as S from './UserMedalSummaryWidget.styles';
import type { UserMedalSummaryWidgetProps } from './UserMedalSummaryWidget.types';

const REGISTERED_GAMES: readonly GameId[] = ['sudoku', 'nonogram', 'minesweeper', 'queens', 'tracks'];

interface UserMedalData {
	readonly totalTrophies: number;
	readonly gold: number;
	readonly silver: number;
	readonly bronze: number;
	readonly hasActivity: boolean;
}

function UserMedalSummaryWidgetContent({ lang }: { lang: SupportedLanguageCode }) {
	const { t } = useI18n('medals');
	const [data, setData] = useState<UserMedalData>({
		totalTrophies: 0,
		gold: 0,
		silver: 0,
		bronze: 0,
		hasActivity: false,
	});

	const loadUserMedals = useCallback(async () => {
		try {
			let totalTrophies = 0;
			let gold = 0;
			let silver = 0;
			let bronze = 0;
			let totalGamesPlayed = 0;

			for (const gameId of REGISTERED_GAMES) {
				const state = await getGameMedalState(gameId);
				totalGamesPlayed += state.baseStats.gamesPlayed;
				for (const unlock of Object.values(state.unlockedMedals)) {
					totalTrophies++;
					if (unlock.tier === 'gold') gold++;
					else if (unlock.tier === 'silver') silver++;
					else if (unlock.tier === 'bronze') bronze++;
				}
			}

			// Check auth state
			let isAuthenticated = false;
			try {
				const userService = createUserService();
				const session = await userService.initialize();
				isAuthenticated = session.isAuthenticated;
			} catch {
				// local guest mode
			}

			const hasActivity = totalGamesPlayed > 0 || totalTrophies > 0 || isAuthenticated;

			setData({
				totalTrophies,
				gold,
				silver,
				bronze,
				hasActivity,
			});
		} catch (error) {
			console.error('Failed to load user medal summary:', error);
		}
	}, []);

	useEffect(() => {
		loadUserMedals();
		const unsubscribe = subscribeToMedalUnlocked(() => {
			loadUserMedals();
		});
		return unsubscribe;
	}, [loadUserMedals]);

	const showcaseHref = `/${lang}/medals`;

	if (data.hasActivity) {
		return (
			<div className={S.WidgetContainer}>
				<a href={showcaseHref} className={S.BannerLink} aria-label={t('showcase.widget.bannerTitle')}>
					<div className={S.BannerLeft}>
						<span className={S.TrophyIcon} aria-hidden="true">
							🏆
						</span>
						<div className={S.BannerTextGroup}>
							<h3 className={S.BannerTitle}>{t('showcase.widget.bannerTitle')}</h3>
							<div className={S.MedalsTally}>
								<span className={S.TallyItem}>
									🥇 {data.gold} {t('showcase.tiers.gold')}
								</span>
								<span className={S.TallyItem}>
									🥈 {data.silver} {t('showcase.tiers.silver')}
								</span>
								<span className={S.TallyItem}>
									🥉 {data.bronze} {t('showcase.tiers.bronze')}
								</span>
								<span className={S.TallyItem}>
									({data.totalTrophies} {t('showcase.trophiesSummary')})
								</span>
							</div>
						</div>
					</div>
					<span className={S.CtaBadge} aria-hidden="true">
						{t('showcase.widget.viewShowcase')} →
					</span>
				</a>
			</div>
		);
	}

	return (
		<div className={S.WidgetContainer}>
			<a href={showcaseHref} className={S.GuestTileLink} aria-label={t('showcase.widget.guestTitle')}>
				<div className={S.GuestContent}>
					<span className={S.TrophyIcon} aria-hidden="true">
						🏅
					</span>
					<div>
						<h3 className={S.GuestTitle}>{t('showcase.widget.guestTitle')}</h3>
						<p className={S.GuestDescription}>{t('showcase.widget.guestDescription')}</p>
					</div>
				</div>
				<span className={S.GuestCtaBadge} aria-hidden="true">
					{t('showcase.widget.viewShowcase')} →
				</span>
			</a>
		</div>
	);
}

export function UserMedalSummaryWidget({ lang }: UserMedalSummaryWidgetProps) {
	return (
		<I18nProvider language={lang}>
			<UserMedalSummaryWidgetContent lang={lang} />
		</I18nProvider>
	);
}
