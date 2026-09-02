// Layered procedural texture visual for the FxPlanet project card.
const fxPlanet = document.querySelector('.mini-planet');
if (fxPlanet) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  const size = 220;
  canvas.width = size; canvas.height = size;
  canvas.setAttribute('aria-hidden', 'true');
  fxPlanet.replaceWith(canvas);
  canvas.className = 'mini-planet';
  const ctx = canvas.getContext('2d');
  let seed = Math.floor(Math.random() * 0xffffffff);
  let timer = 0;
  let visible = true;
  let frame = 0;
  let current = null;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const hash = (x, y, salt) => {
    let n = (x * 374761393 + y * 668265263 + salt * 1442695041) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };
  const smooth = (v) => v * v * (3 - 2 * v);
  const noise = (x, y, scale, salt) => {
    const px = x / scale, py = y / scale;
    const x0 = Math.floor(px), y0 = Math.floor(py), tx = smooth(px - x0), ty = smooth(py - y0);
    const a = hash(x0, y0, salt), b = hash(x0 + 1, y0, salt), c = hash(x0, y0 + 1, salt), d = hash(x0 + 1, y0 + 1, salt);
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  };
  const choosePlanet = () => {
    const palettes = [
      { base: [35,58,117], light: [145,186,255], land: [213,255,79], cloud: [240,238,232], accent: [255,118,92] },
      { base: [17,28,52], light: [102,142,226], land: [145,186,255], cloud: [240,238,232], accent: [213,255,79] },
      { base: [49,84,134], light: [213,255,79], land: [240,238,232], cloud: [145,186,255], accent: [255,118,92] },
      { base: [23,25,35], light: [255,118,92], land: [145,186,255], cloud: [213,255,79], accent: [240,238,232] },
    ];
    current = palettes[Math.floor(random() * palettes.length)];
    current.seed = Math.floor(random() * 100000);
  };
  const paint = () => {
    choosePlanet();
    const image = ctx.createImageData(size, size);
    const lightX = .32 + random() * .2, lightY = .24 + random() * .22;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x + .5 - size / 2) / (size * .45), dy = (y + .5 - size / 2) / (size * .45);
        const sphere = dx * dx + dy * dy;
        const i = (y * size + x) * 4;
        if (sphere > 1) { image.data[i + 3] = 0; continue; }
        const z = Math.sqrt(1 - sphere);
        const diffuse = Math.max(.18, Math.min(1, dx * lightX + dy * lightY + z * .75));
        const n1 = noise(x, y, 34, current.seed);
        const n2 = noise(x, y, 17, current.seed + 19);
        const n3 = noise(x, y, 7, current.seed + 47);
        const layered = n1 * .52 + n2 * .3 + n3 * .18;
        const land = smooth(Math.max(0, Math.min(1, (layered - .49) * 5.2)));
        const cloud = smooth(Math.max(0, Math.min(1, (noise(x, y, 23, current.seed + 91) - .6) * 4)));
        const base = [
          current.base[0] * (1 - land) + current.land[0] * land,
          current.base[1] * (1 - land) + current.land[1] * land,
          current.base[2] * (1 - land) + current.land[2] * land,
        ];
        const mixed = [
          base[0] * (1 - cloud * .42) + current.cloud[0] * cloud * .42,
          base[1] * (1 - cloud * .42) + current.cloud[1] * cloud * .42,
          base[2] * (1 - cloud * .42) + current.cloud[2] * cloud * .42,
        ];
        const rim = Math.pow(1 - z, 1.8);
        image.data[i] = Math.min(255, mixed[0] * diffuse + current.accent[0] * rim * .28);
        image.data[i + 1] = Math.min(255, mixed[1] * diffuse + current.accent[1] * rim * .28);
        image.data[i + 2] = Math.min(255, mixed[2] * diffuse + current.accent[2] * rim * .28);
        image.data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    canvas.classList.remove('planet-new'); void canvas.offsetWidth; canvas.classList.add('planet-new');
  };
  const schedule = () => {
    clearTimeout(timer);
    if (visible && !reducedMotion) timer = window.setTimeout(() => { paint(); schedule(); }, 5000);
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); else clearTimeout(timer); }, { threshold: 0 });
  observer.observe(canvas);
  paint(); schedule();
}
