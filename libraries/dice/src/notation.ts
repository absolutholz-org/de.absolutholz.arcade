import {
	MAX_DICE_COUNT,
	MIN_DICE_COUNT,
	type ParsedDiceNotation,
	STANDARD_DIE_SIDES,
	isStandardDieSides,
} from './types';

const DICE_NOTATION_PATTERN = /^(\d+)[dD](\d+)(?:\s*([+-])\s*(\d+))?$/;

/**
 * Parses standard tabletop dice notation such as "2d6", "1d20", "5d6+3", or "3d8-2".
 */
export function parseDiceNotation(notation: string): ParsedDiceNotation {
	const trimmed = notation.trim();
	if (trimmed.length === 0) {
		throw new Error('Dice notation cannot be empty.');
	}

	const match = DICE_NOTATION_PATTERN.exec(trimmed);
	if (!match) {
		throw new Error(
			`Invalid dice notation "${notation}". Expected format "<count>d<sides>[+/-<modifier>]" (e.g., "2d6", "1d20", "5d6+3").`,
		);
	}

	const rawCount = Number(match[1]);
	const rawSides = Number(match[2]);
	const modifierSign = match[3];
	const rawModifierMagnitude = match[4] !== undefined ? Number(match[4]) : 0;

	if (!Number.isSafeInteger(rawCount) || rawCount < MIN_DICE_COUNT || rawCount > MAX_DICE_COUNT) {
		throw new RangeError(
			`Invalid dice count ${rawCount} in "${notation}". Count must be an integer between ${MIN_DICE_COUNT} and ${MAX_DICE_COUNT}.`,
		);
	}

	if (!isStandardDieSides(rawSides)) {
		throw new RangeError(
			`Unsupported die sides ${rawSides} in "${notation}". Supported sides are ${STANDARD_DIE_SIDES.join(', ')}.`,
		);
	}

	if (!Number.isSafeInteger(rawModifierMagnitude)) {
		throw new RangeError(`Invalid modifier in "${notation}". Modifier must be a safe integer.`);
	}

	// Avoid producing -0 when "-0" is passed as a modifier.
	const modifier =
		rawModifierMagnitude === 0 ? 0 : modifierSign === '-' ? -rawModifierMagnitude : rawModifierMagnitude;

	return {
		count: rawCount,
		sides: rawSides,
		modifier,
	};
}
