import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const requireQA = createRequire(path.resolve(process.env.QA_PREFIX, 'package.json'));
const { chromium } = requireQA('playwright-core');
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const origin = 'http://127.0.0.1:4173';

function totalBytes(urls) {
  const files = new Set(urls.map(url => new URL(url).pathname));
  return [...files].reduce((sum, file) => sum + statSync(path.join('dist', decodeURIComponent(file))).size, 0);
}

try {
  for (const [width, height, dpr] of [[390, 844, 3], [1440, 900, 1]]) {
    const page = await browser.newPage({
      viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce'
    });
    await page.goto(origin, { waitUntil: 'load' });
    // Include the lazy and initially hidden image slots for a comparable full-page budget.
    const images = await page.locator('img[srcset]').evaluateAll(async elements => {
      for (const img of elements) img.loading = 'eager';
      await Promise.all(elements.map(img => img.decode()));
      return elements.map(img => ({ original: img.src, selected: img.currentSrc }));
    });
    const before = totalBytes(images.map(i => i.original));
    const after = totalBytes(images.map(i => i.selected));
    assert(after < before, 'Responsive image downloads should be smaller than the originals');
    const brand = page.locator(width < 768 ? '#ui-header-mobile .ui-header-branding img' : '.block-52f9b71 .ui-logo img');
    assert.match(await brand.evaluate(img => img.currentSrc), /\/assets\/responsive\/home\//);
    const background = await page.locator('.view-20 .block-16c890a .ui-section-bg-parallax').first()
      .evaluate(el => getComputedStyle(el).backgroundImage);
    assert(background.includes('/assets/responsive/home/'), 'Homepage background should use responsive sources');
    console.log(`Homepage at ${width}px / ${dpr}x, ${images.length} responsive img elements: ${before} original bytes, ${after} selected bytes.`);
    await page.close();
  }
} finally {
  await browser.close();
}
