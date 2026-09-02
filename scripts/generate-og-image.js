// Generates og-image.png (1200x630) — the link-preview card Telegram, X,
// Discord, iMessage, and Slack show when the site URL is shared.
// The scene is rasterized in pure Node; text is composited through an SVG
// overlay rasterized by whichever SVG tool is installed (rsvg-convert,
// inkscape, or ImageMagick). No image dependencies.
// Run with: node scripts/generate-og-image.js
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from './lib/png.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200, H = 630;

// --- helpers ---
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const over = (fg, bg, a) => [
  fg[0] * a + bg[0] * (1 - a),
  fg[1] * a + bg[1] * (1 - a),
  fg[2] * a + bg[2] * (1 - a),
];
// Deterministic RNG so regenerating the card never changes the stars
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// --- scene constants (site palette) ---
const INK = hex('#07090d'), TOP = hex('#0d1424');
const PLANET = hex('#668ee2'), SHADE = hex('#3f66b8'), DEEP = hex('#22366b');
const DOT = hex('#91baff'), RING = hex('#d5ff4f'), CORAL = hex('#ff765c');
const CX = 880, CY = 315, R = 190;               // planet
const RING_RX = 300, RING_RY = 95, RING_W = 11;  // ring
const RING_ROT = -14 * Math.PI / 180;
const MOON = [1105, 255, 16];                    // coral moon
const SPOTS = [                                  // highlight dots [x, y, r]
  [820, 240, 26], [950, 270, 18], [860, 370, 22], [975, 385, 13], [795, 330, 14],
];

const scene = (x, y) => {
  // night-sky gradient
  const t = y / H;
  let rgb = [
    INK[0] + (TOP[0] - INK[0]) * t,
    INK[1] + (TOP[1] - INK[1]) * t,
    INK[2] + (TOP[2] - INK[2]) * t,
  ];
  // planet with vertical shading and edge darkening
  const pd = Math.hypot(x - CX, y - CY);
  if (pd <= R) {
    const band = y < CY ? PLANET : SHADE;
    const edge = Math.min(1, (R - pd) / 46);
    rgb = [
      DEEP[0] + (band[0] - DEEP[0]) * edge,
      DEEP[1] + (band[1] - DEEP[1]) * edge,
      DEEP[2] + (band[2] - DEEP[2]) * edge,
    ];
    for (const [sx, sy, sr] of SPOTS) {
      const d = Math.hypot(x - sx, y - sy);
      if (d <= sr) rgb = over(DOT, rgb, .7 * (1 - (d / sr) ** 2));
    }
  }
  // acid ring (rotated ellipse band)
  const dx = x - CX, dy = y - CY;
  const c = Math.cos(-RING_ROT), s = Math.sin(-RING_ROT);
  const px = dx * c - dy * s, py = dx * s + dy * c;
  const k = Math.hypot(px / RING_RX, py / RING_RY);
  if (Math.abs(k - 1) * RING_RY <= RING_W / 2) rgb = RING;
  // coral moon
  const md = Math.hypot(x - MOON[0], y - MOON[1]);
  if (md <= MOON[2]) rgb = CORAL;
  return rgb;
};

// --- rasterize scene (2x2 supersampling) ---
const rgba = Buffer.alloc(W * H * 4);
const rng = mulberry32(20250902);
const stars = Array.from({ length: 430 }, () => ({
  x: rng() * W, y: rng() * H, r: .6 + rng() * 1.7, warm: rng() > .82,
}));
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let r = 0, g = 0, b = 0;
    for (const sy of [.25, .75]) {
      for (const sx of [.25, .75]) {
        const [cr, cg, cb] = scene(x + sx, y + sy);
        r += cr; g += cg; b += cb;
      }
    }
    let [rr, gg, bb] = [r / 4, g / 4, b / 4];
    for (const st of stars) {           // stars on top of gradient, under card text
      const d = Math.hypot(x + .5 - st.x, y + .5 - st.y);
      if (d <= st.r) {
        const tw = st.warm ? [213, 255, 79] : [200, 218, 255];
        [rr, gg, bb] = over(tw, [rr, gg, bb], .9 * (1 - (d / st.r) ** 2));
      }
    }
    const i = (y * W + x) * 4;
    rgba[i] = rr; rgba[i + 1] = gg; rgba[i + 2] = bb; rgba[i + 3] = 255;
  }
}

