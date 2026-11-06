# Hangout support site

Public homepage and help center at <https://hangout-support.beesk.it/>.

## One document source for the app and website

Privacy Policy, Terms of Service, and FAQ are fetched at page load from:

```
https://lifex-hangout.github.io/static/{locale}_Privacy_Policy.md
https://lifex-hangout.github.io/static/{locale}_Terms_of_Service.md
https://lifex-hangout.github.io/static/{locale}_FAQ.md
```

These are the same URLs used by the Flutter ArticleController. **Edit the Markdown in lifex-hangout/static only.** No policy copies or generated policy bodies are maintained here, and this site does not need rebuilding when document content changes. GitHub Pages/CDN propagation still applies; requests revalidate browser caches.

Languages: en-US, ko-KR, ja-JP, zh-CN, zh-TW. Select a language or append `?lang=ko-KR` to any document page. The selector preserves the current document. Translated support sections are loaded from the corresponding `{locale}_Support.html` in the same static repository; English support is available directly in HTML as a fallback.

The existing homepage, /support.html, /privacy.html, /terms.html URLs and CNAME are preserved. /faq.html is the rendered FAQ. The website rewrites the FAQ's app-only account deletion action to the website's support instructions. Source Markdown is unchanged.

## Rendering and preview

This is a static website (.nojekyll) with a small dependency-free generator for localized page shells and search metadata. It fetches source Markdown, parses GitHub-flavored Markdown with Marked, sanitizes HTML with DOMPurify, and builds a table of contents. Loading errors show a retry action and source link instead of an empty page.

Serve locally with `python3 -m http.server 8877 --directory .` and open <http://127.0.0.1:8877/support.html>.

Self-hosted dependencies in assets/vendor avoid third-party script CDN dependencies:

- Marked 18.1.3, MIT — marked.LICENSE
- DOMPurify 3.4.17, Apache-2.0 or MPL-2.0 — dompurify.LICENSE and dompurify.LICENSE-MPL

GitHub Pages publishes the root of main. Keep CNAME set to hangout-support.beesk.it. The organization root Pages site and lifex-hangout/static are separate sites and keep their existing configuration.

## Language preferences

The entire homepage and the shared navigation support all five languages. Language selection stays on the current page and preserves its query parameters and section anchor. Selection order is a valid legacy `?lang=` value, an explicit language route, the browser's saved `hangout.language` preference, then the browser's preferred supported language (English fallback). Explicit URL and selector choices are saved in localStorage; blocked storage falls back safely to URL/browser selection. Every internal navigation link uses a fixed language route, including English and homepage links.

`assets/language-v4.js` resolves the language before the deferred page script. The homepage uses the Hangout app's original onboarding illustration and links to the existing App Store and Google Play listings. Policy and FAQ documents continue to use their shared source above.

Run language regression checks with `node --test tests/language.test.cjs` and JavaScript syntax checks with `node --check assets/language-v4.js` / `node --check assets/site-v4.js`. See [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for the current validation record.


## SEO and localized URLs

Canonical pages are `/en/`, `/ko/`, `/ja/`, `/zh-cn/`, `/zh-tw/`, plus `support.html`, `privacy.html`, `terms.html` and `faq.html` beneath each language. Root URLs and old `?lang=` links keep working. Each localized page has its own title, description, canonical, reciprocal hreflang links, Open Graph and Twitter metadata, and JSON-LD identifying the website, publisher, page and (on homepages) mobile app. Ratings, reviews and prices are not fabricated.

The homepage text is present in static HTML for non-JavaScript crawlers. Shared policy/FAQ bodies and translated support content are still fetched live from the app's source URLs; no policy copies are generated. No-JavaScript document links point to the correct source language.

Edit shared copy in `assets/content.js` and structure in the **five root HTML files**, then run:

```sh
node scripts/build-seo.cjs
node --test tests/language.test.cjs
python3 tests/seo.test.py
```

Commit the generated language directories, root pages, `sitemap.xml` and `robots.txt` together. Do not hand-edit generated files under language directories. The generator has no package dependencies or network requests. Do not add snapshots of policy bodies to the generator. GitHub Pages continues publishing the repository root; no hosting change or new CI workflow is needed. Homepages do not load the document rendering libraries. The previous `assets/language.js` and `assets/site.js` remain unchanged for visitors with cached v3 HTML; new pages use separate v4 filenames.

The sitemap lists the 25 canonical language pages and their language alternatives. `robots.txt` advertises its public URL. The verified property owner can submit `https://hangout-support.beesk.it/sitemap.xml` in Google Search Console; deployment does not establish property ownership or guarantee indexing or search appearance.

References: [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
