// Generates favicon-32.png and apple-touch-icon.png from the same design as
// favicon.svg (planet + ring mark). Pure Node — no image dependencies.
// Run with: node scripts/generate-favicons.js
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- tiny PNG encoder ---
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
const encodePng = (width, height, rgba) => {
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter: none
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

// --- scene, in 64x64 design units (mirrors favicon.svg) ---
const W = 64, H = 64, DEG = Math.PI / 180;
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const INK = hex('#07090d');
const PLANET = hex('#668ee2');
const SHADE = hex('#3f66b8');
const DOT = hex('#91baff');
const RING = hex('#d5ff4f');
const CORAL = hex('#ff765c');
const SPOTS = [
  [26, 26, 2.6],
  [37, 29, 1.9],
  [30, 38, 2.2],
  [40, 39, 1.4],
  [23, 34, 1.5],
];
const RING_ROT = -14 * DEG;

const inSquare = (x, y) => {
  const r = 14, lo = r, hi = W - r;
  const cx = Math.min(Math.max(x, lo), hi);
  const cy = Math.min(Math.max(y, lo), hi);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};
const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
const inRing = (x, y) => {
  const dx = x - 32, dy = y - 34.5;
  const cos = Math.cos(-RING_ROT), sin = Math.sin(-RING_ROT);
  const px = dx * cos - dy * sin, py = dx * sin + dy * cos;
  const k = Math.hypot(px / 27, py / 8.5);
  return Math.abs(k - 1) * 8.5 <= 1.5;
};
const over = (fg, bg, alpha) => [
  fg[0] * alpha + bg[0] * (1 - alpha),
  fg[1] * alpha + bg[1] * (1 - alpha),
  fg[2] * alpha + bg[2] * (1 - alpha),
];
const sample = (x, y) => {
  if (!inSquare(x, y)) return [0, 0, 0, 0];
  let rgb = INK;
  if (inCircle(x, y, 32, 32, 17)) rgb = y >= 32 ? SHADE : PLANET;
  if (SPOTS.some(([cx, cy, r]) => inCircle(x, y, cx, cy, r))) rgb = over(DOT, rgb, .7);
  if (inRing(x, y)) rgb = RING;
  if (inCircle(x, y, 56, 27.5, 2.6)) rgb = CORAL;
  return [rgb[0], rgb[1], rgb[2], 255];
};
const render = (size) => {
  const px = Buffer.alloc(size * size * 4);
  const S = 4; // supersampling grid per axis
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const [cr, cg, cb, ca] = sample(((x + (sx + .5) / S) * W) / size, ((y + (sy + .5) / S) * H) / size);
          r += cr; g += cg; b += cb; a += ca;
        }
      }
      const n = S * S, i = (y * size + x) * 4;
      px[i] = Math.round(r / n);
      px[i + 1] = Math.round(g / n);
      px[i + 2] = Math.round(b / n);
      px[i + 3] = Math.round(a / n);
    }
  }
  return encodePng(size, size, px);
};

writeFileSync(join(root, 'favicon-32.png'), render(32));
writeFileSync(join(root, 'apple-touch-icon.png'), render(180));
console.log('Wrote favicon-32.png (32x32) and apple-touch-icon.png (180x180)');
