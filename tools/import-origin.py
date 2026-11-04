"""Read working public pages only. Reuse hosted assets; never downloads media."""
import concurrent.futures as cf
import hashlib
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://p10xx.flevor.me'
SITE_ORIGIN = 'https://p10x.flevor.me'
SLUGS = ['', 'about-us', 'ppf', 'wrapping', 'tinting', 'detailing',
         'window-film', 'faq', 'insights', 'contact-us', 'ppf-cost-malaysia',
         'tesla-ppf', 'nano-ceramic-tint', 'car-coating-price', 'car-coating',
         'ceramic-coating', 'zeekr-7x-ppf', 'best-car-tint-malaysia',
         'how-long-does-car-window-tinting-take', 'types-of-car-tint',
         'jpj-tinted-rules-specification', 'car-tint-price-malaysia',
         'ppf-thickness', 'car-tint-malaysia', 'tpu-tph-pvc-ppf-film',
         'how-to-install-ppf', 'pre-cut-vs-hand-cut-ppf-guide',
         'best-ppf-film-malaysia', 'ppf-film-types', 'is-ppf-worth-it']
ALIASES = {'/category/p10x-insights/': '/insights/', '/contact/': '/contact-us/',
           '/wp-sitemap.xml': '/sitemap.xml', '/our-services/': '/ppf/',
           '/service/design-consultant/': '/contact-us/'}
REMOVE_IDS = {'swv-js', 'contact-form-7-js', 'contact-form-7-js-before',
              'wp-emoji-settings', 'pxl-main-js-extra', 'pxl-woocommerce-js'}


def read_page(slug):
    url = ORIGIN + '/' + (slug + '/' if slug else '')
    result = subprocess.run(['curl', '-fsSL', '--connect-timeout', '10',
                             '--max-time', '40', url], capture_output=True)
    if result.returncode:
        raise RuntimeError(f'{url}: {result.stderr.decode()[-160:]}')
    html = result.stdout.decode()
    if '<title>' not in html or 'page not found' in BeautifulSoup(html, 'html.parser').title.get_text().lower():
        raise RuntimeError(f'{url}: not a working page')
    return slug, html


def emit(folder, text, extension):
    name = hashlib.sha256(text.encode()).hexdigest()[:16] + extension
    target = ROOT / folder / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text)
    return f'/{folder}/{name}'


def migrate(slug, html):
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup.select('link[rel="https://api.w.org/"],link[rel="EditURI"],link[rel="alternate"],meta[name="generator"],#wpadminbar'):
        tag.decompose()
    for tag in list(soup.find_all('script')):
        text = tag.get_text()
        if tag.get('id') in REMOVE_IDS or tag.get('type') == 'speculationrules' or 'user_registration_params' in text or 'wpEmojiSettingsSupports' in text:
            tag.decompose()
            continue
        if tag.get('id') == 'elementor-frontend-js-before':
            match = re.search(r'var elementorFrontendConfig = (\{.*\});', text)
            config = json.loads(match[1])
            config['nonces'] = {}
            config['urls'].pop('ajaxurl', None)
            # The runtime's lazy chunks and images keep their original public URLs.
            text = 'var elementorFrontendConfig = ' + json.dumps(config, separators=(',', ':')) + ';'
            tag.string = text
    for tag in soup.select('input[name^="_wpcf7"],input[name="_wpnonce"],input[name="_wp_http_referer"]'):
        tag.decompose()
    for form in soup.select('.wpcf7 form'):
        form['action'] = '/contact.php'
        form['method'] = 'post'
        form['data-p10x-contact'] = ''
        form.append(soup.new_tag('input', attrs={'name': 'website', 'tabindex': '-1', 'autocomplete': 'off', 'aria-hidden': 'true', 'style': 'display:none'}))
        form['class'] = [x for x in form.get('class', []) if x not in ('init', 'invalid', 'sent')]
    for form in soup.select('form.search-form'):
        form['action'] = '/insights/'
    for tag in soup.select('a[href]'):
        if tag['href'].startswith('#') or not tag['href']:
            continue
        url = urlsplit(urljoin(ORIGIN + '/' + (slug + '/' if slug else ''), tag['href']))
        if url.netloc == urlsplit(ORIGIN).netloc and not url.path.startswith(('/wp-content/', '/wp-includes/')):
            route = ALIASES.get(url.path, url.path)
            if route.startswith('/author/'):
                route = '/insights/'
            tag['href'] = route + ('?' + url.query if url.query else '') + ('#' + url.fragment if url.fragment else '')
        if tag.get('target') == '_blank':
            tag['rel'] = 'noopener noreferrer'
    # Only styles and scripts present on these pages are retained. Referenced
    # theme/plugin files stay at their existing URLs; no theme directory is copied.
    for tag in list(soup.find_all('style')):
        text = tag.get_text()
        link = soup.new_tag('link', rel='stylesheet', href=emit('styles', text, '.css'))
        if tag.get('media'):
            link['media'] = tag['media']
        tag.replace_with(link)
    for tag in list(soup.find_all('script')):
        if tag.get('src') or tag.get('type') not in (None, 'text/javascript', 'module'):
            continue
        text = str(tag.string or tag.get_text())
        if not text.strip():
            tag.decompose()
            continue
        src = emit('scripts', text, '.js')
        tag.clear()
        tag['src'] = src
    for tag in soup.select('script[src],link[href],img[src],video[src],source[src],iframe[src]'):
        attr = 'href' if tag.name == 'link' else 'src'
        value = tag.get(attr, '')
        if value.startswith(('/wp-content/', '/wp-includes/', '//')):
            tag[attr] = urljoin(ORIGIN, value)
    for tag in soup.select('.e-con.e-parent'):
        tag['class'] = tag.get('class', []) + ['e-lazyloaded']
    for tag in soup.select('link[rel="canonical"]'):
        tag['href'] = SITE_ORIGIN + '/' + (slug + '/' if slug else '')
    soup.head.append(soup.new_tag('link', rel='stylesheet', href='/styles/site.css'))
    soup.body.append(soup.new_tag('script', src='/scripts/site.js', defer=True))
    target = ROOT / slug / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(str(soup))
    return {'route': '/' + (slug + '/' if slug else ''), 'source': ORIGIN + '/' + (slug + '/' if slug else ''), 'title': soup.title.get_text()}


if __name__ == '__main__':
    with cf.ThreadPoolExecutor(max_workers=5) as pool:
        pages = list(pool.map(read_page, SLUGS))
    results = [migrate(slug, html) for slug, html in pages]
    # Remove obsolete page-extracted files after a refreshed import.
    source = '\n'.join(x.read_text() for x in [ROOT / r['route'].strip('/') / 'index.html' for r in results])
    for folder in ('styles', 'scripts'):
        for file in (ROOT / folder).glob('*'):
            if file.name != ('site.css' if folder == 'styles' else 'site.js') and f'/{folder}/{file.name}' not in source:
                file.unlink()
    (ROOT / 'docs').mkdir(exist_ok=True)
    (ROOT / 'docs/migrated-pages.json').write_text(json.dumps(results, indent=2))
    from importlib.util import spec_from_file_location, module_from_spec
    spec = spec_from_file_location('finalize_news', ROOT / 'tools/finalize-news.py')
    news = module_from_spec(spec)
    spec.loader.exec_module(news)
    news.finalize()
    print(f'Migrated {len(results)} working pages. Downloaded no images, videos, fonts or theme libraries.')
