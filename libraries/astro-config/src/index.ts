import { fileURLToPath } from 'node:url';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import react from '@astrojs/react';
import wyw from '@wyw-in-js/vite';
import type { AstroUserConfig } from 'astro';

export function createBaseConfig(overrides: AstroUserConfig = {}): AstroUserConfig {
  const rootEnvDir = fileURLToPath(new URL('../../../', import.meta.url));
  const { vite: overrideVite, ...restOverrides } = overrides;

  return {
    output: 'static',
    integrations: [react()],
    i18n: {
      defaultLocale: DEFAULT_LANGUAGE,
      locales: SUPPORTED_LANGUAGES.map((item) => item.code),
      routing: {
        prefixDefaultLocale: true,
        redirectToDefaultLocale: false,
      },
    },
    ...restOverrides,
    vite: {
      envDir: overrideVite?.envDir ?? rootEnvDir,
      ...overrideVite,
      plugins: [
        wyw({
          include: ['**/*.{ts,tsx,js,jsx}'],
          babelOptions: {
            presets: ['@babel/preset-typescript', '@babel/preset-react'],
          },
        }),
        ...(overrideVite?.plugins || []),
      ],
    },
  };
}
