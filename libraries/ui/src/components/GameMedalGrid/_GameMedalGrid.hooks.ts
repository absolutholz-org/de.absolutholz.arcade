import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import {
	type GameId,
	type GameMedalState,
	type MedalDefinition,
	getGameMedalState,
	subscribeToMedalUnlocked,
} from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GameMedalSummaryCounts, HydratedGameMedalItem } from './_GameMedalGrid.types';

export function resolveSupportedLanguage(lang: SupportedLanguageCode | string): SupportedLanguageCode {
	const baseCode = lang.split('-')[0];
	const matched = SUPPORTED_LANGUAGES.find((item) => item.code === baseCode);
	return matched ? matched.code : DEFAULT_LANGUAGE;
}

export function useGameMedalGrid<G extends GameId = GameId>(
	gameId: G,
	definitions: readonly MedalDefinition<G>[],
): {
	readonly medals: readonly HydratedGameMedalItem[];
	readonly counts: GameMedalSummaryCounts;
} {
	const [medalState, setMedalState] = useState<GameMedalState<G> | null>(null);

	const hydrateMedals = useCallback(async () => {
		try {
			const state = await getGameMedalState(gameId);
			setMedalState(state);
		} catch (error) {
			console.error(`Failed to hydrate ${gameId} medals:`, error);
		}
	}, [gameId]);

	useEffect(() => {
		setMedalState(null);
		hydrateMedals();
		const unsubscribe = subscribeToMedalUnlocked((detail) => {
			if (detail.gameId === gameId) {
				hydrateMedals();
			}
		});
		return unsubscribe;
	}, [gameId, hydrateMedals]);

	const medals = useMemo<readonly HydratedGameMedalItem[]>(() => {
		return definitions.map((def) => {
			const type = def.type ?? 'standalone';
			const unlock = medalState?.unlockedMedals[def.id];
			const progress = medalState?.medalProgress[def.id];
			const isLadder = type === 'ladder';
			const target = def.target ?? def.thresholds?.gold;

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

			const resolvedProgress =
				progress ?? (target !== undefined ? { current: unlock ? target : 0, target } : undefined);

			return {
				id: def.id,
				type,
				tier: def.tier,
				titleKey: def.titleKey,
				descriptionKey: def.descriptionKey,
				icon: def.icon,
				target,
				thresholds: def.thresholds,
				isUnlocked: Boolean(unlock),
				unlockedAt: unlock?.unlockedAt,
				progress: resolvedProgress,
				bronzeUnlocked,
				silverUnlocked,
				goldUnlocked,
			};
		});
	}, [definitions, medalState]);

	const counts = useMemo<GameMedalSummaryCounts>(() => {
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

		return {
			totalCount: medals.length,
			unlockedCount,
			goldCount,
			silverCount,
			bronzeCount,
		};
	}, [medals]);

	return { medals, counts };
}
