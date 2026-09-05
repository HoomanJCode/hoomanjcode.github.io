(() => {
  const canvas = document.querySelector('.detail-orbit-canvas');
  const slug = document.body.dataset.project;
  if (!canvas || !slug) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const orbit = canvas.closest('.detail-orbit');
  if (!orbit) return;

  // Curated color roles per project:
  // [0] ambient/base tint, [1] planet surface, [2] primary ring, [3] secondary ring.
  const palettes = {
    impasse: [[38, 66, 61], [213, 255, 79], [145, 186, 255], [255, 118, 92]],
    'balls-of-chaos': [[28, 36, 48], [240, 238, 232], [213, 255, 79], [255, 118, 92]],
    fxplanet: [[42, 74, 128], [143, 190, 255], [213, 190, 120], [83, 175, 140]],
    'hecs-gravity-sim': [[16, 22, 40], [213, 255, 79], [145, 186, 255], [255, 118, 92]],
    'rainy-cloud': [[18, 40, 72], [129, 207, 244], [96, 120, 200], [255, 214, 150]],
    'concurrent-tools': [[21, 45, 42], [102, 224, 173], [213, 255, 79], [255, 118, 92]],
    'menu-view': [[28, 33, 54], [150, 160, 230], [213, 255, 79], [255, 118, 92]],
    v2portal: [[20, 34, 40], [213, 255, 79], [145, 186, 255], [255, 118, 92]],
    'proxy-tuner': [[30, 38, 52], [160, 190, 240], [120, 150, 190], [213, 255, 79]],
    'simple-meeting-app': [[18, 42, 48], [85, 200, 190], [213, 255, 79], [90, 130, 230]],
    'telegram-7z-bot': [[34, 26, 48], [190, 160, 255], [213, 255, 79], [255, 118, 92]],
    'http-tunnel': [[21, 24, 34], [255, 118, 92], [145, 186, 255], [213, 255, 79]],
    'telegram-insta-bot': [[32, 26, 44], [255, 140, 180], [190, 110, 220], [90, 140, 255]],
    'telegram-youtube': [[36, 22, 28], [255, 120, 120], [255, 70, 90], [145, 186, 255]],
  };
  const palette = palettes[slug] || [[30, 40, 55], [213, 255, 79], [145, 186, 255], [255, 118, 92]];

  // Stable but different light directions per project.
  const lightVariants = [
    { key: [-4, 3, 5], rim: [3, -2, 2] },
    { key: [4, 2, 5], rim: [-3, -2, 2] },
    { key: [4, -3, 5], rim: [-3, 2, 2] },
    { key: [-3, -2, 5], rim: [3, 3, 2] },
    { key: [0, 4, 5], rim: [2, -3, 2] },
    { key: [-4, 0, 5], rim: [3, 2, 2] },
  ];
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  const lights = lightVariants[hash % lightVariants.length];

  const hex = (rgb) => (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];

  import('../../vendor/three/three.module.js').then((THREE) => {
    if (!window.WebGLRenderingContext) return;
    let scene;
    try {
      scene = buildScene(THREE);
    } catch (error) {
      // The planet is decorative — skip silently when WebGL is unavailable.
      return;
    }
    wireUp(THREE, scene);
  }).catch(() => {
    // Three.js failed to load — the hero still works without the planet.
  });

  function buildScene(THREE) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const group = new THREE.Group();
    scene.add(group);

    const planet = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.58, 4),
      new THREE.MeshStandardMaterial({ color: hex(palette[1]), roughness: .52, metalness: .12, flatShading: true })
    );
    group.add(planet);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.66, 1),
      new THREE.MeshBasicMaterial({ color: 0xe8ecf5, wireframe: true, transparent: true, opacity: .2 })
    );
    group.add(wire);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(.82, 24, 16),
      new THREE.MeshBasicMaterial({ color: hex(palette[1]), transparent: true, opacity: .09, side: THREE.BackSide })
    );
    group.add(atmosphere);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.12, .012, 6, 80),
      new THREE.MeshBasicMaterial({ color: hex(palette[2]), transparent: true, opacity: .42, side: THREE.DoubleSide })
    );
    ring.rotation.set(.52, -.34, -.17);
    group.add(ring);

    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(2.43, .006, 6, 80),
      new THREE.MeshBasicMaterial({ color: hex(palette[3]), transparent: true, opacity: .26, side: THREE.DoubleSide })
    );
    ringTwo.rotation.set(-.25, .7, .4);
    group.add(ringTwo);

    const starCount = 340;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const color = new THREE.Color();
    for (let i = 0; i < starCount; i += 1) {
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

    const ambient = new THREE.AmbientLight(hex(palette[0]), 1.5);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xd5ffcf, 3.2);
    key.position.set(...lights.key);
    scene.add(key);
    const rim = new THREE.PointLight(hex(palette[3]), 18, 8);
    rim.position.set(...lights.rim);
    scene.add(rim);

    return { renderer, scene, camera, group, planet, ring, ringTwo, stars, clock: new THREE.Clock() };
  }

  function wireUp(THREE, handle) {
    const { renderer, scene, camera, group, planet, ring, ringTwo, stars, clock } = handle;

    const resize = () => {
      const width = canvas.clientWidth || orbit.clientWidth;
      const height = canvas.clientHeight || orbit.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    let isVisible = true;
    let isPageVisible = !document.hidden;
    let animationFrame = 0;

    const render = () => {
      animationFrame = 0;
      if (!isVisible || !isPageVisible) return;
      const t = clock.getElapsedTime();
      group.rotation.y = t * .09;
      group.rotation.x = Math.sin(t * .17) * .08;
      planet.rotation.y = t * .12;
      ring.rotation.z = t * .03;
      ringTwo.rotation.z = -t * .02;
      stars.rotation.y = t * .008;
      group.position.y = Math.sin(t * .35) * .08;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    };
    const requestRender = () => {
      if (!animationFrame && isVisible && isPageVisible) animationFrame = requestAnimationFrame(render);
    };

    if (reducedMotion.matches) {
      renderer.render(scene, camera);
      return;
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && isPageVisible) requestRender();
    }, { threshold: 0 });
    visibilityObserver.observe(orbit);

    document.addEventListener('visibilitychange', () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) requestRender();
    }, { passive: true });

    // Resize canvas to its laid-out box once the hero has real dimensions.
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        resize();
        ro.disconnect();
      });
      ro.observe(orbit);
    }
    requestRender();
  }
})();
