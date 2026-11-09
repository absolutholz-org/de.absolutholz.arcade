import { useCallback, useEffect, useState } from 'react';
import { getFavoritesManager } from './favorites.js';

export interface UseFavoritesReturn {
	favorites: string[];
	isFavorite: (gameId: string) => boolean;
	toggleFavorite: (gameId: string) => Promise<void>;
	isHydrated: boolean;
}

/**
 * Reactive hook exposing game favorites with multi-tier persistence and SSR-hydration safety.
 *
 * During SSR, `isHydrated` is false and `favorites` is an empty array to avoid hydration layout shifts.
 * Once mounted in the browser, `isHydrated` transitions to true and stored favorites are resolved.
 */
export function useFavorites(): UseFavoritesReturn {
	const [manager] = useState(() => getFavoritesManager());
	const [favorites, setFavorites] = useState<string[]>(() => [...manager.getFavorites()]);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);

		const unsubscribe = manager.subscribe((next) => {
			setFavorites([...next]);
		});

		void manager.initialize();

		return () => {
			unsubscribe();
		};
	}, [manager]);

	const isFavorite = useCallback(
		(gameId: string): boolean => {
			return favorites.includes(gameId);
		},
		[favorites],
	);

	const toggleFavorite = useCallback(
		async (gameId: string): Promise<void> => {
			await manager.toggleFavorite(gameId);
		},
		[manager],
	);

	return {
		favorites,
		isFavorite,
		toggleFavorite,
		isHydrated,
	};
}
