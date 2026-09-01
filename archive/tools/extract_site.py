#!/usr/bin/env python3
"""
Extract every piece of content from the old Publiki/static portfolio site
(hooman.jalalpoor.com) into a single self-contained ./archive directory:

  archive/
  ├── README.md                 # manifest / inventory
  ├── content/
  │   ├── posts/                # blog posts + generative-art page, Markdown + frontmatter
  │   └── pages/                # about-me, contact-me, author bio
  ├── media/                    # ALL images / GIFs (copied verbatim)
  ├── data/                     # feed.json, feed.xml, sitemap.xml, robots.txt, sitemap.xsl
  ├── raw-html/                 # the original HTML pages, kept as the pixel-perfect source
  └── tools/                    # a copy of this script

Run from the repository root:  python3 extract_site.py
"""
import datetime
import json
import os
import re
import shutil
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))
ARCHIVE = os.path.join(ROOT, "archive")

SITE_BASE = "https://hooman.jalalpoor.com"
MEDIA_PREFIX = "https://hooman.jalalpoor.com/media/"
MEDIA_REL = "../../media/"  # relative from archive/content/posts|pages -> archive/media


# ---------------------------------------------------------------------------
# HTML -> Markdown converter (handles the subset of HTML used on the site)
# ---------------------------------------------------------------------------

