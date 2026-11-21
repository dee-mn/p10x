import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
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

const routes = JSON.parse(readFileSync('docs/routes.json', 'utf8')).map(page => page.route);

async function inspectArchive(page, dpr) {
  const covers = await page.locator('div.ui-post--featured[style]').evaluateAll(async (cards, dpr) => {
    const files = [];
    for (const card of cards) {
      const original = card.style.backgroundImage.match(/url\(["']?([^)"']+)/)?.[1];
      const imageSet = getComputedStyle(card).backgroundImage;
      const candidates = [...imageSet.matchAll(/url\("([^"]+)"\)\s+([\d.]+)(?:dppx|x)/g)];
      if (!candidates.length) continue;
      const selected = candidates.find(m => Number(m[2]) >= dpr) ?? candidates.at(-1);
      const img = new Image();
      img.src = selected[1];
      await img.decode();
      files.push({ original: new URL(original, location.href).href, selected: img.src });
    }
    return files;
  }, dpr);
  assert(covers.length, 'Insights listing should select responsive covers');
  assert(totalBytes(covers.map(c => c.selected)) < totalBytes(covers.map(c => c.original)),
    'Insights covers should download fewer bytes at this viewport');
  return covers;
}

async function inspectPage(page, route, width, dpr) {
  await page.goto(origin + route, { waitUntil: 'load' });
  // Decode stills even in lazy and inactive slots so both budgets cover the same images.
  const images = await page.locator('img[srcset]').evaluateAll(async elements => {
    for (const img of elements) img.loading = 'eager';
    await Promise.all(elements.map(img => img.decode()));
    return elements.map(img => ({ original: img.src, selected: img.currentSrc }));
  });
  if (route === '/') {
    const brand = page.locator(width < 768 ? '#ui-header-mobile .ui-header-branding img' : '.block-52f9b71 .ui-logo img');
    assert.match(await brand.evaluate(img => img.currentSrc), /\/assets\/responsive\/home\//);
    if (width < 768) await page.locator('#p10x-motion-hero .pm-more').click();
    const layer = page.locator('.view-20 .block-16c890a .ui-section-bg-parallax').first();
    await layer.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForFunction(el => !el.hasAttribute('data-defer-background'), await layer.elementHandle());
    const background = await layer.evaluate(el => getComputedStyle(el).backgroundImage);
    assert(background.includes('/assets/responsive/home/'), 'Homepage background should use responsive sources');
  }
  if (route === '/insights/') images.push(...await inspectArchive(page, dpr));
  if (route === '/wrapping/') {
    await page.locator('.wr-finish-tabs [role="tab"]').last().click();
    assert(await page.locator('.wr-finish-panel.is-active img').first().evaluate(img => img.complete && img.naturalWidth > 0));
  }
  if (route === '/driver-personality-test/') {
    assert(await page.locator('#dpt-avatar-image').evaluate(t => !!t.content.querySelector('img[srcset]')));
    await page.locator('#dpt-start').click();
    assert(await page.locator('#dpt-lead').isVisible());
  }
  const before = totalBytes(images.map(i => i.original));
  const after = totalBytes(images.map(i => i.selected));
  assert(after < before, route + ' should download fewer image bytes');
  console.log(`Responsive images ${route} ${width}px @${dpr}x: ${before} -> ${after} bytes (${images.length} slots)`);
}

try {
  for (const [width, height, dpr] of [[390, 844, 3], [1440, 900, 1]]) {
    for (const route of routes) {
      const page = await browser.newPage({
        viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce'
      });
      try {
        await inspectPage(page, route, width, dpr);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
