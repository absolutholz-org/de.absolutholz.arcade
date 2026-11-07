import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { ALL_GAMES, GAME_IDS, GAME_REGISTRY } from '../../libraries/games/src/registry.ts';
import {
	GAME_CATEGORIES,
	INPUT_TAGS,
	MECHANIC_TAGS,
	MODE_TAGS,
	PACING_TAGS,
	SESSION_LENGTH_TAGS,
	assertValidGameMetadata,
	isGameCategory,
	isGameId,
	isGameInputTag,
	isGameMechanicTag,
	isGameModeTag,
	isGamePacingTag,
	isGameSessionLengthTag,
	isValidGameMetadata,
	validateGameMetadata,
	validateGameRegistry,
} from '../../libraries/games/src/taxonomy.ts';
import { deTaxonomy } from '../../libraries/i18n/src/locales/de/taxonomy.ts';
import { enTaxonomy } from '../../libraries/i18n/src/locales/en/taxonomy.ts';
import { frTaxonomy } from '../../libraries/i18n/src/locales/fr/taxonomy.ts';
import { ptTaxonomy } from '../../libraries/i18n/src/locales/pt/taxonomy.ts';

const APPS_ROOT = path.resolve(import.meta.dirname, '../../apps');
const EXCLUDED_APP_DIRS = new Set(['hub', '.DS_Store']);

const REQUIRED_CANONICAL_FILES = [
	'src/pages/index.astro',
	'src/pages/[lang]/index.astro',
	'src/pages/[lang]/game.astro',
	'src/pages/[lang]/rules.astro',
	'src/pages/[lang]/settings.astro',
	'src/pages/[lang]/stats.astro',
	'src/pages/[lang]/medals.astro',
	'src/config/settings.ts',
	'src/config/medals.ts',
	'src/content/pages/en/rules.md',
	'README.md',
] as const;

const gameDirectories = fs
	.readdirSync(APPS_ROOT, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory() && !EXCLUDED_APP_DIRS.has(dirent.name))
	.map((dirent) => dirent.name)
	.sort();

describe('ADR 0008 Canonical Game Architecture Conformance', () => {
	it('should discover all 14 expected arcade game packages', () => {
		assert.equal(
			gameDirectories.length,
			14,
			`Expected 14 arcade game packages under apps/*, but discovered ${gameDirectories.length}: ${gameDirectories.join(', ')}`,
		);
	});

	for (const gameId of gameDirectories) {
		describe(`Game package: @arcade/${gameId}`, () => {
			const gamePath = path.join(APPS_ROOT, gameId);

			for (const requiredFile of REQUIRED_CANONICAL_FILES) {
				it(`conforms with required canonical file: ${requiredFile}`, () => {
					const filePath = path.join(gamePath, requiredFile);
					const exists = fs.existsSync(filePath);

					assert.ok(
						exists,
						`[ADR 0008 Conformance Violation] Game "${gameId}" is missing required canonical file: "${requiredFile}"\n` +
							`Expected location: ${filePath}`,
					);
				});
			}
		});
	}
});