// --- text overlay via SVG rasterizer (skipped gracefully if none found) ---
const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="90" y="150" font-family="DejaVu Sans, Arial, sans-serif" font-size="26" font-weight="600" letter-spacing="4" fill="#d5ff4f">INDEPENDENT CREATOR — GAMES · SYSTEMS · GENERATIVE ART</text>
  <text x="88" y="330" font-family="DejaVu Sans, Arial, sans-serif" font-size="96" font-weight="800" letter-spacing="-3" fill="#f0eee8">I build <tspan font-family="DejaVu Serif, Georgia, serif" font-style="italic" fill="#d5ff4f">worlds</tspan></text>
  <text x="88" y="440" font-family="DejaVu Sans, Arial, sans-serif" font-size="96" font-weight="800" letter-spacing="-3" fill="#f0eee8">that stay with you.</text>
  <text x="90" y="565" font-family="DejaVu Sans, Arial, sans-serif" font-size="28" letter-spacing="2" fill="#9a9b9e">hoomanjcode.github.io</text>
</svg>`;

// minimal 8-bit RGBA PNG decoder (enough for rsvg/magick output)
const decodePng = (buf) => {
  let off = 8, idat = [], w = 0, h = 0;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), type = buf.slice(off + 4, off + 8).toString('ascii');
    if (type === 'IHDR') { w = buf.readUInt32BE(off + 8); h = buf.readUInt32BE(off + 12); }
    if (type === 'IDAT') idat.push(buf.slice(off + 8, off + 8 + len));
    off += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * 4, out = Buffer.alloc(w * h * 4), paeth = (a, bb, c) => {
    const p = a + bb - c, pa = Math.abs(p - a), pb = Math.abs(p - bb), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? bb : c;
  };
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const i = y * (stride + 1) + 1 + x;
      const left = x >= 4 ? out[y * stride + x - 4] : 0;
      const up = y > 0 ? out[(y - 1) * stride + x] : 0;
      const ul = y > 0 && x >= 4 ? out[(y - 1) * stride + x - 4] : 0;
      let v = raw[i];
      if (f === 1) v += left; else if (f === 2) v += up;
      else if (f === 3) v += (left + up) >> 1; else if (f === 4) v += paeth(left, up, ul);
      out[y * stride + x] = v & 0xff;
    }
  }
  return { w, h, data: out };
};

const tryRasterize = () => {
  const dir = mkdtempSync(join(tmpdir(), 'og-'));
  const svgPath = join(dir, 'overlay.svg'), pngPath = join(dir, 'overlay.png');
  writeFileSync(svgPath, overlaySvg);
  for (const [bin, args] of [
    ['rsvg-convert', ['-w', String(W), '-h', String(H), '-o', pngPath, svgPath]],
    ['inkscape', ['--export-type=png', `--export-filename=${pngPath}`, `--export-width=${W}`, `--export-height=${H}`, svgPath]],
    ['magick', [svgPath, '-resize', `${W}x${H}!`, pngPath]],
    ['convert', [svgPath, '-resize', `${W}x${H}!`, pngPath]],
  ]) {
    try {
      execFileSync(bin, args, { stdio: 'ignore' });
      const { w, h, data } = decodePng(readFileSync(pngPath));
      if (w === W && h === H) return data;
    } catch { /* try next tool */ }
  }
  return null;
};

const text = tryRasterize();
if (text) {
  for (let i = 0; i < rgba.length; i += 4) {
    const a = text[i + 3] / 255;
    rgba[i] = text[i] * a + rgba[i] * (1 - a);
    rgba[i + 1] = text[i + 1] * a + rgba[i + 1] * (1 - a);
    rgba[i + 2] = text[i + 2] * a + rgba[i + 2] * (1 - a);
  }
} else {
  console.warn('No SVG rasterizer found (rsvg-convert, inkscape, magick) — writing card without text.');
}

writeFileSync(join(root, 'og-image.png'), encodePng(W, H, rgba));
console.log(`Wrote og-image.png (1200x630)${text ? ' with title text' : ' (scene only)'}`);
