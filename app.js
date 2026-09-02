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
    }, 4000);
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

// Generative Impasse thumbnail: a quiet levitating boat over a lily lake.
const boatCanvas = document.querySelector('#boatCanvas');
if (boatCanvas) {
  const ctx = boatCanvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const boatRng = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const rand = boatRng(20250301);
  const waves = Array.from({ length: 18 }, (_, i) => ({
    x: rand(), y: .53 + rand() * .4, length: .04 + rand() * .12,
    phase: rand() * Math.PI * 2, speed: .45 + rand() * .75, weight: .6 + rand() * 1.4,
    alpha: .14 + rand() * .18,
  }));
  const lilies = Array.from({ length: 11 }, () => ({
    x: .05 + rand() * .9, y: .59 + rand() * .31, size: 5 + rand() * 7,
    angle: rand() * Math.PI * 2, bloom: rand() > .58,
  }));
  let frame = 0;
  let visible = true;
  let lastTime = 0;
  const resizeBoat = () => {
    const rect = boatCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    boatCanvas.width = Math.max(1, Math.round(rect.width * ratio));
    boatCanvas.height = Math.max(1, Math.round(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (reducedMotion) drawBoat(0);
  };
  const drawBoat = (time) => {
    const { width: w, height: h } = boatCanvas.getBoundingClientRect();
    if (!w || !h) return;
    const t = time / 1000;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#283a2a'; ctx.fillRect(0, 0, w, h);
    const sky = ctx.createLinearGradient(0, 0, 0, h * .58);
    sky.addColorStop(0, '#435f46'); sky.addColorStop(1, '#789b62');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * .62);
    ctx.fillStyle = '#99b873'; ctx.fillRect(0, h * .54, w, h * .46);
    ctx.fillStyle = 'rgba(213,255,79,.1)'; ctx.fillRect(0, h * .54, w, h * .025);
    // Distant reeds and shoreline marks.
    ctx.strokeStyle = 'rgba(22,45,31,.45)'; ctx.lineWidth = 1;
    for (let i = 0; i < 17; i++) {
      const x = (i / 16) * w + Math.sin(i * 4.7) * 5;
      ctx.beginPath(); ctx.moveTo(x, h * .58); ctx.quadraticCurveTo(x - 3, h * .5, x + 2, h * .43); ctx.stroke();
    }
    // Water waves with small deterministic motion.
    ctx.lineCap = 'round';
    for (const wave of waves) {
      const x = wave.x * w + Math.sin(t * wave.speed + wave.phase) * 4;
      const y = wave.y * h + Math.cos(t * wave.speed * .7 + wave.phase) * 2;
      ctx.strokeStyle = `rgba(38,76,53,${wave.alpha})`; ctx.lineWidth = wave.weight;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + wave.length * w * .45, y - 2, x + wave.length * w, y); ctx.stroke();
    }
    // Rope anchor wood, behind the boat.
    const postX = w * .82, postY = h * .56;
    ctx.fillStyle = '#5d432b'; ctx.fillRect(postX - 7, postY - 57, 13, 62);
    ctx.fillStyle = '#89623c'; ctx.beginPath(); ctx.ellipse(postX, postY - 58, 10, 5, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#382a20'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(postX - 4, postY - 51); ctx.lineTo(postX + 1, postY - 8); ctx.stroke();
    // Floating boat, gently bobbing.
    const bob = reducedMotion ? 0 : Math.sin(t * 1.25) * 3;
    const bx = w * .48, by = h * .39 + bob;
    ctx.strokeStyle = 'rgba(213,255,79,.28)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(bx + 30, by + 13); ctx.quadraticCurveTo(w * .66, by + 27, postX - 2, postY - 56); ctx.stroke();
    ctx.fillStyle = '#d5ff4f'; ctx.globalAlpha = .16; ctx.beginPath(); ctx.ellipse(bx, by + 43, 68, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#536b31'; ctx.beginPath(); ctx.moveTo(bx - 51, by + 9); ctx.quadraticCurveTo(bx, by + 34, bx + 51, by + 9); ctx.lineTo(bx + 39, by + 24); ctx.quadraticCurveTo(bx, by + 43, bx - 39, by + 24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d5ff4f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx - 49, by + 9); ctx.quadraticCurveTo(bx, by + 31, bx + 49, by + 9); ctx.stroke();
    ctx.fillStyle = '#e4c35e'; ctx.beginPath(); ctx.moveTo(bx - 34, by + 2); ctx.lineTo(bx + 34, by + 2); ctx.lineTo(bx + 26, by + 11); ctx.lineTo(bx - 27, by + 11); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8e773d'; ctx.fillRect(bx - 2, by - 25, 4, 28);
    ctx.fillStyle = '#d5ff4f'; ctx.beginPath(); ctx.moveTo(bx + 2, by - 24); ctx.lineTo(bx + 2, by + 1); ctx.lineTo(bx + 29, by - 1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff0a5'; ctx.beginPath(); ctx.moveTo(bx - 2, by - 22); ctx.lineTo(bx - 2, by - 1); ctx.lineTo(bx - 25, by - 2); ctx.closePath(); ctx.fill();
    // Lilies in the foreground.
    for (const lily of lilies) {
      const x = lily.x * w, y = lily.y * h, s = lily.size;
      ctx.fillStyle = '#365e3d'; ctx.beginPath(); ctx.ellipse(x, y, s, s * .58, lily.angle, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(213,255,79,.42)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(lily.angle) * s, y + Math.sin(lily.angle) * s); ctx.stroke();
      if (lily.bloom) { ctx.fillStyle = '#d5ff4f'; ctx.beginPath(); ctx.arc(x + s * .15, y - s * .45, s * .32, 0, Math.PI * 2); ctx.fill(); }
    }
  };
  const renderBoat = (now) => {
    frame = 0;
    if (!visible) return;
    drawBoat(now);
    if (!reducedMotion) frame = requestAnimationFrame(renderBoat);
  };
  const boatObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(renderBoat);
  }, { threshold: 0 });
  boatObserver.observe(boatCanvas);
  window.addEventListener('resize', resizeBoat, { passive: true });
  resizeBoat();
  if (!reducedMotion) frame = requestAnimationFrame(renderBoat);
}

