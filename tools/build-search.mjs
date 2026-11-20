import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as pagefind from 'pagefind';

// The same bundle serves both the repository root and the standalone dist export.
export async function buildSearch(site = '.') {
  const routes = JSON.parse(await fs.readFile('docs/routes.json', 'utf8'));
  const { index, errors } = await pagefind.createIndex({
    excludeSelectors: ['form', '[hidden]', '.ui-hidden-panel-popup']
  });
  try {
    if (!index) throw new Error(errors.join('\n'));
    for (const { route, title } of routes) {
      const html = await fs.readFile(path.join(site, route, 'index.html'), 'utf8');
      if (!html.includes('id="ui-main"')) throw new Error('Missing search content on ' + route);
      const label = title.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
      const result = await index.addHTMLFile({
        url: route,
        content: html.replace('id="ui-main"', `id="ui-main" data-pagefind-body data-pagefind-meta="title[data-label]" data-label="${label}"`)
      });
      if (result.errors.length || !result.file?.uniqueWords)
        throw new Error('Cannot index ' + route + ': ' + result.errors.join('\n'));
    }
    const written = await index.writeFiles({ outputPath: path.join(site, 'pagefind') });
    if (written.errors.length) throw new Error(written.errors.join('\n'));
    console.log('Pagefind indexed ' + routes.length + ' pages.');
  } finally {
    await pagefind.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await buildSearch();
