import fs from 'node:fs/promises';
const articles=JSON.parse(await fs.readFile('docs/article-index.json','utf8')).slice(0,6);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cards=articles.map(article=>`<article class="ui-swiper-slide" aria-label="${esc(article.title)}">
<div class="ui-post--inner">
<div class="ui-post--featured ui-item--img"><a class="ui-img-link" href="${esc(article.route)}" aria-label="Read ${esc(article.title)}"><img src="${esc(article.image)}" alt="${esc(article.title)}" loading="lazy" decoding="async"></a></div>
<div class="ui-item-content"><h3 class="ui-post--title title-hover-line"><a href="${esc(article.route)}">${esc(article.title)}</a></h3>
<div class="ui-item--excerpt">${esc(article.description)}</div>
<div class="ui-item-meta"><time class="ui-item--date" datetime="${new Date(article.date).toISOString().slice(0,10)}">${esc(article.date)}</time></div></div>
</div></article>`).join('\n');
const file='index.html',html=await fs.readFile(file,'utf8');
const start='<!-- home-insights:start -->',end='<!-- home-insights:end -->';
const a=html.indexOf(start),b=html.indexOf(end);
if(a<0||b<a)throw new Error('Homepage Insights markers are missing.');
await fs.writeFile(file,html.slice(0,a+start.length)+'\n'+cards+'\n'+html.slice(b));
