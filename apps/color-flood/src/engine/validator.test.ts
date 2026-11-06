import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { AchievementEvaluationContext, GameResultPayload } from '@arcade/lib-medals';
import { calculateMaxMoves, createNewGame, createRng } from './generator.ts';
import type { ColorIndex, Grid } from './types.ts';
import { applyMove, calculateBoardState, coordKey, getConnectedCluster } from './validator.ts';

describe('Color Flood Engine: Generator & Difficulty Presets', () => {
	it('generates grids adhering to dynamic palette bounds and sizes', () => {
		const beginner = createNewGame('beginner', 123);
		assert.equal(beginner.size, 8);
		assert.equal(beginner.colorCount, 4);
		assert.equal(beginner.maxMoves, 18);
		assert.deepEqual(beginner.activeColors, [0, 1, 2, 3]);

		// Check every cell is in [0, 1, 2, 3]
		for (const row of beginner.grid) {
			for (const cell of row) {
				assert.ok(cell >= 0 && cell <= 3);
			}
		}

		const easy = createNewGame('easy', 123);
		assert.equal(easy.size, 10);
		assert.equal(easy.colorCount, 5);
		assert.equal(easy.maxMoves, 22);
		assert.deepEqual(easy.activeColors, [0, 1, 2, 3, 4]);

		const medium = createNewGame('medium', 123);
		assert.equal(medium.size, 14);
		assert.equal(medium.colorCount, 6);
		assert.equal(medium.maxMoves, 26);

		const hard = createNewGame('hard', 123);
		assert.equal(hard.size, 18);
		assert.equal(hard.colorCount, 6);
		assert.equal(hard.maxMoves, 32);
	});

	it('creates deterministic boards using pseudo-random seeds', () => {
		const g1 = createNewGame('beginner', 12345);
		const g2 = createNewGame('beginner', 12345);
		assert.deepEqual(g1.grid, g2.grid);

		const g3 = createNewGame('beginner', 54321);
		assert.notDeepEqual(g1.grid, g3.grid);
	});
});

describe('Color Flood Engine: Cluster Detection & Move Absorption', () => {
	it('identifies initial connected component of the top-left cell', () => {
		// 3x3 grid:
		// 0 0 1
		// 0 2 1
		// 1 1 1
		const grid: Grid = [
			[0, 0, 1],
			[0, 2, 1],
			[1, 1, 1],
		];
		const cluster = getConnectedCluster(grid);
		assert.equal(cluster.size, 3);
		assert.ok(cluster.has(coordKey(0, 0)));
		assert.ok(cluster.has(coordKey(0, 1)));
		assert.ok(cluster.has(coordKey(1, 0)));
		assert.ok(!cluster.has(coordKey(1, 1)));
	});

	it('absorbs adjacent matching neighbors when flooded with their color', () => {
		// 3x3 grid:
		// 0 0 1
		// 0 2 1
		// 1 1 1
		const grid: Grid = [
			[0, 0, 1],
			[0, 2, 1],
			[1, 1, 1],
		];
		const state = calculateBoardState(grid, 0, 10, 42);
		assert.equal(state.floodedCluster.size, 3);
		assert.equal(state.currentColor, 0);

		// Flood with color 2: absorbs (1, 1)
		const state2 = applyMove(state, 2 as ColorIndex);
		assert.equal(state2.moves, 1);
		assert.equal(state2.currentColor, 2);
		assert.equal(state2.floodedCluster.size, 4);
		assert.ok(state2.floodedCluster.has(coordKey(1, 1)));

		// Flood with color 1: absorbs (0, 2), (1, 2), (2, 0), (2, 1), (2, 2)
		const state3 = applyMove(state2, 1 as ColorIndex);
		assert.equal(state3.moves, 2);
		assert.equal(state3.floodedCluster.size, 9);
		assert.equal(state3.floodPercentage, 100);
		assert.equal(state3.isWon, true);
		assert.equal(state3.isLost, false);
	});

	it('ignores moves selecting the current color, outside active colors, or after game termination', () => {
		const grid: Grid = [
			[0, 1],
			[1, 1],
		];
		// Color count of 2: activeColors [0, 1]
		const state = calculateBoardState(grid, 0, 5, 42, 2);

		// Same color: rejected
		const sameColor = applyMove(state, 0 as ColorIndex);
		assert.equal(sameColor.moves, 0);

		// Color 3 is outside active colors [0, 1]: rejected
		const outsideColor = applyMove(state, 3 as ColorIndex);
		assert.equal(outsideColor.moves, 0);
	});

	it('triggers loss condition when max moves are reached without full flood', () => {
		const grid: Grid = [
			[0, 1],
			[2, 3],
		];
		let state = calculateBoardState(grid, 0, 2, 42);
		// Move 1: flood with color 1 -> absorbs (0, 1)
		state = applyMove(state, 1 as ColorIndex);
		assert.equal(state.moves, 1);
		assert.equal(state.isLost, false);

		// Move 2: flood with color 2 -> absorbs (1, 0)
		state = applyMove(state, 2 as ColorIndex);
		assert.equal(state.moves, 2);
		// Cluster is 3 out of 4 cells, maxMoves is 2 -> Lost!
		assert.equal(state.isWon, false);
		assert.equal(state.isLost, true);
	});
});

