// Optional export. The checked-in repository root is already deployable.
import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const pages = JSON.parse(await readFile(new URL('docs/migrated-pages.json', root), 'utf8'));
const origin = (process.env.SITE_URL || 'https://p10x.flevor.me').replace(/\/$/, '');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const dir of ['styles', 'scripts']) await cp(new URL(`${dir}/`, root), new URL(`${dir}/`, dist), { recursive: true });
await cp(new URL('contact.php', root), new URL('contact.php', dist));
for (const { route } of pages) {
  const file = route.replace(/^\//, '') + 'index.html';
  let html = await readFile(new URL(file, root), 'utf8');
  html = html.replace(/(<link[^>]*href=")[^"]*("[^>]*rel="canonical"[^>]*>)/g, `$1${origin}${route}$2`);
  html = html.replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/g, `$1${origin}${route}$2`);
  await mkdir(new URL(route.replace(/^\//, ''), dist), { recursive: true });
  await writeFile(new URL(file, dist), html);
}
await writeFile(new URL('sitemap.xml', dist), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.map(p => p.route).sort().map(route => `<url><loc>${origin}${route}</loc></url>`).join('') + '</urlset>\n');
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Exported ${pages.length} pages into dist/. Plesk Git deployment can serve the repository root directly.`);
