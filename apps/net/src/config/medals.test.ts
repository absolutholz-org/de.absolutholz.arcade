import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { AchievementEvaluationContext, GameMedalState, NetCustomStats } from '@arcade/lib-medals';
import { NET_MEDAL_DEFINITIONS } from './medals.ts';

function createContext(
	customStats: Partial<NetCustomStats> = {},
	won = true,
	levelKey = 'expert',
	playTimeSeconds = 45,
	undoUsed = false,
): AchievementEvaluationContext<'net'> {
	const priorState: GameMedalState<'net'> = {
		gameId: 'net',
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
			expertWins: 0,
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
			gameId: 'net',
			won,
			playTimeSeconds,
			levelKey,
			roundContext: {
				difficulty: levelKey,
				movesCount: 20,
				undoUsed,
			},
		},
	};
}

function getMedal(id: string) {
	const definition = NET_MEDAL_DEFINITIONS.find((medal) => medal.id === id);
	if (!definition) {
		throw new Error(`Missing medal definition: ${id}`);
	}
	return definition;
}

describe('Net Medal Definitions', () => {
	it('defines all canonical medals in NET_MEDAL_DEFINITIONS', () => {
		const ids = NET_MEDAL_DEFINITIONS.map((m) => m.id);
		assert.ok(ids.includes('net_first_online'));
		assert.ok(ids.includes('net_network_architect'));
		assert.ok(ids.includes('net_backbone_engineer'));
		assert.ok(ids.includes('net_speedy_packet'));
		assert.ok(ids.includes('net_hyperscale'));
		assert.ok(ids.includes('net_packet_perfection'));
		assert.ok(ids.includes('net_hotline_streak'));
		assert.ok(ids.includes('net_zero_waste'));
		assert.ok(ids.includes('net_spinning_wheels'));
		assert.ok(ids.includes('net_total_blackout'));
		assert.ok(ids.includes('net_sudden_surge'));
	});

	it('evaluates net_first_online', () => {
		const medal = getMedal('net_first_online');
		assert.equal(medal.evaluate(createContext({}, false)).unlocked, false);
		assert.equal(medal.evaluate(createContext({}, true)).unlocked, true);
	});

	it('evaluates net_backbone_engineer ladder (hard/expert wins 3 / 15 / 50)', () => {
		const medal = getMedal('net_backbone_engineer');
		const bronze = medal.evaluate(createContext({ hardWins: 1, expertWins: 2 }));
		assert.equal(bronze.bronzeUnlocked, true);
		assert.equal(bronze.silverUnlocked, false);
		assert.equal(bronze.goldUnlocked, false);

		const silver = medal.evaluate(createContext({ hardWins: 5, expertWins: 10 }));
		assert.equal(silver.silverUnlocked, true);
		assert.equal(silver.goldUnlocked, false);

		const gold = medal.evaluate(createContext({ hardWins: 20, expertWins: 30 }));
		assert.equal(gold.goldUnlocked, true);
	});

	it('evaluates net_speedy_packet (easy <= 30s)', () => {
		const medal = getMedal('net_speedy_packet');
		// Easy <= 30s
		assert.equal(medal.evaluate(createContext({}, true, 'easy', 30)).unlocked, true);
		// Easy > 30s
		assert.equal(medal.evaluate(createContext({}, true, 'easy', 31)).unlocked, false);
		// Medium <= 30s is not eligible (requires easy)
		assert.equal(medal.evaluate(createContext({}, true, 'medium', 25)).unlocked, false);
	});

	it('evaluates net_hyperscale (hard/expert <= 180s)', () => {
		const medal = getMedal('net_hyperscale');
		// Expert <= 180s
		assert.equal(medal.evaluate(createContext({}, true, 'expert', 120)).unlocked, true);
		// Hard <= 180s
		assert.equal(medal.evaluate(createContext({}, true, 'hard', 180)).unlocked, true);
		// Hard > 180s
		assert.equal(medal.evaluate(createContext({}, true, 'hard', 181)).unlocked, false);
		// Medium <= 180s is not eligible
		assert.equal(medal.evaluate(createContext({}, true, 'medium', 100)).unlocked, false);
	});

	it('evaluates net_packet_perfection (medium/hard/expert without undo)', () => {
		const medal = getMedal('net_packet_perfection');
		// Expert without undo -> unlocked
		assert.equal(medal.evaluate(createContext({}, true, 'expert', 60, false)).unlocked, true);
		// Expert with undo -> locked
		assert.equal(medal.evaluate(createContext({}, true, 'expert', 60, true)).unlocked, false);
		// Easy without undo -> locked (requires medium/hard/expert)
		assert.equal(medal.evaluate(createContext({}, true, 'easy', 20, false)).unlocked, false);
	});

	it('evaluates net_zero_waste', () => {
		const medal = getMedal('net_zero_waste');
		assert.equal(medal.evaluate(createContext({ zeroWasteWins: 0 })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ zeroWasteWins: 1 })).unlocked, true);
	});

	it('evaluates net_spinning_wheels', () => {
		const medal = getMedal('net_spinning_wheels');
		assert.equal(medal.evaluate(createContext({ spinningWheelsCount: 0 })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ spinningWheelsCount: 1 })).unlocked, true);
	});

	it('evaluates net_total_blackout', () => {
		const medal = getMedal('net_total_blackout');
		assert.equal(medal.evaluate(createContext({ totalBlackoutCount: 0 })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ totalBlackoutCount: 1 })).unlocked, true);
	});

	it('evaluates net_sudden_surge', () => {
		const medal = getMedal('net_sudden_surge');
		assert.equal(medal.evaluate(createContext({ suddenSurgeWins: 0 })).unlocked, false);
		assert.equal(medal.evaluate(createContext({ suddenSurgeWins: 1 })).unlocked, true);
	});
});
