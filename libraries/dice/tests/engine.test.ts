import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../src/cryptoRng';
import { calculateDiceStats, createDice, resetDice, rollDice, setDieHold, toggleDieHold } from '../src/engine';
import { type DieState, STANDARD_DIE_SIDES } from '../src/types';

function freezeDiceSnapshot(dice: DieState[]): DieState[] {
	for (const die of dice) {
		Object.freeze(die);
	}
	Object.freeze(dice);
	return dice;
}

describe('engine', () => {
	describe('createDice', () => {
		it('creates dice with default count (2), default sides (6), baseline value 1, and unique IDs', () => {
			const dice = createDice();

			expect(dice).toHaveLength(2);
			expect(dice[0]?.id).not.toBe(dice[1]?.id);
			for (const die of dice) {
				expect(die.sides).toBe(6);
				expect(die.value).toBe(1);
				expect(die.isHeld).toBe(false);
				expect(die.isRolling).toBe(false);
			}
		});

		it('supports every standard die side configuration and valid counts up to 20', () => {
			for (const sides of STANDARD_DIE_SIDES) {
				const dice = createDice(3, sides);
				expect(dice).toHaveLength(3);
				expect(dice.every((die) => die.sides === sides)).toBe(true);
			}

			const maxDice = createDice(20, 12);
			expect(maxDice).toHaveLength(20);
			expect(new Set(maxDice.map((die) => die.id)).size).toBe(20);
		});

		it('throws RangeError for invalid counts or unsupported side counts', () => {
			expect(() => createDice(0)).toThrow(RangeError);
			expect(() => createDice(-2)).toThrow(RangeError);
			expect(() => createDice(21)).toThrow(RangeError);
			expect(() => createDice(2.5)).toThrow(RangeError);
			expect(() => createDice(2, 7 as never)).toThrow(RangeError);
		});
	});

	describe('rollDice and hold invariants', () => {
		it('never changes held dice values across repeated rollDice calls while rolling unheld dice', () => {
			const initial: DieState[] = [
				{ id: 'd1', sides: 6, value: 5, isHeld: true, isRolling: false },
				{ id: 'd2', sides: 6, value: 2, isHeld: false, isRolling: true },
				{ id: 'd3', sides: 6, value: 6, isHeld: true, isRolling: false },
				{ id: 'd4', sides: 6, value: 1, isHeld: false, isRolling: true },
			];

			let current = initial;
			for (let iteration = 0; iteration < 100; iteration += 1) {
				const { dice, total } = rollDice(current);
				expect(dice[0]?.value).toBe(5);
				expect(dice[2]?.value).toBe(6);
				expect(dice[1]?.isRolling).toBe(false);
				expect(dice[3]?.isRolling).toBe(false);
				expect(dice[1]?.value).toBeGreaterThanOrEqual(1);
				expect(dice[1]?.value).toBeLessThanOrEqual(6);
				expect(total).toBe(dice.reduce((sum, die) => sum + die.value, 0));
				current = dice;
			}
		});

		it('produces deterministic rolls and accurate totals with a custom RNG', () => {
			const dice = createDice(5, 6);
			const held = setDieHold(dice, dice[0]?.id ?? '', true);
			const rng = createSeededRng(42);

			const { dice: rolled, total } = rollDice(held, rng);
			expect(rolled[0]?.value).toBe(1);
			const expectedSum = rolled.reduce((sum, die) => sum + die.value, 0);
			expect(total).toBe(expectedSum);
		});

		it('handles rolling an empty dice array cleanly', () => {
			expect(rollDice([])).toEqual({ dice: [], total: 0 });
		});
	});

	describe('toggleDieHold, setDieHold, and resetDice', () => {
		it('toggles and explicitly sets hold states for targeted dice only', () => {
			const dice = createDice(3, 8);
			const targetId = dice[1]?.id ?? '';

			const toggledOn = toggleDieHold(dice, targetId);
			expect(toggledOn.map((die) => die.isHeld)).toEqual([false, true, false]);

			const toggledOff = toggleDieHold(toggledOn, targetId);
			expect(toggledOff.map((die) => die.isHeld)).toEqual([false, false, false]);

			const explicitlyHeld = setDieHold(dice, targetId, true);
			expect(explicitlyHeld.map((die) => die.isHeld)).toEqual([false, true, false]);

			const unknownIdResult = toggleDieHold(explicitlyHeld, 'non-existent-id');
			expect(unknownIdResult.map((die) => die.isHeld)).toEqual([false, true, false]);
		});

		it('resets all dice back to baseline value 1, unheld, and not rolling', () => {
			const activeDice: DieState[] = [
				{ id: 'a', sides: 20, value: 19, isHeld: true, isRolling: false },
				{ id: 'b', sides: 20, value: 14, isHeld: false, isRolling: true },
			];

			const reset = resetDice(activeDice);
			expect(reset).toEqual([
				{ id: 'a', sides: 20, value: 1, isHeld: false, isRolling: false },
				{ id: 'b', sides: 20, value: 1, isHeld: false, isRolling: false },
			]);
		});
	});

	describe('immutability guarantees', () => {
		it('never mutates input arrays or DieState objects in place across any engine operation', () => {
			const original = freezeDiceSnapshot([
				{ id: 'die-1', sides: 6, value: 4, isHeld: false, isRolling: true },
				{ id: 'die-2', sides: 6, value: 6, isHeld: true, isRolling: false },
			]);

			const rolled = rollDice(original, () => 0.8);
			expect(rolled.dice).not.toBe(original);
			expect(rolled.dice[0]).not.toBe(original[0]);
			expect(rolled.dice[1]).not.toBe(original[1]);

			const toggled = toggleDieHold(original, 'die-1');
			expect(toggled).not.toBe(original);
			expect(toggled[0]).not.toBe(original[0]);

			const held = setDieHold(original, 'die-1', true);
			expect(held).not.toBe(original);
			expect(held[0]).not.toBe(original[0]);

			const reset = resetDice(original);
			expect(reset).not.toBe(original);
			expect(reset[0]).not.toBe(original[0]);

			expect(original).toEqual([
				{ id: 'die-1', sides: 6, value: 4, isHeld: false, isRolling: true },
				{ id: 'die-2', sides: 6, value: 6, isHeld: true, isRolling: false },
			]);
		});
	});

	describe('calculateDiceStats', () => {
		it('calculates total, min, max, and face frequency counts for rule evaluation', () => {
			// Full house: three 4s and two 2s
			const fullHouse: DieState[] = [
				{ id: '1', sides: 6, value: 4, isHeld: false, isRolling: false },
				{ id: '2', sides: 6, value: 2, isHeld: true, isRolling: false },
				{ id: '3', sides: 6, value: 4, isHeld: false, isRolling: false },
				{ id: '4', sides: 6, value: 2, isHeld: true, isRolling: false },
				{ id: '5', sides: 6, value: 4, isHeld: false, isRolling: false },
			];

			expect(calculateDiceStats(fullHouse)).toEqual({
				total: 16,
				min: 2,
				max: 4,
				counts: {
					2: 2,
					4: 3,
				},
			});
		});

		it('returns zeroed stats and empty counts for an empty dice array', () => {
			expect(calculateDiceStats([])).toEqual({
				total: 0,
				min: 0,
				max: 0,
				counts: {},
			});
		});
	});
});
