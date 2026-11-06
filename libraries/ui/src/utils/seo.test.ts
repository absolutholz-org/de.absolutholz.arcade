import { ALL_GAMES, type GameMetadata, getGame } from '@arcade/lib-games';
import { SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import { describe, expect, it } from 'vitest';
import {
	buildGameSeoMetadata,
	buildVideoGameJsonLd,
	formatPageTitle,
	resolveGameIdFromPath,
	serializeJsonLd,
} from './seo';

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

describe('resolveGameIdFromPath', () => {
	it('extracts valid GameId from game paths and full canonical URLs', () => {
		expect(resolveGameIdFromPath('/sudoku/en/game')).toBe('sudoku');
		expect(resolveGameIdFromPath('/minesweeper/de/')).toBe('minesweeper');
		expect(resolveGameIdFromPath('/untangle')).toBe('untangle');
		expect(resolveGameIdFromPath('https://arcade.absolutholz.de/queens/fr/game')).toBe('queens');
	});

	it('returns undefined for hub, tool, or empty routes', () => {
		expect(resolveGameIdFromPath('/')).toBeUndefined();
		expect(resolveGameIdFromPath('/en/')).toBeUndefined();
		expect(resolveGameIdFromPath('/en/privacy')).toBeUndefined();
		expect(resolveGameIdFromPath('/tools/dice')).toBeUndefined();
		expect(resolveGameIdFromPath(undefined)).toBeUndefined();
	});
});

describe('buildVideoGameJsonLd', () => {
	it('populates Schema.org VideoGame structured data with localized strings and genre labels', () => {
		const jsonLd = buildVideoGameJsonLd('sudoku', 'en');
		expect(jsonLd).toEqual({
			'@context': 'https://schema.org',
			'@type': 'VideoGame',
			name: 'Sudoku',
			description: 'Classic number placement logic puzzle on a 9×9 grid.',
			applicationCategory: 'Game',
			gamePlatform: ['Web Browser'],
			genre: ['Logic & Deduction', 'Grid-Based', 'Deduction', 'Number Logic'],
			playMode: ['SinglePlayer'],
		});
	});

	it('includes MultiPlayer in playMode when game modes contain multiplayer tags', () => {
		const baseSudoku = getGame('sudoku');
		const multiplayerGame: GameMetadata = {
			...baseSudoku,
			tags: {
				...baseSudoku.tags,
				modes: ['single-player', 'pass-and-play'],
			},
		};

		const jsonLd = buildVideoGameJsonLd(multiplayerGame, 'en');
		expect(jsonLd.playMode).toEqual(['SinglePlayer', 'MultiPlayer']);
	});

	it('validates generated JSON-LD output for every registered game across all supported languages', () => {
		for (const game of ALL_GAMES) {
			for (const { code } of SUPPORTED_LANGUAGES) {
				const seo = buildGameSeoMetadata({ game: game.id, lang: code });
				const parsed = JSON.parse(seo.jsonLdScript);

				expect(parsed['@context']).toBe('https://schema.org');
				expect(parsed['@type']).toBe('VideoGame');
				expect(parsed.name.length).toBeGreaterThan(0);
				expect(parsed.description.length).toBeGreaterThan(0);
				expect(parsed.applicationCategory).toBe('Game');
				expect(parsed.gamePlatform).toEqual(['Web Browser']);
				expect(Array.isArray(parsed.genre)).toBe(true);
				expect(parsed.genre.length).toBeGreaterThanOrEqual(2);
				expect(parsed.playMode).toContain('SinglePlayer');
				expect(seo.keywords.length).toBeGreaterThan(0);
				expect(seo.openGraph.type).toBe('website');
				expect(seo.openGraph.title).toBe(parsed.name);
				expect(seo.openGraph.description).toBe(parsed.description);
			}
		}
	});
});

describe('serializeJsonLd & buildGameSeoMetadata', () => {
	it('escapes HTML-sensitive characters in serialized JSON-LD while remaining valid JSON', () => {
		const raw = {
			'@context': 'https://schema.org',
			'@type': 'VideoGame',
			name: 'Tents & Campers </script><script>alert(1)</script>',
		};
		const serialized = serializeJsonLd(raw);

		expect(serialized).not.toContain('</script>');
		expect(serialized).not.toContain('<');
		expect(serialized).not.toContain('>');
		expect(serialized).not.toContain('&');
		expect(JSON.parse(serialized)).toEqual(raw);
	});

	it('populates localized keywords and Open Graph metadata with page overrides', () => {
		const seo = buildGameSeoMetadata({
			game: 'nonogram',
			lang: 'en',
			pageTitle: 'Play Nonogram | Arcade',
		});

		expect(seo.openGraph).toEqual({
			title: 'Play Nonogram | Arcade',
			description: seo.description,
			type: 'website',
		});
		expect(seo.keywords).toContain('Logic & Deduction');
		expect(seo.keywords).toContain('Spatial Puzzle');
		expect(seo.keywords).toContain('Pattern Recognition');
	});
});
