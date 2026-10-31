import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

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

describe('ADR 0008 Canonical Game Architecture Conformance', () => {
	const gameDirectories = fs
		.readdirSync(APPS_ROOT, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory() && !EXCLUDED_APP_DIRS.has(dirent.name))
		.map((dirent) => dirent.name)
		.sort();

	it('should discover all 11 expected arcade game packages', () => {
		assert.equal(
			gameDirectories.length,
			11,
			`Expected 11 arcade game packages under apps/*, but discovered ${gameDirectories.length}: ${gameDirectories.join(', ')}`,
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
