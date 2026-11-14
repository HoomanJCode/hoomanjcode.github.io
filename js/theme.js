// The portfolio uses the dark palette on every page.
document.documentElement.dataset.theme = 'dark';
const pageThemeMeta = document.querySelector('meta[name="theme-color"][data-theme-page]');
if (pageThemeMeta) pageThemeMeta.setAttribute('content', '#080a0e');
