import type { CodeRuleConfig, PegColorId } from './types.ts';

/**
 * Generates a secret code of `codeLength` pegs chosen from `0..colorCount-1`.
 * When `allowDuplicates` is false, selects distinct colors via partial Fisher-Yates shuffle.
 */
export function generateSecretCode(config: CodeRuleConfig, rng: () => number = Math.random): PegColorId[] {
	const { codeLength, colorCount, allowDuplicates } = config;

	if (codeLength < 1 || colorCount < 1 || colorCount > 8) {
		throw new RangeError(`Invalid Codebreaker config: codeLength=${codeLength}, colorCount=${colorCount}`);
	}

	if (!allowDuplicates && codeLength > colorCount) {
		throw new RangeError(`Cannot generate unique code of length ${codeLength} from only ${colorCount} colors.`);
	}

	if (allowDuplicates) {
		const code: PegColorId[] = [];
		for (let i = 0; i < codeLength; i += 1) {
			const color = Math.floor(rng() * colorCount) as PegColorId;
			code.push(color);
		}
		return code;
	}

	const pool: PegColorId[] = [];
	for (let c = 0; c < colorCount; c += 1) {
		pool.push(c as PegColorId);
	}

	for (let i = 0; i < codeLength; i += 1) {
		const j = i + Math.floor(rng() * (pool.length - i));
		const tmp = pool[i];
		pool[i] = pool[j];
		pool[j] = tmp;
	}

	return pool.slice(0, codeLength);
}
