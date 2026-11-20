import { cp } from 'node:fs/promises';
import { build } from 'astro';
import { buildSearch } from './build-search.mjs';

await build();
for (const name of [
  '.htaccess', 'tinting', 'window-film', 'window-tint',
  'contact.php', 'comment.php', 'driver-test.php', 'includes', 'data',
  'styles', 'scripts', 'assets', 'robots.txt', 'sitemap.xml'
]) {
  await cp(name, `dist/${name}`, { recursive: true });
}
await import('./optimize-pages.mjs');
await buildSearch('dist');
