import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize, resolve } from 'node:path';
import { describe, it } from 'node:test';

const ROOT_DIR = resolve(import.meta.dirname, '..', '..');

function collectMarkdownFiles(dir: string): string[] {
	const results: string[] = [];
	if (!existsSync(dir)) return results;

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...collectMarkdownFiles(fullPath));
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			results.push(fullPath);
		}
	}
	return results;
}

describe('AI Ecosystem & ADR Conformance', () => {
	const aiDocs = [
		join(ROOT_DIR, 'AGENTS.md'),
		...collectMarkdownFiles(join(ROOT_DIR, '.ai')),
		...collectMarkdownFiles(join(ROOT_DIR, 'docs/adr')),
		...readdirSync(join(ROOT_DIR, 'apps'), { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.flatMap((d) => {
				const p = join(ROOT_DIR, 'apps', d.name, 'AGENTS.md');
				return existsSync(p) ? [p] : [];
			}),
		...readdirSync(join(ROOT_DIR, 'libraries'), { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.flatMap((d) => [
				...(existsSync(join(ROOT_DIR, 'libraries', d.name, 'AGENTS.md'))
					? [join(ROOT_DIR, 'libraries', d.name, 'AGENTS.md')]
					: []),
				...collectMarkdownFiles(join(ROOT_DIR, 'libraries', d.name, '.ai')),
			]),
	];

	it('has zero broken markdown links, machine-specific file:// URLs, or [cite:] artifacts', () => {
		const errors: string[] = [];

		for (const filePath of aiDocs) {
			const content = readFileSync(filePath, 'utf8');
			const relFile = filePath.replace(`${ROOT_DIR}/`, '');

			if (/\[cite:[^\]]+\]/.test(content)) {
				errors.push(`${relFile}: contains [cite: ...] artifact`);
			}

			for (const match of content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
				const rawTarget = match[2].split('#')[0].trim();
				if (!rawTarget || rawTarget.startsWith('http://') || rawTarget.startsWith('https://')) {
					continue;
				}
				if (rawTarget.startsWith('file://')) {
					errors.push(`${relFile}: contains machine-specific file:// link (${rawTarget})`);
					continue;
				}
				// Ignore template placeholder paths like /apps/[gameId]/...
				if (rawTarget.includes('[') && rawTarget.includes(']')) {
					continue;
				}

				const resolved = rawTarget.startsWith('/')
					? join(ROOT_DIR, rawTarget.slice(1))
					: normalize(join(dirname(filePath), rawTarget));

				if (!existsSync(resolved)) {
					errors.push(`${relFile}: broken link "${match[2]}" -> ${resolved.replace(`${ROOT_DIR}/`, '')}`);
				}
			}
		}

		assert.deepEqual(errors, []);
	});

	it('validates frontmatter on all SKILL.md files registered in .agents/skills.json', () => {
		const skillsConfig = JSON.parse(readFileSync(join(ROOT_DIR, '.agents/skills.json'), 'utf8')) as {
			entries: Array<{ path: string }>;
		};

		const missingFields: string[] = [];
		for (const entry of skillsConfig.entries) {
			const baseDir = join(ROOT_DIR, entry.path);
			assert.ok(existsSync(baseDir), `Skill root does not exist: ${entry.path}`);

			for (const skillFile of collectMarkdownFiles(baseDir).filter((f) => f.endsWith('SKILL.md'))) {
				const content = readFileSync(skillFile, 'utf8');
				const relFile = skillFile.replace(`${ROOT_DIR}/`, '');
				const fm = content.match(/^---\n([\s\S]*?)\n---/);
				if (!fm) {
					missingFields.push(`${relFile}: missing YAML frontmatter`);
					continue;
				}
				const isProjectSkill = !relFile.startsWith('.agents/skills/');
				const requiredFields = isProjectSkill
					? ['id', 'name', 'description', 'targets']
					: ['name', 'description'];
				for (const field of requiredFields) {
					if (!new RegExp(`^${field}:`, 'm').test(fm[1])) {
						missingFields.push(`${relFile}: missing "${field}" in frontmatter`);
					}
				}
			}
		}

		assert.deepEqual(missingFields, []);
	});

	it('lists every standalone ADR file in docs/adr/architecture-decision-records.md', () => {
		const indexContent = readFileSync(join(ROOT_DIR, 'docs/adr/architecture-decision-records.md'), 'utf8');
		const adrFiles = readdirSync(join(ROOT_DIR, 'docs/adr')).filter((f) => /^\d{4}-.*\.md$/.test(f));

		const missing = adrFiles.filter((f) => !indexContent.includes(f));
		assert.deepEqual(missing, [], `ADRs missing from Master Index: ${missing.join(', ')}`);
	});

	it('provides a nested AGENTS.md for every canonical game package', () => {
		const gameDirs = readdirSync(join(ROOT_DIR, 'apps'), { withFileTypes: true })
			.filter((d) => d.isDirectory() && d.name !== 'hub' && d.name !== 'table-compass')
			.map((d) => d.name);

		const missing = gameDirs.filter((game) => !existsSync(join(ROOT_DIR, 'apps', game, 'AGENTS.md')));
		assert.deepEqual(missing, [], `Games missing AGENTS.md: ${missing.join(', ')}`);
	});

	it('keeps libraries/ui/CATALOG.md in sync with newly exported component folders in libraries/ui/src/index.ts', () => {
		const indexContent = readFileSync(join(ROOT_DIR, 'libraries/ui/src/index.ts'), 'utf8');
		const catalogContent = readFileSync(join(ROOT_DIR, 'libraries/ui/CATALOG.md'), 'utf8');
		const knownUndocumented = new Set(['ShareDialog', 'WakeLockToggleButton']);

		const missing: string[] = [];
		for (const match of indexContent.matchAll(/from '\.\/components\/([^/']+)'/g)) {
			const componentFolder = match[1];
			if (!knownUndocumented.has(componentFolder) && !catalogContent.includes(componentFolder)) {
				missing.push(componentFolder);
			}
		}

		assert.deepEqual(missing, [], `Components exported in index.ts missing from CATALOG.md: ${missing.join(', ')}`);
	});
});
