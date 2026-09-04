(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selectors = ['.visual-tools', '.visual-menu'];

  if (reducedMotion.matches) return;

  const cards = selectors
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);
  if (!cards.length) return;

  const activeCards = new Set();
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;

  function render() {
    frame = 0;
    activeCards.forEach((card) => {
      const targetX = card.matches(':hover') ? pointerX : 0;
      const targetY = card.matches(':hover') ? pointerY : 0;
      const currentX = parseFloat(card.dataset.pointerX || '0');
      const currentY = parseFloat(card.dataset.pointerY || '0');
      const nextX = currentX + (targetX - currentX) * 0.16;
      const nextY = currentY + (targetY - currentY) * 0.16;
      card.dataset.pointerX = String(nextX);
      card.dataset.pointerY = String(nextY);
      card.style.setProperty('--pointer-x', `${nextX.toFixed(2)}px`);
      card.style.setProperty('--pointer-y', `${nextY.toFixed(2)}px`);
      if (Math.abs(nextX - targetX) > 0.05 || Math.abs(nextY - targetY) > 0.05) {
        frame = requestAnimationFrame(render);
      }
    });
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activeCards.add(entry.target);
      else activeCards.delete(entry.target);
    });
    schedule();
  }, { threshold: 0.2 });

  cards.forEach((card) => {
    visibilityObserver.observe(card);
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      pointerX = Math.max(-4, Math.min(4, ((event.clientX - bounds.left) / bounds.width - 0.5) * 8));
      pointerY = Math.max(-4, Math.min(4, ((event.clientY - bounds.top) / bounds.height - 0.5) * 8));
      schedule();
    });
    card.addEventListener('pointerleave', schedule);
  });
})();
