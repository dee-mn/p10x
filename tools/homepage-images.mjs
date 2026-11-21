import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import sharp from 'sharp';

const outputDir = '/assets/responsive/home';
const photoWidths = [320, 480, 768, 1080, 1440, 1920, 2560];
const logoWidths = [64, 128, 192, 256, 384, 512];
const raster = /^\/assets\/images\/[\w.@-]+\.(?:jpeg|jpg|png)(?:\?[\w=&.-]+)?$/i;
// These photographs occur only in the homepage stylesheet.
const cssPhotos = ['/assets/images/p10x-vibe-16.jpg', '/assets/images/p10x-about.jpeg'];

function sizesFor(node, url, ratio) {
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
  if (url.includes('William-Lee-')) return '(max-width: 767px) 85vw, 420px';
  return '100vw';
}

async function makeVariants(dir, url) {
  const file = path.join(dir, url);
  const input = await readFile(file);
  if (input.length < 10000) return;
  const meta = await sharp(input).metadata();
  const rotated = meta.orientation >= 5 && meta.orientation <= 8;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;
  const isLogo = /\/(?:p10x-logo|p10x-brand-|p10x-partner-)/i.test(url);
  const candidates = [];
  const fullWidth = cssPhotos.includes(url) || /Five-Pillars|p10x-vibe-12/.test(url);
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

export async function prepareHomepageImages(html, dir) {
  const sources = new Set(cssPhotos);
  const elements = [];
  function visit(node) {
    for (const attr of node.attrs || []) {
      const isImg = node.tagName === 'img' && attr.name === 'src';
      if (isImg || attr.name === 'data-search-photo' || attr.name === 'data-image-url') {
        if (!raster.test(attr.value)) continue;
        sources.add(attr.value.split('?')[0]);
        elements.push({ node, attr, isImg });
      }
      if (attr.name === 'style') {
        for (const match of attr.value.matchAll(/url\(["']?(\/assets\/images\/[\w.@-]+)["']?\)/g))
          if (raster.test(match[1])) sources.add(match[1]);
      }
    }
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parse(html, { sourceCodeLocationInfo: true }));
  await mkdir(path.join(dir, outputDir), { recursive: true });
  const images = new Map();
  for (const url of sources) {
    const image = await makeVariants(dir, url);
    if (image) images.set(url, image);
  }

  const patches = [];
  for (const { node, attr, isImg } of elements) {
    const url = attr.value.split('?')[0];
    const image = images.get(url);
    if (!image) continue;
    const { candidates, ratio } = image;
    const loc = node.sourceCodeLocation.attrs[attr.name];
    if (isImg) {
      if (node.attrs.some(a => a.name === 'srcset')) continue;
      const srcset = candidates.map(c => `${c.url === url ? attr.value : c.url} ${c.width}w`).join(', ');
      const sizes = sizesFor(node, url, ratio);
      patches.push([loc.endOffset, loc.endOffset, ` srcset="${srcset}" sizes="${sizes}"`]);
    } else {
      const target = candidates.find(c => c.width >= (attr.name === 'data-search-photo' ? 480 : 768));
      if (target) patches.push([loc.startOffset, loc.endOffset, `${attr.name}="${target.url}"`]);
    }
  }
  for (const [start, end, value] of patches.sort((a, b) => b[0] - a[0]))
    html = html.slice(0, start) + value + html.slice(end);

  const backgrounds = new Map();
  function background(url) {
    if (!images.has(url)) return;
    if (!backgrounds.has(url)) backgrounds.set(url, '--home-img-' + backgrounds.size);
    return `var(${backgrounds.get(url)}, url("${url}"))`;
  }
  // Inline backgrounds are authored alongside a few of the homepage pictures.
  html = html.replace(/\bstyle=(["'])(.*?)\1/gs, (attr, quote, value) => {
    const css = value.replace(/url\((["']?)(\/assets\/images\/[\w.@-]+)\1\)/g,
      (raw, innerQuote, url) => background(url)?.replaceAll('"', innerQuote) || raw);
    return `style=${quote}${css}${quote}`;
  });

  function backgroundCss() {
    // Only the homepage bundle receives these variables. Original URLs are the CSS fallback.
    const rules = [[null, Infinity], [2560, 2560], [1920, 1920], [1440, 1440], [960, 960], [600, 640]];
    return '@supports (background-image:image-set(url("") 1x)){'+ rules.map(([max, width]) => {
      const values = [];
      for (const [url, name] of backgrounds) {
        const { candidates } = images.get(url);
        const slot = /Five-Pillars|IMG_0315/.test(url) ? 320 : width;
        const choices = [1, 2, 3].map(dpr => {
          const selected = candidates.find(c => c.width >= slot * dpr) || candidates.at(-1);
          return `url("${selected.url}") ${dpr}x`;
        });
        values.push(`${name}:image-set(${choices.join(',')})`);
      }
      const css = `:root{${values.join(';')}}`;
      return max ? `@media(max-width:${max}px){${css}}` : css;
    }).join('') + '}';
  }
  return { html, background, backgroundCss };
}
