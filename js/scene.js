import * as THREE from '../vendor/three/three.module.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 760px)').matches;
const canPilot = window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)').matches;
const canvas = document.querySelector('#heroCanvas');

function createScene() {
  if (!canvas || !window.WebGLRenderingContext || prefersReducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
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

  // A small procedural interceptor for the desktop flight mode. Its nose
  // points down local -Z, which makes the chase camera and thrust controls
  // straightforward to reason about.
  const ship = new THREE.Group();
  ship.position.set(-.2, .05, 17.5);
  ship.rotation.order = 'YXZ';
  ship.scale.setScalar(.001);
  scene.add(ship);
  const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x9db5d9, metalness: .78, roughness: .27, flatShading: true });
  const wingMaterial = new THREE.MeshStandardMaterial({ color: 0x344c72, metalness: .72, roughness: .34, flatShading: true });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xd5ff4f, metalness: .58, roughness: .3, emissive: 0x526510, emissiveIntensity: .42 });
  const cockpitMaterial = new THREE.MeshPhysicalMaterial({ color: 0x5dcfff, metalness: .45, roughness: .12, clearcoat: 1, emissive: 0x0b314f, emissiveIntensity: .65 });
  const engineMaterial = new THREE.MeshStandardMaterial({ color: 0x202734, metalness: .84, roughness: .3 });
  const plumeMaterial = new THREE.MeshBasicMaterial({ color: 0x75ddff, transparent: true, opacity: .64, depthWrite: false });

  const fuselage = new THREE.Mesh(new THREE.ConeGeometry(.37, 2.8, 8), hullMaterial);
  fuselage.rotation.x = -Math.PI / 2;
  ship.add(fuselage);
  const rearBody = new THREE.Mesh(new THREE.CylinderGeometry(.3, .37, .72, 8), hullMaterial);
  rearBody.rotation.x = Math.PI / 2;
  rearBody.position.z = .92;
  ship.add(rearBody);

  const wingShape = new THREE.Shape();
  wingShape.moveTo(-.2, -.48);
  wingShape.lineTo(-1.72, .82);
  wingShape.lineTo(-1.45, 1.12);
  wingShape.lineTo(-.28, .62);
  wingShape.closePath();
  const wingGeometry = new THREE.ExtrudeGeometry(wingShape, {
    depth: .085,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: .035,
    bevelThickness: .025,
  });
  wingGeometry.translate(0, 0, -.0425);
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.rotation.x = Math.PI / 2;
  ship.add(leftWing);
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.rotation.x = Math.PI / 2;
  rightWing.scale.x = -1;
  ship.add(rightWing);

  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(.34, 16, 12), cockpitMaterial);
  cockpit.position.set(0, .2, -.34);
  cockpit.scale.set(.78, .72, 1.55);
  ship.add(cockpit);
  const noseLight = new THREE.Mesh(new THREE.SphereGeometry(.075, 10, 8), trimMaterial);
  noseLight.position.set(0, 0, -1.35);
  ship.add(noseLight);

  const enginePlumes = [];
  for (const side of [-1, 1]) {
    const engine = new THREE.Mesh(new THREE.CylinderGeometry(.14, .19, .72, 10), engineMaterial);
    engine.rotation.x = Math.PI / 2;
    engine.position.set(side * .31, -.04, .86);
    ship.add(engine);
    const nozzle = new THREE.Mesh(new THREE.TorusGeometry(.13, .025, 6, 12), trimMaterial);
    nozzle.position.set(side * .31, -.04, 1.23);
    ship.add(nozzle);
    const plume = new THREE.Mesh(new THREE.ConeGeometry(.105, .58, 8), plumeMaterial.clone());
    plume.rotation.x = Math.PI / 2;
    plume.position.set(side * .31, -.04, 1.55);
    ship.add(plume);
    enginePlumes.push(plume);
    const wingMark = new THREE.Mesh(new THREE.BoxGeometry(.64, .022, .045), trimMaterial);
    wingMark.position.set(side * .94, .06, .48);
    wingMark.rotation.y = side * -.48;
    ship.add(wingMark);
  }
  const engineGlow = new THREE.PointLight(0x63d9ff, 2.4, 4.5);
  engineGlow.position.set(0, 0, 1.55);
  ship.add(engineGlow);

  // A second, much wider star layer fades in as the camera leaves the hero
  // planet. It wraps around the ship while flying so the player can keep
  // moving without reaching the edge of the backdrop.
  const flightStarCount = 1500;
  const flightStarPositions = new Float32Array(flightStarCount * 3);
  const flightStarColors = new Float32Array(flightStarCount * 3);
  for (let i = 0; i < flightStarCount; i += 1) {
    flightStarPositions[i * 3] = (Math.random() - .5) * 190;
    flightStarPositions[i * 3 + 1] = (Math.random() - .5) * 130;
    flightStarPositions[i * 3 + 2] = (Math.random() - .5) * 210;
    color.setHSL(.55 + Math.random() * .08, .35 + Math.random() * .35, .62 + Math.random() * .35);
    flightStarColors[i * 3] = color.r;
    flightStarColors[i * 3 + 1] = color.g;
    flightStarColors[i * 3 + 2] = color.b;
  }
  const flightStarGeometry = new THREE.BufferGeometry();
  const flightStarPositionAttribute = new THREE.BufferAttribute(flightStarPositions, 3);
  flightStarPositionAttribute.setUsage(THREE.DynamicDrawUsage);
  flightStarGeometry.setAttribute('position', flightStarPositionAttribute);
  flightStarGeometry.setAttribute('color', new THREE.BufferAttribute(flightStarColors, 3));
  const flightStarsMaterial = new THREE.PointsMaterial({
    size: .055,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const flightStars = new THREE.Points(flightStarGeometry, flightStarsMaterial);
  flightStars.visible = false;
  scene.add(flightStars);

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

  const flightHud = document.querySelector('#flightHud');
  const flightExitButton = document.querySelector('#flightExit');
  const flightSpeedReadout = document.querySelector('#flightSpeed');
  const flightReticle = document.querySelector('#flightReticle');
  const flightEntry = document.querySelector('.flight-entry');
  const flightPageElements = [
    document.querySelector('.site-header'),
    ...document.querySelectorAll('main > .scene-section:not(.hero)'),
    document.querySelector('.site-footer'),
  ].filter(Boolean);
  const heroCopy = document.querySelector('.hero-copy');
  const heroMeta = [...document.querySelectorAll('.hero-meta')];
  const flightKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'ShiftRight']);
  const launchKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
  const flightVelocity = new THREE.Vector3();
  const flightForward = new THREE.Vector3();
  const flightUp = new THREE.Vector3(0, 1, 0);
  const flightCameraOffset = new THREE.Vector3(0, 2.35, 8.6);
  const flightLookOffset = new THREE.Vector3(0, .2, -1.65);
  const flightCameraGoal = new THREE.Vector3();
  const flightLookGoal = new THREE.Vector3();
  const flightCameraOffsetWorld = new THREE.Vector3();
  const flightLookOffsetWorld = new THREE.Vector3();
  const lastFlightLookTarget = new THREE.Vector3();
  const exitCameraStart = new THREE.Vector3();
  const exitLookStart = new THREE.Vector3();
  const heroCameraPosition = new THREE.Vector3(0, 0, 8.5);
  const heroCameraTarget = new THREE.Vector3(0, 0, 0);
  const flightModeKeys = new Set();
  let flightMode = 'hero';
  let flightTransitionTime = 0;
  let flightReturnScroll = 0;
  let flightYaw = 0;
  let shipYaw = 0;
  let flightPitch = 0;
  let flightRoll = 0;
  let flightThrottle = 0;
  let aimYaw = 0;
  let aimPitch = 0;
  let lastPointerX = window.innerWidth / 2;
  let lastPointerY = window.innerHeight / 2;
  let cameraLookEase = 0;
  const transitionDuration = 2.7;
  const returnDuration = 1.15;
  const smoothstep = (value) => value * value * (3 - 2 * value);
  const updateFlightCameraGoal = () => {
    flightCameraOffsetWorld.copy(flightCameraOffset).applyQuaternion(ship.quaternion);
    flightLookOffsetWorld.copy(flightLookOffset).applyQuaternion(ship.quaternion);
    flightCameraGoal.copy(ship.position).add(flightCameraOffsetWorld);
    flightLookGoal.copy(ship.position).add(flightLookOffsetWorld);
  };
  const setPortfolioHidden = (hidden) => {
    flightPageElements.forEach((element) => {
      element.inert = hidden;
      if (hidden) element.setAttribute('aria-hidden', 'true');
      else element.removeAttribute('aria-hidden');
    });
    if (heroCopy) {
      heroCopy.inert = hidden;
      heroCopy.setAttribute('aria-hidden', String(hidden));
    }
    heroMeta.forEach((element) => element.setAttribute('aria-hidden', String(hidden)));
  };
  const updateAim = (clientX, clientY) => {
    lastPointerX = clientX;
    lastPointerY = clientY;
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    const normalX = (clientX / width) * 2 - 1;
    const normalY = (clientY / height) * 2 - 1;
    aimYaw = -normalX * Math.PI;
    aimPitch = THREE.MathUtils.clamp(-normalY * .72, -.56, .56);
    if (flightReticle) {
      flightReticle.style.left = `${clientX}px`;
      flightReticle.style.top = `${clientY}px`;
    }
  };
  const beginFlight = () => {
    if (!canPilot || flightMode !== 'hero' || !flightHud) return;
    flightReturnScroll = window.scrollY;
    flightVelocity.set(0, 0, 0);
    flightThrottle = 0;
    flightModeKeys.clear();
    ship.position.set(-.2, .05, 17.5);
    updateAim(lastPointerX, lastPointerY);
    flightYaw = 0;
    shipYaw = aimYaw;
    flightPitch = aimPitch;
    flightRoll = 0;
    ship.rotation.set(flightPitch, shipYaw, flightRoll, 'YXZ');
    enginePlumes.forEach((plume) => { plume.material.opacity = 0; });
    engineGlow.intensity = 0;
    ship.scale.setScalar(.001);
    flightMode = 'entering';
    flightTransitionTime = 0;
    camera.position.copy(heroCameraPosition);
    camera.rotation.set(0, 0, 0);
    lastFlightLookTarget.copy(heroCameraTarget);
    flightStars.position.copy(ship.position);
    flightStars.visible = true;
    flightStarsMaterial.opacity = 0;
    document.body.classList.add('spaceflight-active');
    document.body.dataset.flightState = 'entering';
    flightEntry?.setAttribute('aria-hidden', 'true');
    flightHud.setAttribute('aria-hidden', 'false');
    setPortfolioHidden(true);
    clearHover();
    dragging = false;
  };
  const exitFlight = () => {
    if (flightMode !== 'entering' && flightMode !== 'playing') return;
    flightMode = 'exiting';
    flightTransitionTime = 0;
    exitCameraStart.copy(camera.position);
    exitLookStart.copy(lastFlightLookTarget);
    flightModeKeys.clear();
    document.body.dataset.flightState = 'exiting';
    flightHud?.setAttribute('aria-hidden', 'true');
  };
  const finishFlight = () => {
    flightMode = 'hero';
    flightVelocity.set(0, 0, 0);
    flightThrottle = 0;
    flightModeKeys.clear();
    flightStars.visible = false;
    flightStarsMaterial.opacity = 0;
    ship.scale.setScalar(.001);
    document.body.classList.remove('spaceflight-active');
    document.body.removeAttribute('data-flight-state');
    flightEntry?.removeAttribute('aria-hidden');
    flightHud?.setAttribute('aria-hidden', 'true');
    setPortfolioHidden(false);
    if (document.activeElement === flightExitButton) flightExitButton.blur();
    window.scrollTo(0, flightReturnScroll);
  };

  if (canPilot) {
    document.addEventListener('keydown', (event) => {
      if (flightMode === 'hero') {
        if (!launchKeys.has(event.code) || window.scrollY > 36) return;
        event.preventDefault();
        beginFlight();
        flightModeKeys.add(event.code);
        return;
      }
      if (event.code === 'Escape') {
        event.preventDefault();
        exitFlight();
        return;
      }
      if (flightKeys.has(event.code)) {
        event.preventDefault();
        if (flightMode !== 'exiting') flightModeKeys.add(event.code);
      }
    });
    document.addEventListener('keyup', (event) => flightModeKeys.delete(event.code));
    document.addEventListener('pointermove', (event) => {
      if (flightMode === 'hero') {
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        return;
      }
      if (flightMode !== 'exiting') updateAim(event.clientX, event.clientY);
    }, { passive: true });
    window.addEventListener('blur', () => flightModeKeys.clear());
    flightExitButton?.addEventListener('click', exitFlight);
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
    if (flightMode !== 'hero') return;
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
    if (flightMode !== 'hero') return;
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
    if (flightMode !== 'hero') return;
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
    if (flightMode === 'hero') {
      camera.position.set(0, 0, 8.5 - p * .5);
      camera.rotation.set(-p * .22, 0, 0);
    } else if (flightMode === 'entering') {
      flightTransitionTime = Math.min(1, flightTransitionTime + dt / transitionDuration);
      const ease = smoothstep(flightTransitionTime);
      updateFlightCameraGoal();
      ship.scale.setScalar(Math.max(.001, ease));
      flightStars.position.copy(ship.position);
      flightStarsMaterial.opacity = ease * .86;
      camera.position.lerpVectors(heroCameraPosition, flightCameraGoal, ease);
      lastFlightLookTarget.lerpVectors(heroCameraTarget, flightLookGoal, ease);
      camera.fov = 38 + 4 * ease;
      camera.updateProjectionMatrix();
      camera.lookAt(lastFlightLookTarget);
      if (flightTransitionTime >= 1) {
        flightMode = 'playing';
        document.body.dataset.flightState = 'playing';
      }
    } else if (flightMode === 'playing') {
      const steeringEase = 1 - Math.exp(-dt * 4.2);
      const turnInput = (flightModeKeys.has('KeyD') ? 1 : 0) - (flightModeKeys.has('KeyA') ? 1 : 0);
      flightYaw -= turnInput * 1.85 * dt;
      const desiredYaw = flightYaw + aimYaw;
      const yawDifference = Math.atan2(Math.sin(desiredYaw - shipYaw), Math.cos(desiredYaw - shipYaw));
      shipYaw += yawDifference * steeringEase;
      flightPitch += (aimPitch - flightPitch) * steeringEase;
      const thrust = (flightModeKeys.has('KeyW') ? 1 : 0) - (flightModeKeys.has('KeyS') ? 1 : 0);
      const lift = (flightModeKeys.has('Space') ? 1 : 0)
        - (flightModeKeys.has('ShiftLeft') || flightModeKeys.has('ShiftRight') ? 1 : 0);
      const bank = -turnInput * .48 - yawDifference * .08;
      flightRoll += (bank - flightRoll) * (1 - Math.exp(-dt * 5));
      ship.rotation.set(flightPitch, shipYaw, flightRoll, 'YXZ');
      flightForward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize();
      if (thrust === 0) {
        flightThrottle = 0;
      } else {
        const targetThrottle = thrust > 0 ? 12 : -5.5;
        flightThrottle += (targetThrottle - flightThrottle) * (1 - Math.exp(-dt * 2.4));
      }
      flightVelocity.copy(flightForward).multiplyScalar(flightThrottle);
      flightVelocity.addScaledVector(flightUp, lift * 5.4);
      ship.position.addScaledVector(flightVelocity, dt);

      updateFlightCameraGoal();
      cameraLookEase = 1 - Math.exp(-dt * 5.2);
      camera.position.lerp(flightCameraGoal, cameraLookEase);
      lastFlightLookTarget.lerp(flightLookGoal, cameraLookEase);
      camera.fov += (42 - camera.fov) * (1 - Math.exp(-dt * 2.4));
      camera.updateProjectionMatrix();
      camera.lookAt(lastFlightLookTarget);

      const speed = flightVelocity.length();
      if (flightSpeedReadout) flightSpeedReadout.textContent = speed.toFixed(1);
      const engineOn = flightModeKeys.has('KeyW');
      const enginePulse = engineOn ? .78 + Math.min(.22, speed / 28) + Math.sin(t * 17) * .06 : 0;
      enginePlumes.forEach((plume, index) => {
        plume.material.opacity = enginePulse;
        plume.scale.y = engineOn ? .72 + Math.min(.7, speed / 24) + Math.sin(t * 19 + index) * .08 : .001;
      });
      engineGlow.intensity = engineOn ? 2.2 + speed * .13 + Math.sin(t * 12) * .35 : 0;

      const wrapRadius = 95;
      for (let i = 0; i < flightStarCount; i += 1) {
        const offset = i * 3;
        flightStarPositions[offset] -= flightVelocity.x * dt * 2.1;
        flightStarPositions[offset + 1] -= flightVelocity.y * dt * 2.1;
        flightStarPositions[offset + 2] -= flightVelocity.z * dt * 2.1;
        for (let axis = 0; axis < 3; axis += 1) {
          const limit = axis === 1 ? 65 : wrapRadius;
          if (flightStarPositions[offset + axis] > limit) flightStarPositions[offset + axis] -= limit * 2;
          else if (flightStarPositions[offset + axis] < -limit) flightStarPositions[offset + axis] += limit * 2;
        }
      }
      flightStarPositionAttribute.needsUpdate = true;
      flightStars.position.copy(ship.position);
    } else if (flightMode === 'exiting') {
      flightTransitionTime = Math.min(1, flightTransitionTime + dt / returnDuration);
      const ease = smoothstep(flightTransitionTime);
      ship.scale.setScalar(Math.max(.001, 1 - ease));
      flightStarsMaterial.opacity = .86 * (1 - ease);
      camera.position.lerpVectors(exitCameraStart, heroCameraPosition, ease);
      lastFlightLookTarget.lerpVectors(exitLookStart, heroCameraTarget, ease);
      camera.fov = 42 - 4 * ease;
      camera.updateProjectionMatrix();
      camera.lookAt(lastFlightLookTarget);
      flightStars.position.copy(ship.position);
      if (flightTransitionTime >= 1) finishFlight();
    }
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
