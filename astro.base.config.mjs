// astro.base.config.mjs
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import react from '@astrojs/react';
import wyw from '@wyw-in-js/vite';

/**
 * @param {import('astro').UserConfig} overrides
 */
export function createBaseConfig(overrides = {}) {
  return {
    // Point all apps to the monorepo root for .env files automatically
    envDir: './',
    output: 'static',
    integrations: [react()],
    vite: {
      plugins: [
        wyw({
          include: ['**/*.{ts,tsx,js,jsx}'],
          babelOptions: {
            presets: ['@babel/preset-typescript', '@babel/preset-react'],
          },
        }),
      ],
      ...(overrides.vite || {}),
    },
    i18n: {
      defaultLocale: DEFAULT_LANGUAGE,
      locales: SUPPORTED_LANGUAGES.map((item) => item.code),
      routing: {
        prefixDefaultLocale: true,
        redirectToDefaultLocale: false,
      },
    },
    ...overrides,
  };
}
