(() => {
  const canvas = document.querySelector('.detail-orbit-canvas');
  const slug = document.body.dataset.project;
  if (!canvas || !slug) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isSmallScreen = window.matchMedia('(max-width: 760px)').matches;
  const orbit = canvas.closest('.detail-orbit');
  if (!orbit) return;

  // Color roles per project: [0] ambient/base tint, [1] planet surface,
  // [2] primary ring, [3] secondary ring. Projects with local cover art or
  // screenshots take their colors from those images; the rest follow their
  // artwork palette. Palettes live in the shared project data; the map below
  // is only a fallback if the data ever fails to load.
  const palettes = {
    // cover amber + teal gameplay + coral accent
    impasse: [[18, 44, 40], [235, 180, 70], [58, 190, 175], [255, 118, 92]],
    // yellow balls, red and acid-green accents from the arena screenshots
    'balls-of-chaos': [[30, 22, 40], [248, 202, 33], [200, 70, 68], [160, 205, 75]],
    fxplanet: [[42, 74, 128], [143, 190, 255], [213, 190, 120], [83, 175, 140]],
    // the capture is grayscale, so a moon-silver surface with its artwork rings
    'hecs-gravity-sim': [[12, 16, 26], [205, 210, 220], [150, 200, 255], [200, 255, 110]],
    // muted teal scene with pale-cream light and moss tones from the cover
    'rainy-cloud': [[22, 38, 32], [86, 146, 120], [225, 221, 175], [112, 142, 84]],
    'concurrent-tools': [[21, 45, 42], [102, 224, 173], [213, 255, 79], [255, 118, 92]],
    'menu-view': [[28, 33, 54], [150, 160, 230], [213, 255, 79], [255, 118, 92]],
    v2portal: [[20, 34, 40], [213, 255, 79], [145, 186, 255], [255, 118, 92]],
    'proxy-tuner': [[30, 38, 52], [160, 190, 240], [120, 150, 190], [213, 255, 79]],
    // indigo UI with blue and violet accents from the app screens
    'simple-meeting-app': [[14, 20, 34], [101, 112, 240], [86, 168, 250], [160, 120, 225]],
    'telegram-7z-bot': [[34, 26, 48], [190, 160, 255], [213, 255, 79], [255, 118, 92]],
    'http-tunnel': [[21, 24, 34], [255, 118, 92], [145, 186, 255], [213, 255, 79]],
    'telegram-insta-bot': [[32, 26, 44], [255, 140, 180], [190, 110, 220], [90, 140, 255]],
    'telegram-youtube': [[36, 22, 28], [255, 120, 120], [255, 70, 90], [145, 186, 255]],
  };
  const palette = window.PROJECTS?.[slug]?.palette || palettes[slug] || [[30, 40, 55], [213, 255, 79], [145, 186, 255], [255, 118, 92]];

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

    const ambient = new THREE.AmbientLight(hex(palette[0]), 1.5);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xd5ffcf, 3.2);
    key.position.set(...lights.key);
    scene.add(key);
    const rim = new THREE.PointLight(hex(palette[3]), 18, 8);
    rim.position.set(...lights.rim);
    scene.add(rim);

    // Man-made satellites (solar-panel probes with a red beacon) orbit this
    // project's planet like a GPS fleet. The count is random per calendar day:
    // a seeded roll between -5 and 5 (any value below 1 means none today), so
    // each day brings a different fleet and it never reshuffles on reload.
    const probes = [];
    // Phones skip the satellite fleet for performance — project pages on
    // small screens keep just the planet and its rings.
    if (!isSmallScreen) {
    const probeParent = new THREE.Group();
    group.add(probeParent);
    {
      const now = new Date();
      const seedKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${slug}`;
      let seed = 1779033703 ^ seedKey.length;
      for (let i = 0; i < seedKey.length; i += 1) {
        seed = Math.imul(seed ^ seedKey.charCodeAt(i), 3432918353);
        seed = (seed << 13) | (seed >>> 19);
      }
      const rand = () => {
        seed = Math.imul(seed ^ (seed >>> 16), 2246822507);
        seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
        seed ^= seed >>> 16;
        return (seed >>> 0) / 4294967296;
      };
      const roll = Math.floor(rand() * 11) - 5; // uniform -5..5
      const probeCount = Math.max(0, roll);
      if (probeCount > 0) {
        const s = .58;
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xc3ccda, metalness: .6, roughness: .35 });
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a63, metalness: .35, roughness: .5 });
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff5540 });
        for (let i = 0; i < probeCount; i += 1) {
          // Each probe orbits in its own tilted plane, like a satellite fleet.
          const plane = new THREE.Group();
          plane.rotation.x = (rand() - .5) * 1.1;
          plane.rotation.y = rand() * Math.PI * 2;
          plane.rotation.z = (rand() - .5) * .6;
          probeParent.add(plane);

          const craft = new THREE.Group();
          const body = new THREE.Mesh(
            new THREE.BoxGeometry(s * .03, s * .035, s * .05),
            bodyMat
          );
          craft.add(body);
          const wingL = new THREE.Mesh(
            new THREE.BoxGeometry(s * .08, s * .004, s * .045),
            panelMat
          );
          wingL.position.x = -s * .055;
          craft.add(wingL);
          const wingR = new THREE.Mesh(
            new THREE.BoxGeometry(s * .08, s * .004, s * .045),
            panelMat
          );
          wingR.position.x = s * .055;
          craft.add(wingR);
          const beacon = new THREE.Mesh(
            new THREE.SphereGeometry(s * .012, 6, 6),
            beaconMat
          );
          beacon.position.y = s * .035;
          craft.add(beacon);
          craft.rotation.x = (rand() - .5) * .7;
          craft.rotation.z = (rand() - .5) * .4;
          plane.add(craft);

          const phase = rand() * Math.PI * 2;
          // Spread the fleet between the planet's atmosphere and the first big
          // decorative ring, with a touch of jitter so they're not uniform.
          const spread = probeCount > 1 ? i / (probeCount - 1) : .5;
          const radius = .95 + (1.95 - .95) * spread + (rand() - .5) * .03;
          const angle = phase;
          craft.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
          probes.push({
            craft,
            radius,
            speed: (.05 + rand() * .11) * (rand() < .5 ? -1 : 1),
            phase,
          });
        }
      }
    }
    }

    return { renderer, scene, camera, group, planet, ring, ringTwo, probes, clock: new THREE.Clock() };
  }

  function wireUp(THREE, handle) {
    const { renderer, scene, camera, group, planet, ring, ringTwo, probes, clock } = handle;

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

    // Like the homepage hero, the planet can be turned by dragging, with a
    // little momentum so it keeps coasting after release.
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let yawVel = 0;
    let pitchVel = 0;
    const clampPitch = (v) => Math.max(-1.1, Math.min(1.1, v));
    canvas.addEventListener('pointerdown', (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      yawVel += dx * .0022;
      pitchVel += dy * .0016;
      yawVel *= .93;
      pitchVel *= .93;
      canvas.style.cursor = 'grabbing';
    }, { passive: true });
    const endDrag = () => {
      dragging = false;
      canvas.style.cursor = '';
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    let isVisible = true;
    let isPageVisible = !document.hidden;
    let animationFrame = 0;
    let lastFrame = performance.now();
    let userYaw = 0;
    let userPitch = 0;

    const render = () => {
      animationFrame = 0;
      if (!isVisible || !isPageVisible) return;
      const now = performance.now();
      const dt = Math.min(.05, Math.max(0, (now - lastFrame) / 1000)) || 1 / 60;
      lastFrame = now;
      const t = clock.getElapsedTime();
      // Momentum: decay gently when released, lightly while dragged.
      const damping = dragging ? Math.pow(.97, dt * 60) : Math.pow(.992, dt * 60);
      yawVel *= damping;
      pitchVel *= damping;
      // Integrate the drag velocity into a persistent offset on top of the
      // idle spin, so it keeps coasting a moment after release.
      userYaw += yawVel * dt;
      userPitch += pitchVel * dt;
      group.rotation.y = t * .09 + userYaw;
      group.rotation.x = Math.sin(t * .17) * .08 + clampPitch(userPitch);
      planet.rotation.y = t * .12;
      ring.rotation.z = t * .03;
      ringTwo.rotation.z = -t * .02;
      probes.forEach((probe) => {
        const angle = t * probe.speed + probe.phase;
        probe.craft.position.set(Math.cos(angle) * probe.radius, 0, Math.sin(angle) * probe.radius);
        probe.craft.rotation.y = t * .6 + probe.phase;
      });
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
