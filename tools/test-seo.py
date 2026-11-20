"""Check SEO in the actual static export, optionally through a running HTTP server."""
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, build_opener
from xml.etree import ElementTree

ROOT = Path('dist')
SITE = 'https://p10x.flevor.me'


class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.field = None
        self.fields = {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'head':
            self.active = True
        if not self.active:
            return
        if tag == 'meta':
            key = a.get('name') or a.get('property')
            if key:
                self.fields.setdefault(key, []).append(a.get('content', ''))
        elif tag == 'link' and a.get('rel') == 'canonical':
            self.fields.setdefault('canonical', []).append(a['href'])
        elif tag == 'title' or (tag == 'script' and a.get('type') == 'application/ld+json'):
            self.field = tag
            self.fields.setdefault(tag, []).append('')

    def handle_data(self, data):
        if self.field:
            self.fields[self.field][-1] += data

    def handle_endtag(self, tag):
        if self.field == tag:
            self.field = None
        if tag == 'head':
            self.active = False

    def one(self, field):
        values = self.fields.get(field, [])
        assert len(values) == 1 and values[0].strip(), (field, values)
        return values[0]


class Direct(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def response(origin, path):
    try:
        result = build_opener(Direct()).open(origin + path, timeout=10)
    except HTTPError as error:
        result = error
    with result:
        return result.status, result.headers.get('Location', '')


def redirect(origin, path, target):
    status, location = response(origin, path + '?utm_source=seo')
    resolved = urlsplit(location)
    assert (status, resolved.path, resolved.query) == (301, target, 'utm_source=seo'), (path, status, location)
    assert not resolved.netloc or resolved.netloc == urlsplit(origin).netloc, location


if __name__ == '__main__':
    origin = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else None
    pages = [item['route'] for item in json.loads(Path('docs/routes.json').read_text())]
    articles = sorted('/insights/' + p.parent.name + '/' for p in (ROOT / 'insights').glob('*/index.html'))
    pages += articles
    urls = [loc.text for loc in ElementTree.parse(ROOT / 'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    assert sorted(urls) == sorted(SITE + path for path in pages)
    assert 'Sitemap: ' + SITE + '/sitemap.xml' in (ROOT / 'robots.txt').read_text().splitlines()
    titles, descriptions = set(), set()
    for path in pages:
        head = Head()
        head.feed((ROOT / path.strip('/') / 'index.html').read_text())
        try:
            title, description = head.one('title'), head.one('description')
            assert title not in titles and description not in descriptions
            titles.add(title)
            descriptions.add(description)
            assert path.endswith('/') and head.one('canonical') == head.one('og:url') == SITE + path
            assert head.one('twitter:card') == 'summary_large_image'
            assert head.one('og:site_name') == 'P10X' and head.one('og:locale') == 'en_MY'
            for key in ['title', 'description', 'image', 'image:alt']:
                assert head.one('og:' + key) == head.one('twitter:' + key)
            image = head.one('og:image')
            assert image.startswith(SITE + '/assets/') and (ROOT / urlsplit(image).path.lstrip('/')).is_file()
            schema = json.loads(head.one('script'))
            assert schema['@context'] == 'https://schema.org'
            if path in articles:
                assert head.one('og:type') == 'article' and schema['@type'] == 'BlogPosting'
                assert schema['mainEntityOfPage'] == SITE + path and schema['image'] == image
            else:
                assert head.one('og:type') == 'website'
                assert any(node.get('url') == SITE + path and node.get('name') == title for node in schema['@graph'])
            if origin:
                assert response(origin, path)[0] == 200
                if path != '/':
                    redirect(origin, path[:-1], path)
                redirect(origin, path + 'index.html', path)
        except AssertionError as error:
            raise AssertionError(path, error.args) from error
    if origin:
        aliases = {'/tinting': '/automotive-window-tint/', '/window-film': '/architecture-tint/', '/window-tint': '/architecture-tint/'}
        aliases.update({path.removeprefix('/insights').rstrip('/'): path for path in articles
                        if ('RewriteRule ^' + path.split('/')[-2] + '(?:') in (ROOT / '.htaccess').read_text()})
        for alias, target in aliases.items():
            for suffix in ['', '/', '/index.html']:
                redirect(origin, alias + suffix, target)
        for path in ['/robots.txt', '/sitemap.xml', '/insights/feed.xml', '/scripts/native.js']:
            assert response(origin, path)[0] == 200, path
        for path in ['/unknown-seo-check', '/unknown-seo-check/index.html']:
            assert response(origin, path)[0] == 404, path
    print('Verified SEO for', len(pages), 'canonical pages.' if not origin else 'canonical pages including HTTP redirect checks.')
