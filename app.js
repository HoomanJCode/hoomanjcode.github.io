// Mark the UI script as loaded so the inline failsafe in index.html can
// force hidden .reveal sections visible if this file ever fails to run.
window.__appReady = true;

const progressBar = document.querySelector('#progressBar');
let progressFrame = 0;
const updateProgress = () => {
  progressFrame = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = `scaleX(${max ? window.scrollY / max : 0})`;
};
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, { passive: true });
updateProgress();

// Browser chrome (mobile address bar / tab strip) tint per scene
const loadingTheme = document.querySelector('meta[data-meta="theme-color-loading"]');
const pageTheme = document.querySelector('meta[data-meta="theme-color-page"]');
const setThemeColor = (content) => {
  if (pageTheme) pageTheme.setAttribute('content', content);
};
const SCENE_COLORS = {
  hero: '#07090d',
  statement: '#f0eee8',
  work: '#07090d',
  about: '#bdcce9',
  contact: '#17191e',
};
if (loadingTheme && pageTheme) {
  requestAnimationFrame(() => loadingTheme.remove()); // leave the loading tint once painted
}
const applySceneTheme = (scene) => {
  if (SCENE_COLORS[scene]) setThemeColor(SCENE_COLORS[scene]);
};
applySceneTheme(document.body.dataset.scene || 'hero');
window.addEventListener('pageshow', () => {
  if (document.body.dataset.scene) applySceneTheme(document.body.dataset.scene);
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: .13 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const sections = [...document.querySelectorAll('.scene-section')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.body.dataset.scene = entry.target.dataset.scene;
      applySceneTheme(entry.target.dataset.scene);
    }
  });
}, { threshold: .55 });

window.__appDone = true;
sections.forEach((section) => sectionObserver.observe(section));
