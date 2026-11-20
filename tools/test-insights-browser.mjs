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
