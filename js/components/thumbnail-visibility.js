(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const thumbnails = [...document.querySelectorAll('.project-visual')];
  if (!thumbnails.length) return;

  const watched = new Set();
  const updatePlayback = () => {
    const pageVisible = !document.hidden;
    thumbnails.forEach((thumbnail) => {
      const isPlaying = pageVisible && watched.has(thumbnail) && !reducedMotion.matches;
      thumbnail.classList.toggle('is-thumbnail-playing', isPlaying);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.35) watched.add(entry.target);
      else watched.delete(entry.target);
    });
    updatePlayback();
  }, { threshold: [0, 0.35] });

  thumbnails.forEach((thumbnail) => observer.observe(thumbnail));
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener?.('change', updatePlayback);
  updatePlayback();
})();
