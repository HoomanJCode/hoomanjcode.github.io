# Hooman Jalalpour — Portfolio Content (Text Only)

Text content extracted from the old portfolio website **https://hooman.jalalpoor.com**
("Hooman's Portfolio"), kept as the basis for building a new website.

**Exported:** 2026-09-01 — media (images/videos) intentionally removed by owner request.

## What's in here

| Path | Contents |
| --- | --- |
| `content/posts/` | All 8 posts in Markdown with YAML frontmatter (title, date, tags, cover filename, summary, original URL) |
| `content/pages/` | Static pages: `about-me`, `contact-me`, author bio |
| `data/` | Same content in structured form: `feed.json`, `feed.xml`, `sitemap.xml`, `robots.txt` |
| `tools/` | The script that originally generated this archive |

## Posts

- `fxplanet-random-planet-generator-state-of-the-art`
- `boost-your-unity-development-with-concurrenttools-package`
- `menuview-package-in-unity-simple-menu-management-tool`
- `hecsgravitysim-a-high-performance-gravity-simulation-in-unity`
- `rainy-cloud-a-melancholic-yet-hopeful-puzzle-adventure`
- `balls-of-chaos-a-game-jam-triumph-in-100-seconds-of-mayhem`
- `impasse-a-puzzle-action-gem-born-from-collaboration-and-hope`
- `generativeart`

## Site facts worth keeping

- **Name:** Hooman's Portfolio — Hooman Jalalpour
- **Profiles:** [GitHub](https://github.com/HoomanJCode) · [itch.io](https://hoomanj.itch.io/) · [LinkedIn](https://www.linkedin.com/in/hooman-jalalpoor/) · [fxhash](https://www.fxhash.xyz/u/Parallax%20Rendering)
- **Email:** hooman.jalalpoor@gmail.com
- **Other site:** generative-art blog at https://parallax.tez.page

## Notes

- The original 173 images/GIFs are **not** stored here — they were removed on
  request. They remain fully recoverable from this repository's git history
  (HEAD commit `25a1f98`, which tracks all of `media/`), e.g.:
  `git restore --source=25a1f98 media` (or checkout that commit's `media/`).
- A 95 MB demo video (`Gravity.mp4`, likely for HEcsGravitySim) that was
  recovered from the git `Videos` branch has also been removed from here; it
  can be re-fetched from the repo's Git LFS store / the `Videos` branch.
- Markdown `cover:` fields and image references name the original media files
  (e.g. `media/posts/9/…`); they serve as documentation of which asset belongs
  where, to be re-linked when media is restored or re-hosted.