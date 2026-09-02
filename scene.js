const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 760px)').matches;
const canvas = document.querySelector('#heroCanvas');

function createScene() {
  if (!canvas || !window.THREE || !window.WebGLRenderingContext || prefersReducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isSmallScreen,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const group = new THREE.Group();
  group.position.set(isSmallScreen ? 1.15 : 2.1, 0.05, 0);
  scene.add(group);

  const planet = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.48, isSmallScreen ? 3 : 4),
    new THREE.MeshStandardMaterial({ color: 0x668ee2, roughness: .52, metalness: .12, flatShading: true })
  );
  group.add(planet);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.53, 1),
    new THREE.MeshBasicMaterial({ color: 0x91baff, wireframe: true, transparent: true, opacity: .2 })
  );
  group.add(wire);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.63, isSmallScreen ? 16 : 24, isSmallScreen ? 12 : 16),
    new THREE.MeshBasicMaterial({ color: 0x91baff, transparent: true, opacity: .07, side: THREE.BackSide })
  );
  group.add(atmosphere);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.12, .012, 6, isSmallScreen ? 48 : 80),
    new THREE.MeshBasicMaterial({ color: 0xd5ff4f, transparent: true, opacity: .42, side: THREE.DoubleSide })
  );
  ring.rotation.set(.52, -.34, -.17);
  group.add(ring);

  const ringTwo = new THREE.Mesh(
    new THREE.TorusGeometry(2.43, .006, 6, isSmallScreen ? 48 : 80),
    new THREE.MeshBasicMaterial({ color: 0xff765c, transparent: true, opacity: .26, side: THREE.DoubleSide })
  );
  ringTwo.rotation.set(-.25, .7, .4);
  group.add(ringTwo);

  const starCount = isSmallScreen ? 260 : 650;
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
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({ size: .025, vertexColors: true, transparent: true, opacity: .8, sizeAttenuation: true })
  );
  scene.add(stars);

  scene.add(new THREE.AmbientLight(0x7f98c9, 1.5));
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
  window.addEventListener('resize', resize, { passive: true });
  resize();

  let scrollProgress = 0;
  let isVisible = true;
  let isPageVisible = !document.hidden;
  let scrollFrame = 0;
  const updateScroll = () => {
    scrollFrame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && isPageVisible) requestRender();
  }, { threshold: 0 });
  visibilityObserver.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  }, { passive: true });

  const clock = new THREE.Clock();
  let animationFrame = 0;
  const render = () => {
    animationFrame = 0;
    if (!isVisible || !isPageVisible) return;
    const t = clock.getElapsedTime();
    const p = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
    group.rotation.y = t * .09;
    group.rotation.x = Math.sin(t * .17) * .08 - p * .25;
    planet.rotation.y = t * .12;
    ring.rotation.z = t * .03 - p * .5;
    ringTwo.rotation.z = -t * .02 + p * .35;
    stars.rotation.y = t * .008 + p * .12;
    stars.position.y = -p * 4;
    stars.material.size = .025 + p * .045;
    stars.material.opacity = .8 - p * .25;
    const s = 1 + p * .45;
    group.scale.set(s, s, s);
    group.position.y = Math.sin(t * .35) * .08 + p * 2.6;
    camera.rotation.x = -p * .22;
    camera.position.z = 8.5 - p * .5;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(render);
  };
  const requestRender = () => {
    if (!animationFrame && isVisible && isPageVisible) animationFrame = requestAnimationFrame(render);
  };
  visibilityObserver.takeRecords();
  requestRender();
}

try {
  createScene();
} catch (error) {
  // The 3D hero is decorative — the page still works without WebGL.
}
