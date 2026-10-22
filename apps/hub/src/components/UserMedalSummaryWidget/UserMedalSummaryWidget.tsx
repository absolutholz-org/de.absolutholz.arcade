import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type GameId, getGameMedalState, subscribeToMedalUnlocked } from '@arcade/lib-medals';
import { ClickableCard } from '@arcade/lib-ui';
import { createUserService } from '@arcade/lib-user';
import { useCallback, useEffect, useState } from 'react';
import * as S from './UserMedalSummaryWidget.styles';
import type { UserMedalSummaryWidgetProps } from './UserMedalSummaryWidget.types';

const REGISTERED_GAMES: readonly GameId[] = [
	'sudoku',
	'nonogram',
	'minesweeper',
	'queens',
	'tracks',
	'bridges',
	'tents',
];

interface UserMedalData {
	readonly totalTrophies: number;
	readonly gold: number;
	readonly silver: number;
	readonly bronze: number;
	readonly isAuthenticated: boolean;
}

function UserMedalSummaryWidgetContent({ lang }: { lang: SupportedLanguageCode }) {
	const { t } = useI18n('medals');
	const [data, setData] = useState<UserMedalData>({
		totalTrophies: 0,
		gold: 0,
		silver: 0,
		bronze: 0,
		isAuthenticated: false,
	});

	const loadUserMedals = useCallback(async () => {
		try {
			let isAuthenticated = false;
			try {
				const userService = createUserService();
				const session = await userService.initialize();
				isAuthenticated = session.isAuthenticated;
			} catch {
				// local guest mode
			}

			if (!isAuthenticated) {
				setData((prev) => (prev.isAuthenticated ? { ...prev, isAuthenticated: false } : prev));
				return;
			}

			let totalTrophies = 0;
			let gold = 0;
			let silver = 0;
			let bronze = 0;

			for (const gameId of REGISTERED_GAMES) {
				const state = await getGameMedalState(gameId);
				for (const unlock of Object.values(state.unlockedMedals)) {
					totalTrophies++;
					if (unlock.tier === 'gold') gold++;
					else if (unlock.tier === 'silver') silver++;
					else if (unlock.tier === 'bronze') bronze++;
				}
			}

			setData({
				totalTrophies,
				gold,
				silver,
				bronze,
				isAuthenticated: true,
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

	if (!data.isAuthenticated) {
		return null;
	}

	const showcaseHref = `/${lang}/medals`;

	return (
		<div className={S.WidgetContainer}>
			<ClickableCard
				as="a"
				href={showcaseHref}
				className={S.BannerCard}
				aria-label={t('showcase.widget.bannerTitle')}
			>
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
			</ClickableCard>
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
