import { readFileSync } from 'node:fs';

const msgFile = process.argv[2];
if (!msgFile) {
	console.error('Usage: node scripts/validate-commit-msg.mjs <commit-msg-file>');
	process.exit(1);
}

const rawMsg = readFileSync(msgFile, 'utf8').trim();
const firstLine = rawMsg.split(/\r?\n/)[0].trim();

// Allow auto-generated merge or revert commits if git generates them, though standard reverts should use ⏪
if (firstLine.startsWith('Merge ')) {
	process.exit(0);
}

const ALLOWED_EMOJIS = [
	'✨',
	'🔧',
	'🐛',
	'📝',
	'♻️',
	'♻',
	'💄',
	'🧪',
	'📦',
	'🔥',
	'♿️',
	'♿',
	'⚡️',
	'⚡',
	'👷',
	'✏️',
	'✏',
	'🔒',
	'🏷️',
	'🏷',
	'🎨',
	'🌐',
	'💡',
	'🍱',
	'⏪',
];

const emojiPattern = ALLOWED_EMOJIS.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

const commitRegex = new RegExp(`^(${emojiPattern}) \\(([a-z0-9-]+(?:,\\s*[a-z0-9-]+)*)\\): ([A-Z].*)$`);

if (!commitRegex.test(firstLine)) {
	console.error('\n❌ Invalid commit message format:');
	console.error(`   "${firstLine}"\n`);
	console.error('Commit messages must strictly follow /.ai/skills/semantic-commit/SKILL.md:');
	console.error('   <emoji> (<scope>): <Capitalized summary>\n');
	console.error('Examples:');
	console.error('   ✨ (hub): Add compact favorites strip');
	console.error('   🐛 (anagram): Move AnagramControls below AnagramRack');
	console.error('   🌐 (root): Rename project to absolutholz Arcade\n');
	console.error('Allowed emojis: ✨ 🔧 🐛 📝 ♻️ 💄 🧪 📦 🔥 ♿️ ⚡️ 👷 ✏️ 🔒 🏷️ 🎨 🌐 💡 🍱 ⏪\n');
	process.exit(1);
}
