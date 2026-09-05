(() => {
  const container = document.querySelector('.visual-chaos');
  if (!container) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const MAX_BALLS = 10;
  const SPAWN_INTERVAL = 5000;
  const WATCH_THRESHOLD = 0.35;
  const ballEls = [...container.querySelectorAll('.chaos-ball')].slice(0, 2);
  if (!ballEls.length) return;

  const balls = ballEls.map((el) => createBall(el));
  let isVisible = false;
  let raf = 0;
  let spawnTimer = 0;
  let manualMode = false;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = entry.isIntersecting && entry.intersectionRatio >= WATCH_THRESHOLD;
      if (isVisible) {
        startSpawning();
        if (!raf) tick();
      } else {
        stopSpawning();
      }
    },
    { threshold: [0, WATCH_THRESHOLD] }
  );
  observer.observe(container);

  document.addEventListener('visibilitychange', () => {
    if (isVisible && !document.hidden) {
      startSpawning();
      if (!raf) tick();
    } else {
      stopSpawning();
    }
  });

  container.addEventListener('click', handleClick);

  function createBall(el, size) {
    const ballSize = size || el.offsetWidth || parseInt(getComputedStyle(el).width) || 50;
    el.dataset.chaosBall = 'true';
    return {
      el,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: ballSize / 2,
      mass: ballSize * ballSize,
    };
  }

  function handleClick(event) {
    if (!isVisible || document.hidden) return;

    manualMode = true;
    stopSpawning();

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickedBallIndex = findBallAt(x, y);

    if (clickedBallIndex !== -1) {
      balls[clickedBallIndex].el.remove();
      balls.splice(clickedBallIndex, 1);
      return;
    }

    if (balls.length >= MAX_BALLS) return;
    addRandomBallAt(x, y, rect.width || 1, rect.height || 1);
  }

  function findBallAt(x, y) {
    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      if (Math.hypot(x - ball.x, y - ball.y) <= ball.r) return i;
    }
    return -1;
  }

  function tick() {
    if (!isVisible || document.hidden) {
      raf = 0;
      return;
    }

    const rect = container.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;

    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      b.x += b.vx;
      b.y += b.vy;

      const minX = b.r;
      const maxX = w - b.r;
      const minY = b.r;
      const maxY = h - b.r;

      if (b.x < minX) { b.x = minX; b.vx = Math.abs(b.vx); }
      if (b.x > maxX) { b.x = maxX; b.vx = -Math.abs(b.vx); }
      if (b.y < minY) { b.y = minY; b.vy = Math.abs(b.vy); }
      if (b.y > maxY) { b.y = maxY; b.vy = -Math.abs(b.vy); }
    }

    // Resolve more than once because separating one pair can create a new
    // overlap with a third ball, especially around the largest ball.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distanceSquared = dx * dx + dy * dy;
          const minDist = a.r + b.r;

          if (distanceSquared < minDist * minDist) {
            const dist = Math.sqrt(distanceSquared);
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const relativeSpeed = Math.hypot(dvx, dvy);
            const nx = dist > 0.0001
              ? dx / dist
              : relativeSpeed > 0.0001
                ? dvx / relativeSpeed
                : (i + j) % 2 === 0 ? 1 : 0;
            const ny = dist > 0.0001
              ? dy / dist
              : relativeSpeed > 0.0001
                ? dvy / relativeSpeed
                : (i + j) % 2 === 0 ? 0 : 1;
            const overlap = minDist - dist;

            const totalMass = a.mass + b.mass;
            a.x -= nx * overlap * (b.mass / totalMass);
            a.y -= ny * overlap * (b.mass / totalMass);
            b.x += nx * overlap * (a.mass / totalMass);
            b.y += ny * overlap * (a.mass / totalMass);

            const dvDotN = dvx * nx + dvy * ny;
            if (dvDotN > 0) {
              const impulse = (2 * dvDotN) / totalMass;
              a.vx -= impulse * b.mass * nx;
              a.vy -= impulse * b.mass * ny;
              b.vx += impulse * a.mass * nx;
              b.vy += impulse * a.mass * ny;
            }
          }
        }
      }
    }

    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      b.x = Math.max(b.r, Math.min(w - b.r, b.x));
      b.y = Math.max(b.r, Math.min(h - b.r, b.y));
      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%, -50%)`;
    }

    raf = requestAnimationFrame(tick);
  }

  function placeAndLaunch(ball, w, h, speed) {
    const minX = ball.r;
    const maxX = Math.max(minX, w - ball.r);
    const minY = ball.r;
    const maxY = Math.max(minY, h - ball.r);
    const angle = Math.random() * Math.PI * 2;

    ball.x = minX + Math.random() * (maxX - minX);
    ball.y = minY + Math.random() * (maxY - minY);
    ball.vx = Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
  }

  function stopSpawning() {
    if (spawnTimer) {
      window.clearInterval(spawnTimer);
      spawnTimer = 0;
    }
  }

  function startSpawning() {
    stopSpawning();
    if (manualMode || !isVisible || document.hidden || balls.length >= MAX_BALLS) return;

    spawnTimer = window.setInterval(() => {
      const currentRect = container.getBoundingClientRect();
      addRandomBall(currentRect.width || 1, currentRect.height || 1);
    }, SPAWN_INTERVAL);
  }

  function createRandomBall(w, h) {
    const colors = [
      ['var(--acid)', 'inset -15px -15px 0 rgba(213, 255, 79, .12), 0 0 25px rgba(213, 255, 79, .25)'],
      ['var(--coral)', '0 0 25px rgba(255, 118, 92, .25)'],
      ['var(--blue)', '0 0 25px rgba(145, 186, 255, .25)'],
    ];
    const [color, shadow] = colors[Math.floor(Math.random() * colors.length)];
    const size = 28 + Math.random() * 72;
    const el = document.createElement('div');
    el.className = 'chaos-ball';
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.setProperty('--ball-color', color);
    el.style.setProperty('--ball-shadow', shadow);
    container.appendChild(el);

    const ball = createBall(el, size);
    balls.push(ball);
    placeAndLaunch(ball, w, h, 0.8 + Math.random() * 1.2);
    return ball;
  }

  function addRandomBall(w, h) {
    if (balls.length >= MAX_BALLS) {
      stopSpawning();
      return;
    }
    createRandomBall(w, h);
  }

  function addRandomBallAt(x, y, w, h) {
    const ball = createRandomBall(w, h);
    ball.x = Math.max(ball.r, Math.min(w - ball.r, x));
    ball.y = Math.max(ball.r, Math.min(h - ball.r, y));
  }

  function init() {
    const rect = container.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;

    balls.forEach((ball, i) => {
      const size = ball.el.offsetWidth || parseInt(getComputedStyle(ball.el).width) || 50;
      ball.r = size / 2;
      ball.mass = size * size;
      placeAndLaunch(ball, w, h, 0.8 + (balls.length - i) * 0.35);
    });

    tick();
    startSpawning();
  }

  if (container.offsetWidth > 0) {
    init();
  } else {
    const ro = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        ro.disconnect();
        init();
      }
    });
    ro.observe(container);
  }
})();