class MDConverter(HTMLParser):
    BLOCK = {"p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol",
             "pre", "figure", "figcaption", "hr", "table", "tr", "section",
             "header", "footer"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.list_stack = []       # ["ul" | "ol", ...]
        self.ol_counters = {}      # depth -> counter
        self.link_href = None
        self.link_text = []
        self.pre_lang = None
        self.in_pre = False
        self.skip = 0              # depth of <style>/<script> to ignore

    # ---- helpers ----------------------------------------------------------

    def ensure_blank(self):
        """Make sure the output currently ends with a blank line (\n\n)."""
        if not self.parts:
            return
        if not self.parts[-1].endswith("\n\n"):
            self.parts.append("\n")

    def ensure_newline(self):
        """Make sure the output currently ends with a single newline."""
        if not self.parts:
            return
        if not self.parts[-1].endswith("\n"):
            self.parts.append("\n")

    # ---- parser callbacks -------------------------------------------------

    def handle_starttag(self, tag, attrs):
        if tag in ("style", "script"):
            self.skip += 1
            return
        if self.skip:
            return
        d = dict(attrs)

        if tag == "br":
            self.parts.append("  \n")
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.ensure_blank()
            self.parts.append("#" * int(tag[1]) + " ")
        elif tag == "p":
            self.ensure_blank()
        elif tag == "hr":
            self.ensure_blank()
            self.parts.append("---")
        elif tag in ("ul", "ol"):
            if self.list_stack:
                self.ensure_newline()  # nested list stays tight inside its item
            else:
                self.ensure_blank()
            self.list_stack.append(tag)
            self.ol_counters[len(self.list_stack)] = 0
        elif tag == "li":
            self.ensure_newline()
            depth = len(self.list_stack)
            marker = "-"
            if self.list_stack and self.list_stack[-1] == "ol":
                self.ol_counters[depth] = self.ol_counters.get(depth, 0) + 1
                marker = f"{self.ol_counters[depth]}."
            self.parts.append(f"{'  ' * (depth - 1)}{marker} ")
        elif tag == "pre":
            self.ensure_blank()
            self.in_pre = True
            self.pre_lang = None
            m = re.search(r"language-(\w+)", d.get("class", ""))
            if m:
                self.pre_lang = m.group(1)
        elif tag == "code":
            if self.in_pre:
                m = re.search(r"language-(\w+)", d.get("class", ""))
                if m:
                    self.pre_lang = m.group(1)
            else:
                self.parts.append("`")
        elif tag == "blockquote":
            self.ensure_blank()
        elif tag == "a":
            self.link_href = d.get("href", "")
            self.link_text = []
        elif tag == "img":
            src = d.get("src", "")
            alt = d.get("alt", "")
            if src.endswith("-thumbnail."):  # stray thumbnail with no full size
                pass
            m = re.match(r"^(.*)-thumbnail(\.\w+)$", src)
            if m:
                src = m.group(1) + m.group(2)  # prefer full-size image
            self.parts.append(f"![{alt}]({src})")
        elif tag in ("strong", "b"):
            self.parts.append("**")
        elif tag in ("em", "i"):
            self.parts.append("*")
        elif tag in self.BLOCK:
            self.ensure_blank()

    def handle_endtag(self, tag):
        if tag in ("style", "script"):
            if self.skip:
                self.skip -= 1
            return
        if self.skip:
            return

        if tag == "p":
            self.parts.append("\n")
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.parts.append("\n")
        elif tag in ("ul", "ol"):
            if self.list_stack:
                self.list_stack.pop()
            self.ensure_blank()
        elif tag == "li":
            self.parts.append("\n")
        elif tag == "pre":
            # wrap everything emitted since <pre> in a fenced code block
            idx = None
            for i in range(len(self.parts) - 1, -1, -1):
                s = self.parts[i]
                if isinstance(s, str) and s.strip() and s.lstrip().startswith("#" * 6, 0, 1):
                    continue
                if isinstance(s, str) and s.strip():
                    idx = i
                    break
            code = "".join(self.parts[idx:]).strip() if idx is not None else ""
            if idx is not None and idx > 0:
                del self.parts[idx:]
            lang = self.pre_lang or ""
            self.parts.append(f"```{lang}\n{code}\n```")
            self.ensure_blank()
            self.in_pre = False
        elif tag == "blockquote":
            self.parts.append("\n")
        elif tag == "a":
            href = self.link_href or ""
            text = "".join(self.link_text)
            if text.strip():
                self.parts.append(f"[{text}]({href})")
            self.link_href = None
        elif tag == "code":
            if not self.in_pre:
                self.parts.append("`")
        elif tag in ("strong", "b"):
            self.parts.append("**")
        elif tag in ("em", "i"):
            self.parts.append("*")
        elif tag in self.BLOCK:
            self.ensure_blank()

    def handle_data(self, data):
        if self.skip:
            return
        if self.link_href is not None:
            # text inside <a> becomes part of the link label only
            self.link_text.append(data)
            return
        if not data.strip() and not self.in_pre:
            return  # drop whitespace-only text between tags (keeps lists tight)
        self.parts.append(data)

    def finish(self):
        md = "".join(self.parts).replace("\xa0", " ")
        md = re.sub(r"[ \t]+\n", "\n", md)
        md = re.sub(r"\n{3,}", "\n\n", md)
        md = md.replace(MEDIA_PREFIX, MEDIA_REL).strip() + "\n"
        return md


def convert_inner(html):
    c = MDConverter()
    c.feed(html)
    c.close()
    return c.finish()


def html_to_markdown(html_str):
    """Convert HTML to Markdown; blockquotes are handled via recursion."""
    # Extract blockquotes first (nested conversion), splice the quoted Markdown back in.
    out = []
    pos = 0
    pattern = re.compile(r"<blockquote>(.*?)</blockquote>", re.S)
    for m in pattern.finditer(html_str):
        out.append(html_str[pos:m.start()])
        inner = convert_inner(m.group(1)).strip()
        quoted = "\n".join(("> " + line) if line.strip() else ">" for line in inner.splitlines())
        out.append("\n" + quoted + "\n")
        pos = m.end()
    out.append(html_str[pos:])

    result = convert_inner("".join(out))
    # Collapse blank lines that the blockquote splice may have created.
    result = re.sub(r"\n{3,}", "\n\n", result)
    result = result.replace(MEDIA_PREFIX, MEDIA_REL).strip() + "\n"
    return result


def yaml_quote(s):
    return '"' + str(s).replace("\\", "\\\\").replace('"', '\\"') + '"'


def write_md(path, frontmatter, body):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    lines = ["---"]
    for k, v in frontmatter.items():
        if isinstance(v, list):
            lines.append(f"{k}: [{', '.join(yaml_quote(x) for x in v)}]")
        elif v is None or v == "":
            continue
        else:
            lines.append(f"{k}: {yaml_quote(v)}")
    lines.append("---")
    lines.append("")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + body)


def rel_media(url):
    """Convert an absolute media URL into the path used inside markdown."""
    return url.replace(MEDIA_PREFIX, MEDIA_REL)


def slug_from_url(url):
    return url.rstrip("/").rsplit("/", 1)[-1]


# ---------------------------------------------------------------------------
# 1. Posts from feed.json
# ---------------------------------------------------------------------------

