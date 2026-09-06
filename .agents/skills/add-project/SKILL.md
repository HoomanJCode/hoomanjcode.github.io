---
name: add-project
description: Add a new project to the Hooman Jalalpour portfolio (hooman.jlpr.ir). Discovers the project's real links, info, and media to build its page, registers its data so it automatically gets its own orbital planet and project-page planet, adds a main-page thumbnail like other projects, and names it in the "Other projects" news ticker exactly as on the main page. Use whenever the user asks to add, include, or showcase a new project.
---

# Add a Project to the Portfolio

The portfolio is a static, data-driven site. **`js/project-data.js` (`window.PROJECTS`) is the single source of truth**: one entry per project, keyed by slug. Almost everything else is generated from it:

- The **homepage hero** (`js/scene.js`) builds one small **orbital planet per project** that rides its own ring around the main planet. Adding a data entry automatically adds the planet — it needs no manual wiring. Its surface color is `palette[1]`, its ring is `palette[2]`, and clicking it navigates to `projects/<slug>/`.
- The **project page planet** (`js/components/detail-orbit.js`) renders the same palette (ambient `palette[0]`, surface `palette[1]`, ring `palette[2]`, second ring `palette[3]`).

So a new project = one data entry + one HTML page + one main-page thumbnail card + a ticker name. The planets take care of themselves.

## Step 1 — Discover the project (never invent content)

Before writing anything, find the project's real links and pull its real info:

1. **Identify the primary link** the user gave or the project's canonical home — a GitHub repo (`github.com/HoomanJCode/<Repo>`), itch.io page (`hoomanj.itch.io/...` or a collaborator's), fxhash project, PyPI package, or demo URL. Check the user's GitHub profile if only a name is given.
2. **Fetch the page/README** (use a web fetch tool) and extract:
   - `title` (display name — see naming rule below) and a one-line `description`
   - `category` (e.g. `GAME / UNITY`, `TELEGRAM BOT / AUTOMATION`, `SOFTWARE / NETWORKING`) and `number` (next in sequence: the current count is 14, so the next is `'15'`)
   - 2–3 short `paragraphs`, `technologies` (3–6 tags), and 3 `facts` (`[label, value]` pairs)
   - `source` URL + `sourceLabel` (e.g. `Play <Title>` for itch, `View on GitHub`) + `sourceType` (`itch.io`, `GitHub`, `fxhash`, …)
   - any `related` links (demos, videos)
3. **Collect media**: cover art, screenshots, gameplay GIFs. Download them into `assets/projects/<slug>/` and reference them with local relative paths (`../../assets/projects/<slug>/...`). Use `.webp` for stills, `.gif` for animations, `.jpg` only if already that format (see rainy-cloud). If no real media can be found, use the GitHub `https://opengraph.githubassets.com/1/HoomanJCode/<Repo>` preview as a single image (see concurrent-tools/menu-view) — never fabricate screenshots.
4. **Derive a 4-color palette** `[[ambient], [surface], [ring], [accent]]` from the cover art / screenshots / brand: `[0]` dark ambient tint, `[1]` planet surface color, `[2]` primary ring, `[3]` accent (usually the site coral `[255,118,92]` is reused). This palette *is* the project's planet identity — pick colors that differ from other projects so every planet looks unique.

## Step 2 — Register the data entry in `js/project-data.js`

Append a new key inside `window.PROJECTS`, in order, copying the shape of an existing entry:

