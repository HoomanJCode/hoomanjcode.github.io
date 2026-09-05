// Generates og-image.png (1200x630) — the profile card shown by Telegram,
// X, Discord, iMessage, and Slack when the site URL is shared.
// The card is rasterized in pure Node; text is composited through an SVG
// overlay rasterized by whichever SVG tool is installed (rsvg-convert,
// inkscape, or ImageMagick). No image dependencies.
// Run with: node scripts/generate-og-image.js
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { encodePng } from './lib/png.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200, H = 630;

const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const over = (fg, bg, a) => [
  fg[0] * a + bg[0] * (1 - a),
  fg[1] * a + bg[1] * (1 - a),
  fg[2] * a + bg[2] * (1 - a),
];
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const INK = hex('#07090d');
const TOP = hex('#111a2c');
const PAPER = hex('#f0eee8');
const MUTED = hex('#9a9b9e');
const ACID = hex('#d5ff4f');
const CORAL = hex('#ff765c');
const BLUE = hex('#91baff');

// --- rasterize profile-card background ---
const rgba = Buffer.alloc(W * H * 4);
const rng = mulberry32(20250903);
const gridStep = 42;
const dots = Array.from({ length: 120 }, () => ({
  x: 700 + rng() * 430,
  y: 45 + rng() * 540,
  r: .5 + rng() * 1.5,
  color: rng() > .8 ? ACID : BLUE,
}));

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = y / H;
    let rgb = [
      INK[0] + (TOP[0] - INK[0]) * t,
      INK[1] + (TOP[1] - INK[1]) * t,
      INK[2] + (TOP[2] - INK[2]) * t,
    ];

    // Fine technical grid on the right side of the card.
    const gridX = x % gridStep;
    const gridY = y % gridStep;
    if (x > 650 && (gridX < 1 || gridY < 1)) rgb = over(BLUE, rgb, .11);

    // Coral accent block behind the monogram.
    if (x >= 920 && x < 1060 && y >= 188 && y < 328) rgb = over(CORAL, rgb, .88);

    // Rounded-corner monogram circle.
    const md = Math.hypot(x - 990, y - 258);
    if (md <= 62) rgb = over(INK, rgb, .9);
    if (Math.abs(md - 62) <= 2) rgb = ACID;

    for (const dot of dots) {
      const d = Math.hypot(x - dot.x, y - dot.y);
      if (d <= dot.r) rgb = over(dot.color, rgb, .8 * (1 - (d / dot.r) ** 2));
    }

    const i = (y * W + x) * 4;
    rgba[i] = rgb[0];
    rgba[i + 1] = rgb[1];
    rgba[i + 2] = rgb[2];
    rgba[i + 3] = 255;
  }
}

// Minimal bitmap font used when no SVG rasterizer is installed. The fallback
// keeps the generated card readable on dependency-free environments.
const FONT = {
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
  '-': ['00000', '00000', '00000', '01110', '00000', '00000', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '·': ['00000', '00000', '00100', '00000', '00100', '00000', '00000'],
};
const drawText = (textValue, x, y, scale, color, gap = scale) => {
  const glyphs = [...textValue.toUpperCase()];
  const ink = hex(color);
  glyphs.forEach((character, glyphIndex) => {
    const glyph = FONT[character] || FONT[' '];
    glyph.forEach((row, rowIndex) => {
      [...row].forEach((pixel, columnIndex) => {
        if (pixel === '1') {
          const px = x + glyphIndex * (6 * scale + gap) + columnIndex * scale;
          const py = y + rowIndex * scale;
          for (let yy = 0; yy < scale; yy++) {
            for (let xx = 0; xx < scale; xx++) {
              if (px + xx < 0 || px + xx >= W || py + yy < 0 || py + yy >= H) continue;
              const i = ((py + yy) * W + px + xx) * 4;
              rgba[i] = ink[0]; rgba[i + 1] = ink[1]; rgba[i + 2] = ink[2]; rgba[i + 3] = 255;
            }
          }
        }
      });
    });
  });
};

const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <line x1="90" y1="92" x2="1110" y2="92" stroke="#d5ff4f" stroke-opacity=".42" />
  <text x="90" y="72" font-family="DejaVu Sans, Arial, sans-serif" font-size="19" font-weight="600" letter-spacing="5" fill="#d5ff4f">HOOMAN JALALPOUR / WORLD BUILDER</text>

  <text x="90" y="260" font-family="DejaVu Sans, Arial, sans-serif" font-size="92" font-weight="800" letter-spacing="-3" fill="#f0eee8">Hooman</text>
  <text x="90" y="350" font-family="DejaVu Sans, Arial, sans-serif" font-size="92" font-weight="800" letter-spacing="-3" fill="#f0eee8">Jalalpour</text>
  <text x="94" y="416" font-family="DejaVu Sans, Arial, sans-serif" font-size="25" font-weight="600" letter-spacing="3" fill="#d5ff4f">GAME PROGRAMMER · SOFTWARE ENGINEER</text>
  <text x="94" y="460" font-family="DejaVu Sans, Arial, sans-serif" font-size="22" letter-spacing="2" fill="#9a9b9e">GENERATIVE ART · PLAYFUL SYSTEMS · STRANGE WORLDS</text>

  <text x="990" y="271" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="42" font-weight="800" letter-spacing="-2" fill="#f0eee8">HJ</text>
  <text x="90" y="552" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" letter-spacing="3" fill="#9a9b9e">HOOMANJCODE.GITHUB.IO</text>
  <line x1="90" y1="570" x2="1110" y2="570" stroke="#f0eee8" stroke-opacity=".2" />
  <text x="1110" y="552" text-anchor="end" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" letter-spacing="3" fill="#ff765c">INDEPENDENT CREATOR</text>
</svg>`;

// Minimal 8-bit RGBA PNG decoder (enough for rsvg/magick output).
const decodePng = (buf) => {
  let off = 8, idat = [], w = 0, h = 0;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), type = buf.slice(off + 4, off + 8).toString('ascii');
    if (type === 'IHDR') { w = buf.readUInt32BE(off + 8); h = buf.readUInt32BE(off + 12); }
    if (type === 'IDAT') idat.push(buf.slice(off + 8, off + 8 + len));
    off += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * 4, out = Buffer.alloc(w * h * 4), paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const i = y * (stride + 1) + 1 + x;
      const left = x >= 4 ? out[y * stride + x - 4] : 0;
      const up = y > 0 ? out[(y - 1) * stride + x] : 0;
      const upperLeft = y > 0 && x >= 4 ? out[(y - 1) * stride + x - 4] : 0;
      let value = raw[i];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) value += paeth(left, up, upperLeft);
      out[y * stride + x] = value & 0xff;
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
  drawText('HOOMAN JALALPOUR', 90, 176, 8, '#f0eee8', 5);
  drawText('GAME PROGRAMMER', 94, 390, 3, '#d5ff4f', 3);
  drawText('SOFTWARE ENGINEER', 94, 420, 3, '#d5ff4f', 3);
  drawText('GENERATIVE ART', 94, 468, 3, '#9a9b9e', 3);
  drawText('PLAYFUL SYSTEMS', 94, 498, 3, '#9a9b9e', 3);
  drawText('HOOMANJCODE.GITHUB.IO', 90, 548, 3, '#9a9b9e', 2);
  drawText('INDEPENDENT CREATOR', 800, 548, 2, '#ff765c', 2);
}

writeFileSync(join(root, 'og-image.png'), encodePng(W, H, rgba));
console.log(`Wrote profile card og-image.png (1200x630)${text ? ' with SVG text' : ' with bitmap text fallback'}`);
