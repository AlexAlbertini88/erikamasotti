import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Set SITE_URL and BASE_PATH only when building for a different domain/path.
export default defineConfig({
  site: process.env.SITE_URL || 'https://alexalbertini88.github.io',
  base: process.env.BASE_PATH || '/erikamasotti',
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
});
