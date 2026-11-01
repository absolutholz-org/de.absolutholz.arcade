import { getRandomInt } from './cryptoRng';
import {
	DEFAULT_DICE_COUNT,
	DEFAULT_DIE_SIDES,
	type DiceStats,
	type DieState,
	MAX_DICE_COUNT,
	MIN_DICE_COUNT,
	type RandomGenerator,
	type RollDiceResult,
	STANDARD_DIE_SIDES,
	type StandardDieSides,
	isStandardDieSides,
} from './types';

const INITIAL_DIE_VALUE = 1;
let fallbackIdCounter = 0;

function createDieId(): string {
	if (typeof globalThis.crypto?.randomUUID === 'function') {
		return globalThis.crypto.randomUUID();
	}

	fallbackIdCounter += 1;
	const randomSuffix = getRandomInt(0, 0x7fff_ffff).toString(16).padStart(8, '0');
	return `die-${fallbackIdCounter}-${randomSuffix}`;
}

function updateDieHold(
	currentDice: readonly DieState[],
	dieId: string,
	resolveHold: (currentHold: boolean) => boolean,
): DieState[] {
	return currentDice.map((die) =>
		die.id === dieId
			? {
					...die,
					isHeld: resolveHold(die.isHeld),
				}
			: { ...die },
	);
}

export function createDice(
	count: number = DEFAULT_DICE_COUNT,
	sides: StandardDieSides = DEFAULT_DIE_SIDES,
): DieState[] {
	if (!Number.isInteger(count) || count < MIN_DICE_COUNT || count > MAX_DICE_COUNT) {
		throw new RangeError(
			`Dice count must be an integer between ${MIN_DICE_COUNT} and ${MAX_DICE_COUNT}, received ${count}.`,
		);
	}

	if (!isStandardDieSides(sides)) {
		throw new RangeError(`Unsupported die sides ${sides}. Supported sides are ${STANDARD_DIE_SIDES.join(', ')}.`);
	}

	return Array.from({ length: count }, () => ({
		id: createDieId(),
		sides,
		value: INITIAL_DIE_VALUE,
		isHeld: false,
		isRolling: false,
	}));
}

export function rollDice(currentDice: DieState[], customRng?: RandomGenerator): RollDiceResult {
	let total = 0;

	const dice = currentDice.map((die) => {
		const nextDie: DieState = die.isHeld
			? { ...die }
			: {
					...die,
					value: getRandomInt(INITIAL_DIE_VALUE, die.sides, customRng),
					isRolling: false,
				};

		total += nextDie.value;
		return nextDie;
	});

	return { dice, total };
}

export function toggleDieHold(currentDice: DieState[], dieId: string): DieState[] {
	return updateDieHold(currentDice, dieId, (isHeld) => !isHeld);
}

export function setDieHold(currentDice: DieState[], dieId: string, isHeld: boolean): DieState[] {
	return updateDieHold(currentDice, dieId, () => isHeld);
}

export function resetDice(currentDice: DieState[]): DieState[] {
	return currentDice.map((die) => ({
		...die,
		value: INITIAL_DIE_VALUE,
		isHeld: false,
		isRolling: false,
	}));
}

export function calculateDiceStats(dice: DieState[]): DiceStats {
	const firstDie = dice[0];
	if (!firstDie) {
		return {
			total: 0,
			min: 0,
			max: 0,
			counts: {},
		};
	}

	let total = 0;
	let min = firstDie.value;
	let max = firstDie.value;
	const counts: Record<number, number> = {};

	for (const { value } of dice) {
		total += value;
		if (value < min) {
			min = value;
		}
		if (value > max) {
			max = value;
		}
		counts[value] = (counts[value] ?? 0) + 1;
	}

	return {
		total,
		min,
		max,
		counts,
	};
}