def extract_posts():
    feed = json.load(open(os.path.join(ROOT, "feed.json"), encoding="utf-8"))
    posts_dir = os.path.join(ARCHIVE, "content", "posts")
    exported = []
    for item in feed["items"]:
        slug = slug_from_url(item["url"])
        body = html_to_markdown(item.get("content_html", ""))
        fm = {
            "title": item.get("title", slug),
            "type": "post",
            "slug": slug,
            "date": item.get("date_published"),
            "updated": item.get("date_modified"),
            "tags": item.get("tags", []),
            "cover": rel_media(item.get("image", "")),
            "summary": item.get("summary", ""),
            "original_url": item.get("url", ""),
        }
        write_md(os.path.join(posts_dir, f"{slug}.md"), fm, body)
        exported.append(slug)
    return exported


# ---------------------------------------------------------------------------
# 2. Static pages parsed from their HTML files
# ---------------------------------------------------------------------------

def grab(regex, text, group=1):
    m = re.search(regex, text, re.S)
    return m.group(group).strip() if m else ""


def extract_pages():
    pages_dir = os.path.join(ARCHIVE, "content", "pages")
    os.makedirs(pages_dir, exist_ok=True)

    # about-me ---------------------------------------------------------------
    am = open(os.path.join(ROOT, "about-me", "index.html"), encoding="utf-8").read()
    am_body = html_to_markdown(grab(r'<div class="content__entry">(.*?)</div>', am))
    am_cover = grab(r'<figure class="content__featured-image[^"]*"[^>]*>.*?<img src="([^"]+)"', am)
    write_md(os.path.join(pages_dir, "about-me.md"), {
        "title": "About Me",
        "type": "page",
        "slug": "about-me",
        "date": "2025-05-02",
        "updated": "2025-05-04",
        "cover": rel_media(am_cover) if am_cover else "",
        "original_url": f"{SITE_BASE}/about-me/",
    }, am_body)

    # contact-me -------------------------------------------------------------
    cm = open(os.path.join(ROOT, "contact-me", "index.html"), encoding="utf-8").read()
    cm_body = html_to_markdown(grab(r'<div class="content__entry">(.*?)</div>', cm))
    write_md(os.path.join(pages_dir, "contact-me.md"), {
        "title": "Contact Me",
        "type": "page",
        "slug": "contact-me",
        "original_url": f"{SITE_BASE}/contact-me/",
    }, cm_body)

    # author bio -------------------------------------------------------------
    au = open(os.path.join(ROOT, "authors", "hooman-jalalpoor", "index.html"), encoding="utf-8").read()
    au_bio = html_to_markdown(grab(r'<div class="page--author__desc">(.*?)</div>', au))
    write_md(os.path.join(pages_dir, "hooman-jalalpoor.md"), {
        "title": "Hooman Jalalpour",
        "type": "author",
        "slug": "hooman-jalalpoor",
        "cover": rel_media("https://hooman.jalalpoor.com/media/website/dfjhkk-2-2xl.png"),
        "original_url": f"{SITE_BASE}/authors/hooman-jalalpoor/",
    }, au_bio)


# ---------------------------------------------------------------------------
# 3. Media, raw HTML, structured data
# ---------------------------------------------------------------------------

def copy_media():
    shutil.copytree(os.path.join(ROOT, "media"), os.path.join(ARCHIVE, "media"))


SITE_PATHS = [
    "index.html", "404.html", "robots.txt", "sitemap.xml", "sitemap.xsl",
    "feed.xml", "feed.json",
    "about-me", "contact-me", "generativeart",
    "authors/hooman-jalalpoor",
    "tags", "tags/art", "tags/game", "tags/nft", "tags/tools",
    "balls-of-chaos-a-game-jam-triumph-in-100-seconds-of-mayhem",
    "boost-your-unity-development-with-concurrenttools-package",
    "fxplanet-random-planet-generator-state-of-the-art",
    "hecsgravitysim-a-high-performance-gravity-simulation-in-unity",
    "impasse-a-puzzle-action-gem-born-from-collaboration-and-hope",
    "menuview-package-in-unity-simple-menu-management-tool",
    "rainy-cloud-a-melancholic-yet-hopeful-puzzle-adventure",
]


def copy_raw_html():
    dst = os.path.join(ARCHIVE, "raw-html")
    for rel in SITE_PATHS:
        src = os.path.join(ROOT, rel)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(dst, rel), dirs_exist_ok=True)
        elif os.path.isfile(src):
            os.makedirs(dst, exist_ok=True)
            shutil.copy2(src, os.path.join(dst, rel))


def copy_data():
    dst = os.path.join(ARCHIVE, "data")
    os.makedirs(dst, exist_ok=True)
    for f in ["feed.json", "feed.xml", "sitemap.xml", "robots.txt", "sitemap.xsl"]:
        shutil.copy2(os.path.join(ROOT, f), os.path.join(dst, f))


