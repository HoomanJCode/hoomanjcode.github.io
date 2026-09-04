(() => {
  const canvas = document.querySelector('#gravityCanvas');
  const container = canvas?.closest('.visual-gravity');
  if (!canvas || !container) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MAX_BALLS = 10;
  const STARTING_BALLS = 4;
  const GRAVITY = 9000;
  const SOFTENING = 180;
  const RESTITUTION = 0.92;
  const WATCH_THRESHOLD = 0.35;
  const colors = ['#d5ff4f', '#ff765c', '#91baff', '#f0eee8'];
  const context = canvas.getContext('2d');
  if (!context) return;

  let width = 0;
  let height = 0;
  let devicePixelRatio = 1;
  let animationFrame = 0;
  let lastTime = 0;
  let visible = false;
  let pageVisible = !document.hidden;
  let initialized = false;
  const balls = [];

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!initialized && width > 0 && height > 0) {
      seedBalls();
      initialized = true;
    }
    requestFrame();
  });
  resizeObserver.observe(container);

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= WATCH_THRESHOLD;
    if (visible) {
      lastTime = 0;
      requestFrame();
    } else {
      stopAnimation();
    }
  }, { threshold: [0, WATCH_THRESHOLD] });
  visibilityObserver.observe(container);

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (pageVisible) {
      lastTime = 0;
      requestFrame();
    } else {
      stopAnimation();
    }
  });

  canvas.addEventListener('pointerdown', (event) => {
    if (reducedMotion.matches || !visible || document.hidden) return;

    const point = getPointerPosition(event);
    const hitIndex = findBall(point.x, point.y);
    if (hitIndex !== -1) {
      balls.splice(hitIndex, 1);
    } else if (balls.length < MAX_BALLS) {
      addBall(point.x, point.y, true);
    }
    requestFrame();
  });

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * devicePixelRatio));
    canvas.height = Math.max(1, Math.round(height * devicePixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function seedBalls() {
    balls.length = 0;
    for (let i = 0; i < STARTING_BALLS; i++) {
      addBall(
        width * (0.25 + Math.random() * 0.5),
        height * (0.24 + Math.random() * 0.52),
        false,
      );
    }
    separateOverlappingBalls();
  }

  function addBall(x, y, launched) {
    const radius = 10 + Math.random() * 9;
    const ball = {
      x: clamp(x, radius, Math.max(radius, width - radius)),
      y: clamp(y, radius, Math.max(radius, height - radius)),
      vx: launched ? (Math.random() - 0.5) * 55 : (Math.random() - 0.5) * 25,
      vy: launched ? (Math.random() - 0.5) * 55 : (Math.random() - 0.5) * 25,
      radius,
      mass: radius * radius,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    balls.push(ball);
  }

  function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function findBall(x, y) {
    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      if (Math.hypot(x - ball.x, y - ball.y) <= ball.radius) return i;
    }
    return -1;
  }

  function update(deltaTime) {
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];
      for (let j = i + 1; j < balls.length; j++) {
        const other = balls[j];
        const dx = other.x - ball.x;
        const dy = other.y - ball.y;
        const distanceSquared = dx * dx + dy * dy + SOFTENING;
        const distance = Math.sqrt(distanceSquared);
        const nx = dx / distance;
        const ny = dy / distance;
        const force = GRAVITY * ball.mass * other.mass / distanceSquared;

        ball.vx += (force * nx / ball.mass) * deltaTime;
        ball.vy += (force * ny / ball.mass) * deltaTime;
        other.vx -= (force * nx / other.mass) * deltaTime;
        other.vy -= (force * ny / other.mass) * deltaTime;
      }
    }

    for (const ball of balls) {
      ball.x += ball.vx * deltaTime;
      ball.y += ball.vy * deltaTime;
      keepInside(ball);
    }

    resolveCollisions();
  }

  function resolveCollisions() {
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.hypot(dx, dy);
          const minimumDistance = a.radius + b.radius;
          if (distance >= minimumDistance) continue;

          const nx = distance > 0.001 ? dx / distance : 1;
          const ny = distance > 0.001 ? dy / distance : 0;
          const overlap = minimumDistance - Math.max(distance, 0.001);
          const totalMass = a.mass + b.mass;
          a.x -= nx * overlap * (b.mass / totalMass);
          a.y -= ny * overlap * (b.mass / totalMass);
          b.x += nx * overlap * (a.mass / totalMass);
          b.y += ny * overlap * (a.mass / totalMass);

          const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (relativeVelocity >= 0) continue;
          const impulse = -(1 + RESTITUTION) * relativeVelocity / (1 / a.mass + 1 / b.mass);
          a.vx -= impulse * nx / a.mass;
          a.vy -= impulse * ny / a.mass;
          b.vx += impulse * nx / b.mass;
          b.vy += impulse * ny / b.mass;
        }
      }
    }
    balls.forEach(keepInside);
  }

  function keepInside(ball) {
    if (ball.x < ball.radius) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx) * RESTITUTION;
    } else if (ball.x > width - ball.radius) {
      ball.x = width - ball.radius;
      ball.vx = -Math.abs(ball.vx) * RESTITUTION;
    }
    if (ball.y < ball.radius) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy) * RESTITUTION;
    } else if (ball.y > height - ball.radius) {
      ball.y = height - ball.radius;
      ball.vy = -Math.abs(ball.vy) * RESTITUTION;
    }
  }

  function separateOverlappingBalls() {
    for (let pass = 0; pass < 5; pass++) resolveCollisions();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (const ball of balls) {
      const glow = context.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius * 2.8);
      glow.addColorStop(0, `${ball.color}55`);
      glow.addColorStop(1, `${ball.color}00`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius * 2.8, 0, Math.PI * 2);
      context.fill();

      const fill = context.createRadialGradient(
        ball.x - ball.radius * 0.35,
        ball.y - ball.radius * 0.4,
        ball.radius * 0.1,
        ball.x,
        ball.y,
        ball.radius,
      );
      fill.addColorStop(0, '#ffffffcc');
      fill.addColorStop(0.2, ball.color);
      fill.addColorStop(1, '#080a0ecc');
      context.fillStyle = fill;
      context.strokeStyle = ball.color;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }
    context.restore();
  }

  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    lastTime = 0;
  }

  function requestFrame() {
    if (!animationFrame && visible && pageVisible && !reducedMotion.matches) {
      animationFrame = requestAnimationFrame(render);
    } else if (reducedMotion.matches) {
      draw();
    }
  }

  function render(time) {
    animationFrame = 0;
    if (!visible || !pageVisible || reducedMotion.matches) return;
    const deltaTime = lastTime ? Math.min((time - lastTime) / 1000, 0.033) : 0.016;
    lastTime = time;
    update(deltaTime);
    draw();
    requestFrame();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  resize();
})();
