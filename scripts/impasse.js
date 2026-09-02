// Live generative visual for the Impasse project card.
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
