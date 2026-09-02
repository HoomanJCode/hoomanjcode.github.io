// Live 2D top-down generative visual for the Impasse project card.
const boatCanvas = document.querySelector('#boatCanvas');
if (boatCanvas) {
  const ctx = boatCanvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const random = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const rand = random(91357);
  const waves = Array.from({ length: 32 }, () => ({
    x: rand(), y: rand(), width: .025 + rand() * .1, phase: rand() * 6.28,
    speed: .35 + rand() * .7, alpha: .1 + rand() * .16,
  }));
  const lilies = [[.1,.2],[.22,.76],[.38,.16],[.53,.82],[.72,.22],[.88,.67],[.09,.56],[.82,.42],[.33,.9],[.65,.91]]
    .map(([x,y], i) => ({ x, y, size: 9 + (i % 3) * 3, flower: i % 2 === 0, phase: rand() * 6.28 }));
  let width = 0, height = 0, ratio = 1, frame = 0, visible = true;
  const resize = () => {
    const rect = boatCanvas.getBoundingClientRect();
    width = rect.width; height = rect.height; ratio = Math.min(window.devicePixelRatio || 1, 2);
    boatCanvas.width = Math.max(1, Math.round(width * ratio));
    boatCanvas.height = Math.max(1, Math.round(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const drawWave = (wave, time) => {
    const x = wave.x * width + Math.sin(time * wave.speed + wave.phase) * 4;
    const y = wave.y * height + Math.cos(time * wave.speed * .7 + wave.phase) * 2;
    ctx.strokeStyle = `rgba(145,186,255,${wave.alpha})`; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + wave.width * width * .5, y - 2, x + wave.width * width, y); ctx.stroke();
  };
  const drawLily = (lily, time) => {
    const x = lily.x * width, y = lily.y * height + (reducedMotion ? 0 : Math.sin(time * .55 + lily.phase) * 1.5), s = lily.size;
    ctx.fillStyle = '#315486'; ctx.beginPath(); ctx.arc(x, y, s, .28, Math.PI * 2 - .28); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(213,255,79,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * .75, y - s * .35); ctx.stroke();
    if (lily.flower) {
      ctx.fillStyle = '#f0eee8';
      for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * s * .55, y + Math.sin(a) * s * .55, s * .34, s * .17, a, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#ff765c'; ctx.beginPath(); ctx.arc(x, y, s * .17, 0, Math.PI * 2); ctx.fill();
    }
  };
  const drawBoat = (time) => {
    const bx = width * .45, by = height * .47 + (reducedMotion ? 0 : Math.sin(time * 1.1) * 2), bw = Math.min(width * .32, 170), bh = bw * .42;
    const postX = width * .83, postY = height * .42;
    ctx.strokeStyle = 'rgba(240,238,232,.85)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(bx + bw * .35, by - bh * .05); ctx.quadraticCurveTo(width * .64, by + height * .05, postX, postY); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(8,10,14,.3)'; ctx.beginPath(); ctx.ellipse(bx + 3, by + 6, bw * .52, bh * .38, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d5ff4f'; ctx.beginPath(); ctx.ellipse(bx, by, bw * .52, bh * .35, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f0eee8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(bx, by, bw * .45, bh * .23, -.12, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#668ee2'; ctx.beginPath(); ctx.ellipse(bx, by, bw * .35, bh * .15, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff765c'; ctx.fillRect(bx - bw * .18, by - 2, bw * .36, 4);
    ctx.fillStyle = '#f0eee8'; ctx.beginPath(); ctx.arc(bx + bw * .37, by - bh * .03, 3, 0, Math.PI * 2); ctx.fill();
    // Top-down faceted wood anchor with a visible dark cut end.
    ctx.fillStyle = '#ff765c'; ctx.beginPath(); ctx.ellipse(postX, postY, 16, 12, -.18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#080a0e'; ctx.beginPath(); ctx.ellipse(postX, postY, 9, 7, -.18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(240,238,232,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(postX, postY, 13, 9, -.18, 0, Math.PI * 2); ctx.stroke();
  };
  const draw = (now) => {
    const time = now / 1000;
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#080a0e'); gradient.addColorStop(.55, '#111c34'); gradient.addColorStop(1, '#233a75');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
    waves.forEach((wave) => drawWave(wave, time));
    lilies.forEach((lily) => drawLily(lily, time));
    drawBoat(time);
  };
  const render = (now) => { frame = 0; if (!visible) return; draw(now); if (!reducedMotion) frame = requestAnimationFrame(render); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(render); }, { threshold: 0 });
  observer.observe(boatCanvas);
  window.addEventListener('resize', resize, { passive: true }); resize();
  if (reducedMotion) draw(0); else frame = requestAnimationFrame(render);
}
