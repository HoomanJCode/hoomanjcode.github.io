(() => {
  const slug = document.body.dataset.project;
  const project = window.PROJECTS?.[slug];
  if (!project) return;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const imageFallback = "this.onerror=null;this.hidden=true;this.nextElementSibling.hidden=false;";
  const visualMarkup = (media, index) => {
    if (media.image) {
      return `<div class="detail-media-image"><img src="${escapeHtml(media.image)}" alt="${escapeHtml(media.alt)}" onerror="${imageFallback}"><div class="media-fallback ${escapeHtml(media.visual || 'art-generic')}" hidden aria-hidden="true"></div></div>`;
    }
    return `<div class="media-fallback ${escapeHtml(media.visual || 'art-generic')}" role="img" aria-label="${escapeHtml(media.alt)}"></div>`;
  };
  const media = project.media.map((item, index) => `<figure class="detail-media reveal"><div class="detail-media-frame">${visualMarkup(item, index)}<span class="media-number">0${index + 1}</span></div><figcaption>${escapeHtml(item.caption)}</figcaption></figure>`).join('');
  const tags = project.technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join('');
  const facts = project.facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  const paragraphs = project.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const canonical = `https://hooman.jlpr.ir/projects/${slug}/`;

  document.title = `${project.title} — Hooman Jalalpour`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${project.title} — Hooman Jalalpour`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', project.description);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  if (project.image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', project.image);

  document.querySelector('#projectPage').innerHTML = `
    <header class="detail-header">
      <a class="brand" href="../../" aria-label="Hooman Jalalpour home"><span class="brand-mark">HJ</span><span>Hooman<br><b>Jalalpour</b></span></a>
      <a class="back-link" href="../../#work">Back to work <span>↗</span></a>
    </header>
    <main>
      <section class="detail-hero">
        <div class="detail-hero-copy">
          <p class="detail-kicker">${escapeHtml(project.number)} <span>/</span> ${escapeHtml(project.category)}</p>
          <p class="eyebrow">${escapeHtml(project.eyebrow)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="detail-lede">${escapeHtml(project.description)}</p>
          <div class="detail-actions"><a class="button button-bright" href="${escapeHtml(project.source)}" target="_blank" rel="noreferrer">${escapeHtml(project.sourceLabel)} <span>↗</span></a><a class="text-link" href="#story">Read the story <span>↓</span></a></div>
        </div>
        <div class="detail-orbit detail-orbit-${escapeHtml(project.number)}" aria-hidden="true"><div class="detail-orbit-core"></div><div class="detail-orbit-line"></div><span>PROJECT / ${escapeHtml(project.number)}</span></div>
      </section>
      <section class="detail-facts" aria-label="Project details"><dl>${facts}</dl><ul class="detail-tags">${tags}</ul></section>
      <section class="detail-story" id="story"><div class="detail-section-label">${escapeHtml(project.number)} <span>/</span> notes from the build</div><div class="detail-story-grid"><div><p class="eyebrow">The work</p><h2>Rules that<br><em>make room</em><br>for feeling.</h2></div><div class="detail-prose">${paragraphs}</div></div></section>
      <section class="detail-gallery" aria-label="Project media"><div class="detail-section-label">Selected media <span>/</span> ${escapeHtml(project.sourceType)}</div><div class="detail-media-grid">${media}</div></section>
      <section class="detail-next"><p class="eyebrow">Keep exploring</p><a href="../../#work">See all projects <span>↗</span></a></section>
    </main>
    <footer class="site-footer"><span>© Hooman Jalalpour</span><span>Built with curiosity</span><a href="#top">Back to top ↑</a></footer>`;

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach((element) => observer ? observer.observe(element) : element.classList.add('is-visible'));
})();
