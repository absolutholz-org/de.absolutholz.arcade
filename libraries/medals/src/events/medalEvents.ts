import type { GameId, MedalUnlock } from '../types/index.js';

export const MEDAL_UNLOCKED_EVENT = 'medalUnlocked';

export interface MedalUnlockedEventDetail {
	readonly gameId: GameId;
	readonly medals: readonly MedalUnlock[];
}

export function dispatchMedalUnlockedEvent(gameId: GameId, medals: readonly MedalUnlock[]): void {
	if (typeof window !== 'undefined' && medals.length > 0) {
		const detail: MedalUnlockedEventDetail = { gameId, medals };
		const event = new CustomEvent<MedalUnlockedEventDetail>(MEDAL_UNLOCKED_EVENT, { detail });
		window.dispatchEvent(event);
	}
}

export function subscribeToMedalUnlocked(listener: (detail: MedalUnlockedEventDetail) => void): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const handler = (event: Event) => {
		const customEvent = event as CustomEvent<MedalUnlockedEventDetail>;
		if (customEvent.detail) {
			listener(customEvent.detail);
		}
	};

	window.addEventListener(MEDAL_UNLOCKED_EVENT, handler);
	return () => {
		window.removeEventListener(MEDAL_UNLOCKED_EVENT, handler);
	};
}
