import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ryanholloway.work',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