```js
'<slug>': {
  number: '15', category: '…', title: '…', eyebrow: '…',
  storyKicker: '…', storyTitle: ['…', '…', '…'],
  description: '…',
  palette: [[r, g, b], [r, g, b], [r, g, b], [r, g, b]],
  paragraphs: ['…', '…'],
  techKicker: 'Notes from the build',
  techTitle: ['…', '…', '…'],
  technical: ['…', '…'],
  techPoints: ['…', '…', '…'],
  fa: { category: '…', eyebrow: '…', description: '…', paragraphs: ['…', '…'],
        storyKicker: '…', storyTitle: ['…', '…', '…'], techKicker: '…', techTitle: ['…', '…', '…'],
        technical: ['…', '…'], techPoints: ['…', '…', '…'],
        facts: [['…', '…'], ['…', '…'], ['…', '…']], sourceLabel: '…' },
  technologies: ['…', '…'],
  facts: [['Type', '…'], ['…', '…'], ['…', '…']],
  source: 'https://…', sourceLabel: '…', sourceType: '…',
  image: 'https://…',            // optional: og image for GitHub-only projects
  related: [{ url: 'https://…', label: '…', type: '…' }],   // optional
  media: [
    { image: '../../assets/projects/<slug>/cover.webp', alt: '…', caption: 'COVER / 01' },
    { image: '../../assets/projects/<slug>/screen-1.webp', alt: '…', caption: 'SCREEN / 02' },
    // optional second entry as procedural artwork when no more media exists:
    // { visual: 'art-<slug> alt-art', alt: '…', caption: '…' }
  ]
}
```

Notes:
- The `fa` block holds the Persian translations; fields it omits fall back to English. Translate honestly — do not leave English text inside the fa block.
- `media` drives the project page gallery + lightbox; the first item also works as the page's visual anchor. Use the project page's own `art-generic`/`art-<slug>` procedural fallback for the second item when a project has only one real asset (see hecs-gravity-sim).
- The slug must be URL-safe and match the folder/body data exactly (e.g. `simple-meeting-app`, `telegram-7z-bot`).

## Step 3 — Create the project page

1. Copy `project-page.html` to `projects/<slug>/index.html` **unchanged**, except:
   - `<body data-project="__PROJECT_SLUG__" …>` → `<body data-project="<slug>" …>`
2. Fill the static `<head>` meta with real values (the page script also re-writes these at runtime, but keep the static ones correct for crawlers):
   - `meta[name="description"]`, `link[rel="canonical"]`, `og:title`, `og:description`, `og:url`, `twitter:title`, `twitter:description` — all using `projects/<slug>/` as the URL
   - `<title><Title> — Hooman Jalalpour</title>`
3. Nothing else: the whole page body, the planet, the lightbox, and language switching render from the data entry.

## Step 4 — Add a main-page thumbnail (like other projects)

In `index.html`, inside `<div class="project-list" id="projectList">`, append a card after the last `is-extra` article:

```html
<article class="project-card project-extra is-extra reveal" hidden>
  <div class="project-visual project-thumb visual-<slug>" role="img" aria-label="…">
    <!-- one of the three thumbnail styles below -->
    <span class="visual-caption">CATEGORY / 15</span>
  </div>
  <div class="project-info">
    <p class="project-index" data-i18n="proj.<slug>.index">15 · CATEGORY</p>
    <h3><Title></h3>
    <p data-i18n="proj.<slug>.desc">…</p>
    <div class="project-links">
      <a href="projects/<slug>/" class="text-link"><span data-i18n="proj.readMore">Read more</span> <span>↗</span></a>
      <a href="<source>" class="text-link" target="_blank" rel="noreferrer"><span data-i18n="proj.<slug>.play">…</span> <span>↗</span></a>
    </div>
  </div>
</article>
```

Choose a thumbnail style, matching how other projects do it:

