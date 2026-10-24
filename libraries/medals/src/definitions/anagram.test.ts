import { describe, expect, it } from 'vitest';
import { createInitialMedalState } from '../storage/medalStorage.js';
import type { AchievementEvaluationContext, AnagramCustomStats } from '../types/index.js';
import { ANAGRAM_MEDAL_DEFINITIONS } from './anagram.js';
import { getMedalDefinitionsForGame } from './index.js';

function createContext(customStats: AnagramCustomStats, won = true): AchievementEvaluationContext<'anagram'> {
	const priorState = createInitialMedalState('anagram');
	return {
		priorState,
		updatedBaseStats: {
			...priorState.baseStats,
			gamesPlayed: 1,
			gamesWon: won ? 1 : 0,
		},
		updatedCustomStats: {
			...priorState.customStats,
			...customStats,
		},
		result: {
			gameId: 'anagram',
			won,
			playTimeSeconds: 45,
			levelKey: 'easy',
		},
	};
}

function getMedal(id: string) {
	const definition = ANAGRAM_MEDAL_DEFINITIONS.find((medal) => medal.id === id);
	if (!definition) {
		throw new Error(`Missing medal definition: ${id}`);
	}
	return definition;
}

describe('Anagram Polyglot Medals', () => {
	it('registers all 4 polyglot medals in getMedalDefinitionsForGame("anagram")', () => {
		const ids = getMedalDefinitionsForGame('anagram').map((medal) => medal.id);
		expect(ids).toContain('anagram_polyglot_apprentice');
		expect(ids).toContain('anagram_polyglot_trio');
		expect(ids).toContain('anagram_tower_of_babel');
		expect(ids).toContain('anagram_polyglot_expert');
	});

	it('evaluates anagram_polyglot_apprentice (>= 1 win in at least 2 distinct languages)', () => {
		const medal = getMedal('anagram_polyglot_apprentice');

		expect(medal.evaluate(createContext({ languagesPlayed: { en: 3 } })).unlocked).toBe(false);
		expect(medal.evaluate(createContext({ languagesPlayed: { en: 1, de: 0 } })).unlocked).toBe(false);
		expect(medal.evaluate(createContext({ languagesPlayed: { en: 1, pt: 1 } })).unlocked).toBe(true);
		expect(medal.evaluate(createContext({ languagesPlayed: { de: 2, pt: 1 } })).unlocked).toBe(true);
	});

	it('evaluates anagram_polyglot_trio (>= 1 win in en, de, and pt)', () => {
		const medal = getMedal('anagram_polyglot_trio');

		expect(medal.evaluate(createContext({ languagesPlayed: { en: 2, de: 2 } })).unlocked).toBe(false);
		expect(medal.evaluate(createContext({ languagesPlayed: { en: 1, de: 1, pt: 0 } })).unlocked).toBe(false);
		expect(medal.evaluate(createContext({ languagesPlayed: { en: 1, de: 1, pt: 1 } })).unlocked).toBe(true);
	});

	it('evaluates anagram_tower_of_babel ladder (5 / 20 / 50 secondary language wins)', () => {
		const medal = getMedal('anagram_tower_of_babel');

		const none = medal.evaluate(createContext({ languagesPlayed: { en: 50, de: 2, pt: 2 } }));
		expect(none.currentProgress).toBe(4);
		expect(none.currentTier).toBeNull();
		expect(none.bronzeUnlocked).toBe(false);

		const bronze = medal.evaluate(createContext({ languagesPlayed: { en: 10, de: 3, pt: 2 } }));
		expect(bronze.currentProgress).toBe(5);
		expect(bronze.currentTier).toBe('bronze');
		expect(bronze.bronzeUnlocked).toBe(true);
		expect(bronze.silverUnlocked).toBe(false);

		const silver = medal.evaluate(createContext({ languagesPlayed: { de: 12, pt: 8 } }));
		expect(silver.currentProgress).toBe(20);
		expect(silver.currentTier).toBe('silver');
		expect(silver.silverUnlocked).toBe(true);
		expect(silver.goldUnlocked).toBe(false);

		const gold = medal.evaluate(createContext({ languagesPlayed: { de: 25, pt: 25 } }));
		expect(gold.currentProgress).toBe(50);
		expect(gold.currentTier).toBe('gold');
		expect(gold.goldUnlocked).toBe(true);
		expect(gold.nextThreshold).toBeNull();
	});

	it('evaluates anagram_polyglot_expert (Expert win in at least 2 different languages)', () => {
		const medal = getMedal('anagram_polyglot_expert');

		expect(medal.evaluate(createContext({ expertLanguagesWon: [] })).unlocked).toBe(false);
		expect(medal.evaluate(createContext({ expertLanguagesWon: ['en'] })).unlocked).toBe(false);
		expect(medal.evaluate(createContext({ expertLanguagesWon: ['en', 'pt'] })).unlocked).toBe(true);
		expect(medal.evaluate(createContext({ expertLanguagesWon: ['en', 'de', 'pt'] })).unlocked).toBe(true);
	});
});
