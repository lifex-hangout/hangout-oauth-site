// Generate language-specific HTML from the five root pages, without copying policy bodies.
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const root = resolve(__dirname, '..');
const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'assets/content.js'), 'utf8'), context);
const { locales, routes, seo } = context.window.HangoutContent;
const base = 'https://hangout-support.beesk.it';
const pages = { home: 'index.html', support: 'support.html', privacy: 'privacy.html', terms: 'terms.html', faq: 'faq.html' };
const documents = { privacy: 'Privacy_Policy.md', terms: 'Terms_of_Service.md', faq: 'FAQ.md' };
const pagePath = (page, lang) => `/${routes[lang]}/${page === 'home' ? '' : pages[page]}`;
const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sourceUrl = (page, lang) => `https://lifex-hangout.github.io/static/${lang}_${documents[page] || 'Support.html'}`;

function metadata(page, lang) {
  const [title, description] = seo[lang][page];
  const url = base + pagePath(page, lang);
  const image = `${base}/assets/app-icon.png?v=2`;
  const graph = [
    { '@type': 'Organization', '@id': `${base}/#organization`, name: "Bee's Knees", url: `${base}/`, logo: image, email: 'sysop@beesk.it' },
    { '@type': 'WebSite', '@id': `${base}/#website`, url: `${base}/`, name: 'Hangout', inLanguage: Object.keys(locales), publisher: { '@id': `${base}/#organization` } },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: lang, isPartOf: { '@id': `${base}/#website` }, ...(page === 'home' ? { mainEntity: { '@id': `${base}/#app` } } : {}) },
  ];
  if (page === 'home') graph.push({ '@type': 'MobileApplication', '@id': `${base}/#app`, name: 'Hangout - Date & Find Friends', operatingSystem: 'iOS, Android', applicationCategory: 'SocialNetworkingApplication', description, url, image, downloadUrl: ['https://apps.apple.com/app/id6450007498', 'https://play.google.com/store/apps/details?id=com.thrust.hangout'], publisher: { '@id': `${base}/#organization` } });
  const alternate = Object.keys(locales).map((code) => `  <link rel="alternate" hreflang="${code}" href="${base}${pagePath(page, code)}">`).join('\n');
  return `<!-- SEO:start -->
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${url}">
${alternate}
  <link rel="alternate" hreflang="x-default" href="${base}${page === 'home' ? '/' : '/' + pages[page]}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Hangout">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="${lang.replace('-', '_')}">
${Object.keys(locales).filter(code => code !== lang).map(code => `  <meta property="og:locale:alternate" content="${code.replace('-', '_')}">`).join('\n')}
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1024">
  <meta property="og:image:height" content="1024">
  <meta property="og:image:alt" content="Hangout">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="Hangout">
  <script id="structured-data" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>
  <!-- SEO:end -->`;
}

function render(template, page, lang, pinned) {
  const copy = locales[lang];
  let html = template.replace(/\s*<!-- SEO:start -->[\s\S]*?<!-- SEO:end -->/g, '')
    .replace(/\s*<title>[\s\S]*?<\/title>/g, '')
    .replace(/\s*<meta name="description"[^>]*>/g, '')
    .replace(/\s*<!-- Languages:start -->[\s\S]*?<!-- Languages:end -->/g, '');
  html = html.replace(/<html[^>]*>/, `<html lang="${lang}">`)
    .replace('</head>', `  ${metadata(page, lang)}\n</head>`)
    .replace(/\b(href|src)="\/?assets\//g, '$1="/assets/')
    .replace(/(<([a-z][a-z0-9]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g, (all, start, tag, key, end) => copy[key] ? start + escape(copy[key]) + end : all)
    .replace(/(<[^>]*\bdata-i18n-aria="([^"]+)"[^>]*>)/g, (all, tag, key) => all.replace(/aria-label="[^"]*"/, `aria-label="${escape(copy[key])}"`))
    .replace(/(<a class="brand"[^>]*?)aria-label="[^"]*"/, `$1aria-label="${escape(copy.homeLabel)}"`)
    .replace(/<select id="language"([^>]*)>/, (all, attrs) => `<select id="language"${attrs.replace(/aria-label="[^"]*"/, `aria-label="${escape(copy.language)}"`)}>`)
    .replace(/<option value="([^"]+)"(?: selected)?>/g, (all, code) => `<option value="${code}"${code === lang ? ' selected' : ''}>`)
    .replace(/<a\b[^>]*\bdata-page-link="([^"]+)"[^>]*>/g, (all, kind) => {
      const hash = all.match(/href="[^"]*?(#[^"]*)"/)?.[1] || '';
      return all.replace(/href="[^"]*"/, `href="${pagePath(kind, lang)}${hash}"`);
    });
  if (page === 'home') html = html.replace(/\s*<script defer src="\/assets\/vendor\/[^"]+"><\/script>/g, '');
  if (documents[page]) {
    html = html.replace(/<p class="subtitle" data-i18n="(?:intro|pageIntro)">[\s\S]*?<\/p>/, `<p class="subtitle" data-i18n="pageIntro">${escape(seo[lang][page][1])}</p>`)
      .replace(/<div id="document-status"([^>]*)>[\s\S]*?<\/div>/, `<div id="document-status"$1>${escape(copy.loading)}</div>`)
      .replace(/href="https:\/\/lifex-hangout\.github\.io\/static\/[^" ]+"/g, `href="${sourceUrl(page, lang)}"`)
      .replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript><p><a href="${sourceUrl(page, lang)}">${escape(copy.source)}</a></p></noscript>`);
  }
  if (page === 'support' && pinned && lang !== 'en-US') {
    html = html.replace('<div id="support-sections" class="support-sections" lang="en-US">', '<div id="support-sections" class="support-sections" lang="en-US" hidden>');
    html = html.replace('</main>', `<noscript><p><a href="${sourceUrl(page, lang)}">${escape(copy.support)}</a></p></noscript>\n</main>`);
  }
  const links = Object.keys(locales).map(code => `<a href="${pagePath(page, code)}" data-language-link="${code}" lang="${code}" hreflang="${code}"${code === lang ? ' aria-current="true"' : ''}>${locales[code].name}</a>`).join(' <span aria-hidden="true">·</span> ');
  html = html.replace('</body>', `<!-- Languages:start -->\n<nav class="language-links" data-i18n-aria="language" aria-label="${escape(copy.language)}">${links}</nav>\n<!-- Languages:end -->\n</body>`);
  return html;
}

const templates = Object.fromEntries(Object.entries(pages).map(([page, file]) => [page, readFileSync(resolve(root, file), 'utf8')]));
for (const [page, template] of Object.entries(templates)) {
  writeFileSync(resolve(root, pages[page]), render(template, page, 'en-US', false));
  for (const lang of Object.keys(locales)) {
    mkdirSync(resolve(root, routes[lang]), { recursive: true });
    writeFileSync(resolve(root, routes[lang], pages[page]), render(template, page, lang, true));
  }
}
const entries = [];
for (const page of Object.keys(pages)) {
  for (const lang of Object.keys(locales)) {
    const alternates = Object.keys(locales).map(code => `    <xhtml:link rel="alternate" hreflang="${code}" href="${base}${pagePath(page, code)}"/>`).join('\n');
    entries.push(`  <url>\n    <loc>${base}${pagePath(page, lang)}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${page === 'home' ? '/' : '/' + pages[page]}"/>\n  </url>`);
  }
}
writeFileSync(resolve(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
writeFileSync(resolve(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
console.log('Generated 25 localized pages, 5 compatible root pages, sitemap.xml and robots.txt.');
