import { fileURLToPath } from 'node:url';
import { createBaseConfig } from '@arcade/lib-astro-config';
import { defineConfig } from 'astro/config';

export default defineConfig(
	createBaseConfig({
		base: '/nonogram',
		vite: {
			resolve: {
				alias: {
					'@arcade/lib-medals': fileURLToPath(
						new URL('../../libraries/medals/src/index.ts', import.meta.url),
					),
				},
			},
		},
	}),
);
