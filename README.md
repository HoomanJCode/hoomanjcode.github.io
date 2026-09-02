# Hooman Jalalpour — Portfolio

Personal portfolio for **Hooman Jalalpour**, an indie game programmer,
software engineer, and generative artist.

The site is a static GitHub Pages project with a procedural Three.js scene,
scroll-driven motion, responsive layouts, selected projects, profile details,
and contact links.

## Live site

- Website: <https://hooman.jlpr.ir> (custom domain via the `CNAME` file;
  <https://hoomanjcode.github.io> redirects here)
- Repository: <https://github.com/HoomanJCode/hoomanjcode.github.io>

## Run locally

From the repository root, start any static HTTP server. For example:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

The site uses Three.js from jsDelivr, so the 3D scene requires an internet
connection during development and when visitors load the page.

## Deploy with GitHub Pages

The repository is configured for a root-directory GitHub Pages deployment:

- Branch: `master`
- Folder: `/ (root)`
- `.nojekyll` is included so GitHub Pages serves the static files directly

Contact: `hooman.jalalpoor@gmail.com`.

## Project files

- `index.html` — page structure and portfolio content
- `styles.css` — visual design, responsive rules, and CSS animations
- `app.js` — scroll progress, reveal animations, section tracking, and browser
  chrome (theme-color) tinting per section
- `scene.js` — procedural Three.js planet, stars, orbital rings, and scroll behavior
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` — favicon set with a
  planet + ring mark in the site palette
- `site.webmanifest` — web app manifest exposing the favicon set
- `og-image.png` — 1200x630 Open Graph card shown by Telegram, X, Discord, and
  other link previews
- `scripts/generate-favicons.js` — regenerates the PNG favicons from the SVG
  design (`node scripts/generate-favicons.js`, no dependencies)
- `scripts/generate-og-image.js` — regenerates `og-image.png`
  (`node scripts/generate-og-image.js`, no dependencies; uses `rsvg-convert`,
  `inkscape`, or ImageMagick for the title text if one is installed)
- `scripts/lib/png.js` — shared minimal PNG encoder used by both generators
- `.nojekyll` — disables Jekyll processing
- `.gitignore` — excludes local logs, temporary files, and build artifacts

Images and videos are intentionally not included in the working tree; the
design generates its visual elements procedurally.
