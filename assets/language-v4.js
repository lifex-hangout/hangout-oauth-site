(() => {
  "use strict";
  const { routes } = window.HangoutContent;
  const supported = Object.keys(routes);
  const key = "hangout.language";
  const valid = (value) => supported.includes(value);
  const save = (value) => {
    if (!valid(value)) return;
    try { localStorage.setItem(key, value); } catch { /* Storage can be unavailable in private browsers. */ }
  };
  function browserLocale(value) {
    const code = String(value).toLowerCase();
    if (code.startsWith("ko")) return "ko-KR";
    if (code.startsWith("ja")) return "ja-JP";
    if (code.startsWith("zh")) {
      if (code.includes("hant")) return "zh-TW";
      if (code.includes("hans")) return "zh-CN";
      return /tw|hk|mo/.test(code) ? "zh-TW" : "zh-CN";
    }
    if (code.startsWith("en")) return "en-US";
    return null;
  }
  const pathLocale = supported.find((code) => location.pathname?.split("/")[1] === routes[code]);
  const requested = new URLSearchParams(location.search).get("lang");
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Use URL or browser language instead. */ }
  const detected = Array.from(navigator.languages || [navigator.language]).map(browserLocale).find(Boolean);
  const language = valid(requested) ? requested : pathLocale || (valid(saved) ? saved : detected || "en-US");
  if (valid(requested) || pathLocale) save(language);
  const pageUrl = (kind, locale = language) => `/${routes[locale]}/${kind === "home" ? "" : `${kind}.html`}`;
  document.documentElement.lang = language;
  window.HangoutLanguage = Object.freeze({ language, save, pageUrl });
})();
