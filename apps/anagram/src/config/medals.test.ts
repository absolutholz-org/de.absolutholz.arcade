import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { AchievementEvaluationContext, AnagramCustomStats, GameMedalState } from '@arcade/lib-medals';
import { ANAGRAM_MEDAL_DEFINITIONS } from './medals.ts';

function createContext(customStats: AnagramCustomStats, won = true): AchievementEvaluationContext<'anagram'> {
	const priorState: GameMedalState<'anagram'> = {
		gameId: 'anagram',
		baseStats: {
			gamesPlayed: 0,
			gamesWon: 0,
			totalPlayTimeSeconds: 0,
			currentStreak: 0,
			bestStreak: 0,
			lastPlayedAt: 0,
		},
		customStats: {
			totalWordsFound: 0,
			expertWins: 0,
			languagesPlayed: {},
			expertLanguagesWon: [],
		},
		unlockedMedals: {},
		medalProgress: {},
		schemaVersion: 1,
		updatedAt: 0,
	};
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
	it('defines all 4 polyglot medals in ANAGRAM_MEDAL_DEFINITIONS', () => {
		const ids = ANAGRAM_MEDAL_DEFINITIONS.map((medal) => medal.id);
		assert.ok(ids.includes('anagram_polyglot_apprentice'));
		assert.ok(ids.includes('anagram_polyglot_trio'));
		assert.ok(ids.includes('anagram_tower_of_babel'));
		assert.ok(ids.includes('anagram_polyglot_expert'));
	});

	it('evaluates anagram_polyglot_apprentice (>= 1 win in at least 2 distinct languages)', () => {
		const medal = getMedal('anagram_polyglot_apprentice');

		assert.equal(medal.evaluate(createContext({ languagesPlayed: { en: 3 } })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ languagesPlayed: { en: 1, de: 0 } })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ languagesPlayed: { en: 1, pt: 1 } })).unlocked, true);
		assert.equal(medal.evaluate(createContext({ languagesPlayed: { de: 2, pt: 1 } })).unlocked, true);
	});

	it('evaluates anagram_polyglot_trio (>= 1 win in en, de, and pt)', () => {
		const medal = getMedal('anagram_polyglot_trio');

		assert.equal(medal.evaluate(createContext({ languagesPlayed: { en: 2, de: 2 } })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ languagesPlayed: { en: 1, de: 1, pt: 0 } })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ languagesPlayed: { en: 1, de: 1, pt: 1 } })).unlocked, true);
	});

	it('evaluates anagram_tower_of_babel ladder (5 / 20 / 50 secondary language wins)', () => {
		const medal = getMedal('anagram_tower_of_babel');

		const none = medal.evaluate(createContext({ languagesPlayed: { en: 50, de: 2, pt: 2 } }));
		assert.equal(none.currentProgress, 4);
		assert.equal(none.currentTier, null);
		assert.equal(none.bronzeUnlocked, false);

		const bronze = medal.evaluate(createContext({ languagesPlayed: { en: 10, de: 3, pt: 2 } }));
		assert.equal(bronze.currentProgress, 5);
		assert.equal(bronze.currentTier, 'bronze');
		assert.equal(bronze.bronzeUnlocked, true);
		assert.equal(bronze.silverUnlocked, false);

		const silver = medal.evaluate(createContext({ languagesPlayed: { de: 12, pt: 8 } }));
		assert.equal(silver.currentProgress, 20);
		assert.equal(silver.currentTier, 'silver');
		assert.equal(silver.silverUnlocked, true);
		assert.equal(silver.goldUnlocked, false);

		const gold = medal.evaluate(createContext({ languagesPlayed: { de: 25, pt: 25 } }));
		assert.equal(gold.currentProgress, 50);
		assert.equal(gold.currentTier, 'gold');
		assert.equal(gold.goldUnlocked, true);
		assert.equal(gold.nextThreshold, null);
	});

	it('evaluates anagram_polyglot_expert (Expert win in at least 2 different languages)', () => {
		const medal = getMedal('anagram_polyglot_expert');

		assert.equal(medal.evaluate(createContext({ expertLanguagesWon: [] })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ expertLanguagesWon: ['en'] })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ expertLanguagesWon: ['en', 'pt'] })).unlocked, true);
		assert.equal(medal.evaluate(createContext({ expertLanguagesWon: ['en', 'de', 'pt'] })).unlocked, true);
	});
});
