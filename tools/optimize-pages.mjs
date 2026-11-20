import { publishedRoutes } from './published-routes.mjs';
/* Publish lightweight styles and stable media boxes without changing authored visuals. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';
import { addImageDimensions, attribute } from './image-dimensions.mjs';

const routes = publishedRoutes('dist');
async function readOptionalText(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

await fs.mkdir('dist/styles/generated', { recursive: true });
const sourceCache = new Map(),
  stats = [];
const checkedBundles = new Set();
for (const { route } of routes) {
  const file = path.join('dist', route, 'index.html');
  const previousHtml = await fs.readFile(file, 'utf8');
  let html = previousHtml;
  const links = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
  const sources = links.map(([tag]) => attribute(tag, 'href'));
  if (!sources.length) throw Error('No stylesheet sources for ' + route);
  const classes = new Set(
    [...html.matchAll(/\bclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/))
  );
  const chunks = ['', '', ''];
  let chunk = 0,
    original = '',
    originalGzipSum = 0;
  let removed = 0;
  for (const src of sources) {
    if (!src.startsWith('/styles/'))
      throw Error('Unexpected stylesheet ' + src);
    if (!sourceCache.has(src))
      sourceCache.set(src, await fs.readFile('.' + src, 'utf8'));
    const shared = src === '/styles/reference/b163d126be3f87ed.css';
    if (shared) chunk = 1;
    const text = sourceCache.get(src);
    original += text;
    originalGzipSum += zlib.gzipSync(text).length;
    const ast = postcss.parse(text, { from: src });
    ast.walkAtRules('charset', (n) => n.remove());
    ast.walkRules((rule) => {
      const selectors = selectorParser().astSync(rule.selector);
      selectors.each((selector) => {
        let impossible = false;
        selector.walkClasses((n) => {
          // Only positive, top-level page/root classes are invariant; leave pseudo states untouched.
          if (n.parent?.parent?.type !== 'root') return;
          const pageRoot = !shared && /^(view-\d+|page-id-\d+|p10x-(about|ppf|tint|detail|window|wrap|faq))$/.test(n.value);
          const shopRoot = /^(single-product|woocommerce(?:-cart|-checkout|-page)?|widget_product_categories)$/.test(n.value);
          if ((pageRoot || shopRoot) && !classes.has(n.value)) impossible = true;
        });
        if (impossible) {
          selector.remove();
          removed++;
        }
      });
      if (selectors.nodes.length) rule.selector = selectors.toString();
      else rule.remove();
    });
    ast.walkDecls((decl) => {
      const value = valueParser(decl.value);
      value.walk((node) => {
        if (node.type !== 'function' || node.value.toLowerCase() !== 'url')
          return;
        const arg = node.nodes.find((n) => n.type !== 'space');
        if (!arg) return false;
        const url = arg.value;
        if (!/^(data:|https?:|\/|#|%23)/i.test(url))
          arg.value = path.posix.resolve(path.posix.dirname(src), url);
        return false;
      });
      decl.value = value.toString();
    });
    ast.walkAtRules((n) => {
      if (n.nodes && !n.nodes.length) n.remove();
    });
    chunks[chunk] += ast.toString() + '\n';
    if (shared) chunk = 2;
  }
  // Compact whitespace through the syntax tree, preserving values and legacy syntax exactly.
  const codes = chunks.filter(Boolean).map((css) => {
    const compact = postcss.parse(css);
    compact.walk((n) => {
      if (
        n.type === 'comment' &&
        !n.text.startsWith('!') &&
        !/copyright|licen[cs]e|@preserve/i.test(n.text)
      ) {
        n.remove();
        return;
      }
      n.raws.before = '';
      if (n.type === 'decl') {
        n.raws.between = ':';
        if (n.important) n.raws.important = '!important';
      }
      if (n.nodes) {
        n.raws.after = '';
        n.raws.between = '';
        n.raws.semicolon = false;
      }
      if (n.type === 'atrule' && n.params) n.raws.afterName = ' ';
    });
    compact.raws.after = '';
    return compact.toString();
  });
  const bundles = [];
  for (const code of codes) {
    const hash = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex')
      .slice(0, 12);
    const bundle = '/styles/generated/site-' + hash + '.css';
    if (!checkedBundles.has(bundle)) {
      const existing = await readOptionalText('dist' + bundle);
      if (existing !== code) await fs.writeFile('dist' + bundle, code);
      checkedBundles.add(bundle);
    }
    bundles.push(bundle);
  }
  // Replace existing bundle URLs in place to preserve indentation and cascade order.
  const currentBundles = links.map(([tag]) => attribute(tag, 'href'));
  if (
    bundles.length === currentBundles.length &&
    currentBundles.every((href) => href.startsWith('/styles/generated/'))
  ) {
    let index = 0;
    html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
      const updatedTag = tag.replace(currentBundles[index], bundles[index]);
      index++;
      return updatedTag;
    });
  } else {
    let first = true;
    html = html.replace(
      /([ \t]*)<link\b[^>]*rel="stylesheet"[^>]*>/g,
      (_, indent) => {
        if (!first) return '';
        first = false;
        return bundles
          .map((href) => indent + '<link rel="stylesheet" href="' + href + '">')
          .join('\n');
      }
    );
  }
  html = addImageDimensions(html);
  if (!html.includes('as="font"'))
    html = html.replace(
      '</head>',
      '<link rel="preload" href="/assets/fonts/inter-normal-latin.woff2" as="font" type="font/woff2" crossorigin></head>'
    );
  if (html !== previousHtml) await fs.writeFile(file, html);
  stats.push({
    route,
    stylesheetsBefore: sources.length,
    stylesheetsAfter: bundles.length,
    originalBytes: Buffer.byteLength(original),
    bundleBytes: codes.reduce((n, s) => n + Buffer.byteLength(s), 0),
    originalGzip: originalGzipSum,
    bundleGzip: codes.reduce((n, s) => n + zlib.gzipSync(s).length, 0),
    removedOtherPageSelectors: removed,
    bundles
  });
}
const used = new Set(
  stats.flatMap((s) => s.bundles.map((b) => path.posix.basename(b)))
);
for (const name of await fs.readdir('dist/styles/generated'))
  if (name.endsWith('.css') && !used.has(name))
    await fs.unlink('dist/styles/generated/' + name);
await fs.mkdir('qa', { recursive: true });
await fs.writeFile(
  'qa/style-optimization.json',
  JSON.stringify(stats, null, 2) + '\n'
);
console.log(
  'Optimized styles and image dimensions for ' +
    stats.length +
    ' pages. Homepage:',
  JSON.stringify(stats[0])
);
