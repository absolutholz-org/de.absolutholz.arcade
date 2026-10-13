import { defineConfig } from 'astro/config';
import { createBaseConfig } from '@arcade/lib-astro-config';

export default defineConfig(
  createBaseConfig({
    base: '/queens',
  })
);
