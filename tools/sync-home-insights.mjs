import fs from 'node:fs/promises';
const articles = JSON.parse(
  await fs.readFile('docs/article-index.json', 'utf8')
).slice(0, 6);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]
  );
function renderCard(article) {
  const title = esc(article.title);
  const date = new Date(article.date).toISOString().slice(0, 10);

  return `<article class="ui-swiper-slide" aria-label="${title}">
  <div class="ui-post--inner">
    <div class="ui-post--featured ui-item--img">
      <a class="ui-img-link" href="${esc(article.route)}" aria-label="Read ${title}"><img src="${esc(article.image)}" alt="${title}" loading="lazy" decoding="async"></a>
    </div>
    <div class="ui-item-content">
      <h3 class="ui-post--title title-hover-line"><a href="${esc(article.route)}">${title}</a></h3>
      <div class="ui-item--excerpt">${esc(article.description)}</div>
      <div class="ui-item-meta"><time class="ui-item--date" datetime="${date}">${esc(article.date)}</time></div>
    </div>
  </div>
</article>`;
}

const file = 'index.html',
  html = await fs.readFile(file, 'utf8');
const start = '<!-- home-insights:start -->',
  end = '<!-- home-insights:end -->';
const a = html.indexOf(start),
  b = html.indexOf(end);
if (a < 0 || b < a) throw new Error('Homepage Insights markers are missing.');
const indent = html.slice(html.lastIndexOf('\n', a) + 1, a).match(/^[ \t]*/)[0];
const cards = articles
  .map(renderCard)
  .join('\n')
  .split('\n')
  .map((line) => indent + line)
  .join('\n');
await fs.writeFile(
  file,
  html.slice(0, a + start.length) + '\n' + cards + '\n' + indent + html.slice(b)
);
