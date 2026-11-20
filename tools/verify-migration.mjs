import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireQA = createRequire(path.resolve(process.env.QA_PREFIX, 'package.json'));
const { chromium } = requireQA('playwright-core');
const baseline = '.baseline';
const routes = JSON.parse(await fs.readFile('docs/routes.json', 'utf8'));
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
try {
  // Compare the browser's parsed document before any client-side scripts run.
  const parser = await browser.newPage();
  for (const { route } of routes) {
    const documents = await Promise.all([baseline, 'dist'].map((dir) => fs.readFile(path.join(dir, route, 'index.html'), 'utf8')));
    const [before, after] = await parser.evaluate((documents) => {
      function normalize(node) {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() ? node.textContent.replace(/\s+/g, ' ').trim() : null;
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        const attrs = Array.from(node.attributes, ({ name, value }) => [name, value]).sort(([a], [b]) => a.localeCompare(b));
        if (node.matches('script[type="application/ld+json"]')) return [node.tagName, attrs, JSON.parse(node.textContent)];
        return [node.tagName, attrs, Array.from(node.childNodes, normalize).filter(Boolean)];
      }
      return documents.map((html) => normalize(new DOMParser().parseFromString(html, 'text/html').documentElement));
    }, documents);
    // Report the first different field without dumping whole pages into build logs.
    function compare(a, b, location) {
      if (typeof a === 'object' && a && typeof b === 'object' && b) {
        assert.deepEqual(Object.keys(a), Object.keys(b), location + ' structure');
        for (const key of Object.keys(a)) compare(a[key], b[key], location + '/' + key);
      } else assert.equal(b, a, location);
    }
    compare(before, after, route);
  }
  await parser.close();
  console.log('Matched rendered markup and metadata across ' + routes.length + ' routes.');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, isMobile: viewport.width < 500, hasTouch: viewport.width < 500 });
    const origin = 'http://127.0.0.1:4173';
    await page.goto(origin, { waitUntil: 'domcontentloaded' });
    await page.locator('.pm-stage').waitFor();
    if (viewport.width < 500) {
      await page.locator('.pm-more').tap();
      await page.waitForFunction(() => window.scrollY > 0);
    } else {
      const stage = await page.locator('.pm-stage').boundingBox();
      const x = stage.x + stage.width / 2, y = stage.y + stage.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + 60, y + 10, { steps: 10 });
      await page.mouse.up();
    }
    await page.goto(origin + '/training/', { waitUntil: 'domcontentloaded' });
    await page.locator('.tr-hero').waitFor();
    const trigger = page.locator('.site-search-trigger:visible').first();
    await trigger.click();
    await page.locator('#site-search input:visible').first().fill('detailing');
    await page.locator('.search-results a').first().waitFor();
    await page.keyboard.press('Escape');
    await page.goto(origin + '/detailing/', { waitUntil: 'domcontentloaded' });
    const video = page.getByLabel('Interior detailing at P10X');
    await video.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const video = document.querySelector('video[aria-label="Interior detailing at P10X"]');
      return video && !video.controls && video.muted && !video.paused && video.currentTime > 0;
    });
    await page.close();
    console.log('Passed interaction checks at ' + viewport.width + 'px.');
  }
} finally {
  await browser.close();
}
