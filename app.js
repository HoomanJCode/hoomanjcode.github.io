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
    ctx.clearRect(0, 0, w, h);    // Top-down water field in the game's warm yellow-green palette.
    const water = ctx.createLinearGradient(0, 0, w, h);
    water.addColorStop(0, '#111c34'); water.addColorStop(.52, '#233a75'); water.addColorStop(1, '#080a0e');
    ctx.fillStyle = water; ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round';
    for (const wave of waves) {
      const x = wave.x * w + Math.sin(t * wave.speed + wave.phase) * 3;
      const y = wave.y * h + Math.cos(t * wave.speed * .7 + wave.phase) * 2;
      ctx.strokeStyle = `rgba(145,186,255,${wave.alpha})`; ctx.lineWidth = wave.weight;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + wave.length * w * .45, y - 2, x + wave.length * w, y); ctx.stroke();
    }
    const postX = w * .82, postY = h * .55;
    // Top-down wooden post, with a small shadow and visible rope knot.
    ctx.fillStyle = 'rgba(55,45,23,.2)'; ctx.beginPath(); ctx.ellipse(postX + 3, postY + 4, 14, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff765c'; ctx.beginPath(); ctx.ellipse(postX, postY, 11, 14, -.15, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ff765c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(postX, postY, 7, 10, -.15, 0, Math.PI * 2); ctx.stroke();
    const bob = reducedMotion ? 0 : Math.sin(t * 1.25) * 2;
    const bx = w * .47, by = h * .38 + bob;
    // Rope from the boat's bow to the post, with a loose middle curve.
    ctx.strokeStyle = 'rgba(73,51,23,.8)'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(bx + 25, by + 4); ctx.quadraticCurveTo(w * .65, by + 22, postX, postY - 8); ctx.stroke(); ctx.setLineDash([]);
    // Boat viewed from above: hull, rim, seats, and central mast.
    ctx.fillStyle = 'rgba(55,45,23,.22)'; ctx.beginPath(); ctx.ellipse(bx + 4, by + 6, 55, 25, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d5ff4f'; ctx.beginPath(); ctx.ellipse(bx, by, 54, 25, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f0eee8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(bx, by, 48, 19, -.12, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#7d6530'; ctx.fillRect(bx - 2, by - 15, 4, 30);
    ctx.fillStyle = '#91baff'; ctx.fillRect(bx - 29, by - 4, 58, 5);
    ctx.fillStyle = '#6e5429'; ctx.beginPath(); ctx.arc(bx + 27, by + 4, 3, 0, Math.PI * 2); ctx.fill();
    // Lily pads and lily flowers are the only green elements.
    for (const lily of lilies) {
      const x = lily.x * w, y = lily.y * h, s = lily.size;
      ctx.fillStyle = '#46753d'; ctx.beginPath(); ctx.arc(x, y, s, .25, Math.PI * 2 - .25); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(213,255,79,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(lily.angle) * s, y + Math.sin(lily.angle) * s); ctx.stroke();
      if (lily.bloom) {
        ctx.fillStyle = '#f5e88a';
        for (let petal = 0; petal < 5; petal++) { const a = petal * Math.PI * 2 / 5; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * s * .55, y + Math.sin(a) * s * .55, s * .3, s * .15, a, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = '#ff765c'; ctx.beginPath(); ctx.arc(x, y, s * .16, 0, Math.PI * 2); ctx.fill();
      }
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

// Playable Balls of Chaos thumbnail: minimal Pong with a yellow player
// paddle, red AI paddle, and pointer/touch controls across the arena.
const pongCanvas = document.querySelector('#pongCanvas');
if (pongCanvas) {
  const ctx = pongCanvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, scale = 1, frame = 0, visible = true, lastTime = 0;
  let playerTarget = .5, player = .5, ai = .28;
  let ball = { x: .5, y: .5, vx: .36, vy: .22 };
  let score = 0, aiScore = 0;
  const trail = [];
  const resizePong = () => {
    const rect = pongCanvas.getBoundingClientRect();
    scale = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    pongCanvas.width = Math.max(1, Math.round(width * scale));
    pongCanvas.height = Math.max(1, Math.round(height * scale));
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  };
  const resetBall = (direction) => {
    ball = { x: .5, y: .5, vx: (Math.random() - .5) * .34, vy: direction * (.3 + Math.random() * .08) };
    trail.length = 0;
  };
  const setPlayerFromPointer = (event) => {
    const rect = pongCanvas.getBoundingClientRect();
    playerTarget = Math.max(.12, Math.min(.88, (event.clientX - rect.left) / rect.width));
  };
  const drawPong = (now) => {
    const dt = Math.min(.035, (now - lastTime) / 1000 || .016);
    lastTime = now;
    const paddleW = Math.max(44, width * .24), paddleH = Math.max(5, height * .018);
    const py = height * .09, ay = height * .91;
    player += (playerTarget - player) * Math.min(1, dt * 12);
    ai += (ball.x - ai) * Math.min(1, dt * (reducedMotion ? 3 : 4.2));
    ai = Math.max(.12, Math.min(.88, ai));
    if (!reducedMotion) { ball.x += ball.vx * dt; ball.y += ball.vy * dt; }
    if (ball.x < .08 || ball.x > .92) { ball.vx *= -1; ball.x = Math.max(.08, Math.min(.92, ball.x)); }
    const playerHit = ball.y < .12 && ball.y > .095 && Math.abs(ball.x - player) < .16;
    const aiHit = ball.y > .88 && ball.y < .905 && Math.abs(ball.x - ai) < .16;
    if (playerHit && ball.vy < 0) { ball.vy = Math.abs(ball.vy) * 1.04; ball.vx += (ball.x - player) * .28; score++; }
    if (aiHit && ball.vy > 0) { ball.vy = -Math.abs(ball.vy) * 1.04; ball.vx += (ball.x - ai) * .22; aiScore++; }
    if (ball.y < -.04) resetBall(1);
    if (ball.y > 1.04) resetBall(-1);
    trail.push({ x: ball.x * width, y: ball.y * height });
    if (trail.length > 9) trail.shift();
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#080a0e'); bg.addColorStop(1, '#17191e');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(213,255,79,.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 9]);
    ctx.beginPath(); ctx.moveTo(width * .12, height / 2); ctx.lineTo(width * .88, height / 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(213,255,79,.12)'; ctx.beginPath(); ctx.arc(width / 2, height / 2, height * .18, 0, Math.PI * 2); ctx.stroke();
    trail.forEach((point, index) => { ctx.fillStyle = `rgba(255,118,92,${(index / trail.length) * .28})`; ctx.beginPath(); ctx.arc(point.x, point.y, 2 + index * .35, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#d5ff4f'; ctx.shadowColor = '#d5ff4f'; ctx.shadowBlur = 16; ctx.fillRect(player * width - paddleW / 2, py - paddleH / 2, paddleW, paddleH); ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff765c'; ctx.shadowColor = '#ff765c'; ctx.shadowBlur = 16; ctx.fillRect(ai * width - paddleW / 2, ay - paddleH / 2, paddleW, paddleH); ctx.shadowBlur = 0;
    ctx.fillStyle = '#f0eee8'; ctx.shadowColor = '#f0eee8'; ctx.shadowBlur = 13; ctx.beginPath(); ctx.arc(ball.x * width, ball.y * height, Math.max(4, width * .014), 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(240,238,232,.7)'; ctx.font = `${Math.max(10, width * .025)}px DM Mono, monospace`; ctx.fillText(String(score).padStart(2, '0'), width * .16, height * .16); ctx.fillText(String(aiScore).padStart(2, '0'), width * .78, height * .16);
  };
  const renderPong = (now) => { frame = 0; if (!visible) return; drawPong(now);  if (!reducedMotion) frame = requestAnimationFrame(renderPong);
}

// FxPlanet thumbnail: regenerate a new procedural planet every five seconds.
const fxPlanet = document.querySelector('.mini-planet');
if (fxPlanet) {
  let planetSeed = Math.floor(Math.random() * 0xffffffff);
  let planetTimer = 0;
  let planetVisible = true;
  const nextRandom = () => {
    planetSeed = (planetSeed * 1664525 + 1013904223) >>> 0;
    return planetSeed / 4294967296;
  };
  const createPlanet = () => {
    const palette = [
      ['#91baff', '#668ee2', '#233a75'],
      ['#d5ff4f', '#91baff', '#315486'],
      ['#ff765c', '#668ee2', '#111c34'],
      ['#f0eee8', '#91baff', '#3f66b8'],
    ];
    const selected = palette[Math.floor(nextRandom() * palette.length)];
    fxPlanet.style.setProperty('--planet-a', selected[0]);
    fxPlanet.style.setProperty('--planet-b', selected[1]);
    fxPlanet.style.setProperty('--planet-c', selected[2]);
    fxPlanet.style.setProperty('--planet-x', `${28 + Math.round(nextRandom() * 44)}%`);
    fxPlanet.style.setProperty('--planet-y', `${22 + Math.round(nextRandom() * 40)}%`);
    fxPlanet.style.setProperty('--planet-rotation', `${-8 + Math.round(nextRandom() * 16)}deg`);
    fxPlanet.classList.remove('planet-new');
    void fxPlanet.offsetWidth;
    fxPlanet.classList.add('planet-new');
  };
  const schedulePlanet = () => {
    clearTimeout(planetTimer);
    if (planetVisible && !reducedMotion) planetTimer = window.setTimeout(() => { createPlanet(); schedulePlanet(); }, 5000);
  };
  const planetObserver = new IntersectionObserver(([entry]) => {
    planetVisible = entry.isIntersecting;
    if (planetVisible) schedulePlanet(); else clearTimeout(planetTimer);
  }, { threshold: 0 });
  planetObserver.observe(fxPlanet);
  createPlanet();
  schedulePlanet();
}

;
  pongCanvas.addEventListener('pointermove', setPlayerFromPointer);
  pongCanvas.addEventListener('pointerdown', setPlayerFromPointer);
  pongCanvas.addEventListener('touchstart', (event) => { const touch = event.touches[0]; if (touch) setPlayerFromPointer(touch); }, { passive: true });
  const pongObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(renderPong); }, { threshold: 0 });
  pongObserver.observe(pongCanvas);
  window.addEventListener('resize', resizePong, { passive: true });
  resizePong();
  if (reducedMotion) drawPong(0); else frame = requestAnimationFrame(renderPong);
}


