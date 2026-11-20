import fs from 'node:fs/promises';
import { addImageDimensions } from './image-dimensions.mjs';

const articles = JSON.parse(
  await fs.readFile('docs/article-index.json', 'utf8')
).slice(0, 6);
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]
  );
function renderCard(article) {
  const title = escapeHtml(article.title);
  const date = new Date(article.date + ' GMT').toISOString().slice(0, 10);

  return `<article class="ui-swiper-slide" aria-label="${title}">
  <div class="ui-post--inner">
    <div class="ui-post--featured ui-item--img">
      <a class="ui-img-link" href="${escapeHtml(article.route)}" aria-label="Read ${title}"><img src="${escapeHtml(article.image)}" alt="${title}" loading="lazy" decoding="async"></a>
    </div>
    <div class="ui-item-content">
      <h3 class="ui-post--title title-hover-line"><a href="${escapeHtml(article.route)}">${title}</a></h3>
      <div class="ui-item--excerpt">${escapeHtml(article.description)}</div>
      <div class="ui-item-meta"><time class="ui-item--date" datetime="${date}">${escapeHtml(article.date)}</time></div>
    </div>
  </div>
</article>`;
}

const file = 'index.html',
  html = await fs.readFile(file, 'utf8');
const start = '<!-- home-insights:start -->',
  end = '<!-- home-insights:end -->';
const startIndex = html.indexOf(start),
  endIndex = html.indexOf(end);
if (startIndex < 0 || endIndex < startIndex) throw new Error('Homepage Insights markers are missing.');
const indent = html.slice(html.lastIndexOf('\n', startIndex) + 1, startIndex).match(/^[ \t]*/)[0];
const cards = articles
  .map((article) => addImageDimensions(renderCard(article)))
  .join('\n')
  .split('\n')
  .map((line) => indent + line)
  .join('\n');
const nextHtml = [html.slice(0, startIndex + start.length), cards, indent + html.slice(endIndex)].join('\n');
if (nextHtml !== html) await fs.writeFile(file, nextHtml);
