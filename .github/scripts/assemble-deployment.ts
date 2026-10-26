import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { ALL_GAMES } from '../../libraries/games/src/registry.ts';

const ROOT_DIR = process.cwd();
const DEPLOY_DIST_DIR = path.join(ROOT_DIR, 'deploy_dist');

console.log('🚀 Assembling Arcade deployment payload...');

// 1. Reset deploy_dist
if (existsSync(DEPLOY_DIST_DIR)) {
	rmSync(DEPLOY_DIST_DIR, { recursive: true, force: true });
}
mkdirSync(DEPLOY_DIST_DIR, { recursive: true });

// 2. Validate and Copy Hub (document root)
const hubDistDir = path.join(ROOT_DIR, 'apps', 'hub', 'dist');
if (!existsSync(hubDistDir)) {
	console.error('❌ Missing build output for apps/hub at:', hubDistDir);
	console.error('Run "pnpm build" before assembling deployment payload.');
	process.exit(1);
}
cpSync(hubDistDir, DEPLOY_DIST_DIR, { recursive: true });
console.log('✓ Mounted Hub at /');

// 3. Validate and Copy all registered games from GAME_REGISTRY
for (const game of ALL_GAMES) {
	const gameDistDir = path.join(ROOT_DIR, 'apps', game.id, 'dist');
	if (!existsSync(gameDistDir)) {
		console.error(`❌ Missing build output for registered game "${game.name}" (${game.id}) at:`, gameDistDir);
		console.error('Run "pnpm build" before assembling deployment payload.');
		process.exit(1);
	}

	const gameTargetDir = path.join(DEPLOY_DIST_DIR, game.id);
	mkdirSync(gameTargetDir, { recursive: true });
	cpSync(gameDistDir, gameTargetDir, { recursive: true });
	console.log(`✓ Mounted ${game.name} at /${game.id}/`);
}

// 4. Validate and Copy Storybook
const storybookDistDir = path.join(ROOT_DIR, 'libraries', 'ui', 'storybook-static');
if (!existsSync(storybookDistDir)) {
	console.error('❌ Missing build output for Storybook at:', storybookDistDir);
	console.error('Run "pnpm build:storybook" before assembling deployment payload.');
	process.exit(1);
}
const storybookTargetDir = path.join(DEPLOY_DIST_DIR, 'storybook');
mkdirSync(storybookTargetDir, { recursive: true });
cpSync(storybookDistDir, storybookTargetDir, { recursive: true });
console.log('✓ Mounted Storybook at /storybook/');

// 5. Copy Apache production configuration
const htaccessPath = path.join(ROOT_DIR, 'deploy', '.htaccess');
if (!existsSync(htaccessPath)) {
	console.error('❌ Missing deploy/.htaccess configuration file.');
	process.exit(1);
}
copyFileSync(htaccessPath, path.join(DEPLOY_DIST_DIR, '.htaccess'));
console.log('✓ Mounted Apache production .htaccess');

console.log('🎉 Deployment payload successfully assembled at deploy_dist/');
