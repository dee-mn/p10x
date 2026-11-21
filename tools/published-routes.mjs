import fs from 'node:fs';
import path from 'node:path';

export function publishedRoutes(site) {
  const pages = JSON.parse(fs.readFileSync('docs/routes.json', 'utf8'));
  const articles = fs.readdirSync(path.join(site, 'insights'), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(site, 'insights', entry.name, 'index.html')))
    .map(entry => ({ route: '/insights/' + entry.name + '/', isArticle: true }));
  return [...pages, ...articles];
}