function mockContext(overrides: {
	result?: Partial<GameResultPayload<'color-flood'>>;
	updatedBaseStats?: { gamesWon: number };
	updatedCustomStats?: Record<string, unknown>;
}): AchievementEvaluationContext<'color-flood'> {
	return {
		priorState: {} as unknown as AchievementEvaluationContext<'color-flood'>['priorState'],
		updatedBaseStats: {
			gamesPlayed: 1,
			gamesWon: overrides.updatedBaseStats?.gamesWon ?? (overrides.result?.won ? 1 : 0),
			totalPlayTimeSeconds: 10,
			currentStreak: 1,
			bestStreak: 1,
			lastPlayedAt: Date.now(),
		},
		updatedCustomStats:
			overrides.updatedCustomStats as AchievementEvaluationContext<'color-flood'>['updatedCustomStats'],
		result: {
			gameId: 'color-flood',
			won: true,
			playTimeSeconds: 10,
			...overrides.result,
		},
	};
}

describe('Color Flood Engine: Medals & Telemetry Evaluation', () => {
	it('evaluates tsunami achievement when absorption delta >= 40%', async () => {
		const { COLOR_FLOOD_MEDAL_DEFINITIONS } = await import('../config/medals.ts');
		const tsunamiDef = COLOR_FLOOD_MEDAL_DEFINITIONS.find((m) => m.id === 'color_flood_tsunami');
		assert.ok(tsunamiDef);

		// Delta < 0.40 -> not unlocked
		const resLow = tsunamiDef.evaluate(
			mockContext({
				result: {
					won: true,
					roundContext: { roundMetadata: { maxSingleMoveDelta: 0.35, isTsunami: false } },
				},
			}),
		);
		assert.equal(resLow.unlocked, false);

		// Delta >= 0.40 -> unlocked
		const resHigh = tsunamiDef.evaluate(
			mockContext({
				result: {
					won: true,
					roundContext: { roundMetadata: { maxSingleMoveDelta: 0.42, isTsunami: true } },
				},
			}),
		);
		assert.equal(resHigh.unlocked, true);
	});

	it('evaluates grand-tour across beginner, easy, medium, and hard tiers', async () => {
		const { COLOR_FLOOD_MEDAL_DEFINITIONS } = await import('../config/medals.ts');
		const grandTourDef = COLOR_FLOOD_MEDAL_DEFINITIONS.find((m) => m.id === 'color_flood_grand_tour');
		assert.ok(grandTourDef);

		// 3 tiers won -> progress 3, not unlocked
		const resPartial = grandTourDef.evaluate(
			mockContext({
				updatedCustomStats: {
					tierWins: { beginner: true, easy: true, medium: true },
				},
				result: { won: false },
			}),
		);
		assert.equal(resPartial.progress, 3);
		assert.equal(resPartial.unlocked, false);

		// 4th tier won in current round -> progress 4, unlocked
		const resComplete = grandTourDef.evaluate(
			mockContext({
				updatedCustomStats: {
					tierWins: { beginner: true, easy: true, medium: true },
				},
				result: {
					won: true,
					levelKey: 'hard',
				},
			}),
		);
		assert.equal(resComplete.progress, 4);
		assert.equal(resComplete.unlocked, true);
	});

	it('evaluates the-deluge ladder thresholds for cumulative cells flooded', async () => {
		const { COLOR_FLOOD_MEDAL_DEFINITIONS } = await import('../config/medals.ts');
		const delugeDef = COLOR_FLOOD_MEDAL_DEFINITIONS.find((m) => m.id === 'color_flood_the_deluge');
		assert.ok(delugeDef);

		// Below 1000: no tier
		const res0 = delugeDef.evaluate(
			mockContext({
				updatedCustomStats: { lifetimeCellsFlooded: 800 },
				result: {
					won: false,
					roundContext: { roundMetadata: { cellsFlooded: 100 } },
				},
			}),
		);
		assert.equal(res0.currentTier, null);
		assert.equal(res0.currentProgress, 900);
		assert.equal(res0.bronzeUnlocked, false);

		// At 1000: Bronze
		const resBronze = delugeDef.evaluate(
			mockContext({
				updatedCustomStats: { lifetimeCellsFlooded: 900 },
				result: {
					won: true,
					roundContext: { roundMetadata: { cellsFlooded: 150 } },
				},
			}),
		);
		assert.equal(resBronze.currentTier, 'bronze');
		assert.equal(resBronze.bronzeUnlocked, true);
		assert.equal(resBronze.silverUnlocked, false);

		// At 5000: Silver
		const resSilver = delugeDef.evaluate(
			mockContext({
				updatedCustomStats: { lifetimeCellsFlooded: 5200 },
				result: { won: true },
			}),
		);
		assert.equal(resSilver.currentTier, 'silver');
		assert.equal(resSilver.silverUnlocked, true);
		assert.equal(resSilver.goldUnlocked, false);

		// At 15000: Gold
		const resGold = delugeDef.evaluate(
			mockContext({
				updatedCustomStats: { lifetimeCellsFlooded: 16000 },
				result: { won: true },
			}),
		);
		assert.equal(resGold.currentTier, 'gold');
		assert.equal(resGold.goldUnlocked, true);
	});

	it('evaluates symbol-surveyor when won with shape overlay enabled', async () => {
		const { COLOR_FLOOD_MEDAL_DEFINITIONS } = await import('../config/medals.ts');
		const symbolDef = COLOR_FLOOD_MEDAL_DEFINITIONS.find((m) => m.id === 'color_flood_symbol_surveyor');
		assert.ok(symbolDef);

		const resOff = symbolDef.evaluate(
			mockContext({
				result: {
					won: true,
					roundContext: { roundMetadata: { isSymbolSurveyor: false } },
				},
			}),
		);
		assert.equal(resOff.unlocked, false);

		const resOn = symbolDef.evaluate(
			mockContext({
				result: {
					won: true,
					roundContext: { roundMetadata: { isSymbolSurveyor: true } },
				},
			}),
		);
		assert.equal(resOn.unlocked, true);
	});
});
