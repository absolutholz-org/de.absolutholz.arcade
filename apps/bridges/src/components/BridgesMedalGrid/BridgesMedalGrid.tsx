import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type MedalProgress, type MedalTier, getGameMedalState, subscribeToMedalUnlocked } from '@arcade/lib-medals';
import { MedalCard } from '@arcade/lib-ui';
import { Button } from '@arcade/lib-ui/components/Button';
import { useCallback, useEffect, useState } from 'react';
import * as S from './BridgesMedalGrid.styles.js';
import type { BridgesMedalDefinitionItem, BridgesMedalGridProps } from './BridgesMedalGrid.types.js';

interface HydratedMedalItem extends BridgesMedalDefinitionItem {
	readonly isUnlocked: boolean;
	readonly unlockedAt?: number;
	readonly progress?: MedalProgress;
	readonly bronzeUnlocked?: boolean;
	readonly silverUnlocked?: boolean;
	readonly goldUnlocked?: boolean;
}

function BridgesMedalGridContent({
	lang,
	staticMedals = [],
}: {
	lang: SupportedLanguageCode;
	staticMedals?: readonly BridgesMedalDefinitionItem[];
}) {
	const { t: tMedals } = useI18n('medals');
	const { t: tBridges } = useI18n('bridges');

	const [medals, setMedals] = useState<readonly HydratedMedalItem[]>(() =>
		staticMedals.map((item) => ({
			...item,
			isUnlocked: false,
		})),
	);

	const hydrateMedals = useCallback(async () => {
		try {
			const state = await getGameMedalState('bridges');
			setMedals((prev) =>
				prev.map((item) => {
					const unlock = state.unlockedMedals[item.id];
					const progress = state.medalProgress[item.id];
					const isLadder = item.type === 'ladder';

					let bronzeUnlocked = false;
					let silverUnlocked = false;
					let goldUnlocked = false;

					if (isLadder) {
						bronzeUnlocked = Boolean(
							progress?.bronzeUnlocked ||
								unlock?.tier === 'bronze' ||
								unlock?.tier === 'silver' ||
								unlock?.tier === 'gold',
						);
						silverUnlocked = Boolean(
							progress?.silverUnlocked || unlock?.tier === 'silver' || unlock?.tier === 'gold',
						);
						goldUnlocked = Boolean(progress?.goldUnlocked || unlock?.tier === 'gold');
					}

					return {
						...item,
						isUnlocked: Boolean(unlock),
						unlockedAt: unlock?.unlockedAt,
						progress: progress ?? (item.target ? { current: 0, target: item.target } : undefined),
						bronzeUnlocked,
						silverUnlocked,
						goldUnlocked,
					};
				}),
			);
		} catch (error) {
			console.error('Failed to hydrate Bridges medals:', error);
		}
	}, []);

	useEffect(() => {
		hydrateMedals();
		const unsubscribe = subscribeToMedalUnlocked((detail) => {
			if (detail.gameId === 'bridges') {
				hydrateMedals();
			}
		});
		return unsubscribe;
	}, [hydrateMedals]);

	const goldCount = medals.filter(
		(m) => m.goldUnlocked || (m.type === 'standalone' && m.isUnlocked && m.tier === 'gold'),
	).length;
	const silverCount = medals.filter(
		(m) => m.silverUnlocked || (m.type === 'standalone' && m.isUnlocked && m.tier === 'silver'),
	).length;
	const bronzeCount = medals.filter(
		(m) => m.bronzeUnlocked || (m.type === 'standalone' && m.isUnlocked && m.tier === 'bronze'),
	).length;
	const unlockedCount = medals.filter(
		(m) => m.isUnlocked || m.bronzeUnlocked || m.silverUnlocked || m.goldUnlocked,
	).length;

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

			{/* Static/Hydrated Medals Grid consuming design system MedalCard */}
			<div className={S.MedalsGrid}>
				{medals.map((item) => {
					const isProgressive = item.type === 'ladder';
					const progress = item.progress;

					if (isProgressive) {
						const bronzeUnlocked = Boolean(item.bronzeUnlocked);
						const silverUnlocked = Boolean(item.silverUnlocked);
						const goldUnlocked = Boolean(item.goldUnlocked);
						const nextTier: MedalTier | undefined = !bronzeUnlocked
							? 'bronze'
							: !silverUnlocked
								? 'silver'
								: !goldUnlocked
									? 'gold'
									: undefined;

						const current = progress?.currentProgress ?? progress?.current ?? 0;
						const target =
							progress?.nextThreshold ??
							(nextTier === 'bronze'
								? (item.thresholds?.bronze ?? 3)
								: nextTier === 'silver'
									? (item.thresholds?.silver ?? 5)
									: (item.thresholds?.gold ?? 10));

						return (
							<MedalCard
								key={item.id}
								mode="progressive"
								title={item.title}
								description={item.description}
								bronzeUnlocked={bronzeUnlocked}
								silverUnlocked={silverUnlocked}
								goldUnlocked={goldUnlocked}
								unlockedAt={item.unlockedAt}
								unlockedDateText={
									item.unlockedAt
										? tMedals('showcase.status.unlockedOn', {
												date: new Date(item.unlockedAt).toLocaleDateString(lang),
											})
										: undefined
								}
								progressiveProgress={{
									current,
									target,
									nextTier,
								}}
								lockedText={tMedals('showcase.status.locked')}
							/>
						);
					}

					return (
						<MedalCard
							key={item.id}
							mode="standalone"
							tier={item.tier}
							title={item.title}
							description={item.description}
							unlocked={item.isUnlocked}
							unlockedAt={item.unlockedAt}
							unlockedDateText={
								item.unlockedAt
									? tMedals('showcase.status.unlockedOn', {
											date: new Date(item.unlockedAt).toLocaleDateString(lang),
										})
									: undefined
							}
							progress={
								progress && progress.target > 0
									? { current: progress.current, target: progress.target }
									: undefined
							}
							tierLabel={tMedals(`showcase.tiers.${item.tier}` as `showcase.tiers.${MedalTier}`)}
							lockedText={tMedals('showcase.status.locked')}
						/>
					);
				})}
			</div>

			<div className={S.Actions}>
				<Button
					as="a"
					href={`/bridges/${lang}/`}
					variant="primary"
					size="md"
					aria-label={tBridges('controls.backToLobby')}
				>
					{tBridges('controls.backToLobby')}
				</Button>
			</div>
		</div>
	);
}

export function BridgesMedalGrid({ lang, staticMedals }: BridgesMedalGridProps) {
	return (
		<I18nProvider language={lang}>
			<BridgesMedalGridContent lang={lang} staticMedals={staticMedals} />
		</I18nProvider>
	);
}
