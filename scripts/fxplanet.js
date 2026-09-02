// Rotating procedural visual for the FxPlanet project card.
// FxPlanet thumbnail: regenerate a new procedural planet every five seconds.
const fxPlanet = document.querySelector('.mini-planet');
if (fxPlanet) {
  let planetSeed = Math.floor(Math.random() * 0xffffffff);
  let planetTimer = 0;
  let planetVisible = true;
  const nextRandom = () => {
    planetSeed = (planetSeed * 1664525 + 1013904223) >>> 0;
    return planetSeed / 4294967296;
  };
  const createPlanet = () => {
    const palette = [
      ['#91baff', '#668ee2', '#233a75'],
      ['#d5ff4f', '#91baff', '#315486'],
      ['#ff765c', '#668ee2', '#111c34'],
      ['#f0eee8', '#91baff', '#3f66b8'],
    ];
    const selected = palette[Math.floor(nextRandom() * palette.length)];
    fxPlanet.style.setProperty('--planet-a', selected[0]);
    fxPlanet.style.setProperty('--planet-b', selected[1]);
    fxPlanet.style.setProperty('--planet-c', selected[2]);
    fxPlanet.style.setProperty('--planet-x', `${28 + Math.round(nextRandom() * 44)}%`);
    fxPlanet.style.setProperty('--planet-y', `${22 + Math.round(nextRandom() * 40)}%`);
    fxPlanet.style.setProperty('--planet-rotation', `${-8 + Math.round(nextRandom() * 16)}deg`);
    fxPlanet.classList.remove('planet-new');
    void fxPlanet.offsetWidth;
    fxPlanet.classList.add('planet-new');
  };
  const schedulePlanet = () => {
    clearTimeout(planetTimer);
    if (planetVisible && !reducedMotion) planetTimer = window.setTimeout(() => { createPlanet(); schedulePlanet(); }, 5000);
  };
  const planetObserver = new IntersectionObserver(([entry]) => {
    planetVisible = entry.isIntersecting;
    if (planetVisible) schedulePlanet(); else clearTimeout(planetTimer);
  }, { threshold: 0 });
  planetObserver.observe(fxPlanet);
  createPlanet();
  schedulePlanet();
}
