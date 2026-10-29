import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import {
	type DifficultyBucketStats,
	type GameId,
	type GameStats,
	createEmptyDifficultyBucketStats,
	getGameStats,
} from '@arcade/lib-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function resolveSupportedLanguage(lang: SupportedLanguageCode | string): SupportedLanguageCode {
	const baseCode = lang.split('-')[0];
	const matched = SUPPORTED_LANGUAGES.find((item) => item.code === baseCode);
	return matched ? matched.code : DEFAULT_LANGUAGE;
}

export function useGameStatsDashboard(gameId: GameId, preloadedStats?: GameStats) {
	const [fetchedStats, setFetchedStats] = useState<GameStats | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(!preloadedStats);
	const [activeTab, setActiveTab] = useState<string>('overall');

	const loadStats = useCallback(async () => {
		if (preloadedStats) {
			setIsLoading(false);
			return;
		}
		try {
			setIsLoading(true);
			const result = await getGameStats(gameId);
			setFetchedStats(result);
		} catch (error) {
			console.error(`Failed to load game stats for ${gameId}:`, error);
		} finally {
			setIsLoading(false);
		}
	}, [gameId, preloadedStats]);

	useEffect(() => {
		if (!preloadedStats) {
			loadStats();
		} else {
			setIsLoading(false);
		}
	}, [loadStats, preloadedStats]);

	const stats: GameStats | null = preloadedStats ?? fetchedStats;

	const bucketKeys = useMemo<readonly string[]>(() => {
		if (!stats?.byBucket) return [];
		return Object.keys(stats.byBucket);
	}, [stats?.byBucket]);

	// Ensure active tab is valid
	const resolvedActiveTab = useMemo(() => {
		if (activeTab === 'overall') return 'overall';
		if (bucketKeys.includes(activeTab)) return activeTab;
		return 'overall';
	}, [activeTab, bucketKeys]);

	const activeBucketStats = useMemo<DifficultyBucketStats>(() => {
		if (!stats) return createEmptyDifficultyBucketStats();
		if (resolvedActiveTab === 'overall') return stats.overall;
		return stats.byBucket[resolvedActiveTab] ?? stats.overall;
	}, [stats, resolvedActiveTab]);

	const winRate = useMemo(() => {
		const played = activeBucketStats.gamesPlayed;
		const won = activeBucketStats.gamesWon;
		if (played <= 0) return 0;
		return Math.round((won / played) * 100);
	}, [activeBucketStats.gamesPlayed, activeBucketStats.gamesWon]);

	return {
		stats,
		isLoading,
		activeTab: resolvedActiveTab,
		setActiveTab,
		bucketKeys,
		activeBucketStats,
		winRate,
	};
}
