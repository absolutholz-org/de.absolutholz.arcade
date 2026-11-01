import { describe, expect, it } from 'vitest';
import { parseDiceNotation } from '../src/notation';

describe('parseDiceNotation', () => {
	it('parses standard dice notations with and without modifiers', () => {
		expect(parseDiceNotation('2d6')).toEqual({ count: 2, sides: 6, modifier: 0 });
		expect(parseDiceNotation('1d20')).toEqual({ count: 1, sides: 20, modifier: 0 });
		expect(parseDiceNotation('5d6+3')).toEqual({ count: 5, sides: 6, modifier: 3 });
		expect(parseDiceNotation('3d8-2')).toEqual({ count: 3, sides: 8, modifier: -2 });
	});

	it('supports uppercase D, whitespace padding, boundary counts, and all standard sides', () => {
		expect(parseDiceNotation(' 4D10 + 12 ')).toEqual({ count: 4, sides: 10, modifier: 12 });
		expect(parseDiceNotation('1d4')).toEqual({ count: 1, sides: 4, modifier: 0 });
		expect(parseDiceNotation('20d100-25')).toEqual({ count: 20, sides: 100, modifier: -25 });
		expect(parseDiceNotation('2d12+0')).toEqual({ count: 2, sides: 12, modifier: 0 });

		const negativeZeroResult = parseDiceNotation('3d8-0');
		expect(Object.is(negativeZeroResult.modifier, 0)).toBe(true);
	});

	it('throws descriptive errors for empty or syntactically malformed notation strings', () => {
		const malformedInputs = [
			'',
			'   ',
			'd6',
			'2d',
			'2x6',
			'abc',
			'2d6+',
			'2d6-',
			'2d6++3',
			'2d6+1+2',
			'2d6*3',
			'roll 2d6',
			'2.5d6',
			'2d6.5',
		];

		for (const invalid of malformedInputs) {
			expect(() => parseDiceNotation(invalid)).toThrow();
		}
	});

	it('throws RangeError for unsupported die sides or out-of-bounds dice counts', () => {
		expect(() => parseDiceNotation('0d6')).toThrow(/count/i);
		expect(() => parseDiceNotation('21d6')).toThrow(/count/i);
		expect(() => parseDiceNotation('2d7')).toThrow(/sides/i);
		expect(() => parseDiceNotation('1d3')).toThrow(/sides/i);
		expect(() => parseDiceNotation('2d0')).toThrow(/sides/i);
	});
});
