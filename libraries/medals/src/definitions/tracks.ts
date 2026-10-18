import type { AchievementDefinition } from '../types/index.js';

export const TRACKS_MEDAL_DEFINITIONS: readonly AchievementDefinition<'tracks'>[] = [
	{
		id: 'tracks_first_departure',
		tier: 'bronze',
		titleKey: 'medals.tracks.first_departure.title',
		descriptionKey: 'medals.tracks.first_departure.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'tracks_transcontinental',
		tier: 'gold',
		titleKey: 'medals.tracks.transcontinental.title',
		descriptionKey: 'medals.tracks.transcontinental.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 15,
			progress: Math.min(15, updatedBaseStats.gamesWon),
			target: 15,
		}),
	},
];
