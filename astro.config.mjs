// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// Deployed to GitHub Pages as a project site: https://decoy-dev.github.io/julienna-portfolio/
// Every internal link goes through `href()` in src/lib/url.ts so the base path is never hard-coded.
export default defineConfig({
  site: 'https://decoy-dev.github.io',
  base: '/julienna-portfolio',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [icon({ include: { ph: ['*'] } })],
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
