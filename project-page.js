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
  const media = project.media.map((item, index) => `<figure class="detail-media reveal"><div class="detail-media-frame">${visualMarkup(item, index)}<button class="detail-media-trigger" type="button" data-media-index="${index}" aria-label="Open ${escapeHtml(item.caption)} in a larger view"></button><span class="media-number">0${index + 1}</span></div><figcaption>${escapeHtml(item.caption)}</figcaption></figure>`).join('');
  const tags = project.technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join('');
  const facts = project.facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  const paragraphs = project.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const storyTitle = (project.storyTitle || ['Rules that', 'make room', 'for feeling.']).map((line, index) => `${index ? '<br>' : ''}${index === 1 ? `<em>${escapeHtml(line)}</em>` : escapeHtml(line)}`).join('');
  const storyKicker = project.storyKicker || 'The work';
  const related = (project.related || []).map((item) => `<a class="detail-related-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(item.type || 'Related')}</span>${escapeHtml(item.label)} <b>↗</b></a>`).join('');
  const canonical = `https://hooman.jlpr.ir/projects/${slug}/`;

  document.title = `${project.title} — Hooman Jalalpour`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${project.title} — Hooman Jalalpour`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', project.description);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
  if (project.image) {
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', project.image);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', project.image);
  }
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', `${project.title} — Hooman Jalalpour`);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', project.description);
  const structuredData = document.createElement('script');
  structuredData.type = 'application/ld+json';
  structuredData.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${canonical}#project`,
    name: project.title, description: project.description, url: canonical,
    image: project.image || 'https://hooman.jlpr.ir/og-image.png?v=2',
    creator: { '@type': 'Person', name: 'Hooman Jalalpour', url: 'https://hooman.jlpr.ir/' },
    keywords: project.technologies.join(', '), sameAs: project.source
  });
  document.head.appendChild(structuredData);

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
        <div class="detail-orbit" aria-hidden="true"><canvas class="detail-orbit-canvas" aria-hidden="true"></canvas></div>
      </section>
      <section class="detail-facts" aria-label="Project details"><dl>${facts}</dl><ul class="detail-tags">${tags}</ul></section>
      <section class="detail-story" id="story"><div class="detail-section-label">${escapeHtml(project.number)} <span>/</span> notes from the build</div><div class="detail-story-grid"><div><p class="eyebrow">${escapeHtml(storyKicker)}</p><h2>${storyTitle}</h2></div><div class="detail-prose">${paragraphs}</div></div></section>
      <section class="detail-gallery" aria-label="Project media"><div class="detail-section-label">Selected media <span>/</span> ${escapeHtml(project.sourceType)}</div><div class="detail-media-grid">${media}</div>${related ? `<div class="detail-related"><div class="detail-section-label">Related <span>/</span> watch & explore</div>${related}</div>` : ''}</section>
      <section class="detail-next"><p class="eyebrow">Keep exploring</p><a href="../../#work">See all projects <span>↗</span></a></section>
    </main>
    <footer class="site-footer"><span>© Hooman Jalalpour</span><span>Built with curiosity</span><a href="#top">Back to top ↑</a></footer>`;

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach((element) => observer ? observer.observe(element) : element.classList.add('is-visible'));

  const lightbox = document.createElement('div');
  lightbox.className = 'media-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-labelledby', 'mediaLightboxCaption');
  lightbox.innerHTML = `<div class="media-lightbox-panel"><button class="media-lightbox-close" type="button" aria-label="Close larger media view">×</button><button class="media-lightbox-nav media-lightbox-prev" type="button" aria-label="Previous project media">←</button><div class="media-lightbox-stage"><img class="media-lightbox-image" alt=""><div class="media-lightbox-art" role="img" aria-hidden="true"></div></div><button class="media-lightbox-nav media-lightbox-next" type="button" aria-label="Next project media">→</button><div class="media-lightbox-meta"><span id="mediaLightboxCaption"></span><span class="media-lightbox-counter" aria-live="polite"></span></div></div>`;
  document.body.appendChild(lightbox);

  const triggers = [...document.querySelectorAll('.detail-media-trigger')];
  const closeButton = lightbox.querySelector('.media-lightbox-close');
  const previousButton = lightbox.querySelector('.media-lightbox-prev');
  const nextButton = lightbox.querySelector('.media-lightbox-next');
  const image = lightbox.querySelector('.media-lightbox-image');
  const artwork = lightbox.querySelector('.media-lightbox-art');
  const caption = lightbox.querySelector('#mediaLightboxCaption');
  const counter = lightbox.querySelector('.media-lightbox-counter');
  let activeIndex = 0;
  let previouslyFocused = null;

  const showMedia = (index) => {
    activeIndex = (index + project.media.length) % project.media.length;
    const item = project.media[activeIndex];
    const frame = triggers[activeIndex]?.closest('.detail-media-frame');
    const source = frame?.querySelector('.detail-media-image img');
    const fallback = frame?.querySelector('.media-fallback');
    const fallbackClasses = fallback?.className.replace('media-fallback', '').trim() || 'art-generic';

    artwork.className = `media-lightbox-art ${fallbackClasses}`;
    artwork.setAttribute('aria-label', item.alt || 'Project media');
    artwork.hidden = Boolean(source && !source.hidden);
    image.hidden = !source || source.hidden;
    image.alt = item.alt || '';
    image.onerror = () => {
      image.hidden = true;
      artwork.hidden = false;
    };
    if (source && !source.hidden) image.src = source.currentSrc || source.src;
    caption.textContent = item.caption || '';
    counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(project.media.length).padStart(2, '0')}`;
  };

  const openLightbox = (index) => {
    previouslyFocused = document.activeElement;
    showMedia(index);
    lightbox.hidden = false;
    document.body.classList.add('media-lightbox-open');
    closeButton.focus();
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('media-lightbox-open');
    image.removeAttribute('src');
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
  };
  triggers.forEach((trigger) => trigger.addEventListener('click', () => openLightbox(Number(trigger.dataset.mediaIndex))));
  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showMedia(activeIndex - 1));
  nextButton.addEventListener('click', () => showMedia(activeIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showMedia(activeIndex - 1);
    if (event.key === 'ArrowRight') showMedia(activeIndex + 1);
    if (event.key === 'Tab') {
      const focusable = [closeButton, previousButton, nextButton];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
