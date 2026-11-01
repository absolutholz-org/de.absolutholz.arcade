import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { AchievementEvaluationContext, GameMedalState, UntangleCustomStats } from '@arcade/lib-medals';
import { UNTANGLE_MEDAL_DEFINITIONS } from './medals.ts';

function createContext(
	customStats: Partial<UntangleCustomStats> = {},
	won = true,
	levelKey = 'hard',
	playTimeSeconds = 30,
	undoUsed = false,
): AchievementEvaluationContext<'untangle'> {
	const priorState: GameMedalState<'untangle'> = {
		gameId: 'untangle',
		baseStats: {
			gamesPlayed: 0,
			gamesWon: 0,
			totalPlayTimeSeconds: 0,
			currentStreak: 0,
			bestStreak: 0,
			lastPlayedAt: 0,
		},
		customStats: {
			easyWins: 0,
			mediumWins: 0,
			hardWins: 0,
			winsWithoutUndo: 0,
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
			currentStreak: won ? 1 : 0,
			bestStreak: won ? 1 : 0,
		},
		updatedCustomStats: {
			...priorState.customStats,
			...customStats,
		},
		result: {
			gameId: 'untangle',
			won,
			playTimeSeconds,
			levelKey,
			roundContext: {
				difficulty: levelKey,
				undoUsed,
			},
		},
	};
}

function getMedal(id: string) {
	const definition = UNTANGLE_MEDAL_DEFINITIONS.find((medal) => medal.id === id);
	if (!definition) {
		throw new Error(`Missing medal definition: ${id}`);
	}
	return definition;
}

describe('Untangle Medal Definitions', () => {
	it('defines all canonical medals in UNTANGLE_MEDAL_DEFINITIONS', () => {
		const ids = UNTANGLE_MEDAL_DEFINITIONS.map((m) => m.id);
		assert.ok(ids.includes('untangle_first_win'));
		assert.ok(ids.includes('untangle_wins'));
		assert.ok(ids.includes('untangle_hard_wins'));
		assert.ok(ids.includes('untangle_streak'));
		assert.ok(ids.includes('untangle_speed_demon'));
		assert.ok(ids.includes('untangle_no_undo'));
		assert.ok(ids.includes('untangle_big_unravel'));
		assert.ok(ids.includes('untangle_fewest_moves'));
		assert.ok(ids.includes('untangle_worse_before_better'));
		assert.ok(ids.includes('untangle_flawless_descent'));
	});

	it('evaluates untangle_first_win', () => {
		const medal = getMedal('untangle_first_win');
		assert.equal(medal.evaluate(createContext({}, false)).unlocked, false);
		assert.equal(medal.evaluate(createContext({}, true)).unlocked, true);
	});

	it('evaluates untangle_hard_wins ladder (3 / 15 / 50)', () => {
		const medal = getMedal('untangle_hard_wins');
		const bronze = medal.evaluate(createContext({ hardWins: 3 }));
		assert.equal(bronze.bronzeUnlocked, true);
		assert.equal(bronze.silverUnlocked, false);
		assert.equal(bronze.goldUnlocked, false);

		const silver = medal.evaluate(createContext({ hardWins: 15 }));
		assert.equal(silver.silverUnlocked, true);
		assert.equal(silver.goldUnlocked, false);

		const gold = medal.evaluate(createContext({ hardWins: 50 }));
		assert.equal(gold.goldUnlocked, true);
	});

	it('evaluates untangle_speed_demon (medium/hard <= 45s)', () => {
		const medal = getMedal('untangle_speed_demon');
		// Easy is not eligible
		assert.equal(medal.evaluate(createContext({}, true, 'easy', 20)).unlocked, false);
		// Medium <= 45s is eligible
		assert.equal(medal.evaluate(createContext({}, true, 'medium', 45)).unlocked, true);
		// Medium > 45s is not eligible
		assert.equal(medal.evaluate(createContext({}, true, 'medium', 46)).unlocked, false);
		// Hard <= 45s is eligible
		assert.equal(medal.evaluate(createContext({}, true, 'hard', 30)).unlocked, true);
	});

	it('evaluates untangle_no_undo (hard win without undo)', () => {
		const medal = getMedal('untangle_no_undo');
		// Hard win with undoUsed = false -> unlocked
		assert.equal(medal.evaluate(createContext({}, true, 'hard', 30, false)).unlocked, true);
		// Hard win with undoUsed = true -> locked
		assert.equal(medal.evaluate(createContext({}, true, 'hard', 30, true)).unlocked, false);
		// Medium win without undo -> locked (requires hard)
		assert.equal(medal.evaluate(createContext({}, true, 'medium', 30, false)).unlocked, false);
	});

	it('evaluates untangle_big_unravel (reduced >= 5 crossings in a single move)', () => {
		const medal = getMedal('untangle_big_unravel');
		assert.equal(medal.evaluate(createContext({ maxCrossingsReducedInSingleMove: 4 })).unlocked, false);
		const unlockedEval = medal.evaluate(createContext({ maxCrossingsReducedInSingleMove: 5 }));
		assert.equal(unlockedEval.unlocked, true);
		assert.equal(unlockedEval.progress, 5);
		assert.equal(unlockedEval.target, 5);
	});

	it('evaluates untangle_fewest_moves', () => {
		const medal = getMedal('untangle_fewest_moves');
		assert.equal(medal.evaluate(createContext({ fewestMovesWins: 0 })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ fewestMovesWins: 1 })).unlocked, true);
	});

	it('evaluates untangle_worse_before_better', () => {
		const medal = getMedal('untangle_worse_before_better');
		assert.equal(medal.evaluate(createContext({ reachedDoubleInitialCrossingsCount: 0 })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ reachedDoubleInitialCrossingsCount: 1 })).unlocked, true);
	});

	it('evaluates untangle_flawless_descent', () => {
		const medal = getMedal('untangle_flawless_descent');
		assert.equal(medal.evaluate(createContext({ flawlessDescentWins: 0 })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ flawlessDescentWins: 1 })).unlocked, true);
	});
});
