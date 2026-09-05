import * as THREE from '../vendor/three/three.module.js';

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

  // Vocabulary used in this scene (kept distinct so future edits don't
  // conflate the two kinds of orbiters):
  //   - "orbital planets": one small planet per project, riding a ring
  //     around the main planet (the user's "project planets").
  //   - "satellites": man-made solar-panel probes with a red beacon, the
  //     GPS-style fleet whose count is random per calendar day.
  // Everything (the planet system and the starfield) lives inside one
  // container so dragging rotates the whole space together: the planet, its
  // rings, every orbital planet, the satellites, and the stars all turn as
  // one massive body.
  const universe = new THREE.Group();
  universe.position.set(isSmallScreen ? 1.15 : 2.1, 0, 0);
  scene.add(universe);

  const group = new THREE.Group();
  group.position.set(0, .05, 0);
  universe.add(group);

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
    new THREE.MeshBasicMaterial({ color: 0xd5ff4f, transparent: true, opacity: .2, side: THREE.DoubleSide })
  );
  ring.rotation.set(.52, -.34, -.17);
  ring.userData.kind = 'ring';
  group.add(ring);

  const ringTwo = new THREE.Mesh(
    new THREE.TorusGeometry(2.43, .006, 6, isSmallScreen ? 48 : 80),
    new THREE.MeshBasicMaterial({ color: 0xff765c, transparent: true, opacity: .12, side: THREE.DoubleSide })
  );
  ringTwo.rotation.set(-.25, .7, .4);
  ringTwo.userData.kind = 'ringTwo';
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
  universe.add(stars);

  scene.add(new THREE.AmbientLight(0x7f98c9, 1.5));
  const key = new THREE.DirectionalLight(0xd5ffcf, 3.2);
  key.position.set(-4, 3, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xff765c, 18, 8);
  rim.position.set(3, -2, 2);
  scene.add(rim);

  // One orbital planet per project, riding a ring around the main planet like
  // a solar system. Built from the shared project data, so adding or removing
  // a project automatically adds or removes its orbital planet, and its color
  // follows the project's own palette (surface color) like on the project
  // pages. Every orbital planet rides one of the rings around the main
  // planet: each project gets its own ring at its own distance, all sharing a
  // ring-plane tilt like the main planet's decorative rings.
  const hex = (rgb) => (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
  const slugs = window.PROJECTS ? Object.keys(window.PROJECTS) : [];
  // Vertical flattening of the orbit ellipses. Chosen so the closest approach
  // (radius * orbitEllipse) stays well outside the main planet's sphere.
  const orbitEllipse = .78;
  // Shared ring-plane tilt, echoing the main planet's rings, so the orbits
  // read as rings around the planet instead of flat target circles.
  const orbitGroup = new THREE.Group();
  orbitGroup.rotation.set(.5, -.3, -.15);
  group.add(orbitGroup);

  // Every ring (accent orbit rings + the two main rings) gets an invisible
  // wider twin used only for hover detection, so a passing cursor can pick it
  // up without needing pixel-perfect precision on a hair-thin torus.
  const ringHits = [];
  const baseOpacity = { ring: .2, ringTwo: .12, orbit: .15 };
  const addRing = (mesh, parent) => {
    const hit = new THREE.Mesh(
      new THREE.TorusGeometry(mesh.geometry.parameters.radius, .28, 6, 48),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
    );
    hit.rotation.copy(mesh.rotation);
    hit.scale.copy(mesh.scale);
    hit.position.copy(mesh.position);
    parent.add(hit);
    ringHits.push({ hit, ring: mesh });
    return mesh;
  };
  // The two main decorative rings are hoverable too.
  addRing(ring, group);
  addRing(ringTwo, group);

  // Carrier groups that copy each main ring's orientation, so an orbital
  // planet placed in one of them orbits exactly inside that ring's own plane.
  const mainRingCarriers = [ring, ringTwo].map((ringMesh) => {
    const carrier = new THREE.Group();
    carrier.rotation.set(ringMesh.rotation.x, ringMesh.rotation.y, ringMesh.rotation.z);
    group.add(carrier);
    return carrier;
  });

  const orbitalPlanets = slugs.map((slug, index) => {
    const palette = window.PROJECTS[slug]?.palette || [null, [232, 236, 245], [213, 255, 79], [255, 118, 92]];
    // The first two projects ride the main planet's existing rings (radii
    // 2.12 / 2.43); the rest get their own ring at their own distance.
    const onMainRing = index < 2;
    // Unique ring per planet: the first two ride the main rings, the rest get
    // their own lane spread evenly from 2.62 out to ~3.95, so no two planets
    // share a ring and every ring has generous air around it.
    const outerCount = Math.max(1, slugs.length - 2);
    const step = outerCount > 1 ? 1.33 / (outerCount - 1) : 0;
    const radius = onMainRing ? [2.12, 2.43][index] : 2.62 + (index - 2) * step;
    const tilt = onMainRing ? 0 : (index % 3) * .09;
    const ellipse = onMainRing ? 1 : orbitEllipse;
    const size = .06 + (index % 5) * .01;
    const parent = onMainRing ? mainRingCarriers[index] : orbitGroup;

    let orbit = null;
    if (!onMainRing) {
      // This project's ring around the main planet, styled like the main rings.
      orbit = new THREE.Mesh(
        new THREE.TorusGeometry(radius, .005, 6, 96),
        new THREE.MeshBasicMaterial({ color: palette[2] ? hex(palette[2]) : 0x9db4e0, transparent: true, opacity: baseOpacity.orbit, side: THREE.DoubleSide })
      );
      orbit.scale.y = ellipse;
      orbit.position.y = tilt;
      orbit.userData.kind = 'orbit';
      orbitGroup.add(orbit);
      addRing(orbit, orbitGroup);
    } else {
      // Riding a main ring: that ring is the hover target for this orbital
      // planet.
      const mainRingMesh = [ring, ringTwo][index];
      orbit = mainRingMesh;
    }

    // Low-poly icosahedron like the main planet, so the tiny orbiters share
    // the same faceted character (a smooth sphere broke the visual family).
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(size, 1),
      new THREE.MeshStandardMaterial({
        color: palette[1] ? hex(palette[1]) : 0xe8ecf5,
        roughness: .45,
        metalness: .1,
        flatShading: true,
      })
    );
    mesh.userData = {
      slug,
      radius,
      speed: .16 + (index % 6) * .025,
      offset: (index / Math.max(1, slugs.length)) * Math.PI * 2,
      tilt,
      ellipse,
      orbit,
    };
    parent.add(mesh);
    return mesh;
  });

  // Man-made satellites (solar-panel craft with a red beacon) orbit the main
  // planet, like the GPS fleet around Earth. How many appear is random per
  // calendar day: a seeded roll between -5 and 10 (any value below 1 means
  // none that day), so every day brings a different fleet and reloading never
  // reshuffles it.
  const satellites = [];
  // Phones skip the fleet entirely: the satellite mesh overhead isn't worth it
  // on low-end mobile GPUs, so small screens keep only the orbital planets.
  if (!isSmallScreen) {
  const satelliteParent = new THREE.Group();
  group.add(satelliteParent);
  {
    const now = new Date();
    const seedKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-main`;
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
    const roll = Math.floor(rand() * 16) - 5; // uniform -5..10
    const satelliteCount = Math.max(0, roll);
    if (satelliteCount > 0) {
      // Craft sized relative to the planet so proportions stay sane (GPS
      // satellites are small next to the body they circle).
      const s = 1.48;
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xc3ccda, metalness: .6, roughness: .35 });
      const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a63, metalness: .35, roughness: .5 });
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff5540 });
      for (let i = 0; i < satelliteCount; i += 1) {
        // Each satellite has its own tilted orbital plane, like the ring
        // system, so the fleet doesn't all travel in one flat disc.
        const plane = new THREE.Group();
        plane.rotation.x = (rand() - .5) * 1.1;
        plane.rotation.y = rand() * Math.PI * 2;
        plane.rotation.z = (rand() - .5) * .6;
        satelliteParent.add(plane);

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
        // Spread the fleet across the band between the planet's atmosphere and
        // the inner ring, with a touch of jitter so they're not evenly spaced.
        const spread = satelliteCount > 1 ? i / (satelliteCount - 1) : .5;
        const radius = 1.74 + (2.03 - 1.74) * spread + (rand() - .5) * .02;
        const angle = phase;
        craft.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        satellites.push({
          craft,
          radius,
          speed: (.05 + rand() * .11) * (rand() < .5 ? -1 : 1),
          phase,
        });
      }
    }
  }
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const ringHitMeshes = ringHits.map(({ hit }) => hit);
  const pickAt = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    // Orbital planets get priority: each one sits right on its ring, whose fat
    // invisible hover-twin would otherwise be picked first and swallow the
    // planet's hand cursor. Only fall back to rings when no planet is hit.
    const orbitalPlanetHits = raycaster.intersectObjects(orbitalPlanets);
    if (orbitalPlanetHits.length) return orbitalPlanetHits[0].object;
    const ringHitsResult = raycaster.intersectObjects(ringHitMeshes);
    return ringHitsResult.length ? ringHitsResult[0].object : null;
  };

  let hoveredRing = null;
  const setRingOpacity = (mesh, opacity) => {
    if (mesh?.material) mesh.material.opacity = opacity;
  };
  const clearHover = () => {
    if (hoveredRing) {
      setRingOpacity(hoveredRing, baseOpacity[hoveredRing.userData.kind] ?? .15);
      hoveredRing = null;
    }
  };
  const applyHover = (hit) => {
    let ring = null;
    if (hit?.userData?.slug) {
      // Hovering an orbital planet highlights its own orbit ring.
      ring = hit.userData.orbit;
    } else if (hit) {
      const entry = ringHits.find(({ hit: h }) => h === hit);
      if (entry) ring = entry.ring;
    }
    if (ring !== hoveredRing) {
      clearHover();
      if (ring) {
        hoveredRing = ring;
        setRingOpacity(ring, .85);
      }
    }
  };

  // Dragging rotates the whole universe (planet, rings, orbital planets,
  // satellites, stars) with heavy inertia: the body resists quick motion,
  // keeps gliding after you release, and gradually slows — like turning a
  // massive object.
  let dragging = false;
  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let yawVel = 0;
  let pitchVel = 0;
  const clampPitch = (v) => Math.max(-1.1, Math.min(1.1, v));
  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    downX = event.clientX;
    downY = event.clientY;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  });
  // A drag on the scene must never trigger the browser's native selection or
  // drag behavior — otherwise a grab that sweeps over the hero title leaves
  // blue text highlights behind.
  canvas.addEventListener('selectstart', (event) => event.preventDefault());
  canvas.addEventListener('dragstart', (event) => event.preventDefault());
  canvas.addEventListener('pointermove', (event) => {
    if (dragging) {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      // Impulse from the pointer: still softened so it never snaps, but
      // responsive enough that the space turns with the hand comfortably.
      yawVel += dx * .0022;
      pitchVel += dy * .0016;
      yawVel *= .93;
      pitchVel *= .93;
      canvas.style.cursor = 'grabbing';
      return;
    }
    const hit = pickAt(event.clientX, event.clientY);
    // Only orbital planets navigate (they link to their project page), so only
    // they get the pointer cursor — rings just highlight, they don't click.
    canvas.style.cursor = hit?.userData?.slug ? 'pointer' : '';
    applyHover(hit);
  }, { passive: true });
  const endDrag = () => {
    dragging = false;
    canvas.style.cursor = '';
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('click', (event) => {
    // A click is a press with (almost) no travel — ignore anything that
    // actually dragged the scene. Net displacement, not accumulated jitter.
    const traveled = Math.hypot(event.clientX - downX, event.clientY - downY);
    if (dragging || traveled > 6) return;
    const hit = pickAt(event.clientX, event.clientY);
    if (hit?.userData?.slug) window.location.href = `projects/${hit.userData.slug}/`;
  });
  canvas.addEventListener('pointerleave', () => {
    if (!dragging) clearHover();
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
  let lastFrame = performance.now();
  // Establishing shot on load: the system eases from a slightly wider viewing
  // angle down to a composed resting rotation, so the page opens on a nice
  // 3/4 view of the planet with its rings instead of a head-on frame. The
  // entrance hands over to drag control the moment the user grabs it.
  const restYaw = -.6;
  const restPitch = .3;
  const startYaw = -1.05;
  const startPitch = .55;
  let entrance = 0;
  let entranceDone = false;
  const render = () => {
    animationFrame = 0;
    if (!isVisible || !isPageVisible) return;
    const now = performance.now();
    const dt = Math.min(.05, Math.max(0, (now - lastFrame) / 1000)) || 1 / 60;
    lastFrame = now;
    const t = clock.getElapsedTime();
    const p = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
    if (!entranceDone) {
      if (dragging) {
        // User took control — settle on the current angle and let the drag
        // velocities take over from here.
        entranceDone = true;
      } else {
        entrance += dt / 1.6;
        if (entrance >= 1) {
          entrance = 1;
          entranceDone = true;
        }
        const ease = 1 - Math.pow(1 - entrance, 3);
        universe.rotation.y = startYaw + (restYaw - startYaw) * ease;
        universe.rotation.x = startPitch + (restPitch - startPitch) * ease;
      }
    }
    // Momentum: velocities decay gently when released (so it coasts a little)
    // and are damped only lightly while dragged, so turning feels easy.
    const damping = dragging ? Math.pow(.97, dt * 60) : Math.pow(.992, dt * 60);
    yawVel *= damping;
    pitchVel *= damping;
    let yaw = universe.rotation.y + yawVel * dt;
    let pitch = clampPitch(universe.rotation.x + pitchVel * dt);
    universe.rotation.y = yaw;
    universe.rotation.x = pitch;
    group.rotation.y = t * .09;
    group.rotation.x = Math.sin(t * .17) * .08 - p * .25;
    planet.rotation.y = t * .12;
    ring.rotation.z = t * .03 - p * .5;
    ringTwo.rotation.z = -t * .02 + p * .35;
    stars.rotation.y = t * .008 + p * .12;
    orbitalPlanets.forEach((orbitalPlanet) => {
      const { radius, speed, offset, tilt, ellipse } = orbitalPlanet.userData;
      const angle = t * speed + offset;
      orbitalPlanet.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * ellipse + tilt,
        0
      );
    });
    satellites.forEach((satellite) => {
      const angle = t * satellite.speed + satellite.phase;
      // Orbit inside the satellite's own tilted plane (circle in its local
      // XZ), plus a slow self-spin so the solar panels catch the light.
      satellite.craft.position.set(Math.cos(angle) * satellite.radius, 0, Math.sin(angle) * satellite.radius);
      satellite.craft.rotation.y = t * .6 + satellite.phase;
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
