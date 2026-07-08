// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://routinly.org',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // Emit `pricing.html` instead of `pricing/index.html` so URLs resolve
    // without a trailing slash on Cloudflare Workers static assets.
    format: 'file',
  },
});
