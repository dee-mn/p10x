import './sync-home-insights.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const routes = JSON.parse(await fs.readFile('docs/routes.json', 'utf8'));
const header = (await fs.readFile('components/header.html', 'utf8')).trim();
const footer = (await fs.readFile('components/footer.html', 'utf8')).trim();
// Keep shared markup aligned with the wrapper on each page.
function insertComponent(html, pattern, component) {
  return html.replace(pattern, (_, indent) =>
    component
      .split('\n')
      .map((line) => indent + line)
      .join('\n')
  );
}

for (const { route } of routes) {
  const file = path.join('.', route.slice(1), 'index.html');
  let html = await fs.readFile(file, 'utf8');
  html = insertComponent(
    html,
    /([ \t]*)<header\b[^>]*id="ui-header-elementor"[\s\S]*?<\/header>/,
    header
  );
  html = insertComponent(
    html,
    /([ \t]*)<footer\b[^>]*id="ui-footer-elementor"[\s\S]*?<\/footer>/,
    footer
  );
  await fs.writeFile(file, html);
}
console.log(`Shared header and footer applied to ${routes.length} pages.`);
