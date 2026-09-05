(() => {
  const slug = document.body.dataset.project;
  const project = window.PROJECTS?.[slug];
  if (!project) return;

  const lang = () => (document.documentElement.lang === 'fa' ? 'fa' : 'en');
  const t = (key) => window.I18N?.[lang()]?.[key] ?? '';
  // The project's content is merged with its fa block when Persian is active;
  // fields the fa block omits (title, technologies, media, source…) fall back
  // to the shared English data.
  const local = () => (lang() === 'fa' && project.fa ? { ...project, ...project.fa } : project);

  const escapeHtml = (value) => String(value).replace(/[&<>'\"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const imageFallback = "this.onerror=null;this.hidden=true;this.nextElementSibling.hidden=false;";
  const visualMarkup = (media, index) => {
    if (media.image) {
      return `<div class="detail-media-image"><img src="${escapeHtml(media.image)}" alt="${escapeHtml(media.alt)}" onerror="${imageFallback}"><div class="media-fallback ${escapeHtml(media.visual || 'art-generic')}" hidden aria-hidden="true"></div></div>`;
    }
    return `<div class="media-fallback ${escapeHtml(media.visual || 'art-generic')}" role="img" aria-label="${escapeHtml(media.alt)}"></div>`;
  };

  // The lightbox is built once and survives re-renders; only the media
  // triggers change, so they are re-queried and re-wired inside render().
  const lightbox = document.createElement('div');
  lightbox.className = 'media-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-labelledby', 'mediaLightboxCaption');
  lightbox.innerHTML = `<div class="media-lightbox-panel"><button class="media-lightbox-close" type="button" aria-label="Close larger media view">×</button><button class="media-lightbox-nav media-lightbox-prev" type="button" aria-label="Previous project media">←</button><div class="media-lightbox-stage"><img class="media-lightbox-image" alt=""><div class="media-lightbox-art" role="img" aria-hidden="true"></div></div><button class="media-lightbox-nav media-lightbox-next" type="button" aria-label="Next project media">→</button><div class="media-lightbox-meta"><span id="mediaLightboxCaption"></span><span class="media-lightbox-counter" aria-live="polite"></span></div></div>`;
  document.body.appendChild(lightbox);

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
    const data = local();
    activeIndex = (index + data.media.length) % data.media.length;
    const item = data.media[activeIndex];
    const trigger = document.querySelector(`.detail-media-trigger[data-media-index="${activeIndex}"]`);
    const frame = trigger?.closest('.detail-media-frame');
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
    counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(data.media.length).padStart(2, '0')}`;
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

  let revealObserver = null;

  const render = () => {
    const data = local();
    const media = data.media.map((item, index) => `<figure class="detail-media reveal"><div class="detail-media-frame">${visualMarkup(item, index)}<button class="detail-media-trigger" type="button" data-media-index="${index}" aria-label="${t('openLarger')}: ${escapeHtml(item.caption)}"></button><span class="media-number">0${index + 1}</span></div><figcaption>${escapeHtml(item.caption)}</figcaption></figure>`).join('');
    const tags = data.technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join('');
    const facts = data.facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
    const paragraphs = data.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
    const storyTitle = (data.storyTitle || (lang() === 'fa' ? ['قوانینی', 'که جا می‌گذارند', 'برای حس.'] : ['Rules that', 'make room', 'for feeling.'])).map((line, index) => `${index ? '<br>' : ''}${index === 1 ? `<em>${escapeHtml(line)}</em>` : escapeHtml(line)}`).join('');
    const storyKicker = data.storyKicker || 'The work';
    const techKicker = data.techKicker || t('techNotes');
    const techParagraphs = (data.technical || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
    const techPoints = (data.techPoints || []).map((point) => `<li>${escapeHtml(point)}</li>`).join('');
    const related = (data.related || []).map((item) => `<a class="detail-related-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(item.type || 'Related')}</span>${escapeHtml(item.label)} <b>↗</b></a>`).join('');
    const canonical = `https://hooman.jlpr.ir/projects/${slug}/`;

    document.title = `${data.title} — Hooman Jalalpour`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${data.title} — Hooman Jalalpour`);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', data.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    if (data.image) {
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', data.image);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', data.image);
    }
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', `${data.title} — Hooman Jalalpour`);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', data.description);
    document.querySelector('#projectStructuredData')?.remove();
    const structuredData = document.createElement('script');
    structuredData.type = 'application/ld+json';
    structuredData.id = 'projectStructuredData';
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${canonical}#project`,
      name: data.title, description: data.description, url: canonical,
      image: data.image || 'https://hooman.jlpr.ir/og-image.png?v=2',
      creator: { '@type': 'Person', name: 'Hooman Jalalpour', url: 'https://hooman.jlpr.ir/' },
      keywords: data.technologies.join(', '), sameAs: data.source
    });
    document.head.appendChild(structuredData);

    document.querySelector('#projectPage').innerHTML = `
      <header class="detail-header">
        <a class="brand" href="../../" aria-label="Hooman Jalalpour home"><span class="brand-mark">HJ</span><span>Hooman<br><b>Jalalpour</b></span></a>
        <div class="theme-switch" role="group" aria-label="Theme">
          <button type="button" data-theme-choice="system" aria-pressed="false">System</button>
          <button type="button" data-theme-choice="light" aria-pressed="false">Light</button>
          <button type="button" data-theme-choice="dark" aria-pressed="false">Dark</button>
        </div>
        <div class="lang-switch" role="group" aria-label="Language">
          <button type="button" data-lang-choice="en" aria-pressed="false">EN</button>
          <button type="button" data-lang-choice="fa" aria-pressed="false">FA</button>
        </div>
        <a class="back-link" href="../../#work">${t('backLink')} <span>↗</span></a>
      </header>
      <main>
        <section class="detail-hero">
          <div class="detail-hero-copy">
            <p class="detail-kicker">${escapeHtml(data.number)} <span>/</span> ${escapeHtml(data.category)}</p>
            <p class="eyebrow">${escapeHtml(data.eyebrow)}</p>
            <h1>${escapeHtml(data.title)}</h1>
            <p class="detail-lede">${escapeHtml(data.description)}</p>
            <div class="detail-actions"><a class="button button-bright" href="${escapeHtml(data.source)}" target="_blank" rel="noreferrer">${escapeHtml(data.sourceLabel)} <span>↗</span></a><a class="text-link" href="#story">${t('readStory')} <span>↓</span></a></div>
          </div>
          <div class="detail-orbit" aria-hidden="true"><canvas class="detail-orbit-canvas" aria-hidden="true"></canvas></div>
        </section>
        <section class="detail-facts" aria-label="Project details"><dl>${facts}</dl><ul class="detail-tags">${tags}</ul></section>
        <section class="detail-story" id="story"><div class="detail-section-label">${escapeHtml(data.number)} <span>/</span> ${t('storyLabel')}</div><div class="detail-story-grid"><div><p class="eyebrow">${escapeHtml(storyKicker)}</p><h2>${storyTitle}</h2></div><div class="detail-prose">${paragraphs}</div></div></section>
        ${data.technical ? `<section class="detail-tech" aria-label="Technical breakdown"><div class="detail-section-label">${escapeHtml(data.number)} <span>/</span> ${t('techLabel')}</div><p class="eyebrow">${escapeHtml(techKicker)}</p><div class="detail-prose">${techParagraphs}</div>${techPoints ? `<ul class="detail-tech-list">${techPoints}</ul>` : ''}</section>` : ''}
        <section class="detail-gallery" aria-label="Project media"><div class="detail-section-label">${t('selectedMedia')} <span>/</span> ${escapeHtml(data.sourceType)}</div><div class="detail-media-grid">${media}</div>${related ? `<div class="detail-related"><div class="detail-section-label">${t('related')} <span>/</span> ${t('watchExplore')}</div>${related}</div>` : ''}</section>
        <section class="detail-next"><p class="eyebrow">${t('keepExploring')}</p><a href="../../#work">${t('seeAllProjects')} <span>↗</span></a></section>
      </main>
      <footer class="site-footer"><span>© Hooman Jalalpour</span><span>${t('builtCuriosity')}</span><a href="#top">${t('backToTop')} ↑</a></footer>`;

    // Restore switcher states after a re-render (the header is rebuilt).
    let themeChoice = 'system';
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') themeChoice = stored;
    } catch (error) {
      // Storage unavailable — default state stays.
    }
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === themeChoice));
    });
    document.querySelectorAll('[data-lang-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.langChoice === lang()));
    });

    if (revealObserver) revealObserver.disconnect();
    revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 }) : null;
    document.querySelectorAll('.reveal').forEach((element) => revealObserver ? revealObserver.observe(element) : element.classList.add('is-visible'));

    const triggers = [...document.querySelectorAll('.detail-media-trigger')];
    triggers.forEach((trigger) => trigger.addEventListener('click', () => openLightbox(Number(trigger.dataset.mediaIndex))));
  };

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

  render();
  document.addEventListener('langchange', render);
})();