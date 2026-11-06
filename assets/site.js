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
      homeEyebrow: "A LITTLE HELLO. A NEW CONNECTION.",
      homeTitle: "Good company.",
      homeTitleAccent: "Closer than you think.",
      homeIntro: "A coffee, a meal, or a conversation that goes somewhere. Meet people nearby and find your next connection on Hangout.",
      downloadOn: "Download on the",
      getOn: "Get it on",
      alreadyMember: "Already on Hangout? Find help here →",
      artCaption: "LET’S HANGOUT",
      artNote: "It starts with hello.",
      howEyebrow: "MAKE THE FIRST MOVE",
      howTitle: "From a profile to a real connection.",
      stepOneTitle: "Find someone nearby",
      stepOneBody: "Explore profiles and get to know people through their introduction and voice.",
      stepTwoTitle: "Send a Hangout",
      stepTwoBody: "Suggest a coffee, a meal, or a drink. Or write an invitation of your own.",
      stepThreeTitle: "Let the conversation begin",
      stepThreeBody: "When you both say yes, a chat opens so you can get to know each other.",
      helpEyebrow: "HANGOUT HELP CENTER",
      helpTitle: "Here when you need us.",
      helpIntro: "Answers about your account, your privacy, and using the app — all in one place.",
      contactSupport: "Contact support →",
      faqDescription: "Accounts, features, and common questions",
      accountDescription: "How to request deletion of your account",
      privacyDescription: "How your personal information is handled",
      termsDescription: "What to know when using Hangout",
      navigation: "Main navigation",
      homeLabel: "Hangout homepage",

      name: "English", language: "Language", support: "Support", privacy: "Privacy Policy", terms: "Terms of Service", faq: "FAQ",
      legal: "Policies & help", contents: "On this page", source: "View Markdown source", top: "Back to top", skip: "Skip to content",
      intro: "Information about your privacy, your account, and using Hangout.",
      supportTitle: "How can we help?", supportIntro: "Find answers about your account and the app, or contact us for help.",
      loading: "Loading the latest document…", error: "We couldn't load this document. Please check your connection and try again.",
      supportError: "We couldn't load support in this language. The English information is available below.",
      retry: "Try again", table: "Document table — scroll horizontally to see all columns", account: "Account Deletion",
    },
    "ko-KR": {
      homeEyebrow: "가벼운 인사에서 시작되는 새로운 만남",
      homeTitle: "함께할 사람,",
      homeTitleAccent: "생각보다 가까이에.",
      homeIntro: "커피 한 잔, 맛있는 식사, 조금 더 나누고 싶은 대화. 행아웃에서 가까운 사람을 만나고 새로운 인연을 시작해 보세요.",
      downloadOn: "지금 다운로드",
      getOn: "지금 다운로드",
      alreadyMember: "이미 행아웃을 이용 중인가요? 도움말 보기 →",
      artCaption: "우리, 행아웃 할까요?",
      artNote: "시작은 가벼운 인사로.",
      howEyebrow: "먼저 인사를 건네 보세요",
      howTitle: "프로필 너머, 서로를 알아가는 시간.",
      stepOneTitle: "가까운 사람을 찾아보세요",
      stepOneBody: "프로필을 둘러보고 자기소개와 목소리로 상대를 조금 더 알아보세요.",
      stepTwoTitle: "행아웃을 보내세요",
      stepTwoBody: "커피, 식사, 술 한 잔을 제안해 보세요. 나만의 메시지로 마음을 전할 수도 있어요.",
      stepThreeTitle: "대화를 시작하세요",
      stepThreeBody: "서로의 제안을 수락하면 채팅방이 열려요. 대화를 나누며 천천히 알아가세요.",
      helpEyebrow: "행아웃 고객지원",
      helpTitle: "도움이 필요할 때, 여기서.",
      helpIntro: "계정부터 개인정보, 앱 이용까지. 궁금한 내용을 확인하고 해결되지 않는 문제는 문의해 주세요.",
      contactSupport: "고객지원에 문의하기 →",
      faqDescription: "계정과 앱 이용에 관한 궁금증",
      accountDescription: "계정 삭제를 요청하는 방법",
      privacyDescription: "개인정보 수집·이용·보관 안내",
      termsDescription: "행아웃을 이용할 때 알아둘 내용",
      navigation: "주 메뉴",
      homeLabel: "행아웃 홈",

      name: "한국어", language: "언어", support: "고객지원", privacy: "개인정보처리방침", terms: "이용약관", faq: "자주 묻는 질문",
      legal: "정책 및 도움말", contents: "이 페이지의 목차", source: "Markdown 원문 보기", top: "맨 위로", skip: "본문으로 바로가기",
      intro: "개인정보와 계정, Hangout 이용에 관한 안내입니다.",
      supportTitle: "무엇을 도와드릴까요?", supportIntro: "궁금한 점을 확인하고, 도움이 필요하면 편하게 문의해 주세요.",
      loading: "최신 문서를 불러오고 있습니다…", error: "문서를 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.",
      supportError: "한국어 지원 안내를 불러오지 못했습니다. 아래에서 영어 안내를 확인할 수 있습니다.",
      retry: "다시 시도", table: "문서 표 — 옆으로 스크롤하면 모든 열을 볼 수 있습니다", account: "계정 삭제",
    },
    "ja-JP": {
      homeEyebrow: "小さなあいさつから、新しい出会いへ",
      homeTitle: "気の合う誰かは、",
      homeTitleAccent: "思ったより近くに。",
      homeIntro: "一杯のコーヒー、おいしい食事、もっと話したくなる会話。Hangout で近くの人と出会い、新しいつながりを見つけましょう。",
      downloadOn: "ダウンロード",
      getOn: "ダウンロード",
      alreadyMember: "すでにご利用中ですか？ヘルプはこちら →",
      artCaption: "一緒に HANGOUT",
      artNote: "まずは、こんにちは。",
      howEyebrow: "あなたから声をかけてみませんか",
      howTitle: "プロフィールから始まる、新しいつながり。",
      stepOneTitle: "近くの人を見つける",
      stepOneBody: "プロフィールを見て、自己紹介や声から相手のことを知ってみましょう。",
      stepTwoTitle: "Hangout を送る",
      stepTwoBody: "コーヒーや食事、お酒に誘ってみましょう。自分の言葉でメッセージを送ることもできます。",
      stepThreeTitle: "会話を始める",
      stepThreeBody: "お互いの誘いを受け入れるとチャットが開きます。会話を通じて、少しずつ知り合いましょう。",
      helpEyebrow: "HANGOUT サポート",
      helpTitle: "困ったときは、こちらへ。",
      helpIntro: "アカウント、プライバシー、アプリの使い方。気になることをご確認いただけます。",
      contactSupport: "サポートに問い合わせる →",
      faqDescription: "アカウントや使い方についての疑問",
      accountDescription: "アカウントの削除を申請する方法",
      privacyDescription: "個人情報の取り扱いについて",
      termsDescription: "Hangout を利用する際のルール",
      navigation: "メインナビゲーション",
      homeLabel: "Hangout ホーム",

      name: "日本語", language: "言語", support: "サポート", privacy: "プライバシーポリシー", terms: "利用規約", faq: "よくある質問",
      legal: "ポリシーとヘルプ", contents: "このページの目次", source: "Markdown 原文を表示", top: "ページの先頭へ", skip: "本文へ移動",
      intro: "プライバシー、アカウント、Hangout のご利用についてのご案内です。",
      supportTitle: "お困りですか？", supportIntro: "よくある質問をご確認いただくか、お気軽にお問い合わせください。",
      loading: "最新の文書を読み込んでいます…", error: "文書を読み込めませんでした。接続を確認して、もう一度お試しください。",
      supportError: "日本語の案内を読み込めませんでした。以下の英語の案内をご確認ください。",
      retry: "再試行", table: "文書の表 — 横にスクロールしてすべての列を表示", account: "アカウントの削除",
    },
    "zh-CN": {
      homeEyebrow: "一句问候，开启新的相遇",
      homeTitle: "聊得来的人，",
      homeTitleAccent: "也许就在附近。",
      homeIntro: "一杯咖啡、一顿美食，或一段意犹未尽的对话。在 Hangout 认识附近的人，开启新的缘分。",
      downloadOn: "下载于",
      getOn: "下载于",
      alreadyMember: "已经在使用 Hangout？查看帮助 →",
      artCaption: "一起 HANGOUT 吧",
      artNote: "从一句你好开始。",
      howEyebrow: "试着先打个招呼",
      howTitle: "从个人资料开始，慢慢了解彼此。",
      stepOneTitle: "认识附近的人",
      stepOneBody: "浏览个人资料，通过自我介绍和声音多了解对方一点。",
      stepTwoTitle: "发送 Hangout 邀请",
      stepTwoBody: "约一杯咖啡、一起吃饭或小酌一杯，也可以写下你自己的邀请。",
      stepThreeTitle: "开始聊天",
      stepThreeBody: "当双方都接受邀请后，聊天室就会开启。通过对话慢慢了解彼此。",
      helpEyebrow: "HANGOUT 帮助中心",
      helpTitle: "需要帮助时，我们在这里。",
      helpIntro: "账户、隐私和应用使用方面的疑问，都可以从这里找到解答。",
      contactSupport: "联系客户支持 →",
      faqDescription: "账户、功能与常见疑问",
      accountDescription: "如何申请删除账户",
      privacyDescription: "个人信息的处理方式",
      termsDescription: "使用 Hangout 时需要了解的规则",
      navigation: "主导航",
      homeLabel: "Hangout 首页",

      name: "简体中文", language: "语言", support: "客户支持", privacy: "隐私政策", terms: "服务条款", faq: "常见问题",
      legal: "政策与帮助", contents: "本页目录", source: "查看 Markdown 原文", top: "返回顶部", skip: "跳至正文",
      intro: "了解您的隐私、账户以及 Hangout 的使用方式。",
      supportTitle: "有什么可以帮您？", supportIntro: "查找常见问题，或随时联系我们获取帮助。",
      loading: "正在加载最新文档…", error: "无法加载文档。请检查网络连接后重试。",
      supportError: "无法加载中文支持信息，您可以查看下方的英文信息。",
      retry: "重试", table: "文档表格 — 横向滚动以查看所有列", account: "删除账户",
    },
    "zh-TW": {
      homeEyebrow: "一句問候，開啟新的相遇",
      homeTitle: "聊得來的人，",
      homeTitleAccent: "也許就在附近。",
      homeIntro: "一杯咖啡、一頓美食，或一段意猶未盡的對話。在 Hangout 認識附近的人，開啟新的緣分。",
      downloadOn: "下載於",
      getOn: "下載於",
      alreadyMember: "已經在使用 Hangout？查看說明 →",
      artCaption: "一起 HANGOUT 吧",
      artNote: "從一句你好開始。",
      howEyebrow: "試著先打個招呼",
      howTitle: "從個人檔案開始，慢慢了解彼此。",
      stepOneTitle: "認識附近的人",
      stepOneBody: "瀏覽個人檔案，透過自我介紹和聲音多了解對方一點。",
      stepTwoTitle: "傳送 Hangout 邀請",
      stepTwoBody: "約一杯咖啡、一起吃飯或小酌一杯，也可以寫下你自己的邀請。",
      stepThreeTitle: "開始聊天",
      stepThreeBody: "當雙方都接受邀請後，聊天室就會開啟。透過對話慢慢了解彼此。",
      helpEyebrow: "HANGOUT 支援中心",
      helpTitle: "需要協助時，我們在這裡。",
      helpIntro: "帳戶、隱私和 App 使用方面的疑問，都可以從這裡找到解答。",
      contactSupport: "聯絡客戶支援 →",
      faqDescription: "帳戶、功能與常見疑問",
      accountDescription: "如何申請刪除帳戶",
      privacyDescription: "個人資料的處理方式",
      termsDescription: "使用 Hangout 時需要了解的規則",
      navigation: "主導覽",
      homeLabel: "Hangout 首頁",

      name: "繁體中文", language: "語言", support: "客戶支援", privacy: "隱私權政策", terms: "服務條款", faq: "常見問題",
      legal: "政策與說明", contents: "本頁目錄", source: "檢視 Markdown 原文", top: "回到頂端", skip: "跳至主要內容",
      intro: "了解您的隱私、帳戶，以及 Hangout 的使用方式。",
      supportTitle: "有什麼需要協助的嗎？", supportIntro: "尋找常見問題的解答，或隨時與我們聯絡。",
      loading: "正在載入最新文件…", error: "無法載入文件。請確認網路連線後再試一次。",
      supportError: "無法載入中文支援資訊，您可以查看下方的英文資訊。",
      retry: "重試", table: "文件表格 — 水平捲動以查看所有欄位", account: "刪除帳戶",
    },
  };

  const { language, save: saveLanguage } = window.HangoutLanguage;
  const text = LOCALES[language];
  const page = document.body.dataset.page;
  const pageUrl = (kind, locale = language) => `${kind === "home" ? "index" : kind}.html?lang=${encodeURIComponent(locale)}`;

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
    const description = document.querySelector('meta[name="description"]');
    if (page === "home") description.content = text.homeIntro;
    const select = document.querySelector("#language");
    select.value = language;
    select.setAttribute("aria-label", text.language);
    select.addEventListener("change", () => {
      saveLanguage(select.value);
      const url = new URL(location.href);
      url.searchParams.set("lang", select.value);
      location.assign(url.href);
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
