// Playable Pong visual for the Balls of Chaos project card.
const pongCanvas = document.querySelector('#pongCanvas');
if (pongCanvas) {
  const ctx = pongCanvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_BALLS = 10;
  let width = 0, height = 0, scale = 1, frame = 0, visible = true, lastTime = 0;
  let playerTarget = .5, player = .5, ai = .28;
  let balls = [{ x: .5, y: .5, vx: (Math.random() - .5) * .34, vy: .3 }];
  let score = 0, aiScore = 0;
  let touchStartX = 0, touchStartY = 0;
  const trail = [];
  const resizePong = () => {
    const rect = pongCanvas.getBoundingClientRect();
    scale = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    pongCanvas.width = Math.max(1, Math.round(width * scale));
    pongCanvas.height = Math.max(1, Math.round(height * scale));
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  };
  const addBall = (source, direction) => {
    if (balls.length >= MAX_BALLS) return;
    const angle = (Math.random() - .5) * .9;
    balls.push({ x: source.x, y: source.y, vx: Math.sin(angle) * .38, vy: direction * Math.cos(angle) * .38 });
  };
  const resetBall = (direction) => ({ x: .5, y: .5, vx: (Math.random() - .5) * .34, vy: direction * (.3 + Math.random() * .08) });
  const setPlayerFromPointer = (event) => {
    const rect = pongCanvas.getBoundingClientRect();
    playerTarget = Math.max(.12, Math.min(.88, (event.clientX - rect.left) / rect.width));
  };
  const drawPong = (now) => {
    const dt = Math.min(.035, (now - lastTime) / 1000 || .016);
    lastTime = now;
    const paddleW = Math.max(44, width * .24), paddleH = Math.max(5, height * .018);
    const py = height * .91, ay = height * .09;
    player += (playerTarget - player) * Math.min(1, dt * 12);
    ai += (balls[0].x - ai) * Math.min(1, dt * (reducedMotion ? 3 : 4.2));
    ai = Math.max(.12, Math.min(.88, ai));
    const collisions = [];
    balls.forEach((ball) => {
      if (!reducedMotion) { ball.x += ball.vx * dt; ball.y += ball.vy * dt; }
      if (ball.x < .08 || ball.x > .92) { ball.vx *= -1; ball.x = Math.max(.08, Math.min(.92, ball.x)); }
      const playerHit = ball.y > .88 && ball.y < .915 && Math.abs(ball.x - player) < .16;
      const aiHit = ball.y < .12 && ball.y > .085 && Math.abs(ball.x - ai) < .16;
      if (playerHit && ball.vy > 0) { ball.vy = -Math.abs(ball.vy) * 1.03; ball.vx += (ball.x - player) * .28; score++; collisions.push([ball, -1]); }
      if (aiHit && ball.vy < 0) { ball.vy = Math.abs(ball.vy) * 1.03; ball.vx += (ball.x - ai) * .22; aiScore++; collisions.push([ball, 1]); }
      if (ball.y < -.06) Object.assign(ball, resetBall(1));
      if (ball.y > 1.06) Object.assign(ball, resetBall(-1));
      trail.push({ x: ball.x * width, y: ball.y * height, life: 1 });
    });
    collisions.forEach(([ball, direction]) => addBall(ball, direction));
    while (trail.length > 45) trail.shift();
    trail.forEach((point) => { point.life -= dt * 1.8; });
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#1b2947'); bg.addColorStop(.5, '#233a75'); bg.addColorStop(1, '#111c34');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(240,238,232,.04)'; ctx.fillRect(0, height * .48, width, height * .04);
    ctx.strokeStyle = 'rgba(213,255,79,.3)'; ctx.lineWidth = 1; ctx.setLineDash([4, 9]);
    ctx.beginPath(); ctx.moveTo(width * .12, height / 2); ctx.lineTo(width * .88, height / 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(145,186,255,.3)'; ctx.beginPath(); ctx.arc(width / 2, height / 2, height * .18, 0, Math.PI * 2); ctx.stroke();
    trail.forEach((point) => { if (point.life > 0) { ctx.fillStyle = `rgba(255,118,92,${point.life * .22})`; ctx.beginPath(); ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2); ctx.fill(); } });
    ctx.fillStyle = '#d5ff4f'; ctx.shadowColor = '#d5ff4f'; ctx.shadowBlur = 16; ctx.fillRect(player * width - paddleW / 2, py - paddleH / 2, paddleW, paddleH); ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff765c'; ctx.shadowColor = '#ff765c'; ctx.shadowBlur = 16; ctx.fillRect(ai * width - paddleW / 2, ay - paddleH / 2, paddleW, paddleH); ctx.shadowBlur = 0;
    balls.forEach((ball, index) => { const radius = Math.max(4, width * (.011 + Math.min(index, 5) * .001)); ctx.fillStyle = index % 2 ? '#91baff' : '#f0eee8'; ctx.shadowColor = index % 2 ? '#91baff' : '#f0eee8'; ctx.shadowBlur = 13; ctx.beginPath(); ctx.arc(ball.x * width, ball.y * height, radius, 0, Math.PI * 2); ctx.fill(); }); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(240,238,232,.8)'; ctx.font = `${Math.max(10, width * .025)}px DM Mono, monospace`; ctx.fillText(String(aiScore).padStart(2, '0'), width * .16, height * .16); ctx.fillText(String(score).padStart(2, '0'), width * .78, height * .16);
    ctx.fillStyle = 'rgba(213,255,79,.65)'; ctx.font = `${Math.max(8, width * .018)}px DM Mono, monospace`; ctx.fillText(`${balls.length}/${MAX_BALLS}`, width * .45, height * .16);
  };
  const renderPong = (now) => { frame = 0; if (!visible) return; drawPong(now); if (!reducedMotion) frame = requestAnimationFrame(renderPong); };
  pongCanvas.addEventListener('pointermove', setPlayerFromPointer);
  pongCanvas.addEventListener('pointerdown', setPlayerFromPointer);
  pongCanvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    setPlayerFromPointer(touch);
  }, { passive: true });
  pongCanvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    const dx = Math.abs(touch.clientX - touchStartX);
    const dy = Math.abs(touch.clientY - touchStartY);
    // Horizontal movement controls the paddle. Vertical movement remains
    // native browser scrolling because the canvas uses touch-action: pan-y.
    if (dx > dy) setPlayerFromPointer(touch);
  }, { passive: true });
  const pongObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(renderPong); }, { threshold: 0 });
  pongObserver.observe(pongCanvas);
  window.addEventListener('resize', resizePong, { passive: true });
  resizePong();
  if (reducedMotion) drawPong(0); else frame = requestAnimationFrame(renderPong);
}
