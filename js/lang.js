// Shared language handling for the homepage and every project page.
//
// The initial language is decided by an inline head script (see index.html /
// project-page.html) so the page never flashes the wrong language or text
// direction. This module wires the EN/FA switcher, persists the choice,
// translates [data-i18n] content, and dispatches a 'langchange' event that
// pages listen to when they need to re-render.
(() => {
  const STORAGE_KEY = 'lang';
  const root = document.documentElement;

  const readLang = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'fa') return stored;
    } catch (error) {
      // Storage unavailable — fall back to English.
    }
    return 'en';
  };
  const writeLang = (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Storage unavailable — the choice simply won't persist.
    }
  };

  const applyLang = () => {
    const lang = readLang();
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    return lang;
  };

  // Translate the current page's marked elements. Plain [data-i18n] elements
  // get their text swapped; [data-i18n-html] elements get innerHTML (needed
  // for headings that contain <br>, <em>, or <span>).
  const applyText = () => {
    const dict = window.I18N?.[readLang()] || {};
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (key in dict) element.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
      const key = element.dataset.i18nHtml;
      if (key in dict) element.innerHTML = dict[key];
    });
  };

  const syncUI = () => {
    const lang = readLang();
    document.querySelectorAll('[data-lang-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.langChoice === lang));
    });
  };

  // Event delegation so the switcher works wherever it is rendered, including
  // project-page headers built after this module loads.
  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-lang-choice]');
    if (!button) return;
    writeLang(button.dataset.langChoice);
    applyLang();
    applyText();
    syncUI();
  });

  const init = () => {
    applyLang();
    applyText();
    syncUI();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();