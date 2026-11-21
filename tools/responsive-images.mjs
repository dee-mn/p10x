import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import sharp from 'sharp';

const photoWidths = [320, 480, 768, 1080, 1440, 1920, 2560];
const logoWidths = [64, 128, 192, 256, 384, 512];
const raster = /^\/assets\/images\/[\w.@-]+\.(?:jpeg|jpg|png)(?:\?[\w=&.-]+)?$/i;
// These photographic backgrounds need wide candidates on large screens.
const cssPhotos = ['/assets/images/p10x-vibe-16.jpg', '/assets/images/p10x-about.jpeg'];

function sizesFor(node, url, ratio, home) {
  const classes = [];
  for (let p = node.parentNode; p; p = p.parentNode) {
    const attr = p.attrs?.find(a => a.name === 'class');
    if (attr) classes.push(...attr.value.split(/\s+/));
  }
  // In a tall cover crop the image is scaled to the height before its sides are clipped.
  if (classes.includes('p10x-collective-backdrop'))
    return `max(105vw, ${Math.ceil(105 * ratio)}vh)`;
  if (classes.includes('sc-photo'))
    return `(max-width: 767px) max(90vw, ${Math.ceil(470 * ratio)}px), max(55vw, ${Math.ceil(450 * ratio)}px)`;
  if (classes.includes('x-card')) return '(max-width: 767px) 100vw, 58vw';
  if (classes.includes('ui-post--featured'))
    return '(max-width: 767px) max(84vw, 400px), (max-width: 1200px) 50vw, max(28vw, 420px)';
  if (classes.includes('image--inner')) return '560px';
  if (classes.includes('p10x-product-layer')) return '600px';
  if (url.includes('p10x-logo-dark')) return '64px';
  if (url.includes('p10x-logo@')) return '128px';
  if (/p10x-(brand|partner)-/.test(url)) return '180px';
  if (classes.includes('hover-imge-ripple')) return '320px';
  if (!home) {
    const has = (...names) => names.some(name => classes.includes(name));
    if (has('dt-thumb-photo')) return '(max-width: 767px) 40vw, 240px';
    if (has('ab-milestone-image', 'ab-standard-image', 'ab-portrait', 'fs-profile-photo'))
      return '(max-width: 767px) min(100vw, 520px), min(40vw, 600px)';
    if (has('tr-hero-photo', 'ti-stage-photo', 'ae-scene'))
      return `max(100vw, ${Math.ceil(100 * ratio)}vh)`;
    if (has('wf-space-photo')) return `max(75vw, ${Math.ceil(760 * ratio)}px)`;
    if (has('wr-finish-photo', 'pp-stage-image', 'pp-mobile-step-photo', 'dt-view-photo'))
      return `(max-width: 767px) max(95vw, ${Math.ceil(360 * ratio)}px), max(60vw, ${Math.ceil(580 * ratio)}px)`;
    if (has('pp-service', 'dt-service', 'wr-service', 'wf-service', 'ti-service',
            'tr-panel', 'ab-standard', 'ti-detail-photo', 'wr-look-photo', 'dt-frame-photo'))
      return '(max-width: 767px) 100vw, 55vw';
    if (has('pp-gallery-photo', 'pp-panel', 'dt-approach-photo', 'ti-priority-photo', 'wf-architecture-photo'))
      return `(max-width: 767px) max(100vw, ${Math.ceil(480 * ratio)}px), 75vw`;
  }
  if (url.includes('William-Lee-')) return '(max-width: 767px) 85vw, 420px';
  return '100vw';
}

async function makeVariants(dir, outputDir, url) {
  const file = path.join(dir, url);
  const input = await readFile(file);
  if (input.length < 10000) return;
  const meta = await sharp(input).metadata();
  const rotated = meta.orientation >= 5 && meta.orientation <= 8;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;
  const isLogo = /\/(?:p10x-logo|p10x-brand-|p10x-partner-)/i.test(url);
  const candidates = [];
  const fullWidth = cssPhotos.includes(url) || /Five-Pillars|p10x-vibe-12/.test(url) || input.length > 2_000_000;
  let widths = photoWidths;
  if (isLogo) widths = logoWidths;
  else if (fullWidth) widths = [...photoWidths, 3200, 3840, 4320];
  for (const w of widths) {
    if (w >= width) break;
    const image = sharp(input).rotate().resize({ width: w }).keepIccProfile();
    if (meta.format === 'jpeg') image.jpeg({ quality: 89, chromaSubsampling: '4:4:4', mozjpeg: true });
    else image.png({ compressionLevel: 9 });
    const data = await image.toBuffer();
    if (data.length >= input.length) continue;
    const id = createHash('sha256').update(data).digest('hex').slice(0, 12);
    const target = `${outputDir}/${path.parse(url).name}-${w}-${id}.${meta.format === 'jpeg' ? 'jpg' : 'png'}`;
    await writeFile(path.join(dir, target), data);
    candidates.push({ width: w, url: target });
  }
  if (!candidates.length) return;
  candidates.push({ width, url });
  return { candidates, ratio: width / height };
}

