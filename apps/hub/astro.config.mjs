import { createBaseConfig } from '@arcade/lib-astro-config';
import * as arcadeThemes from '@arcade/lib-ui/styles/themes';
import { defineConfig } from 'astro/config';

export default defineConfig(
	createBaseConfig({
		themes: arcadeThemes,
	}),
);
