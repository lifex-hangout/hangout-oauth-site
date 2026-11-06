const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const content = readFileSync(new URL('../assets/content.js', `file://${__filename}`), 'utf8');
const source = readFileSync(new URL('../assets/language-v4.js', `file://${__filename}`), 'utf8');

function boot({ search = '', saved = null, languages = ['en-US'], pathname = '/', blocked = false } = {}) {
  const storage = new Map(saved === null ? [] : [['hangout.language', saved]]);
  const context = {
    URLSearchParams, location: { search, pathname }, navigator: { languages },
    document: { documentElement: {} }, window: {},
    localStorage: {
      getItem(key) { if (blocked) throw Error('Storage blocked'); return storage.get(key); },
      setItem(key, value) { if (blocked) throw Error('Storage blocked'); storage.set(key, value); },
    },
  };
  runInNewContext(content, context);
  runInNewContext(source, context);
  return { ...context.window.HangoutLanguage, html: context.document.documentElement, storage };
}

test('a language chosen through a URL wins over saved and browser preferences', () => {
  const result = boot({ search: '?lang=ja-JP', saved: 'ko-KR', languages: ['zh-TW'] });
  assert.equal(result.language, 'ja-JP');
  assert.equal(result.html.lang, 'ja-JP');
  assert.equal(result.storage.get('hangout.language'), 'ja-JP');
});

test('a return visit without a query restores the selected language', () => {
  const first = boot();
  first.save('ko-KR');
  const next = boot({ saved: first.storage.get('hangout.language') });
  assert.equal(next.language, 'ko-KR');
});

test('an explicit English URL overrides another saved language', () => {
  assert.equal(boot({ search: '?lang=en-US', saved: 'ko-KR' }).language, 'en-US');
});

test('unsupported URL and saved values fall back to browser preferences', () => {
  const result = boot({ search: '?lang=invalid', saved: 'invalid', languages: ['fr-FR', 'ja'] });
  assert.equal(result.language, 'ja-JP');
});

for (const [browser, expected] of Object.entries({
  'ko': 'ko-KR', 'ja-JP': 'ja-JP', 'en-GB': 'en-US', 'zh-SG': 'zh-CN',
  'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', 'zh-HK': 'zh-TW', 'zh-TW': 'zh-TW',
  'zh-Hans-HK': 'zh-CN', 'zh-Hant-CN': 'zh-TW',
})) {
  test(`first visit maps ${browser} to ${expected}`, () => {
    assert.equal(boot({ languages: [browser] }).language, expected);
  });
}

test('unsupported browser languages use English', () => {
  assert.equal(boot({ languages: ['fr-FR'] }).language, 'en-US');
});

test('blocked storage still permits URL and browser language selection', () => {
  const url = boot({ search: '?lang=ko-KR', blocked: true });
  assert.equal(url.language, 'ko-KR');
  assert.doesNotThrow(() => url.save('ja-JP'));
  assert.equal(boot({ languages: ['ja'], blocked: true }).language, 'ja-JP');
});

test('invalid language selections do not overwrite a preference', () => {
  const result = boot({ saved: 'ko-KR' });
  result.save('unsupported');
  assert.equal(result.storage.get('hangout.language'), 'ko-KR');
});


test('a fixed language route overrides saved and browser preferences', () => {
  const result = boot({ pathname: '/ja/privacy.html', saved: 'ko-KR', languages: ['zh-TW'] });
  assert.equal(result.language, 'ja-JP');
  assert.equal(result.storage.get('hangout.language'), 'ja-JP');
});

test('legacy query links override a route and resolve to a stable canonical URL', () => {
  const result = boot({ pathname: '/ko/', search: '?lang=en-US', saved: 'ja-JP' });
  assert.equal(result.language, 'en-US');
  assert.equal(result.pageUrl('home'), '/en/');
  assert.equal(result.pageUrl('privacy', 'zh-TW'), '/zh-tw/privacy.html');
});
