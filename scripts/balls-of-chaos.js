// Playable Pong visual for the Balls of Chaos project card.
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
  const renderPong = (now) => {
    frame = 0;
    if (!visible) return;
    drawPong(now);
    if (!reducedMotion) frame = requestAnimationFrame(renderPong);
  };
  pongCanvas.addEventListener('pointermove', setPlayerFromPointer);
  pongCanvas.addEventListener('pointerdown', setPlayerFromPointer);
  pongCanvas.addEventListener('touchstart', (event) => { const touch = event.touches[0]; if (touch) setPlayerFromPointer(touch); }, { passive: true });
  const pongObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(renderPong); }, { threshold: 0 });
  pongObserver.observe(pongCanvas);
  window.addEventListener('resize', resizePong, { passive: true });
  resizePong();
  if (reducedMotion) drawPong(0); else frame = requestAnimationFrame(renderPong);
}
