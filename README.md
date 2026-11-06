# Hangout support site

Public homepage and help center at <https://hangout-support.beesk.it/>.

## One document source for the app and website

Privacy Policy, Terms of Service, and FAQ are fetched at page load from:

```
https://lifex-hangout.github.io/static/{locale}_Privacy_Policy.md
https://lifex-hangout.github.io/static/{locale}_Terms_of_Service.md
https://lifex-hangout.github.io/static/{locale}_FAQ.md
```

These are the same URLs used by the Flutter ArticleController. **Edit the Markdown in lifex-hangout/static only.** No policy copies or generated document HTML are maintained here, and this site does not need rebuilding when document content changes. GitHub Pages/CDN propagation still applies; requests revalidate browser caches.

Languages: en-US, ko-KR, ja-JP, zh-CN, zh-TW. Select a language or append `?lang=ko-KR` to any document page. The selector preserves the current document. Translated support sections are loaded from the corresponding `{locale}_Support.html` in the same static repository; English support is available directly in HTML as a fallback.

The existing homepage, /support.html, /privacy.html, /terms.html URLs and CNAME are preserved. /faq.html is the rendered FAQ. The website rewrites the FAQ's app-only account deletion action to the website's support instructions. Source Markdown is unchanged.

## Rendering and preview

This is a buildless static website (.nojekyll). It fetches source Markdown, parses GitHub-flavored Markdown with Marked, sanitizes HTML with DOMPurify, and builds a table of contents. Loading errors show a retry action and source link instead of an empty page.

Serve locally with `python3 -m http.server 8877 --directory .` and open <http://127.0.0.1:8877/support.html>.

Self-hosted dependencies in assets/vendor avoid third-party script CDN dependencies:

- Marked 18.1.3, MIT — marked.LICENSE
- DOMPurify 3.4.17, Apache-2.0 or MPL-2.0 — dompurify.LICENSE and dompurify.LICENSE-MPL

GitHub Pages publishes the root of main. Keep CNAME set to hangout-support.beesk.it. The organization root Pages site and lifex-hangout/static are separate sites and keep their existing configuration.
