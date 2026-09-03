(() => {
  const canvas = document.getElementById('fxPlanetCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visual = canvas.closest('.visual-planet');
  if (!visual) return;
  const palettes = [
    [[145, 186, 255], [213, 255, 79], [255, 118, 92], [240, 238, 232]],
    [[213, 255, 79], [145, 186, 255], [240, 238, 232], [255, 118, 92]],
    [[255, 118, 92], [240, 238, 232], [145, 186, 255], [213, 255, 79]],
    [[240, 238, 232], [255, 118, 92], [213, 255, 79], [145, 186, 255]],
  ];

  let seed = Math.floor(Math.random() * 2147483647);
  const starSeed = seed;
  let visible = true;
  let timer = 0;
  let currentFrame = 0;

  const mix = (a, b, amount) => a + (b - a) * amount;
  const smooth = (value) => value * value * (3 - 2 * value);

  function random(seedValue) {
    const value = Math.sin(seedValue * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }

  function gridNoise(x, y, scale, offset) {
    const px = x * scale;
    const py = y * scale;
    const x0 = Math.floor(px);
    const y0 = Math.floor(py);
    const tx = smooth(px - x0);
    const ty = smooth(py - y0);
    const top = mix(random(x0 * 374761 + y0 * 668265 + offset), random((x0 + 1) * 374761 + y0 * 668265 + offset), tx);
    const bottom = mix(random(x0 * 374761 + (y0 + 1) * 668265 + offset), random((x0 + 1) * 374761 + (y0 + 1) * 668265 + offset), tx);
    return mix(top, bottom, ty);
  }

  function layeredNoise(x, y, offset) {
    let value = 0;
    let amplitude = 0.55;
    let frequency = 2.2;
    let total = 0;
    for (let layer = 0; layer < 4; layer += 1) {
      value += gridNoise(x, y, frequency, offset + layer * 971) * amplitude;
      total += amplitude;
      frequency *= 2.03;
      amplitude *= 0.48;
    }
    return value / total;
  }

  function drawPlanet(nextSeed) {
    const bounds = visual.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.round(width * dpr));
    const pixelHeight = Math.max(1, Math.round(height * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.clearRect(0, 0, pixelWidth, pixelHeight);

    // Draw procedural starfield
    const starCount = 280;
    for (let s = 0; s < starCount; s += 1) {
      const sx = random(starSeed + s * 3 + 7001) * pixelWidth;
      const sy = random(starSeed + s * 3 + 7002) * pixelHeight;
      const bright = random(starSeed + s * 3 + 7004);
      const isBright = bright > 0.85;
      const sr = isBright ? (1.4 + random(starSeed + s * 3 + 7003) * 0.8) : (0.35 + random(starSeed + s * 3 + 7003) * 0.65);
      const sb = isBright ? (0.85 + bright * 0.15) : (0.25 + bright * 0.55);
      const colorChoice = random(starSeed + s * 3 + 7005);
      let sc;
      if (colorChoice < 0.55) sc = [240, 238, 232];
      else if (colorChoice < 0.75) sc = [145, 186, 255];
      else if (colorChoice < 0.88) sc = [213, 255, 79];
      else sc = [255, 118, 92];
      ctx.globalAlpha = sb;
      ctx.fillStyle = `rgb(${sc[0]}, ${sc[1]}, ${sc[2]})`;
      if (isBright) {
        ctx.shadowColor = `rgba(${sc[0]}, ${sc[1]}, ${sc[2]}, .8)`;
        ctx.shadowBlur = 8 * dpr;
      }
      ctx.beginPath();
      ctx.arc(sx, sy, sr * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    const size = Math.round(Math.min(pixelWidth, pixelHeight) * (0.39 + random(nextSeed + 41) * 0.08));
    const palette = palettes[Math.floor(random(nextSeed + 17) * palettes.length)];
    const rotation = (random(nextSeed + 23) - 0.5) * 0.5;
    const lightX = -0.55 + random(nextSeed + 31) * 0.45;
    const lightY = -0.65 + random(nextSeed + 37) * 0.5;
    const resolution = Math.max(120, Math.min(250, Math.round(size / dpr)));
    const image = ctx.createImageData(resolution, resolution);
    const pixels = image.data;

    for (let py = 0; py < resolution; py += 1) {
      for (let px = 0; px < resolution; px += 1) {
        const nx = (px / (resolution - 1)) * 2 - 1;
        const ny = (py / (resolution - 1)) * 2 - 1;
        const radius = Math.sqrt(nx * nx + ny * ny);
        const index = (py * resolution + px) * 4;
        if (radius > 1) {
          pixels[index + 3] = 0;
          continue;
        }

        const warpX = (layeredNoise(nx * 0.5 + 0.4, ny * 0.5 + 0.6, nextSeed + 101) - 0.5) * 0.26;
        const warpY = (layeredNoise(nx * 0.5 + 1.2, ny * 0.5 + 0.2, nextSeed + 211) - 0.5) * 0.26;
        const x = nx + warpX;
        const y = ny + warpY;
        const broad = layeredNoise(x * 0.5 + 0.5, y * 0.5 + 0.5, nextSeed + 307);
        const medium = layeredNoise(x * 1.15 + 0.7, y * 1.15 + 0.1, nextSeed + 401);
        const fine = layeredNoise(x * 2.8 + 0.2, y * 2.8 + 0.8, nextSeed + 503);
        const ridges = 1 - Math.abs(2 * layeredNoise(x * 1.7 + 0.3, y * 1.7 + 0.9, nextSeed + 601) - 1);
        const shape = broad * 0.53 + medium * 0.29 + fine * 0.1 + ridges * 0.08;
        const contour = Math.sin((shape * 8 + broad * 2.5) * Math.PI);
        const diffuse = Math.max(0, 1 - radius);
        const light = Math.max(0.44, Math.min(1.08, 0.78 + (nx * lightX + ny * lightY) * 0.42 + diffuse * 0.12));

        let color;
        if (shape > 0.64) color = palette[1];
        else if (shape > 0.52) color = palette[2];
        else if (fine > 0.58 && medium > 0.44) color = palette[3];
        else color = palette[0];

        const texture = contour > 0.5 ? 1.08 : contour < -0.5 ? 0.86 : 1;
        pixels[index] = Math.min(255, color[0] * light * texture);
        pixels[index + 1] = Math.min(255, color[1] * light * texture);
        pixels[index + 2] = Math.min(255, color[2] * light * texture);
        pixels[index + 3] = 255;
      }
    }

    const texture = document.createElement('canvas');
    texture.width = resolution;
    texture.height = resolution;
    texture.getContext('2d').putImageData(image, 0, 0);

    ctx.save();
    ctx.translate(pixelWidth / 2, pixelHeight / 2);
    ctx.rotate(rotation);
    ctx.globalAlpha = 0.28;
    ctx.filter = `blur(${Math.max(8, size * 0.055)}px)`;
    ctx.drawImage(texture, -size * 0.53, -size * 0.53, size * 1.06, size * 1.06);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(texture, -size / 2, -size / 2, size, size);
    ctx.restore();

    ctx.save();
    ctx.translate(pixelWidth / 2, pixelHeight / 2);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240, 238, 232, .56)';
    ctx.lineWidth = Math.max(1, dpr * 1.5);
    ctx.stroke();
    ctx.restore();

    currentFrame += 1;
    canvas.dataset.generation = String(currentFrame);
  }

  function regenerate() {
    if (!visible) return;
    seed = Math.floor(Math.random() * 2147483647);
    drawPlanet(seed);
  }

  function startRegeneration() {
    window.clearInterval(timer);
    if (!reducedMotion.matches) timer = window.setInterval(regenerate, 5000);
  }

  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) {
      if (!canvas.dataset.generation) drawPlanet(seed);
      startRegeneration();
    } else {
      window.clearInterval(timer);
    }
  }, { threshold: 0.05 });

  observer.observe(visual);
  reducedMotion.addEventListener?.('change', startRegeneration);
  window.addEventListener('resize', () => drawPlanet(seed), { passive: true });

  // Use ResizeObserver to draw once the container has real dimensions,
  // handling the case where getBoundingClientRect() initially returns
  // zero (e.g. inside a hidden/reveal element before first paint).
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        drawPlanet(seed);
        ro.disconnect();
      }
    });
    ro.observe(visual);
  } else {
    // Fallback: wait a frame to let layout settle
    requestAnimationFrame(() => drawPlanet(seed));
  }
})();
