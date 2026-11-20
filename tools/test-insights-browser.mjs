import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';

const requireQA = createRequire(path.resolve(process.env.QA_PREFIX, 'package.json'));
const { chromium } = requireQA('playwright-core');
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const origin = 'http://127.0.0.1:4173';

try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(origin + '/insights/', { waitUntil: 'load' });
    const search = page.locator('#ui-header-elementor .site-search-trigger:visible');
    const mobile = width < 768;
    const logo = page.locator(mobile ? '#ui-header-mobile .ui-header-branding img' : '.block-52f9b71 .ui-logo img');
    const preceding = page.locator(mobile ? '#ui-nav-mobile' : '.block-e1a2d64 .ui-anchor-button');
    const before = await logo.boundingBox();
    for (const y of [0, 400]) {
      if (y) {
        await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
        await page.waitForSelector(mobile ? '#ui-header-mobile.ui-header-mobile-fixed' : '.ui-header-elementor-main.is-fixed');
        const sticky = await logo.boundingBox();
        assert.ok(sticky.height <= 24 && sticky.height < before.height, 'Sticky logo shrinks');
      }
      const icon = await search.boundingBox();
      const action = await preceding.boundingBox();
      assert.ok(icon.x >= action.x + action.width - 1 && icon.x + icon.width <= width, 'Search fits on the right');
      assert.equal(await search.evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
      if (!mobile) {
        const nav = await page.locator('.block-ed4be5c .surface-widget-pxl_menu:visible').boundingBox();
        const gap = action.x - (nav.x + nav.width);
        assert.ok(gap >= 12 && gap <= 40, 'Navigation and CTA spacing: ' + gap);
      }
    }
    await search.click();
    await page.locator('#site-search[open]').waitFor();
    await page.keyboard.press('Escape');
    await page.locator('#site-search').waitFor({ state: 'hidden' });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const cards = page.locator('.ui-grid-item');
    const count = await cards.count();
    assert.equal(await page.locator('.ui-grid-item:visible').count(), Math.min(count, 12));
    if (count > 12) {
      await page.getByRole('button', { name: 'Load More' }).click();
      assert.equal(await page.locator('.ui-grid-item:visible').count(), count);
    }
    if (count) {
      const link = cards.first().locator('h2 a');
      const title = await link.innerText();
      await link.click();
      await page.getByRole('heading', { level: 1, name: title, exact: true }).waitFor();
      const post = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(post.headline, title);
      assert.ok(post.author.name);
      assert.equal(await page.locator('form[action="/comment.php"]').count(), 1);
      const field = page.getByRole('searchbox', { name: 'Search Insights' });
      await field.fill(title);
      await field.press('Enter');
      await page.waitForURL('**/insights/?s=*');
      await page.locator('.ui-grid-item:visible').first().waitFor();
      assert.equal(await page.locator('#archive-query').inputValue(), title);
      assert.ok((await page.locator('.ui-grid-item:visible h2').allTextContents()).includes(title));
    }
    await page.goto(origin + '/insights/?s=zz-no-such-post-zz');
    await page.locator('[data-no-insights]').waitFor();
    assert.equal(await page.locator('.ui-grid-item:visible').count(), 0);
    await page.close();
    console.log('Insights archive, search and article checks passed at ' + width + 'px.');
  }
} finally {
  await browser.close();
}
