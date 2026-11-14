import type { CoinFace } from './CoinFlipper.types';

const randomWordBuffer = new Uint32Array(1);

/**
 * Generates an unbiased 50/50 coin flip outcome using `crypto.getRandomValues()`.
 * Reads the least significant bit of a 32-bit uniform word.
 */
export function flipCryptoCoin(): CoinFace {
	if (typeof globalThis.crypto?.getRandomValues !== 'function') {
		throw new Error('Cryptographically secure RNG (crypto.getRandomValues) is unavailable in this environment.');
	}

	globalThis.crypto.getRandomValues(randomWordBuffer);
	return ((randomWordBuffer[0] ?? 0) & 1) === 0 ? 'heads' : 'tails';
}

/**
 * Generates an array of `count` unbiased coin flip outcomes.
 */
export function flipCryptoCoins(count: number): CoinFace[] {
	const results: CoinFace[] = [];
	for (let i = 0; i < count; i += 1) {
		results.push(flipCryptoCoin());
	}
	return results;
}
