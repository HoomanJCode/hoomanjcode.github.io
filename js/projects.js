const viewMoreButton = document.querySelector('.view-more-button');
const projectList = document.querySelector('#projectList');
const moreWork = document.querySelector('.more-work');
const workModeLabel = document.querySelector('#workModeLabel');
const viewMoreLabel = viewMoreButton?.querySelector('.view-more-label');
const extraProjects = [...projectList?.querySelectorAll('.is-extra') || []];
const firstRevealed = extraProjects[0];

// The full-project view is remembered for 24 hours: reopening the page keeps
// the user's last choice, and when the cache is missing or expired the page
// falls back to the three featured projects.
const VIEW_CACHE_KEY = 'projects-view-expanded';
const VIEW_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const readCachedExpanded = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(VIEW_CACHE_KEY));
    if (cached && typeof cached.expanded === 'boolean' && Date.now() - cached.savedAt < VIEW_CACHE_TTL) {
      return cached.expanded;
    }
  } catch (error) {
    // Storage unreadable or unavailable (private mode, blocked cookies) —
    // fall back to the default view.
  }
  return null;
};
const writeCachedExpanded = (expanded) => {
  try {
    localStorage.setItem(VIEW_CACHE_KEY, JSON.stringify({ expanded, savedAt: Date.now() }));
  } catch (error) {
    // Storage unavailable — the preference simply won't persist.
  }
};

if (viewMoreButton && projectList && moreWork && workModeLabel && viewMoreLabel && extraProjects.length) {
  const t = (key) => window.I18N?.[document.documentElement.lang === 'fa' ? 'fa' : 'en']?.[key] ?? '';
  const setLabels = (expanded) => {
    workModeLabel.textContent = expanded ? t('workModeAll') : t('workModeSelected');
    viewMoreLabel.textContent = expanded ? t('viewLess') : t('viewMore');
  };
  // scroll: false on the initial restore so a returning user who left the
  // page expanded is not yanked down to the work section on first paint.
  const setExpanded = (expanded, { scroll = true } = {}) => {
    viewMoreButton.setAttribute('aria-expanded', String(expanded));
    projectList.classList.toggle('is-expanded', expanded);
    extraProjects.forEach((project) => {
      project.hidden = !expanded;
    });
    moreWork.hidden = expanded;
    moreWork.setAttribute('aria-hidden', String(expanded));
    setLabels(expanded);
    if (expanded) {
      projectList.after(viewMoreButton);
      if (scroll) {
        requestAnimationFrame(() => {
          // End the scroll above the first newly revealed project, keeping a
          // strip of the last featured project visible for context and letting
          // the grid gap act as margin before the new projects begin.
          const rowGap = parseFloat(getComputedStyle(projectList).rowGap) || 0;
          const firstRowBottom = firstRevealed.getBoundingClientRect().top + window.scrollY - rowGap;
          window.scrollTo({ top: Math.max(0, firstRowBottom - 50), behavior: 'smooth' });
        });
      }
    } else {
      moreWork.after(viewMoreButton);
    }
  };

  setExpanded(readCachedExpanded() === true, { scroll: false });
  // Keep the toggle labels in sync when the language switches.
  document.addEventListener('langchange', () => setLabels(viewMoreButton.getAttribute('aria-expanded') === 'true'));
  viewMoreButton.addEventListener('click', () => {
    const nextExpanded = viewMoreButton.getAttribute('aria-expanded') !== 'true';
    setExpanded(nextExpanded);
    writeCachedExpanded(nextExpanded);
    if (!nextExpanded) {
      requestAnimationFrame(() => {
        viewMoreButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  });
}
