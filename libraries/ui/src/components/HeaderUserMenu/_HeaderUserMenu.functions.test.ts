import { describe, expect, it } from 'vitest';
import { getInitials } from './_HeaderUserMenu.functions';

describe('getInitials', () => {
	it('extracts first letters from two words', () => {
		expect(getInitials('Jane Doe')).toBe('JD');
	});

	it('extracts first letters from the first two words when three or more words exist', () => {
		expect(getInitials('John Ronald Reuel Tolkien')).toBe('JR');
	});

	it('extracts first two characters uppercase from a single name', () => {
		expect(getInitials('Woody')).toBe('WO');
		expect(getInitials('woody')).toBe('WO');
	});

	it('handles single character names', () => {
		expect(getInitials('A')).toBe('A');
		expect(getInitials('z')).toBe('Z');
	});

	it('handles leading, trailing, and multiple spaces between words', () => {
		expect(getInitials('  Jane   Doe  ')).toBe('JD');
		expect(getInitials('  Woody  ')).toBe('WO');
	});

	it('returns null for empty strings, null, or undefined', () => {
		expect(getInitials('')).toBeNull();
		expect(getInitials('   ')).toBeNull();
		expect(getInitials(null)).toBeNull();
		expect(getInitials(undefined)).toBeNull();
	});
});
