(() => {
  const container = document.querySelector('.visual-chaos');
  if (!container) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const ballEls = [...container.querySelectorAll('.chaos-ball')];
  if (!ballEls.length) return;

  const balls = ballEls.map((el) => {
    const size = el.offsetWidth || parseInt(getComputedStyle(el).width) || 50;
    return {
      el,
      x: Math.random() * 0.6 + 0.2,
      y: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.004,
      r: size / 2,
      mass: size * size,
    };
  });

  let isVisible = true;
  let raf = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !raf) tick();
    },
    { threshold: 0 }
  );
  observer.observe(container);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isVisible && !raf) tick();
  });

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

      const minX = b.r / w;
      const maxX = 1 - b.r / w;
      const minY = b.r / h;
      const maxY = 1 - b.r / h;

      if (b.x < minX) { b.x = minX; b.vx = Math.abs(b.vx); }
      if (b.x > maxX) { b.x = maxX; b.vx = -Math.abs(b.vx); }
      if (b.y < minY) { b.y = minY; b.vy = Math.abs(b.vy); }
      if (b.y > maxY) { b.y = maxY; b.vy = -Math.abs(b.vy); }
    }

    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i];
        const b = balls[j];
        const dx = (b.x - a.x) * w;
        const dy = (b.y - a.y) * h;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.r + b.r;

        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;

          const totalMass = a.mass + b.mass;
          a.x -= (nx * overlap * (b.mass / totalMass)) / w;
          a.y -= (ny * overlap * (b.mass / totalMass)) / h;
          b.x += (nx * overlap * (a.mass / totalMass)) / w;
          b.y += (ny * overlap * (a.mass / totalMass)) / h;

          const dvx = a.vx - b.vx;
          const dvy = a.vy - b.vy;
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

    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      b.el.style.transform = `translate(${(b.x - 0.5) * 100}%, ${(b.y - 0.5) * 100}%)`;
    }

    raf = requestAnimationFrame(tick);
  }

  function init() {
    const rect = container.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;

    balls.forEach((b, i) => {
      const size = b.el.offsetWidth || parseInt(getComputedStyle(b.el).width) || 50;
      b.r = size / 2;
      b.mass = size * size;

      b.x = 0.2 + Math.random() * 0.6;
      b.y = 0.2 + Math.random() * 0.6;

      const speed = 0.0015 + (balls.length - i) * 0.001;
      const angle = Math.random() * Math.PI * 2;
      b.vx = Math.cos(angle) * speed;
      b.vy = Math.sin(angle) * speed;
    });

    tick();
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
