(() => {
  const canvas = document.getElementById('v2PortalCanvas');
  if (!canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visual = canvas.closest('.visual-portal');
  if (!visual) return;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const TAU = Math.PI * 2;

  class V2PortalPreview {
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
      this.nodes = {
        clients: [
          { x: 0.22, y: 0.3 }, { x: 0.22, y: 0.5 }, { x: 0.22, y: 0.7 },
        ],
        inbounds: [
          { x: 0.43, y: 0.38 }, { x: 0.43, y: 0.62 },
        ],
        outbounds: [
          { x: 0.76, y: 0.3, weight: 0.44 }, { x: 0.78, y: 0.5, weight: 0.34 }, { x: 0.76, y: 0.7, weight: 0.22 },
        ],
      };
      this.traffic = Array.from({ length: 18 }, (_, index) => ({
        progress: (index / 18 + 0.04) % 1,
        speed: 0.1 + (index % 4) * 0.014,
        route: index % 3,
        offset: (index % 5) * 0.18,
      }));

      if (!this.ctx) return;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.visual);
      this.visibilityObserver = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        if (this.visible) {
          requestAnimationFrame(() => this.resize());
        }
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

    draw(delta) {
      if (!this.ctx || !this.width || !this.height) return;
      this.phase += delta;
      this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, 0.08);
      this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, 0.08);
      this.traffic.forEach((packet) => {
        packet.progress = (packet.progress + delta * packet.speed) % 1;
      });
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawBackground();
      this.drawRoutes();
      this.drawTraffic();
      this.drawNodes();
    }

    point(node) {
      return {
        x: clamp(node.x * this.width + (this.pointer.x - 0.5) * 5, 22, this.width - 22),
        y: clamp(node.y * this.height + (this.pointer.y - 0.5) * 4, 22, this.height - 22),
      };
    }

    drawBackground() {
      const { ctx, width, height } = this;
      const background = ctx.createRadialGradient(width * 0.52, height * 0.5, 0, width * 0.52, height * 0.5, width * 0.72);
      background.addColorStop(0, '#202e46');
      background.addColorStop(0.56, '#111827');
      background.addColorStop(1, '#0b111c');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(145,186,255,.08)';
      for (let x = 12; x < width; x += 24) ctx.fillRect(x, 0, 1, height);
      for (let y = 12; y < height; y += 24) ctx.fillRect(0, y, width, 1);
    }

    routePath(from, inbound, outbound, bend) {
      const start = this.point(from);
      const middle = this.point(inbound);
      const end = this.point(outbound);
      const controlOneX = lerp(start.x, middle.x, 0.55);
      const controlTwoX = lerp(middle.x, end.x, 0.45);
      const controlY = bend * this.height;
      return { start, middle, end, controlOneX, controlTwoX, controlY };
    }

    drawRoutes() {
      const { ctx } = this;
      ctx.save();
      ctx.lineWidth = 1;
      this.nodes.clients.forEach((client, clientIndex) => {
        this.nodes.inbounds.forEach((inbound, inboundIndex) => {
          const start = this.point(client);
          const end = this.point(inbound);
          ctx.strokeStyle = 'rgba(145,186,255,.22)';
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(lerp(start.x, end.x, 0.5), start.y, end.x, end.y);
          ctx.stroke();
        });
      });
      this.nodes.inbounds.forEach((inbound, inboundIndex) => {
        this.nodes.outbounds.forEach((outbound, outboundIndex) => {
          const start = this.point(inbound);
          const end = this.point(outbound);
          const bend = inboundIndex === 0 ? outbound.y - 0.1 : outbound.y + 0.1;
          const path = this.routePath(inbound, inbound, outbound, bend);
          ctx.strokeStyle = outboundIndex === 1 ? 'rgba(213,255,79,.43)' : 'rgba(255,118,92,.36)';
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.bezierCurveTo(path.controlOneX, path.controlY, path.controlTwoX, path.controlY, end.x, end.y);
          ctx.stroke();
        });
      });
      ctx.restore();
    }

    cubicPoint(path, progress) {
      const p = progress;
      const inverse = 1 - p;
      return {
        x: inverse ** 3 * path.start.x + 3 * inverse ** 2 * p * path.controlOneX + 3 * inverse * p ** 2 * path.controlTwoX + p ** 3 * path.end.x,
        y: inverse ** 3 * path.start.y + 3 * inverse ** 2 * p * path.controlY + 3 * inverse * p ** 2 * path.controlY + p ** 3 * path.end.y,
      };
    }

    drawTraffic() {
      const { ctx } = this;
      this.traffic.forEach((packet, index) => {
        const inbound = this.nodes.inbounds[index % this.nodes.inbounds.length];
        const outbound = this.nodes.outbounds[packet.route];
        const client = this.nodes.clients[index % this.nodes.clients.length];
        const inboundProgress = clamp(packet.progress * 2, 0, 1);
        let point;
        if (packet.progress < 0.5) {
          const start = this.point(client);
          const end = this.point(inbound);
          point = {
            x: lerp(start.x, end.x, inboundProgress),
            y: lerp(start.y, end.y, inboundProgress),
          };
        } else {
          const path = this.routePath(inbound, inbound, outbound, inbound.y + (outbound.y - inbound.y) * 0.5);
          point = this.cubicPoint(path, (packet.progress - 0.5) * 2);
        }
        const color = packet.route === 1 ? '#d5ff4f' : packet.route === 0 ? '#ff765c' : '#91baff';
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.2, 0, TAU);
        ctx.fill();
        ctx.restore();
      });
    }

    drawNodes() {
      const { ctx } = this;
      const groups = [
        ['clients', '#91baff'],
        ['inbounds', '#ff765c'],
        ['outbounds', '#d5ff4f'],
      ];
      groups.forEach(([group, color]) => {
        this.nodes[group].forEach((node) => {
          const point = this.point(node);
          ctx.save();
          ctx.fillStyle = '#0b111c';
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.shadowColor = color;
          ctx.shadowBlur = 9;
          ctx.beginPath();
          ctx.arc(point.x, point.y, group === 'clients' ? 6 : 9, 0, TAU);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.arc(point.x, point.y, group === 'clients' ? 11 : 15, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      });
    }

  }

  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      lazyObserver.unobserve(entry.target);
      new V2PortalPreview(entry.target);
    });
  }, { threshold: 0.2 });

  lazyObserver.observe(canvas);
})();
