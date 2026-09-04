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

// The archive ticker is an animated marquee that remains manually
// draggable/scrollable for touch, wheel, and trackpad users.
const ticker = document.querySelector('[data-ticker]');
if (ticker && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const rows = [...ticker.querySelectorAll('[data-ticker-row]')];
  let pointerId = null;
  let lastX = 0;
  let moved = false;
  let manualOffset = 0;
  let resumeTimer = 0;
  const setAnimationState = (state) => {
    rows.forEach((row) => {
      const track = row.querySelector('.ticker-track');
      if (track) track.style.animationPlayState = state;
    });
  };
  const cancelResume = () => {
    if (resumeTimer) {
      clearTimeout(resumeTimer);
      resumeTimer = 0;
    }
  };
  const resumeAfterDelay = () => {
    cancelResume();
    resumeTimer = window.setTimeout(() => {
      resumeTimer = 0;
      setAnimationState('running');
    }, 2000);
  };
  const setManualOffset = (delta) => {
    manualOffset += delta;
    rows.forEach((row) => {
      const track = row.querySelector('.ticker-track');
      if (track) track.style.transform = `translateX(${manualOffset}px)`;
    });
  };

  ticker.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      setManualOffset(-event.deltaY);
      event.preventDefault();
    }
    cancelResume();
    setAnimationState('paused');
  }, { passive: false });

  ticker.addEventListener('pointerenter', () => {
    cancelResume();
    setAnimationState('paused');
  });
  ticker.addEventListener('pointerleave', resumeAfterDelay);

  ticker.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    cancelResume();
    setAnimationState('paused');
    pointerId = event.pointerId;
    lastX = event.clientX;
    moved = false;
    ticker.classList.add('is-dragging');
    ticker.setPointerCapture(pointerId);
  });

  ticker.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const delta = event.clientX - lastX;
    if (Math.abs(delta) > 0) moved = true;
    setManualOffset(delta);
    setAnimationState('paused');
    lastX = event.clientX;
  });

  const endDrag = (event) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    ticker.classList.remove('is-dragging');
    resumeAfterDelay();
  };
  ticker.addEventListener('pointerup', endDrag);
  ticker.addEventListener('pointercancel', endDrag);
  ticker.addEventListener('pointerleave', (event) => {
    if (event.pointerId === pointerId) endDrag(event);
  });
  ticker.addEventListener('click', (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
    }
    moved = false;
  }, true);
}
sections.forEach((section) => sectionObserver.observe(section));
