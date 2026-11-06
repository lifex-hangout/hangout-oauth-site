(() => {
  "use strict";

  // Shared with the Flutter ArticleController: edit the original .md once.
  const SOURCE_BASE = "https://lifex-hangout.github.io/static/";
  const DOCUMENTS = Object.freeze({
    privacy: "Privacy_Policy.md",
    terms: "Terms_of_Service.md",
    faq: "FAQ.md",
  });
  const { locales: LOCALES, seo: SEO } = window.HangoutContent;

  const { language, save: saveLanguage, pageUrl } = window.HangoutLanguage;
  const text = LOCALES[language];
  const page = document.body.dataset.page;

  function localizeShell() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      if (text[node.dataset.i18n]) node.textContent = text[node.dataset.i18n];
    });
    document.querySelectorAll("[data-page-link]").forEach((link) => {
      const hash = new URL(link.href).hash;
      link.href = pageUrl(link.dataset.pageLink) + hash;
      if (link.dataset.pageLink === page) link.setAttribute("aria-current", "page");
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      node.setAttribute("aria-label", text[node.dataset.i18nAria]);
    });
    document.querySelector(".brand").setAttribute("aria-label", text.homeLabel);
    const [title, description] = SEO[language][page];
    const canonical = `https://hangout-support.beesk.it${pageUrl(page)}`;
    document.title = title;
    const intro = document.querySelector('[data-i18n="pageIntro"]');
    if (intro) intro.textContent = description;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('link[rel="canonical"]').href = canonical;
    for (const [selector, value] of Object.entries({
      'meta[property="og:title"]': title, 'meta[name="twitter:title"]': title,
      'meta[property="og:description"]': description, 'meta[name="twitter:description"]': description,
      'meta[property="og:url"]': canonical, 'meta[property="og:locale"]': language.replace("-", "_"),
    })) document.querySelector(selector).content = value;
    const schema = document.querySelector('#structured-data');
    const data = JSON.parse(schema.textContent);
    for (const entity of data['@graph']) {
      if (entity['@type'] === 'WebPage') Object.assign(entity, {
        '@id': `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: language,
      });
      if (entity['@type'] === 'MobileApplication') Object.assign(entity, { url: canonical, description });
    }
    schema.textContent = JSON.stringify(data);
    document.querySelectorAll("[data-language-link]").forEach((link) => {
      link.href = pageUrl(page, link.dataset.languageLink);
      if (link.dataset.languageLink === language) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    const select = document.querySelector("#language");
    select.value = language;
    select.setAttribute("aria-label", text.language);
    select.addEventListener("change", () => {
      saveLanguage(select.value);
      const url = new URL(location.href);
      url.pathname = pageUrl(page, select.value);
      url.searchParams.delete("lang");
      location.assign(url.href);
    });
  }

  async function fetchText(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { cache: "no-cache", signal: controller.signal });
      if (!response.ok) throw new Error(`Document request failed (${response.status})`);
      return await response.text();
    } finally {
      clearTimeout(timeout);
    }
  }

  function rewriteDocumentLinks(container) {
    container.querySelectorAll("a[href]").forEach((link) => {
      const original = link.getAttribute("href");
      // The app-only action is an instruction link on the public website.
      if (original.includes("app://delete-account")) {
        link.href = `${pageUrl("support")}#account-deletion`;
        return;
      }
      let url;
      try { url = new URL(original, SOURCE_BASE); } catch { return; }
      if (url.origin === new URL(SOURCE_BASE).origin && url.pathname.startsWith("/static/")) {
        const name = decodeURIComponent(url.pathname.split("/").pop());
        for (const [kind, file] of Object.entries(DOCUMENTS)) {
          const locale = Object.keys(LOCALES).find((code) => name === `${code}_${file}`);
          if (locale) { link.href = pageUrl(kind, locale); return; }
        }
      }
      if (!original.startsWith("#")) link.href = url.href;
      if (url.protocol === "https:" && url.origin !== location.origin) link.rel = "noopener noreferrer";
    });
  }

  function makeContents(article) {
    const toc = document.querySelector("#contents");
    const entries = Array.from(article.querySelectorAll("h2, h3"));
    toc.replaceChildren();
    entries.forEach((heading, index) => {
      heading.id = `section-${index + 1}`;
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      toc.append(link);
    });
    const sidebar = document.querySelector(".document-sidebar");
    sidebar.hidden = !entries.length;
    document.querySelector(".document-layout").classList.toggle("has-outline", entries.length > 0);
    const details = document.querySelector("#contents-toggle");
    details.open = !matchMedia("(max-width: 900px)").matches;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((changes) => {
        const visible = changes.find((entry) => entry.isIntersecting);
        if (!visible) return;
        toc.querySelectorAll("a").forEach((link) => {
          if (link.hash === `#${visible.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }, { rootMargin: "-5% 0px -70% 0px" });
      entries.forEach((heading) => observer.observe(heading));
    }
  }

  async function loadDocument() {
    const status = document.querySelector("#document-status");
    const article = document.querySelector("#document-content");
    status.hidden = false;
    status.dataset.state = "loading";
    status.textContent = text.loading;
    article.hidden = true;
    document.querySelector(".document-sidebar").hidden = true;
    document.querySelector(".document-layout").classList.remove("has-outline");
    const source = `${SOURCE_BASE}${language}_${DOCUMENTS[page]}`;
    const sourceLink = document.querySelector("#source-link");
    sourceLink.href = source;
    try {
      const markdown = await fetchText(source);
      if (!markdown.trim() || /^\s*<!doctype html/i.test(markdown)) throw new Error("Invalid Markdown response");
      article.innerHTML = DOMPurify.sanitize(marked.parse(markdown, { gfm: true, breaks: false }), {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "form", "input", "button"],
        FORBID_ATTR: ["style"],
      });
      const heading = article.querySelector("h1");
      if (heading) {
        document.querySelector("#document-title").textContent = heading.textContent;
        heading.remove();
      }
      rewriteDocumentLinks(article);
      article.querySelectorAll("table").forEach((table) => {
        const wrapper = document.createElement("div");
        wrapper.className = "table-scroll";
        wrapper.tabIndex = 0;
        wrapper.setAttribute("role", "region");
        wrapper.setAttribute("aria-label", text.table);
        table.before(wrapper);
        wrapper.append(table);
      });
      makeContents(article);
      article.hidden = false;
      status.hidden = true;
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    } catch {
      status.dataset.state = "error";
      status.textContent = text.error;
      const actions = document.createElement("p");
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "button primary";
      retry.textContent = text.retry;
      retry.addEventListener("click", loadDocument);
      actions.append(retry);
      status.append(actions);
    }
  }

  async function loadSupport() {
    const container = document.querySelector("#support-sections");
    if (language === "en-US") return;
    const status = document.querySelector("#support-status");
    status.hidden = false;
    status.textContent = text.loading;
    container.setAttribute("aria-busy", "true");
    try {
      const html = await fetchText(`${SOURCE_BASE}${language}_Support.html`);
      const source = new DOMParser().parseFromString(html, "text/html");
      const sections = Array.from(source.querySelectorAll("main > section")).filter((section) => !section.querySelector(".links"));
      if (!sections.length) throw new Error("Missing support content");
      container.innerHTML = DOMPurify.sanitize(sections.map((section) => section.outerHTML).join(""), { USE_PROFILES: { html: true } });
      container.lang = language;
      container.querySelectorAll("section").forEach((section) => {
        if (section.querySelector("h2")?.textContent.trim() === text.account) section.id = "account-deletion";
      });
      rewriteDocumentLinks(container);
      status.hidden = true;
      if (location.hash === "#account-deletion") document.querySelector("#account-deletion")?.scrollIntoView();
    } catch {
      status.textContent = text.supportError;
      container.lang = "en-US";
    } finally {
      container.removeAttribute("aria-busy");
      container.hidden = false;
    }
  }

  localizeShell();
  if (Object.hasOwn(DOCUMENTS, page)) loadDocument();
  else if (page === "support") loadSupport();
})();
