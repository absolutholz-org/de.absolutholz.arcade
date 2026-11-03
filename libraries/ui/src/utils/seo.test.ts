import { describe, expect, it } from 'vitest';
import { type PageTitleOptions, formatPageTitle } from './seo';

describe('formatPageTitle', () => {
	it('resolves default brand tagline when no subject and no scope are provided', () => {
		const title = formatPageTitle({});
		expect(title).toBe('Arcade – Logic & Puzzle Games');
	});

	it('resolves custom brand tagline when no subject and no scope are provided', () => {
		const title = formatPageTitle({ brand: 'Pixel Arcade' });
		expect(title).toBe('Pixel Arcade – Logic & Puzzle Games');
	});

	it('resolves scope only (landing/overview)', () => {
		const title = formatPageTitle({ scope: 'Sudoku' });
		expect(title).toBe('Sudoku | Arcade');
	});

	it('resolves active play session with scope', () => {
		const title = formatPageTitle({ scope: 'Sudoku', isPlaySession: true });
		expect(title).toBe('Play Sudoku | Arcade');
	});

	it('resolves active play session with scope and action', () => {
		const title = formatPageTitle({
			scope: 'Sudoku',
			isPlaySession: true,
			action: 'Daily Challenge',
		});
		expect(title).toBe('Daily Challenge – Play Sudoku | Arcade');
	});

	it('resolves subject and scope (game subpages)', () => {
		const statsTitle = formatPageTitle({
			subject: 'Statistics',
			scope: 'Queens',
		});
		expect(statsTitle).toBe('Statistics – Queens | Arcade');

		const rulesTitle = formatPageTitle({
			subject: 'How to Play',
			scope: 'Minesweeper',
		});
		expect(rulesTitle).toBe('How to Play – Minesweeper | Arcade');

		const settingsTitle = formatPageTitle({
			subject: 'Settings',
			scope: 'Nonogram',
		});
		expect(settingsTitle).toBe('Settings – Nonogram | Arcade');

		const medalsTitle = formatPageTitle({
			subject: 'Medals',
			scope: 'Sudoku',
		});
		expect(medalsTitle).toBe('Medals – Sudoku | Arcade');
	});

	it('resolves subject and scope with action', () => {
		const title = formatPageTitle({
			subject: 'Statistics',
			scope: 'Tracks',
			action: 'Hard',
		});
		expect(title).toBe('Hard – Statistics – Tracks | Arcade');
	});

	it('resolves subject only (hub/global subpages & tools)', () => {
		const imprintTitle = formatPageTitle({ subject: 'Imprint' });
		expect(imprintTitle).toBe('Imprint | Arcade');

		const privacyTitle = formatPageTitle({ subject: 'Privacy Policy' });
		expect(privacyTitle).toBe('Privacy Policy | Arcade');

		const diceTitle = formatPageTitle({ subject: 'Dice Roller' });
		expect(diceTitle).toBe('Dice Roller | Arcade');

		const hubMedalsTitle = formatPageTitle({ subject: 'Medals Showcase' });
		expect(hubMedalsTitle).toBe('Medals Showcase | Arcade');
	});

	it('resolves subject only with action', () => {
		const title = formatPageTitle({
			subject: 'Dice Roller',
			action: '3D Simulation',
		});
		expect(title).toBe('3D Simulation – Dice Roller | Arcade');
	});
});
