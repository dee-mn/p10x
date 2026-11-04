import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const dir of ['public', 'src/pages']) await cp(new URL(dir, root), dist, { recursive: true });
for (const dir of ['styles', 'scripts']) await cp(new URL(`src/${dir}`, root), new URL(`${dir}/`, dist), { recursive: true });
const origin = (process.env.SITE_URL || 'https://p10xx.flevor.me').replace(/\/$/, '');
const routes = [];
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name === 'index.html') {
      const route = '/' + path.relative(new URL('.', dist).pathname, path.dirname(file)).replaceAll('\\', '/') + '/';
      const normalized = route.replace(/^\/\/$/, '/');
      routes.push(normalized);
      let html = await readFile(file, 'utf8');
      html = html.replace(/(<link[^>]*href=")[^"]*("[^>]*rel="canonical"[^>]*>)/g, `$1${origin}${normalized}$2`);
      html = html.replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/g, `$1${origin}${normalized}$2`);
      await writeFile(file, html);
    }
  }
}
await walk(new URL('.', dist).pathname);
await writeFile(new URL('sitemap.xml', dist), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + routes.sort().map(route => `<url><loc>${origin}${route}</loc></url>`).join('') + '</urlset>\n');
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Built ${routes.length} pages in dist/.`);