# ---------------------------------------------------------------------------
# 4. README manifest
# ---------------------------------------------------------------------------

MISSING_EXTERNAL = [
    ("https://hooman.jalalpoor.com/content/images/2025/03/3pZmfu-1.gif",
     "Balls of Chaos", "In-article animated screenshot — old host is offline"),
    ("https://hooman.jalalpoor.com/content/images/2025/03/x_UqF6.gif",
     "Balls of Chaos", "In-article animated screenshot — old host is offline"),
    ("https://hooman.jalalpoor.com/content/images/2025/03/Printable-34072680.jpg",
     "Generative Art", "Lfetover artwork — old host is offline"),
    ("https://lh4.googleusercontent.com/0FH3q9LDCVZYtXWoShrnSydbloqV_c1JgZWqrC_IojaJ-EqM_2fep3Q1MQCCgOWOPHyxvylXsY77D_Snp8B3PDTAJ-MGT5gLayGhr1UHocJKnkd_LK6YYsKkGnqFXLmZTg=w1280",
     "Generative Art", "Artwork — Google-hosted image no longer retrievable"),
]


def build_readme(post_slugs, media_count, media_size_mb):
    rows = "\n".join(f"- `{slug}`" for slug in post_slugs)
    missing = "\n".join(
        f"- {url}  \n  used in **{where}** — {why}" for url, where, why in MISSING_EXTERNAL
    )
    readme = f"""# Hooman Jalalpour — Portfolio Site Archive

Complete export of the old portfolio website **https://hooman.jalalpoor.com**
("Hooman's Portfolio", a static Publiki-generated site), captured as the basis
for building a new website.

**Exported:** {datetime.date.today().isoformat()}

## What's in here

| Path | Contents |
| --- | --- |
| `content/posts/` | All {len(post_slugs)} posts in Markdown with YAML frontmatter (title, date, tags, cover, summary, original URL) |
| `content/pages/` | Static pages: `about-me`, `contact-me`, author bio |
| `media/` | All {media_count} image/GIF files ({media_size_mb} MB), organised exactly as the old site served them |
| `data/` | Machine-readable sources: `feed.json`, `feed.xml`, `sitemap.xml`, `robots.txt` |
| `raw-html/` | The original HTML pages, unmodified — the pixel-perfect source of truth |
| `tools/` | The script used to generate this archive |

## Posts

{rows}

## Site facts worth keeping

- **Name:** Hooman's Portfolio — Hooman Jalalpour
- **Profiles:** [GitHub](https://github.com/HoomanJCode) · [itch.io](https://hoomanj.itch.io/) · [LinkedIn](https://www.linkedin.com/in/hooman-jalalpoor/) · [fxhash](https://www.fxhash.xyz/u/Parallax%20Rendering)
- **Email:** hooman.jalalpoor@gmail.com
- **Other site:** generative-art blog at https://parallax.tez.page

## Media referenced but NOT archived (hosts are offline)

A few in-article images pointed at hosts that no longer serve them, so they
could not be downloaded. Their original URLs are still present in the Markdown
so they can be replaced or re-uploaded during the rebuild:

{missing}

## Rebuilding

The Markdown posts use relative media paths (`../../media/...`), so serving
the `archive/` folder — or importing `content/` + `media/` into a new site —
keeps every archived image working. `data/feed.json` is the cleanest
structured source if you want to re-import everything programmatically.
"""
    os.makedirs(os.path.join(ARCHIVE, "tools"), exist_ok=True)
    with open(os.path.join(ARCHIVE, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme)


# ---------------------------------------------------------------------------

def main():
    if os.path.exists(ARCHIVE):
        shutil.rmtree(ARCHIVE)
    os.makedirs(ARCHIVE)

    posts = extract_posts()
    extract_pages()
    copy_media()
    copy_raw_html()
    copy_data()

    media_count = 0
    media_size = 0
    for dirpath, _dirs, files in os.walk(os.path.join(ARCHIVE, "media")):
        for f in files:
            media_count += 1
            media_size += os.path.getsize(os.path.join(dirpath, f))

    build_readme(posts, media_count, round(media_size / 1024 / 1024, 1))
    shutil.copy2(os.path.abspath(__file__), os.path.join(ARCHIVE, "tools", "extract_site.py"))

    print(f"Exported {len(posts)} posts, {media_count} media files ({media_size / 1024 / 1024:.1f} MB)")
    print(f"Archive written to {ARCHIVE}")


if __name__ == "__main__":
    main()