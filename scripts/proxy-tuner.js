(() => {
  const canvas = document.getElementById('proxyTunerCanvas');
  if (!canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visual = canvas.closest('.visual-proxy');
  if (!visual) return;

  const TAU = Math.PI * 2;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;

  class ProxyTunerPreview {
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
      this.client = { x: 0.12, y: 0.5 };
      this.distributor = { x: 0.47, y: 0.5 };
      this.outbounds = [
        { x: 0.84, y: 0.2, color: '#d5ff4f' },
        { x: 0.9, y: 0.5, color: '#91baff' },
        { x: 0.84, y: 0.8, color: '#ff765c' },
      ];
      this.packets = Array.from({ length: 15 }, (_, index) => ({
        progress: (index / 15 + 0.04) % 1,
        speed: 0.12 + (index % 4) * 0.012,
        route: index % this.outbounds.length,
      }));

      if (!this.ctx) return;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.visual);
      this.visibilityObserver = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        this.updateLoop();
      }, { threshold: 0.2 });
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

    point(node) {
      return {
        x: node.x * this.width + (this.pointer.x - 0.5) * 4,
        y: node.y * this.height + (this.pointer.y - 0.5) * 4,
      };
    }

    draw(delta) {
      if (!this.ctx || !this.width || !this.height) return;
      this.phase += delta;
      this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, 0.08);
      this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, 0.08);
      this.packets.forEach((packet) => {
        packet.progress = (packet.progress + delta * packet.speed) % 1;
      });
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawBackground();
      this.drawRoutes();
      this.drawPackets();
      this.drawNodes();
      this.drawLabels();
    }

    drawBackground() {
      const { ctx, width, height } = this;
      const background = ctx.createRadialGradient(width * 0.48, height * 0.5, 0, width * 0.48, height * 0.5, width * 0.75);
      background.addColorStop(0, '#263146');
      background.addColorStop(0.6, '#151b29');
      background.addColorStop(1, '#0e121b');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(240,238,232,.07)';
      for (let x = 10; x < width; x += 24) ctx.fillRect(x, 0, 1, height);
      for (let y = 10; y < height; y += 24) ctx.fillRect(0, y, width, 1);
    }

    drawRoutes() {
      const { ctx } = this;
      const client = this.point(this.client);
      const distributor = this.point(this.distributor);
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(145,186,255,.55)';
      ctx.beginPath();
      ctx.moveTo(client.x, client.y);
      ctx.quadraticCurveTo(lerp(client.x, distributor.x, 0.5), client.y, distributor.x, distributor.y);
      ctx.stroke();
      this.outbounds.forEach((outbound) => {
        const end = this.point(outbound);
        ctx.strokeStyle = `${outbound.color}66`;
        ctx.beginPath();
        ctx.moveTo(distributor.x, distributor.y);
        ctx.bezierCurveTo(this.width * 0.6, distributor.y, this.width * 0.66, end.y, end.x, end.y);
        ctx.stroke();
      });
      ctx.restore();
    }

    routePoint(progress, route) {
      const client = this.point(this.client);
      const distributor = this.point(this.distributor);
      const outbound = this.point(this.outbounds[route]);
      if (progress < 0.38) {
        const amount = progress / 0.38;
        return {
          x: lerp(client.x, distributor.x, amount),
          y: lerp(client.y, distributor.y, amount),
        };
      }
      const amount = (progress - 0.38) / 0.62;
      const inverse = 1 - amount;
      const controlOne = { x: this.width * 0.6, y: distributor.y };
      const controlTwo = { x: this.width * 0.66, y: outbound.y };
      return {
        x: inverse ** 3 * distributor.x + 3 * inverse ** 2 * amount * controlOne.x + 3 * inverse * amount ** 2 * controlTwo.x + amount ** 3 * outbound.x,
        y: inverse ** 3 * distributor.y + 3 * inverse ** 2 * amount * controlOne.y + 3 * inverse * amount ** 2 * controlTwo.y + amount ** 3 * outbound.y,
      };
    }

    drawPackets() {
      const { ctx } = this;
      this.packets.forEach((packet) => {
        const point = this.routePoint(packet.progress, packet.route);
        const color = this.outbounds[packet.route].color;
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.3, 0, TAU);
        ctx.fill();
        ctx.restore();
      });
    }

    drawNodes() {
      const { ctx } = this;
      const nodes = [
        [this.client, '#91baff', 6],
        [this.distributor, '#f0eee8', 8],
        ...this.outbounds.map((node) => [node, node.color, 7]),
      ];
      nodes.forEach(([node, color, radius]) => {
        const point = this.point(node);
        ctx.save();
        ctx.fillStyle = '#0e121b';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius + 5, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    drawLabels() {
      const { ctx, width, height } = this;
      ctx.save();
      ctx.font = `${Math.max(8, Math.min(10, width / 45))}px 'DM Mono', monospace`;
      ctx.fillStyle = 'rgba(145,186,255,.86)';
      ctx.fillText('CLIENT', width * 0.05, height * 0.1);
      ctx.fillStyle = 'rgba(240,238,232,.86)';
      ctx.fillText('DISTRIBUTER', width * 0.36, height * 0.1);
      ctx.fillStyle = 'rgba(213,255,79,.86)';
      ctx.fillText('OUTBOUNDS', width * 0.73, height * 0.1);
      ctx.fillStyle = 'rgba(240,238,232,.36)';
      ctx.fillText('TRAFFIC SPLIT', width * 0.39, height * 0.94);
      ctx.restore();
    }
  }

  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      lazyObserver.unobserve(entry.target);
      new ProxyTunerPreview(entry.target);
    });
  }, { threshold: 0.2 });

  lazyObserver.observe(canvas);
})();
