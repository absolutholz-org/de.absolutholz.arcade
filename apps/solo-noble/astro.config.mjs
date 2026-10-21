import { createBaseConfig } from '@arcade/lib-astro-config';
import { defineConfig } from 'astro/config';

export default defineConfig(
	createBaseConfig({
		base: '/solo-noble',
		prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	}),
);
