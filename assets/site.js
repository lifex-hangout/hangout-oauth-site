(() => {
  "use strict";

  // Shared with the Flutter ArticleController: edit the original .md once.
  const SOURCE_BASE = "https://lifex-hangout.github.io/static/";
  const DOCUMENTS = Object.freeze({
    privacy: "Privacy_Policy.md",
    terms: "Terms_of_Service.md",
    faq: "FAQ.md",
  });
  const LOCALES = {
    "en-US": {
      name: "English", language: "Language", support: "Support", privacy: "Privacy Policy", terms: "Terms of Service", faq: "FAQ",
      legal: "Policies & help", contents: "On this page", source: "View Markdown source", top: "Back to top", skip: "Skip to content",
      intro: "Information about your privacy, your account, and using Hangout.",
      supportTitle: "How can we help?", supportIntro: "Find answers, get in touch, and feel at home on Hangout.",
      loading: "Loading the latest document…", error: "We couldn't load this document. Please check your connection and try again.",
      supportError: "We couldn't load support in this language. The English information is available below.",
      retry: "Try again", table: "Document table — scroll horizontally to see all columns", account: "Account Deletion",
    },
    "ko-KR": {
      name: "한국어", language: "언어", support: "고객지원", privacy: "개인정보처리방침", terms: "이용약관", faq: "자주 묻는 질문",
      legal: "정책 및 도움말", contents: "이 페이지의 목차", source: "Markdown 원문 보기", top: "맨 위로", skip: "본문으로 바로가기",
      intro: "개인정보와 계정, Hangout 이용에 관한 안내입니다.",
      supportTitle: "무엇을 도와드릴까요?", supportIntro: "궁금한 점을 확인하고, 도움이 필요하면 편하게 문의해 주세요.",
      loading: "최신 문서를 불러오고 있습니다…", error: "문서를 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.",
      supportError: "한국어 지원 안내를 불러오지 못했습니다. 아래에서 영어 안내를 확인할 수 있습니다.",
      retry: "다시 시도", table: "문서 표 — 옆으로 스크롤하면 모든 열을 볼 수 있습니다", account: "계정 삭제",
    },
    "ja-JP": {
      name: "日本語", language: "言語", support: "サポート", privacy: "プライバシーポリシー", terms: "利用規約", faq: "よくある質問",
      legal: "ポリシーとヘルプ", contents: "このページの目次", source: "Markdown 原文を表示", top: "ページの先頭へ", skip: "本文へ移動",
      intro: "プライバシー、アカウント、Hangout のご利用についてのご案内です。",
      supportTitle: "お困りですか？", supportIntro: "よくある質問をご確認いただくか、お気軽にお問い合わせください。",
      loading: "最新の文書を読み込んでいます…", error: "文書を読み込めませんでした。接続を確認して、もう一度お試しください。",
      supportError: "日本語の案内を読み込めませんでした。以下の英語の案内をご確認ください。",
      retry: "再試行", table: "文書の表 — 横にスクロールしてすべての列を表示", account: "アカウントの削除",
    },
    "zh-CN": {
      name: "简体中文", language: "语言", support: "客户支持", privacy: "隐私政策", terms: "服务条款", faq: "常见问题",
      legal: "政策与帮助", contents: "本页目录", source: "查看 Markdown 原文", top: "返回顶部", skip: "跳至正文",
      intro: "了解您的隐私、账户以及 Hangout 的使用方式。",
      supportTitle: "有什么可以帮您？", supportIntro: "查找常见问题，或随时联系我们获取帮助。",
      loading: "正在加载最新文档…", error: "无法加载文档。请检查网络连接后重试。",
      supportError: "无法加载中文支持信息，您可以查看下方的英文信息。",
      retry: "重试", table: "文档表格 — 横向滚动以查看所有列", account: "删除账户",
    },
    "zh-TW": {
      name: "繁體中文", language: "語言", support: "客戶支援", privacy: "隱私權政策", terms: "服務條款", faq: "常見問題",
      legal: "政策與說明", contents: "本頁目錄", source: "檢視 Markdown 原文", top: "回到頂端", skip: "跳至主要內容",
      intro: "了解您的隱私、帳戶，以及 Hangout 的使用方式。",
      supportTitle: "有什麼需要協助的嗎？", supportIntro: "尋找常見問題的解答，或隨時與我們聯絡。",
      loading: "正在載入最新文件…", error: "無法載入文件。請確認網路連線後再試一次。",
      supportError: "無法載入中文支援資訊，您可以查看下方的英文資訊。",
      retry: "重試", table: "文件表格 — 水平捲動以查看所有欄位", account: "刪除帳戶",
    },
  };

  const params = new URLSearchParams(location.search);
  const language = Object.hasOwn(LOCALES, params.get("lang")) ? params.get("lang") : "en-US";
  const text = LOCALES[language];
  const page = document.body.dataset.page;
  const pageUrl = (kind, locale = language) => `${kind}.html${locale === "en-US" ? "" : `?lang=${encodeURIComponent(locale)}`}`;

  function localizeShell() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      if (text[node.dataset.i18n]) node.textContent = text[node.dataset.i18n];
    });
    document.querySelectorAll("[data-page-link]").forEach((link) => {
      link.href = pageUrl(link.dataset.pageLink);
      if (link.dataset.pageLink === page) link.setAttribute("aria-current", "page");
    });
    const select = document.querySelector("#language");
    select.value = language;
    select.setAttribute("aria-label", text.language);
    select.addEventListener("change", () => {
      location.href = pageUrl(page === "home" ? "support" : page, select.value);
    });
    if (page !== "home") document.title = `${text[page]} | Hangout - Date & Find Friends`;
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
        document.title = `${heading.textContent} | Hangout - Date & Find Friends`;
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
    }
  }

  localizeShell();
  if (Object.hasOwn(DOCUMENTS, page)) loadDocument();
  else if (page === "support") loadSupport();
})();
