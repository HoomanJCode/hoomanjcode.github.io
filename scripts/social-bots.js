(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvases = [
    { id: 'instagramBotCanvas', type: 'instagram' },
    { id: 'youtubeBotCanvas', type: 'youtube' },
  ];

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  class SocialBotPreview {
    constructor(canvas, type) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });
      this.type = type;
      this.visual = canvas.closest('.project-visual');
      this.visible = false;
      this.pageVisible = !document.hidden;
      this.running = false;
      this.frame = 0;
      this.lastTime = 0;
      this.width = 0;
      this.height = 0;
      this.pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, active: false };
      this.phase = type === 'instagram' ? 0.7 : 2.1;
      this.particles = Array.from({ length: type === 'instagram' ? 18 : 24 }, (_, index) => ({
        seed: index * 1.73 + this.phase,
        x: (index * 0.6180339887 + this.phase) % 1,
        y: (index * 0.3819660113 + this.phase * 0.3) % 1,
        size: 1.5 + (index % 4) * 1.2,
        speed: 0.12 + (index % 5) * 0.025,
      }));

      if (!this.ctx || !this.visual) return;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.visual);
      this.intersectionObserver = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        this.updateLoop();
      }, { threshold: 0.2 });
      this.intersectionObserver.observe(this.visual);
      this.bindEvents();
      this.resize();
      this.draw(0);
    }

    bindEvents() {
      this.canvas.addEventListener('pointerenter', () => {
        this.pointer.active = true;
        this.updateLoop();
      });
      this.canvas.addEventListener('pointermove', (event) => {
        const bounds = this.canvas.getBoundingClientRect();
        this.pointer.targetX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
        this.pointer.targetY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
        this.pointer.active = true;
        if (reducedMotion.matches) this.draw(0);
        else this.updateLoop();
      });
      this.canvas.addEventListener('pointerleave', () => {
        this.pointer.active = false;
        this.pointer.targetX = 0.5;
        this.pointer.targetY = 0.5;
      });
      document.addEventListener('visibilitychange', () => {
        this.pageVisible = !document.hidden;
        this.updateLoop();
      });
      reducedMotion.addEventListener?.('change', () => {
        this.lastTime = 0;
        this.updateLoop();
        if (reducedMotion.matches) this.draw(0);
      });
    }

    resize() {
      const bounds = this.visual.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(width * scale);
      this.canvas.height = Math.round(height * scale);
      this.canvas.style.aspectRatio = `${width} / ${height}`;
      this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
      this.width = width;
      this.height = height;
      this.draw(0);
    }

    updateLoop() {
      const shouldRun = this.visible && this.pageVisible && !reducedMotion.matches;
      if (shouldRun && !this.running) {
        this.running = true;
        this.lastTime = 0;
        this.frame = requestAnimationFrame((time) => this.tick(time));
      } else if (!shouldRun && this.running) {
        cancelAnimationFrame(this.frame);
        this.running = false;
        this.lastTime = 0;
      }
    }

    tick(time) {
      if (!this.running) return;
      const delta = this.lastTime ? Math.min((time - this.lastTime) / 1000, 0.05) : 0;
      this.lastTime = time;
      this.draw(delta);
      this.frame = requestAnimationFrame((nextTime) => this.tick(nextTime));
    }

    draw(delta) {
      if (!this.ctx || !this.width || !this.height) return;
      this.phase += delta;
      this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, 0.08);
      this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, 0.08);
      this.ctx.clearRect(0, 0, this.width, this.height);
      if (this.type === 'instagram') this.drawInstagram();
      else this.drawYoutube();
    }

    drawInstagram() {
      const { ctx, width, height, pointer } = this;
      const px = (pointer.x - 0.5) * width;
      const py = (pointer.y - 0.5) * height;
      const background = ctx.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, '#422348');
      background.addColorStop(0.48, '#1d2949');
      background.addColorStop(1, '#bd5b70');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.translate(px * 0.08, py * 0.08);
      ctx.rotate(-0.08 + px / width * 0.03);
      for (let x = -height; x < width + height; x += 24) {
        ctx.fillStyle = x % 48 ? '#91baff' : '#d5ff4f';
        ctx.fillRect(x, -height, 1, height * 3);
      }
      ctx.restore();

      const tiles = [
        [-0.18, -0.13, 0.32, '#ff765c', '#d5ff4f'],
        [0.12, -0.2, 0.26, '#91baff', '#f0eee8'],
        [0.28, 0.17, 0.34, '#d5ff4f', '#ff765c'],
        [-0.22, 0.22, 0.24, '#f0eee8', '#91baff'],
      ];
      tiles.forEach(([offsetX, offsetY, sizeFactor, colorA, colorB], index) => {
        const size = Math.min(width, height) * sizeFactor;
        const x = width * (0.5 + offsetX) + px * (0.025 + index * 0.008) - size / 2;
        const y = height * (0.5 + offsetY) + py * (0.02 + index * 0.006) - size / 2;
        ctx.save();
        ctx.translate(x + size / 2, y + size / 2);
        ctx.rotate((index - 1.5) * 0.12 + px / width * 0.08);
        roundedRect(ctx, -size / 2, -size / 2, size, size, size * 0.14);
        ctx.clip();
        const tile = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
        tile.addColorStop(0, colorA);
        tile.addColorStop(1, colorB);
        ctx.fillStyle = tile;
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#080a0e';
        ctx.beginPath();
        ctx.arc(size * 0.3, -size * 0.12, size * 0.17, 0, Math.PI * 2);
        ctx.arc(-size * 0.18, size * 0.18, size * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#f0eee8';
        ctx.lineWidth = Math.max(1, size * 0.025);
        ctx.strokeRect(-size * 0.27, -size * 0.27, size * 0.54, size * 0.54);
        ctx.restore();
      });

      const glow = ctx.createRadialGradient(pointer.x * width, pointer.y * height, 0, pointer.x * width, pointer.y * height, width * 0.4);
      glow.addColorStop(0, 'rgba(213,255,79,.35)');
      glow.addColorStop(1, 'rgba(213,255,79,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      this.drawParticles('#f0eee8', 0.28);
    }

    drawYoutube() {
      const { ctx, width, height, pointer } = this;
      const px = (pointer.x - 0.5) * width;
      const py = (pointer.y - 0.5) * height;
      const background = ctx.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, '#481d28');
      background.addColorStop(0.5, '#171a25');
      background.addColorStop(1, '#080a0e');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + px * 0.12, height / 2 + py * 0.12);
      ctx.rotate(px / width * 0.08);
      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = '#ff765c';
      ctx.lineWidth = 1;
      for (let index = 0; index < 12; index += 1) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(index * 0.52) * width, Math.sin(index * 0.52) * height);
        ctx.stroke();
      }
      ctx.restore();

      const buttonWidth = width * 0.46;
      const buttonHeight = height * 0.3;
      const buttonX = width / 2 - buttonWidth / 2 + px * 0.1;
      const buttonY = height / 2 - buttonHeight / 2 + py * 0.1;
      ctx.save();
      roundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight * 0.28);
      ctx.fillStyle = '#ff765c';
      ctx.shadowColor = 'rgba(255,118,92,.65)';
      ctx.shadowBlur = width * 0.06;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(buttonX + buttonWidth * 0.44, buttonY + buttonHeight * 0.27);
      ctx.lineTo(buttonX + buttonWidth * 0.44, buttonY + buttonHeight * 0.73);
      ctx.lineTo(buttonX + buttonWidth * 0.7, buttonY + buttonHeight * 0.5);
      ctx.closePath();
      ctx.fillStyle = '#f0eee8';
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(213,255,79,.72)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let index = 0; index <= 34; index += 1) {
        const x = width * 0.12 + (width * 0.76 * index) / 34;
        const wave = Math.sin(index * 0.9 + this.phase * 3) * height * 0.025;
        const pulse = Math.cos(index * 0.35 + pointer.x * 4) * height * 0.018;
        const y = height * 0.84 + wave + pulse + py * 0.025;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      this.drawParticles('#91baff', 0.62);
    }

    drawParticles(color, opacity) {
      const { ctx, width, height, pointer } = this;
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      this.particles.forEach((particle) => {
        const x = ((particle.x + Math.sin(this.phase * particle.speed + particle.seed) * 0.04 + pointer.x * 0.025) % 1) * width;
        const y = ((particle.y + Math.cos(this.phase * particle.speed * 0.8 + particle.seed) * 0.04 + pointer.y * 0.018) % 1) * height;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const config = canvases.find(({ id }) => id === entry.target.id);
      if (!config) return;
      lazyObserver.unobserve(entry.target);
      new SocialBotPreview(entry.target, config.type);
    });
  }, { threshold: 0.2 });

  canvases.forEach(({ id }) => {
    const canvas = document.getElementById(id);
    if (canvas) lazyObserver.observe(canvas);
  });
})();