// A build encodes each source once. The initial homepage release keeps its public asset paths.
export async function preparePageImages(html, dir, route, variantCache) {
  const home = route === '/';
  const outputDir = home ? '/assets/responsive/home' : '/assets/responsive/pages';
  await mkdir(path.join(dir, outputDir), { recursive: true });
  function imageFor(url) {
    if (!variantCache.has(url)) variantCache.set(url, makeVariants(dir, outputDir, url));
    return variantCache.get(url);
  }

  const backgrounds = new Map();
  async function background(url, card = false) {
    if (!raster.test(url)) return;
    const image = await imageFor(url.split('?')[0]);
    if (!image) return;
    const key = (card ? 'card:' : '') + url;
    if (!backgrounds.has(key)) {
      const variable = (home ? '--home-img-' : '--page-img-') + backgrounds.size;
      backgrounds.set(key, { url, image, variable, card });
    }
    return `var(${backgrounds.get(key).variable}, url("${url}"))`;
  }

  const patches = [];
  async function visit(node) {
    const attrs = node.attrs || [];
    const has = name => attrs.some(a => a.name === name);
    for (const { name, value } of attrs) {
      const loc = node.sourceCodeLocation?.attrs?.[name];
      if (!loc) continue;
      if (name === 'style' && value.includes('/assets/images/')) {
        let css = value;
        const card = route === '/insights/' && attrs.some(a => a.name === 'class' && a.value.split(/\s+/).includes('ui-post--featured'));
        for (const match of value.matchAll(/url\((["']?)(\/assets\/images\/[\w.@-]+)\1\)/g)) {
          const replacement = await background(match[2], card);
          if (replacement) css = css.replace(match[0], replacement);
        }
        if (css !== value) {
          const escaped = css.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
          patches.push([loc.startOffset, loc.endOffset, `style="${escaped}"`]);
        }
        continue;
      }

      const isImg = node.tagName === 'img' && name === 'src';
      const isPoster = node.tagName === 'video' && name === 'poster';
      if (!isImg && !isPoster && name !== 'data-search-photo' && name !== 'data-image-url') continue;
      if (!raster.test(value) || (isImg && has('srcset'))) continue;
      const url = value.split('?')[0];
      const image = await imageFor(url);
      if (!image) continue;
      const { candidates, ratio } = image;
      if (isImg) {
        const srcset = candidates.map(c => `${c.url === url ? value : c.url} ${c.width}w`).join(', ');
        const sizes = has('sizes') ? '' : ` sizes="${sizesFor(node, url, ratio, home)}"`;
        patches.push([loc.endOffset, loc.endOffset, ` srcset="${srcset}"${sizes}`]);
      } else {
        // Video's poster attribute accepts a single file, including before playback or under reduced motion.
        const width = isPoster ? 2560 : name === 'data-search-photo' ? 480 : 768;
        const target = candidates.find(c => c.width >= width);
        if (target && target.url !== url)
          patches.push([loc.startOffset, loc.endOffset, `${name}="${target.url}"`]);
      }
    }
    for (const child of (node.content || node).childNodes || []) await visit(child);
  }
  await visit(parse(html, { sourceCodeLocationInfo: true }));
  for (const [start, end, value] of patches.sort((a, b) => b[0] - a[0]))
    html = html.slice(0, start) + value + html.slice(end);

  function backgroundCss() {
    if (!backgrounds.size) return '';
    const rules = [[null, Infinity], [2560, 2560], [1920, 1920], [1440, 1440], [960, 960], [600, 640]];
    return '@supports (background-image:image-set(url("") 1x)){' + rules.map(([max, width]) => {
      const values = [];
      for (const { url, image, variable, card } of backgrounds.values()) {
        let slot = width;
        if (home && /Five-Pillars|IMG_0315/.test(url)) slot = 320;
        if (card) slot = width <= 960 ? Math.min(width, 768) : 560;
        const choices = [1, 2, 3].map(dpr => {
          const selected = image.candidates.find(c => c.width >= slot * dpr) || image.candidates.at(-1);
          return `url("${selected.url}") ${dpr}x`;
        });
        values.push(`${variable}:image-set(${choices.join(',')})`);
      }
      const css = `:root{${values.join(';')}}`;
      return max ? `@media(max-width:${max}px){${css}}` : css;
    }).join('') + '}';
  }
  return { html, background, backgroundCss };
}
