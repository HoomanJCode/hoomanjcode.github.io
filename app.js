const progressBar = document.querySelector('#progressBar');
let progressFrame = 0;
const updateProgress = () => {
  progressFrame = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = `scaleX(${max ? window.scrollY / max : 0})`;
};
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: .13 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const sections = [...document.querySelectorAll('.scene-section')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) document.body.dataset.scene = entry.target.dataset.scene;
  });
}, { threshold: .55 });
sections.forEach((section) => sectionObserver.observe(section));
