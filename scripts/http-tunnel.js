(() => {
  const canvas = document.getElementById('httpTunnelCanvas');
  if (!canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visual = canvas.closest('.visual-tunnel');
  if (!visual) return;

  const TAU = Math.PI * 2;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;

  class HttpTunnelPreview {
    constructor(target) {
      this.canvas = target;
      this.ctx = target.getContext('2d', { alpha: true });
      this.visual = visual;
      this.visible = false;
      this.pageVisible = !document.hidden;
      this.running = false;
      this.frame = 0;
      this.lastTime = 0;
      this.width = 0;
      this.height = 0;
      this.phase = 0;
      this.pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
      this.requests = Array.from({ length: 3 }, (_, index) => ({
        progress: (index * 0.34 + 0.05) % 1,
        speed: 0.18 + index * 0.015,
      }));
      this.responses = Array.from({ length: 3 }, (_, index) => ({
        progress: (index * 0.34 + 0.46) % 1,
        speed: 0.16 + index * 0.014,
      }));

      if (!this.ctx) return;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.visual);
      this.visibilityObserver = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.35;
        if (this.visible) requestAnimationFrame(() => this.resize());
        this.updateLoop();
      }, { threshold: 0.35 });
      this.visibilityObserver.observe(this.visual);
      this.bindEvents();
      this.resize();
      this.draw(0);
    }

    bindEvents() {
      this.canvas.addEventListener('pointermove', (event) => {
        const bounds = this.canvas.getBoundingClientRect();
        this.pointer.targetX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
        this.pointer.targetY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      });
      this.canvas.addEventListener('pointerleave', () => {
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

    point(x, y) {
      return {
        x: x * this.width + (this.pointer.x - 0.5) * 4,
        y: y * this.height + (this.pointer.y - 0.5) * 4,
      };
    }

    draw(delta) {
      if (!this.ctx || !this.width || !this.height) return;
      this.phase += delta;
      this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, 0.08);
      this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, 0.08);
      this.requests.forEach((packet) => {
        packet.progress = (packet.progress + delta * packet.speed) % 1;
      });
      this.responses.forEach((packet) => {
        packet.progress = (packet.progress + delta * packet.speed) % 1;
      });
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawBackground();
      this.drawTunnel();
      this.drawPackets(this.requests, '#ff765c', false);
      this.drawPackets(this.responses, '#d5ff4f', true);
      this.drawNodes();
    }

    drawBackground() {
      const { ctx, width, height } = this;
      const background = ctx.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, '#18253a');
      background.addColorStop(0.5, '#101722');
      background.addColorStop(1, '#281b2b');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(145,186,255,.08)';
      for (let x = 12; x < width; x += 24) ctx.fillRect(x, 0, 1, height);
      for (let y = 12; y < height; y += 24) ctx.fillRect(0, y, width, 1);
    }

    drawTunnel() {
      const { ctx, width, height } = this;
      const left = this.point(0.18, 0.5);
      const right = this.point(0.82, 0.5);
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(145,186,255,.28)';
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();
      for (let index = 0; index < 4; index += 1) {
        const inset = index * 0.055;
        ctx.strokeStyle = index % 2 ? 'rgba(213,255,79,.32)' : 'rgba(255,118,92,.34)';
        ctx.beginPath();
        ctx.moveTo(width * (0.22 + inset), height * (0.5 - index * 0.035));
        ctx.lineTo(width * (0.78 - inset), height * (0.5 + index * 0.035));
        ctx.stroke();
      }
      ctx.restore();
    }

    drawPackets(packets, color, reverse) {
      const { ctx } = this;
      const startX = reverse ? 0.82 : 0.18;
      const endX = reverse ? 0.18 : 0.82;
      packets.forEach((packet) => {
        const point = this.point(lerp(startX, endX, packet.progress), 0.5);
        const tail = this.point(lerp(startX, endX, Math.max(0, packet.progress - 0.12)), 0.5);
        ctx.save();
        const trail = ctx.createLinearGradient(tail.x, tail.y, point.x, point.y);
        trail.addColorStop(0, 'rgba(255,255,255,0)');
        trail.addColorStop(1, `${color}bb`);
        ctx.strokeStyle = trail;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.8, 0, TAU);
        ctx.fill();
        ctx.restore();
      });
    }

    drawNodes() {
      const nodes = [
        [0.18, '#91baff', 15],
        [0.82, '#ff765c', 15],
      ];
      nodes.forEach(([x, color, radius]) => {
        const point = this.point(x, 0.5);
        this.ctx.save();
        this.ctx.fillStyle = '#101722';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius, 0, TAU);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx.globalAlpha = 0.22;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius + 7, 0, TAU);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      });
    }

  }

  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      lazyObserver.unobserve(entry.target);
      new HttpTunnelPreview(entry.target);
    });
  }, { threshold: 0.35 });

  lazyObserver.observe(canvas);
})();
