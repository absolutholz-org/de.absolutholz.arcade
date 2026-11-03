import { useMemo } from 'react';
import { getGameTitle } from '../utils/gameTitle.js';
import { useI18n } from './useI18n.js';

/**
 * Idiomatic React hook to resolve a game's localized display title.
 * Automatically synchronizes with the active i18n context language.
 */
export function useGameTitle(gameId: string): string {
	const { language } = useI18n();
	return useMemo(() => getGameTitle(gameId, language), [gameId, language]);
}
