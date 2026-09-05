import * as THREE from './vendor/three/three.module.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 760px)').matches;
const canvas = document.querySelector('#heroCanvas');

function createScene() {
  if (!canvas || !window.WebGLRenderingContext || prefersReducedMotion) return;

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

  // One small planet per project, orbiting the main planet like a solar
  // system. Built from the shared project data, so adding or removing a
  // project automatically adds or removes its satellite, and its color
  // follows the project's own palette (surface color) like on the project
  // pages. Every satellite rides one of the rings around the main planet:
  // each project gets its own ring at its own distance, all sharing a
  // ring-plane tilt like the main planet's decorative rings.
  const hex = (rgb) => (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
  const slugs = window.PROJECTS ? Object.keys(window.PROJECTS) : [];
  // Vertical flattening of the orbit ellipses. Chosen so the closest approach
  // (radius * orbitEllipse) stays well outside the main planet's sphere.
  const orbitEllipse = .72;
  // Shared ring-plane tilt, echoing the main planet's rings, so the orbits
  // read as rings around the planet instead of flat target circles.
  const orbitGroup = new THREE.Group();
  orbitGroup.rotation.set(.5, -.3, -.15);
  group.add(orbitGroup);

  const satellites = slugs.map((slug, index) => {
    const palette = window.PROJECTS[slug]?.palette || [null, [232, 236, 245], [213, 255, 79], [255, 118, 92]];
    const radius = 2.62 + (index % 4) * .26;
    const tilt = (index % 3) * .09;
    const size = .055 + (index % 5) * .008;

    // This project's ring around the main planet, styled like the main rings.
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(radius, .012, 6, 96),
      new THREE.MeshBasicMaterial({ color: palette[2] ? hex(palette[2]) : 0x9db4e0, transparent: true, opacity: .3, side: THREE.DoubleSide })
    );
    orbit.scale.y = orbitEllipse;
    orbit.position.y = tilt;
    orbitGroup.add(orbit);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(size, 16, 12),
      new THREE.MeshBasicMaterial({ color: palette[1] ? hex(palette[1]) : 0xe8ecf5 })
    );
    mesh.userData = {
      slug,
      radius,
      speed: .16 + (index % 6) * .025,
      offset: (index / Math.max(1, slugs.length)) * Math.PI * 2,
      tilt,
    };
    orbitGroup.add(mesh);
    return mesh;
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  const pickSatellite = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(satellites);
    return hits.length ? hits[0].object : null;
  };
  canvas.addEventListener('pointermove', (event) => {
    const hit = pickSatellite(event);
    canvas.style.cursor = hit ? 'pointer' : '';
    hovered = hit;
  }, { passive: true });
  canvas.addEventListener('click', (event) => {
    const hit = pickSatellite(event);
    if (hit?.userData?.slug) window.location.href = `projects/${hit.userData.slug}/`;
  });

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
    // Progress across the hero's own exit (first viewport height), so the
    // animation plays out exactly while the scene is still on screen.
    scrollProgress = Math.min(1, window.scrollY / (window.innerHeight || 1));
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  updateScroll();

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
    satellites.forEach((satellite) => {
      const { radius, speed, offset, tilt } = satellite.userData;
      const angle = t * speed + offset;
      satellite.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * orbitEllipse + tilt,
        0
      );
    });
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
