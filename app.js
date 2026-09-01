import * as THREE from 'three';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('#heroCanvas');

function createScene() {
  if (!canvas || !window.WebGLRenderingContext) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const group = new THREE.Group();
  group.position.set(2.1, 0.05, 0);
  scene.add(group);

  const planet = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.48, 5),
    new THREE.MeshStandardMaterial({ color: 0x668ee2, roughness: .52, metalness: .12, flatShading: true })
  );
  group.add(planet);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.53, 2),
    new THREE.MeshBasicMaterial({ color: 0x91baff, wireframe: true, transparent: true, opacity: .2 })
  );
  group.add(wire);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.63, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x91baff, transparent: true, opacity: .07, side: THREE.BackSide })
  );
  group.add(atmosphere);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xd5ff4f, transparent: true, opacity: .42, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.12, .012, 8, 128), ringMaterial);
  ring.rotation.set(.52, -.34, -.17);
  group.add(ring);
  const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.43, .006, 8, 128), new THREE.MeshBasicMaterial({ color: 0xff765c, transparent: true, opacity: .26, side: THREE.DoubleSide }));
  ringTwo.rotation.set(-.25, .7, .4);
  group.add(ringTwo);

  const starCount = 1100;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const color = new THREE.Color();
  for (let i = 0; i < starCount; i++) {
    const radius = 3.3 + Math.random() * 5.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    positions[i * 3 + 2] = Math.cos(phi) * radius - 2;
    color.setHSL(Math.random() > .8 ? .18 : .6, .7, .55 + Math.random() * .35);
    colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ size: .025, vertexColors: true, transparent: true, opacity: .8, sizeAttenuation: true }));
  scene.add(stars);

  const ambient = new THREE.AmbientLight(0x7f98c9, 1.5);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xd5ffcf, 3.2);
  key.position.set(-4, 3, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xff765c, 18, 8);
  rim.position.set(3, -2, 2);
  scene.add(rim);

  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  let scrollProgress = 0;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;
  };
  window.addEventListener('scroll', updateScroll, { passive: true });

  const clock = new THREE.Clock();
  const render = () => {
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      group.rotation.y = t * .09 + scrollProgress * 1.8;
      group.rotation.x = Math.sin(t * .17) * .08 + scrollProgress * .4;
      planet.rotation.y = t * .12;
      ring.rotation.z = t * .03 - scrollProgress * 1.5;
      ringTwo.rotation.z = -t * .02 + scrollProgress;
      stars.rotation.y = t * .008;
      group.position.y = Math.sin(t * .35) * .08 - scrollProgress * 1.2;
      camera.position.x = Math.sin(scrollProgress * Math.PI) * -.5;
      camera.position.z = 8.5 - scrollProgress * .6;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
}

createScene();

const progressBar = document.querySelector('#progressBar');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
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
