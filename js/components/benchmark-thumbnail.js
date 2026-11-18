(() => {
  const canvas = document.querySelector('#benchmarkCanvas');
  const container = canvas?.closest('.visual-benchmark');
  const context = canvas?.getContext('2d');
  if (!canvas || !container || !context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colors = { acid: '#d5ff4f', blue: '#91baff', coral: '#ff765c', paper: '#f0eee8', muted: 'rgba(240,238,232,.42)' };
  let width = 0;
  let height = 0;
  let ratio = 1;
  let visible = false;
  let pageVisible = !document.hidden;
  let frame = 0;
  let elapsed = 0;
  let previousTime = 0;

  const resize = () => {
    const bounds = container.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(0);
  };
  new ResizeObserver(resize).observe(container);

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .2;
    if (visible) start(); else stop();
  }, { threshold: [0, .2] });
  observer.observe(container);
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (pageVisible && visible) start(); else stop();
  });
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) stop(); else if (visible && pageVisible) start();
  });

  function start() {
    if (frame || reducedMotion.matches || !pageVisible) return;
    previousTime = 0;
    frame = requestAnimationFrame(tick);
  }
  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    draw(0);
  }
  function tick(time) {
    if (!visible || !pageVisible || reducedMotion.matches) { frame = 0; draw(0); return; }
    if (previousTime) elapsed += Math.min((time - previousTime) / 1000, .05);
    previousTime = time;
    draw(elapsed);
    frame = requestAnimationFrame(tick);
  }
  function draw(time) {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width / 360, height / 220);
    const left = width * .29;
    const cy = height * .49;
    const orbitX = width * .185;
    const orbitY = height * .27;

    // The left panel sketches an N-body workload.
    context.save();
    context.translate(left, cy);
    context.strokeStyle = 'rgba(145,186,255,.2)';
    context.lineWidth = 1;
    context.setLineDash([3, 5]);
    context.beginPath();
    context.ellipse(0, 0, orbitX, orbitY, -.32, 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);
    context.beginPath();
    context.ellipse(0, 0, orbitX * .62, orbitY * .62, .4, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(213,255,79,.18)';
    context.stroke();
    context.shadowBlur = 18;
    context.shadowColor = colors.acid;
    context.fillStyle = colors.acid;
    context.beginPath();
    context.arc(0, 0, Math.max(3, 4 * scale), 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
    const points = [0, 2.2, 4.1].map((offset, index) => {
      const angle = time * (.52 + index * .08) + offset;
      return { x: Math.cos(angle) * orbitX, y: Math.sin(angle) * orbitY };
    });
    points.forEach((point, index) => {
      context.strokeStyle = index === 0 ? 'rgba(255,118,92,.28)' : 'rgba(145,186,255,.2)';
      context.beginPath(); context.moveTo(0, 0); context.lineTo(point.x, point.y); context.stroke();
      context.fillStyle = [colors.coral, colors.blue, colors.paper][index];
      context.shadowColor = context.fillStyle;
      context.shadowBlur = 9;
      context.beginPath(); context.arc(point.x, point.y, 3.2 * scale, 0, Math.PI * 2); context.fill();
    });
    context.restore();

    // The right panel animates the relative timings of processing strategies.
    const panelX = width * .43;
    const panelW = width * .49;
    context.strokeStyle = 'rgba(240,238,232,.12)';
    context.beginPath(); context.moveTo(width * .39, height * .2); context.lineTo(width * .39, height * .79); context.stroke();
    context.textBaseline = 'middle';
    context.font = `${Math.max(7, 8 * scale)}px ui-monospace, SFMono-Regular, monospace`;
    context.fillStyle = colors.muted;
    context.fillText('METHOD', panelX, height * .22);
    context.fillText('MS / STEP', panelX + panelW * .67, height * .22);
    const labels = ['SINGLE', 'PARALLEL', 'JOBS', 'BURST'];
    const values = [.82, .59, .7, .36];
    const swatches = [colors.coral, colors.blue, colors.paper, colors.acid];
    const rowTop = height * .36;
    const rowGap = height * .126;
    const barX = panelX + panelW * .37;
    const barW = panelW * .48;
    labels.forEach((label, index) => {
      const y = rowTop + index * rowGap;
      context.fillStyle = colors.muted;
      context.fillText(label, panelX, y);
      context.fillStyle = 'rgba(240,238,232,.07)';
      context.fillRect(barX, y - 3, barW, 6);
      const wave = reducedMotion.matches ? 0 : Math.sin(time * 1.7 - index * .62) * .035;
      const amount = Math.max(.12, values[index] + wave);
      context.fillStyle = swatches[index];
      context.globalAlpha = .78;
      context.fillRect(barX, y - 3, barW * amount, 6);
      context.globalAlpha = 1;
      context.fillStyle = colors.paper;
      context.fillText(`${(amount * 10).toFixed(1)}`, panelX + panelW * .89, y);
    });
    context.fillStyle = 'rgba(145,186,255,.65)';
    context.fillRect(panelX, height * .84, panelW * .85, 1);
    context.fillStyle = colors.muted;
    context.font = `${Math.max(7, 7 * scale)}px ui-monospace, SFMono-Regular, monospace`;
    context.fillText('WARM-UP  →  MEASURE  →  COMPARE', panelX, height * .9);
  }
})();
