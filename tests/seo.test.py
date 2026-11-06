"""Validate published HTML without JavaScript, reciprocal alternates, schemas and sitemap."""
from html.parser import HTMLParser
from pathlib import Path
import json
import unittest
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://hangout-support.beesk.it'
ROUTES = {'en-US': 'en', 'ko-KR': 'ko', 'ja-JP': 'ja', 'zh-CN': 'zh-cn', 'zh-TW': 'zh-tw'}
PAGES = ['index.html', 'support.html', 'privacy.html', 'terms.html', 'faq.html']

class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.tags = []
        self.title = ''
        self.headline = ''
        self.schema = ''
        self.capture = None
        self.feed(file.read_text())
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == 'title': self.capture = 'title'
        elif tag == 'h1': self.capture = 'headline'
        elif tag == 'script' and attrs.get('type') == 'application/ld+json': self.capture = 'schema'
    def handle_endtag(self, tag):
        if tag in ['title', 'h1', 'script']: self.capture = None
    def handle_data(self, data):
        if self.capture: setattr(self, self.capture, getattr(self, self.capture) + data)
    def find(self, tag, **attrs):
        return [a for t, a in self.tags if t == tag and all(a.get(k) == v for k, v in attrs.items())]
    def meta(self, name):
        values = self.find('meta', name=name) or self.find('meta', property=name)
        assert len(values) == 1, (name, values)
        return values[0]['content']

def url_for(code, page):
    return f'{BASE}/{ROUTES[code]}/' + ('' if page == 'index.html' else page)

class SEOTests(unittest.TestCase):
    def test_static_metadata_and_reciprocal_languages(self):
        titles = set()
        descriptions = set()
        for code, path in ROUTES.items():
            for filename in PAGES:
                with self.subTest(locale=code, page=filename):
                    page = Page(ROOT / path / filename)
                    self.assertEqual(page.find('html')[0]['lang'], code)
                    self.assertTrue(page.headline.strip())
                    self.assertTrue(10 < len(page.title) < 100)
                    self.assertNotIn(page.title, titles)
                    titles.add(page.title)
                    description = page.meta('description')
                    self.assertTrue(30 < len(description) < 220)
                    self.assertNotIn(description, descriptions)
                    descriptions.add(description)
                    self.assertEqual(page.find('link', rel='canonical'), [{'rel':'canonical', 'href':url_for(code, filename)}])
                    alternates = {a['hreflang']:a['href'] for a in page.find('link', rel='alternate')}
                    expected = {lang:url_for(lang, filename) for lang in ROUTES}
                    expected['x-default'] = BASE + ('/' if filename == 'index.html' else '/' + filename)
                    self.assertEqual(alternates, expected)
                    self.assertEqual(page.meta('og:title'), page.title)
                    self.assertEqual(page.meta('og:description'), description)
                    self.assertEqual(page.meta('og:url'), url_for(code, filename))
                    self.assertEqual(page.meta('og:locale'), code.replace('-', '_'))
                    self.assertEqual(page.meta('twitter:title'), page.title)
                    self.assertEqual(page.meta('twitter:description'), description)
                    self.assertEqual(page.meta('twitter:card'), 'summary')
                    self.assertTrue((ROOT / urlparse(page.meta('og:image')).path.lstrip('/')).is_file())
                    self.assertNotIn('noindex', str(page.find('meta', name='robots')))
                    schema = json.loads(page.schema)
                    self.assertEqual(schema['@context'], 'https://schema.org')
                    webpage = next(n for n in schema['@graph'] if n['@type'] == 'WebPage')
                    self.assertEqual(webpage['url'], url_for(code, filename))
                    self.assertEqual(webpage['inLanguage'], code)
                    for entity in schema['@graph']:
                        self.assertNotIn('aggregateRating', entity)
                        self.assertNotIn('review', entity)
                    # Every language is discoverable through real anchors without running JS.
                    links = page.find('a')
                    for lang in ROUTES:
                        self.assertTrue(any(a.get('data-language-link') == lang and BASE + a['href'] == url_for(lang, filename) for a in links))
                    for tag, attrs in page.tags:
                        target = attrs.get('src') or (attrs.get('href') if tag in ['a', 'link'] else None)
                        if target and target.startswith('/'):
                            local = ROOT / unquote(urlparse(target).path).lstrip('/')
                            if local.is_dir(): local /= 'index.html'
                            self.assertTrue(local.is_file(), target)

    def test_sitemap_has_only_all_canonical_pages(self):
        tree = ET.parse(ROOT / 'sitemap.xml')
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
        urls = tree.findall('s:url', ns)
        self.assertEqual(len(urls), 25)
        self.assertEqual({u.find('s:loc', ns).text for u in urls}, {url_for(c, p) for c in ROUTES for p in PAGES})
        for entry in urls:
            self.assertEqual(len(entry.findall('x:link', ns)), 6)
            self.assertNotIn('?', entry.find('s:loc', ns).text)
        robots = (ROOT / 'robots.txt').read_text()
        self.assertIn(f'Sitemap: {BASE}/sitemap.xml', robots)
        self.assertNotIn('Disallow: /', robots)

    def test_legacy_urls_canonicalize_and_preserve_shared_document_sources(self):
        documents = {'privacy.html':'Privacy_Policy.md', 'terms.html':'Terms_of_Service.md', 'faq.html':'FAQ.md'}
        for filename in PAGES:
            page = Page(ROOT / filename)
            self.assertEqual(page.find('link', rel='canonical')[0]['href'], url_for('en-US', filename))
        for code, path in ROUTES.items():
            for filename, source in documents.items():
                page = Page(ROOT / path / filename)
                self.assertEqual(page.find('a', id='source-link')[0]['href'], f'https://lifex-hangout.github.io/static/{code}_{source}')
                article = page.find('article', id='document-content')
                self.assertEqual(len(article), 1)
                self.assertIn('hidden', article[0])
        for code, path in ROUTES.items():
            page = Page(ROOT / path / 'index.html')
            self.assertFalse(any('/vendor/' in a.get('src','') for a in page.find('script')))

if __name__ == '__main__':
    unittest.main()
