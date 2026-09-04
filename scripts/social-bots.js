(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvases = [
    { id: 'instagramBotCanvas', type: 'instagram' },
    { id: 'youtubeBotCanvas', type: 'youtube' },
  ];

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const TAU = Math.PI * 2;

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
      this.phase = type === 'instagram' ? 0.7 : 2.1;
      this.pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
      this.colors = type === 'instagram'
        ? { source: '#ff765c', platform: '#d5ff4f', telegram: '#91baff', server: '#f0eee8' }
        : { source: '#ff765c', platform: '#ff765c', telegram: '#d5ff4f', server: '#91baff' };
      this.nodes = {
        urls: [{ x: 0.12, y: 0.27 }, { x: 0.1, y: 0.5 }, { x: 0.12, y: 0.73 }],
        platform: { x: 0.32, y: 0.5 },
        telegram: { x: 0.52, y: 0.5 },
        server: { x: 0.71, y: 0.5 },
        clients: [{ x: 0.9, y: 0.27 }, { x: 0.92, y: 0.5 }, { x: 0.9, y: 0.73 }],
      };
      this.packets = Array.from({ length: 18 }, (_, index) => ({
        progress: (index / 18 + 0.02) % 1,
        speed: 0.11 + (index % 4) * 0.012,
        source: index % 3,
        client: (index * 2) % 3,
      }));

      if (!this.ctx || !this.visual) return;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.visual);
      this.visibilityObserver = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        if (this.visible) requestAnimationFrame(() => this.resize());
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
      this.drawTraffic();
      this.drawNodes();
    }

    drawBackground() {
      const { ctx, width, height } = this;
      const background = ctx.createLinearGradient(0, 0, width, height);
      if (this.type === 'instagram') {
        background.addColorStop(0, '#422348');
        background.addColorStop(0.5, '#1d2949');
        background.addColorStop(1, '#3e1f34');
      } else {
        background.addColorStop(0, '#351b28');
        background.addColorStop(0.5, '#171a25');
        background.addColorStop(1, '#080a0e');
      }
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(240,238,232,.055)';
      for (let x = 10; x < width; x += 24) ctx.fillRect(x, 0, 1, height);
      for (let y = 10; y < height; y += 24) ctx.fillRect(0, y, width, 1);
    }

    drawRoutes() {
      const { ctx } = this;
      const platform = this.point(this.nodes.platform);
      const telegram = this.point(this.nodes.telegram);
      const server = this.point(this.nodes.server);
      ctx.save();
      ctx.lineWidth = 1.2;
      this.nodes.urls.forEach((url) => {
        const start = this.point(url);
        ctx.strokeStyle = 'rgba(255,118,92,.5)';
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(lerp(start.x, platform.x, 0.5), start.y, platform.x, platform.y);
        ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(213,255,79,.5)';
      ctx.beginPath();
      ctx.moveTo(platform.x, platform.y);
      ctx.lineTo(telegram.x, telegram.y);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(145,186,255,.5)';
      ctx.beginPath();
      ctx.moveTo(telegram.x, telegram.y);
      ctx.lineTo(server.x, server.y);
      ctx.stroke();
      this.nodes.clients.forEach((client) => {
        const end = this.point(client);
        ctx.strokeStyle = 'rgba(240,238,232,.38)';
        ctx.beginPath();
        ctx.moveTo(server.x, server.y);
        ctx.quadraticCurveTo(lerp(server.x, end.x, 0.5), server.y, end.x, end.y);
        ctx.stroke();
      });
      ctx.restore();
    }

    routePoint(packet) {
      const source = this.point(this.nodes.urls[packet.source]);
      const platform = this.point(this.nodes.platform);
      const telegram = this.point(this.nodes.telegram);
      const server = this.point(this.nodes.server);
      const client = this.point(this.nodes.clients[packet.client]);
      const progress = packet.progress;
      if (progress < 0.25) return this.segmentPoint(source, platform, progress / 0.25, source.y);
      if (progress < 0.5) return this.segmentPoint(platform, telegram, (progress - 0.25) / 0.25);
      if (progress < 0.72) return this.segmentPoint(telegram, server, (progress - 0.5) / 0.22);
      return this.segmentPoint(server, client, (progress - 0.72) / 0.28, server.y);
    }

    segmentPoint(start, end, progress, curveY) {
      const amount = clamp(progress, 0, 1);
      const bend = curveY === undefined ? (start.y + end.y) / 2 : curveY;
      return {
        x: lerp(start.x, end.x, amount),
        y: lerp(start.y, end.y, amount) + Math.sin(amount * Math.PI) * (bend - (start.y + end.y) / 2),
      };
    }

    drawTraffic() {
      const { ctx } = this;
      this.packets.forEach((packet) => {
        const point = this.routePoint(packet);
        const color = packet.progress < 0.25
          ? this.colors.source
          : packet.progress < 0.5
            ? this.colors.platform
            : packet.progress < 0.72
              ? this.colors.telegram
              : this.colors.server;
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.4, 0, TAU);
        ctx.fill();
        ctx.restore();
      });
    }

    drawNodes() {
      const groups = [
        [this.nodes.urls, this.colors.source, 5],
        [[this.nodes.platform], this.colors.platform, 8],
        [[this.nodes.telegram], this.colors.telegram, 8],
        [[this.nodes.server], this.colors.server, 9],
        [this.nodes.clients, '#f0eee8', 5],
      ];
      groups.forEach(([nodes, color, radius]) => {
        nodes.forEach((node) => {
          const point = this.point(node);
          this.ctx.save();
          this.ctx.fillStyle = '#0b111c';
          this.ctx.strokeStyle = color;
          this.ctx.lineWidth = 2;
          this.ctx.shadowColor = color;
          this.ctx.shadowBlur = 10;
          this.ctx.beginPath();
          this.ctx.arc(point.x, point.y, radius, 0, TAU);
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.restore();
          this.ctx.globalAlpha = 0.24;
          this.ctx.fillStyle = color;
          this.ctx.beginPath();
          this.ctx.arc(point.x, point.y, radius + 5, 0, TAU);
          this.ctx.fill();
          this.ctx.globalAlpha = 1;
        });
      });
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