- **Local image** (like rainy-cloud): `<img src="assets/projects/<slug>/cover.jpg" alt="…">` inside the visual div, plus a `.visual-<slug>` class in `css/main.css` that gives it a background and hides the pseudo-elements (`.visual-<slug>::before, .visual-<slug>::after { display: none; }`).
- **CSS-only generative visual** (like visual-tools, visual-menu, visual-tunnel): add a `.visual-<slug>` class in `css/main.css` using gradients/borders and the `--pointer-x/--pointer-y` parallax variables (they're driven by `js/components/thumbnail-parallax.js`).
- **Canvas animation** (like v2portal, proxy-tuner, http-tunnel, the bots): add a `<canvas id="<slug>Canvas" class="routing-canvas|social-bot-canvas" …>` in the card and a component file in `js/components/`. Then register the component in the **resilient script loader** — the inline script at the bottom of `index.html` that retries decorative scripts with backoff so a transient CDN 504 never kills a thumbnail (add `'js/components/<component>.js'` to its `SCRIPTS` array; never add a plain `<script defer>` tag for it).

Then add the translations to `js/translations.js` under **both** `en` and `fa`:
`proj.<slug>.index`, `proj.<slug>.desc`, and a `proj.<slug>.play`/`.view` action label (reuse `proj.viewGithub` for GitHub-only projects).

## Step 5 — Name the project in the news ticker (same name as the main page)

The "Other projects" marquee (`div.archive-ticker` → `.ticker-row` rows) is the site's scrolling **news ticker** of project names. Every non-featured project is named there. Add the new project:

1. Pick one of the two `.ticker-row` tracks (`.ticker-track`) — the rows split the project list between them.
2. Insert `<a href="projects/<slug>/"><Title></a><i>·</i>` at the end of the track's content.
3. **The track content is duplicated inside itself** for the seamless marquee loop — duplicate the full track the same way the existing rows do (each row repeats its own full set of links).
4. **Naming rule:** the ticker name must be the **exact display title** from the main-page card and the data entry (`title`), not the repo/folder name. E.g. the main page says "Simple Meeting App", so the ticker must say `Simple Meeting App` — never `SimpleMeetingApp`. Fix the ticker to match the main page for any existing project that already violates this.

## Step 6 — Finishing touches & verification

- Add the page URL to `sitemap.xml` (`https://hooman.jlpr.ir/projects/<slug>/`, `changefreq monthly`, priority `0.7`).
- If the project is promoted to the featured top 3, also add it to the JSON-LD `ItemList` in `index.html` and give it a dedicated `css/projects/<slug>.css` visual (see impasse/balls-of-chaos/fxplanet). Default for new projects: extra card only.
- Optionally add the project to the README featured/experiments tables.
- Verify with a local server (`python3 -m http.server 4173`):
  - the hero shows a **new orbital planet with its own ring**, colored by its palette, and clicking it opens the project page
  - the project page renders, its planet matches the palette, the lightbox works, and EN/FA switching works
  - the thumbnail card appears under "View more" with the caption, links, and (if used) the canvas animation
  - the new name scrolls in the ticker with the exact main-page title

## Rules to always follow

1. **Real content only** — discover facts, links, and media from the actual project; never fabricate screenshots, links, or descriptions.
2. **One name everywhere** — the main card, the ticker, the project page, and the sitemap all use the same display `title`.
3. **Palette = planet identity** — every project needs a distinct 4-color `palette`; it drives both the homepage orbital planet and the project-page planet.
4. **Nothing hand-wired for planets** — never edit `scene.js` or `detail-orbit.js`; the data entry is all they need.
5. **Keep EN/FA in sync** — every user-visible string added to `index.html`/`translations.js` gets both languages.

## Checklist

- [ ] Project link fetched; info, tech, facts, and media extracted from real sources
- [ ] Media saved under `assets/projects/<slug>/` (or GitHub og fallback used)
- [ ] Distinct 4-color `palette` chosen
- [ ] `js/project-data.js` entry added (number, fa block, media, source)
- [ ] `projects/<slug>/index.html` created from `project-page.html` with meta + slug
- [ ] Main-page thumbnail card added with `.visual-<slug>` (image, CSS, or canvas)
- [ ] `js/translations.js` updated in EN **and** FA
- [ ] Name added to the archive ticker using the exact main-page title (track duplicated for the loop)
- [ ] `sitemap.xml` updated
- [ ] Verified locally: orbital planet, project page, thumbnail, ticker name