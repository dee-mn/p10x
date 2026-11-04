"""Build the full static news listing from the migrated article pages."""
import copy
import json
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


def finalize():
    file = ROOT / 'src/pages/insights/index.html'
    soup = BeautifulSoup(file.read_text(), 'html.parser')
    grid = soup.select_one('.pxl-blog-grid')
    grid['data-p10x-news'] = ''
    inner = grid.select_one('.pxl-grid-inner')
    cards = inner.select('.pxl-grid-item')
    existing = {c.select_one('.pxl-post--title a')['href'] for c in cards}
    template = cards[-1]
    for page in json.loads((ROOT / 'docs/migrated-pages.json').read_text()):
        path = ROOT / 'src/pages' / page['route'].strip('/') / 'index.html'
        article = BeautifulSoup(path.read_text(), 'html.parser')
        post = article.select_one('article.pxl---post')
        if post is None or page['route'] in existing:
            continue
        card = copy.deepcopy(template)
        title = page['title'].removesuffix(' – P10X – Professional 10 Times').removesuffix(' – P10X')
        a = card.select_one('.pxl-post--title a')
        a['href'] = page['route']
        a.string = title
        image_link = card.select_one('.pxl-img-link')
        image_link['href'] = page['route']
        image_link['aria-label'] = 'Read ' + title
        image = post.select_one('#pxl-inner-post-sg-bg')
        card.select_one('.pxl-post--featured')['style'] = image.get('style', '') if image else ''
        paras = post.select('.pxl-item--content p')
        excerpt = next((p.get_text(' ', strip=True) for p in paras if len(p.get_text(' ', strip=True)) > 80), '')
        card.select_one('.pxl-item--excerpt').string = excerpt[:157].rsplit(' ', 1)[0] + '…' if len(excerpt) > 160 else excerpt
        date = post.select_one('.pxl-item--date')
        card.select_one('.pxl-item--date').string = date.get_text(' ', strip=True) if date else ''
        inner.append(card)
    for i, card in enumerate(inner.select('.pxl-grid-item')):
        if i >= 12:
            card['data-p10x-more'] = ''
    button = grid.select_one('.btn-grid-loadmore')
    button.name = 'button'
    button['type'] = 'button'
    button['hidden'] = ''
    button['data-p10x-load-more'] = ''
    status = soup.new_tag('p', attrs={'data-p10x-news-status': '', 'role': 'status', 'aria-live': 'polite'})
    grid.append(status)
    for tag in soup.select('#pxl-post-grid-js'):
        tag.decompose()
    file.write_text(str(soup))
    # No page needs the former grid's AJAX configuration after static pagination.
    for page in (ROOT / 'src/pages').rglob('index.html'):
        text = page.read_text()
        for tag in BeautifulSoup(text, 'html.parser').select('script[src^="/scripts/"]'):
            script = ROOT / 'src' / tag['src'].lstrip('/')
            if script.exists() and 'sourceURL=pxl-post-grid-js-extra' in script.read_text():
                text = text.replace(str(tag), '')
        page.write_text(text)
    print(f'Static news listing: {len(inner.select(".pxl-grid-item"))} articles; no WordPress pagination.')


if __name__ == '__main__':
    finalize()
