// Shared theme handling for the homepage and every project page.
//
// The effective theme is decided as early as possible by an inline head
// script (see index.html / project-page.html) so the page never flashes the
// wrong theme. This module wires the theme switcher, persists the user's
// choice, and follows the operating system when the choice is "system".
(() => {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const pageThemeMeta = document.querySelector('meta[name="theme-color"][data-theme-page]');

  const readChoice = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch (error) {
      // Storage unavailable — fall back to following the system.
    }
    return 'system';
  };
  const writeChoice = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (error) {
      // Storage unavailable — the choice simply won't persist.
    }
  };

  // Returns true when the effective (rendered) theme is dark.
  const applyTheme = () => {
    const choice = readChoice();
    const dark = choice === 'dark' || (choice === 'system' && media.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    // Keep browser chrome tint in sync on pages without app.js scene colors.
    if (pageThemeMeta) pageThemeMeta.setAttribute('content', dark ? '#080a0e' : '#f2f1ec');
    document.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
    return dark;
  };

  const syncUI = () => {
    const choice = readChoice();
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice));
    });
  };

  // Event delegation so the switcher works wherever it is rendered, including
  // project-page headers built after this module loads.
  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-theme-choice]');
    if (!button) return;
    writeChoice(button.dataset.themeChoice);
    applyTheme();
    syncUI();
  });

  // Follow the OS while the user has not pinned a specific theme.
  media.addEventListener?.('change', () => {
    if (readChoice() === 'system') applyTheme();
  });

  const init = () => {
    applyTheme();
    syncUI();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();