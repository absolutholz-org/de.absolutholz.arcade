import { createBaseConfig } from '@arcade/lib-astro-config';
import { defineConfig } from 'astro/config';

export default defineConfig(
	createBaseConfig({
		base: '/tracks',
	}),
);