describe('ADR 0009 Game Taxonomy & Metadata Registry Conformance', () => {
	it('maintains bidirectional parity between apps/* game packages and GAME_REGISTRY', () => {
		const registeredIds = [...GAME_IDS].sort();
		assert.deepEqual(
			registeredIds,
			gameDirectories,
			`Mismatch between registered GAME_IDS (${registeredIds.join(', ')}) and apps/* directories (${gameDirectories.join(', ')})`,
		);
	});

	it('validates the entire GAME_REGISTRY with zero schema or taxonomy issues', () => {
		const validation = validateGameRegistry(GAME_REGISTRY);
		assert.equal(
			validation.valid,
			true,
			`GAME_REGISTRY failed ADR 0009 validation:\n${validation.issues.map((issue) => `  - ${issue.path}: ${issue.message}`).join('\n')}`,
		);
		assert.equal(validation.issues.length, 0);
	});

	for (const game of ALL_GAMES) {
		it(`validates GameMetadata manifest and input/accessibility facets for "${game.id}"`, () => {
			assert.doesNotThrow(() => assertValidGameMetadata(game));
			assert.equal(isValidGameMetadata(game), true);
			assert.equal('title' in game, false, `Game "${game.id}" must not contain presentation title field.`);
			assert.equal('name' in game, false, `Game "${game.id}" must not contain presentation name field.`);
			assert.equal(
				'shortDescription' in game,
				false,
				`Game "${game.id}" must not contain presentation shortDescription field.`,
			);
			assert.ok(
				game.tags.inputs.includes('keyboard-controls'),
				`Game "${game.id}" must declare keyboard-controls support or document an explicit exception.`,
			);
			assert.ok(
				game.tags.inputs.includes('touch-optimized'),
				`Game "${game.id}" must declare touch-optimized support for PWA compliance.`,
			);
		});
	}

	it('provides complete taxonomy translations across all supported languages in @arcade/lib-i18n', () => {
		const taxonomyByLang = {
			en: enTaxonomy,
			de: deTaxonomy,
			fr: frTaxonomy,
			pt: ptTaxonomy,
		};

		for (const [langCode, taxonomy] of Object.entries(taxonomyByLang)) {
			for (const category of GAME_CATEGORIES) {
				const label = taxonomy.categories[category];
				assert.ok(
					typeof label === 'string' && label.length > 0,
					`Missing translation for category "${category}" in language "${langCode}"`,
				);
			}

			for (const tag of MECHANIC_TAGS) {
				const label = taxonomy.tags.mechanics[tag];
				assert.ok(
					typeof label === 'string' && label.length > 0,
					`Missing translation for mechanic tag "${tag}" in language "${langCode}"`,
				);
			}

			for (const tag of INPUT_TAGS) {
				const label = taxonomy.tags.inputs[tag];
				assert.ok(
					typeof label === 'string' && label.length > 0,
					`Missing translation for input tag "${tag}" in language "${langCode}"`,
				);
			}

			for (const tag of PACING_TAGS) {
				const label = taxonomy.tags.pacing[tag];
				assert.ok(
					typeof label === 'string' && label.length > 0,
					`Missing translation for pacing tag "${tag}" in language "${langCode}"`,
				);
			}

			for (const tag of MODE_TAGS) {
				const label = taxonomy.tags.modes[tag];
				assert.ok(
					typeof label === 'string' && label.length > 0,
					`Missing translation for mode tag "${tag}" in language "${langCode}"`,
				);
			}

			for (const tag of SESSION_LENGTH_TAGS) {
				const label = taxonomy.tags.sessionLength[tag];
				assert.ok(
					typeof label === 'string' && label.length > 0,
					`Missing translation for sessionLength tag "${tag}" in language "${langCode}"`,
				);
			}
		}
	});

	it('enforces narrow taxonomy literal type guards accurately', () => {
		for (const category of GAME_CATEGORIES) {
			assert.equal(isGameCategory(category), true);
		}
		assert.equal(isGameCategory('arcade-shooter'), false);

		for (const tag of MECHANIC_TAGS) {
			assert.equal(isGameMechanicTag(tag), true);
		}
		assert.equal(isGameMechanicTag('unknown-mechanic'), false);

		for (const tag of INPUT_TAGS) {
			assert.equal(isGameInputTag(tag), true);
		}
		assert.equal(isGameInputTag('gamepad-vr'), false);

		for (const tag of PACING_TAGS) {
			assert.equal(isGamePacingTag(tag), true);
		}
		assert.equal(isGamePacingTag('hyper-realtime'), false);

		for (const tag of MODE_TAGS) {
			assert.equal(isGameModeTag(tag), true);
		}
		assert.equal(isGameModeTag('mmo-raid'), false);

		for (const tag of SESSION_LENGTH_TAGS) {
			assert.equal(isGameSessionLengthTag(tag), true);
		}
		assert.equal(isGameSessionLengthTag('marathon-4h'), false);

		assert.equal(isGameId('sudoku'), true);
		assert.equal(isGameId('nonexistent'), false);
	});

	it('rejects malformed GameMetadata manifests (duplicate secondary category, empty facets, duplicate tags)', () => {
		const baseSudoku = GAME_REGISTRY.sudoku;

		const duplicateCategoryCandidate = {
			...baseSudoku,
			category: {
				primary: 'logic-deduction',
				secondary: 'logic-deduction',
			},
		};
		const dupCategoryResult = validateGameMetadata(duplicateCategoryCandidate);
		assert.equal(dupCategoryResult.valid, false);
		assert.ok(dupCategoryResult.issues.some((issue) => issue.path === 'category.secondary'));

		const emptyAndDuplicateTagsCandidate = {
			...baseSudoku,
			route: '/wrong-route',
			tags: {
				...baseSudoku.tags,
				mechanics: [],
				inputs: ['tap-only', 'tap-only'],
			},
		};
		const badTagsResult = validateGameMetadata(emptyAndDuplicateTagsCandidate);
		assert.equal(badTagsResult.valid, false);
		assert.equal(isValidGameMetadata(emptyAndDuplicateTagsCandidate), false);
		assert.ok(badTagsResult.issues.some((issue) => issue.path === 'route'));
		assert.ok(badTagsResult.issues.some((issue) => issue.path === 'tags.mechanics'));
		assert.ok(badTagsResult.issues.some((issue) => issue.path === 'tags.inputs[1]'));
		assert.throws(() => assertValidGameMetadata(emptyAndDuplicateTagsCandidate), TypeError);
	});
});
