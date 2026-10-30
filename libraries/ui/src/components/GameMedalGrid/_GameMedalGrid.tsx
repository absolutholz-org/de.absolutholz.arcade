import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import type { GameId, MedalDefinition, MedalTier } from '@arcade/lib-medals';
import type { JSX } from 'react';
import { Button } from '../Button';
import { MedalCard } from '../MedalCard';
import { resolveSupportedLanguage, useGameMedalGrid } from './_GameMedalGrid.hooks';
import * as S from './_GameMedalGrid.styles';
import type { GameMedalGridProps } from './_GameMedalGrid.types';

function GameMedalGridContent<G extends GameId = GameId>({
	gameId,
	definitions,
	lang,
	hideActions = false,
	className,
}: {
	readonly gameId: G;
	readonly definitions: readonly MedalDefinition<G>[];
	readonly lang: SupportedLanguageCode;
	readonly hideActions?: boolean;
	readonly className?: string;
}) {
	const { t: tMedals } = useI18n('medals');
	const { t: tGame } = useI18n(gameId);
	const { medals, counts } = useGameMedalGrid(gameId, definitions);

	const backToLobbyLabel = gameId === 'anagram' ? tGame('navigation.lobby') : tGame('controls.backToLobby');

	return (
		<S.Container className={className}>
			<S.TrophyBar aria-label={tMedals('showcase.trophiesSummary')}>
				<S.TrophyCard>
					<span data-slot="count">
						{counts.unlockedCount} / {counts.totalCount}
					</span>
					<span data-slot="label">{tMedals('showcase.trophiesSummary')}</span>
				</S.TrophyCard>
				<S.TrophyCard data-tier="gold">
					<span data-slot="count">{counts.goldCount}</span>
					<span data-slot="label">{tMedals('showcase.tiers.gold')}</span>
				</S.TrophyCard>
				<S.TrophyCard data-tier="silver">
					<span data-slot="count">{counts.silverCount}</span>
					<span data-slot="label">{tMedals('showcase.tiers.silver')}</span>
				</S.TrophyCard>
				<S.TrophyCard data-tier="bronze">
					<span data-slot="count">{counts.bronzeCount}</span>
					<span data-slot="label">{tMedals('showcase.tiers.bronze')}</span>
				</S.TrophyCard>
			</S.TrophyBar>

			{/* biome-ignore lint/a11y/useSemanticElements: VoiceOver requires explicit role="list" on ul with list-style: none */}
			<S.MedalsList role="list" aria-label={tMedals('showcase.title')}>
				{medals.map((item) => {
					const isProgressive = item.type === 'ladder';
					const progress = item.progress;
					const titleKey = item.titleKey.replace(/^medals\./, '') as TranslationKey;
					const descriptionKey = item.descriptionKey.replace(/^medals\./, '') as TranslationKey;
					const title = tMedals(titleKey);
					const description = tMedals(descriptionKey);
					const unlockedDateText = item.unlockedAt
						? tMedals('showcase.status.unlockedOn', {
								date: new Date(item.unlockedAt).toLocaleDateString(lang),
							})
						: undefined;

					if (isProgressive) {
						const { bronzeUnlocked, silverUnlocked, goldUnlocked } = item;
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
							<S.MedalItem key={item.id}>
								<MedalCard
									mode="progressive"
									title={title}
									description={description}
									bronzeUnlocked={bronzeUnlocked}
									silverUnlocked={silverUnlocked}
									goldUnlocked={goldUnlocked}
									unlockedAt={item.unlockedAt}
									unlockedDateText={unlockedDateText}
									progressiveProgress={{
										current,
										target,
										nextTier,
									}}
									lockedText={tMedals('showcase.status.locked')}
								/>
							</S.MedalItem>
						);
					}

					return (
						<S.MedalItem key={item.id}>
							<MedalCard
								mode="standalone"
								tier={item.tier}
								title={title}
								description={description}
								unlocked={item.isUnlocked}
								unlockedAt={item.unlockedAt}
								unlockedDateText={unlockedDateText}
								progress={
									progress && progress.target > 0
										? { current: progress.current, target: progress.target }
										: undefined
								}
								tierLabel={tMedals(`showcase.tiers.${item.tier}` as `showcase.tiers.${MedalTier}`)}
								lockedText={tMedals('showcase.status.locked')}
							/>
						</S.MedalItem>
					);
				})}
			</S.MedalsList>

			{!hideActions && (
				<S.Actions>
					<Button
						as="a"
						href={`/${gameId}/${lang}/`}
						variant="primary"
						size="md"
						aria-label={backToLobbyLabel}
					>
						{backToLobbyLabel}
					</Button>
				</S.Actions>
			)}
		</S.Container>
	);
}

/**
 * Shared ADR 0008 achievement showcase grid rendering all medals for a gameId.
 * Hydrates unlocked medals and ladder progression from `@arcade/lib-medals` storage.
 */
export function GameMedalGrid<G extends GameId = GameId>({
	gameId,
	definitions,
	lang,
	hideActions,
	className,
}: GameMedalGridProps<G>): JSX.Element {
	const resolvedLang = resolveSupportedLanguage(lang);

	return (
		<I18nProvider language={resolvedLang}>
			<GameMedalGridContent
				gameId={gameId}
				definitions={definitions}
				lang={resolvedLang}
				hideActions={hideActions}
				className={className}
			/>
		</I18nProvider>
	);
}
