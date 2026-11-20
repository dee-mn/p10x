import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://p10x.flevor.me',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
  devToolbar: { enabled: false }
});
