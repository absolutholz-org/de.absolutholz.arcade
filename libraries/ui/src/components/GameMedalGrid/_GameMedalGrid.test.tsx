import * as libMedals from '@arcade/lib-medals';
import type { MedalDefinition } from '@arcade/lib-medals';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { GameMedalGrid } from './_GameMedalGrid';

const TEST_SUDOKU_DEFINITIONS: readonly MedalDefinition<'sudoku'>[] = [
	{
		id: 'sudoku_first_victory',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.first_victory.title',
		descriptionKey: 'medals.sudoku.first_victory.desc',
		icon: 'trophy-bronze',
		target: 1,
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(updatedBaseStats.gamesWon, 1),
			target: 1,
		}),
	},
	{
		id: 'sudoku_streak',
		type: 'ladder',
		tier: 'gold',
		titleKey: 'medals.sudoku.streak.title',
		descriptionKey: 'medals.sudoku.streak.desc',
		icon: 'trophy-gold',
		thresholds: { bronze: 3, silver: 5, gold: 10 },
		evaluate: ({ updatedBaseStats }) => ({
			currentProgress: updatedBaseStats.bestStreak,
			currentTier: updatedBaseStats.bestStreak >= 3 ? 'bronze' : null,
			nextThreshold: 3,
			bronzeUnlocked: updatedBaseStats.bestStreak >= 3,
			silverUnlocked: updatedBaseStats.bestStreak >= 5,
			goldUnlocked: updatedBaseStats.bestStreak >= 10,
		}),
	},
	{
		id: 'sudoku_are_you_sure',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.are_you_sure.title',
		descriptionKey: 'medals.sudoku.are_you_sure.desc',
		icon: 'trophy-bronze',
		target: 10,
		evaluate: () => ({
			unlocked: false,
			progress: 0,
			target: 10,
		}),
	},
];

const TEST_ANAGRAM_DEFINITIONS: readonly MedalDefinition<'anagram'>[] = [
	{
		id: 'anagram_first_word',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.anagram.first_word.title',
		descriptionKey: 'medals.anagram.first_word.desc',
		icon: 'trophy-bronze',
		target: 1,
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(updatedBaseStats.gamesWon, 1),
			target: 1,
		}),
	},
];

describe('GameMedalGrid', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders semantic list markup (<ul role="list"> and <li> items) with localized titles', async () => {
		const { container } = render(<GameMedalGrid gameId="sudoku" definitions={TEST_SUDOKU_DEFINITIONS} lang="en" />);

		await act(async () => {
			await Promise.resolve();
		});

		const list = container.querySelector('ul[role="list"]');
		expect(list).not.toBeNull();
		expect(list?.getAttribute('aria-label')).toBe('Medal Showcase');

		const items = list?.querySelectorAll('li') ?? [];
		expect(items.length).toBeGreaterThan(0);
		expect(container.textContent).toContain('First Victory');
		expect(container.textContent).toContain('Winning Streak');
		expect(container.textContent).toContain('Back to Lobby');
	});

	it('hydrates standalone and progressive ladder medals from getGameMedalState', async () => {
		vi.spyOn(libMedals, 'getGameMedalState').mockResolvedValue({
			gameId: 'sudoku',
			baseStats: {
				gamesPlayed: 5,
				gamesWon: 4,
				currentStreak: 4,
				maxStreak: 4,
				totalPlayTimeSeconds: 600,
			},
			customStats: {
				winsByDifficulty: {},
				bestTimeByDifficulty: {},
				completedLevels: [],
				zeroHintWins: 0,
				zeroMistakeHardPlusWins: 0,
				maxConsecutiveUndos: 4,
				maxNotesBeforeFirstMove: 0,
			},
			unlockedMedals: {
				sudoku_first_victory: {
					id: 'sudoku_first_victory',
					tier: 'bronze',
					unlockedAt: 1760000000000,
				},
				sudoku_streak: {
					id: 'sudoku_streak',
					tier: 'bronze',
					unlockedAt: 1760000000000,
				},
			},
			medalProgress: {
				sudoku_streak: {
					current: 4,
					target: 5,
					currentProgress: 4,
					currentTier: 'bronze',
					nextThreshold: 5,
					bronzeUnlocked: true,
					silverUnlocked: false,
					goldUnlocked: false,
				},
				sudoku_are_you_sure: {
					current: 4,
					target: 10,
				},
			},
			schemaVersion: 1,
			updatedAt: 1760000000000,
		});

		const { container } = render(<GameMedalGrid gameId="sudoku" definitions={TEST_SUDOKU_DEFINITIONS} lang="en" />);

		await act(async () => {
			await Promise.resolve();
		});

		expect(libMedals.getGameMedalState).toHaveBeenCalledWith('sudoku');
		expect(container.textContent).toContain('4 / 5 (80%)');
		expect(container.textContent).toContain('Next: silver');
		expect(container.textContent).toContain('4 / 10');

		// Verify progressive TriadBadge renders unlocked bronze and locked silver/gold
		const progressiveCard = container.querySelector('[data-mode="progressive"]');
		expect(progressiveCard).not.toBeNull();
		expect(progressiveCard?.querySelector('svg[data-tier="bronze"]')?.getAttribute('data-state')).toBe('unlocked');
		expect(progressiveCard?.querySelector('svg[data-tier="silver"]')?.getAttribute('data-state')).toBe('locked');
	});

	it('resolves the localized lobby button label for anagram', async () => {
		const { container } = render(
			<GameMedalGrid gameId="anagram" definitions={TEST_ANAGRAM_DEFINITIONS} lang="en" />,
		);

		await act(async () => {
			await Promise.resolve();
		});

		const lobbyLink = container.querySelector('a[href="/anagram/en/"]');
		expect(lobbyLink).not.toBeNull();
		expect(lobbyLink?.textContent).toContain('Lobby');
	});
});
