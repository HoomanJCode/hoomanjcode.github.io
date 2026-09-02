// Live top-down low-poly visual for the Impasse project card.
const boatCanvas = document.querySelector('#boatCanvas');
if (boatCanvas && window.THREE) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 2, -2, .1, 100);
  camera.position.set(0, 6.8, .15);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ canvas: boatCanvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x111c34, 1);

  const world = new THREE.Group();
  world.rotation.y = -.12;
  scene.add(world);
  const lake = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 6, 18, 14),
    new THREE.MeshStandardMaterial({ color: 0x233a75, roughness: .7, metalness: .05, flatShading: true })
  );
  lake.rotation.x = -Math.PI / 2;
  world.add(lake);

  const ripples = [];
  const rippleMaterial = new THREE.MeshBasicMaterial({ color: 0x91baff, transparent: true, opacity: .28, side: THREE.DoubleSide });
  for (let i = 0; i < 15; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(.08, .095, 20), rippleMaterial.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(-3.4 + (i * 1.71) % 6.8, -2.4 + ((i * .91) % 4.7), .025);
    ring.userData.phase = i * .73;
    ring.userData.base = .65 + (i % 4) * .12;
    world.add(ring); ripples.push(ring);
  }

  const padMaterial = new THREE.MeshStandardMaterial({ color: 0x315486, roughness: .9, flatShading: true });
  const flowerMaterial = new THREE.MeshBasicMaterial({ color: 0xd5ff4f });
  const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xff765c });
  for (let i = 0; i < 10; i++) {
    const pad = new THREE.Mesh(new THREE.CircleGeometry(.14 + (i % 3) * .035, 7), padMaterial);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(-3.1 + (i * 1.37) % 6.2, -2.1 + ((i * 1.11) % 4.1), .06);
    world.add(pad);
    if (i % 2 === 0) {
      const flower = new THREE.Group();
      for (let p = 0; p < 5; p++) {
        const petal = new THREE.Mesh(new THREE.CircleGeometry(.055, 6), flowerMaterial);
        petal.rotation.x = -Math.PI / 2;
        const angle = p * Math.PI * 2 / 5;
        petal.position.set(Math.cos(angle) * .06, .075, Math.sin(angle) * .06);
        flower.add(petal);
      }
      const center = new THREE.Mesh(new THREE.CircleGeometry(.027, 8), centerMaterial);
      center.rotation.x = -Math.PI / 2; center.position.y = .078; flower.add(center);
      flower.position.copy(pad.position); flower.position.y += .02; world.add(flower);
    }
  }

  const anchor = new THREE.Group();
  const wood = new THREE.Mesh(new THREE.CylinderGeometry(.25, .3, .16, 8), new THREE.MeshStandardMaterial({ color: 0xff765c, roughness: .85, flatShading: true }));
  wood.rotation.x = -Math.PI / 2; anchor.add(wood);
  const woodCore = new THREE.Mesh(new THREE.CylinderGeometry(.13, .16, .18, 8), new THREE.MeshStandardMaterial({ color: 0x080a0e, roughness: 1, flatShading: true }));
  woodCore.rotation.x = -Math.PI / 2; woodCore.position.z = .02; anchor.add(woodCore);
  anchor.position.set(2.25, .16, -.6); world.add(anchor);

  const boat = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(.62, 1.05, 4, 10), new THREE.MeshStandardMaterial({ color: 0xd5ff4f, roughness: .58, metalness: .08, flatShading: true }));
  hull.scale.set(1, .16, .48); hull.rotation.y = Math.PI / 2; hull.position.y = .28; boat.add(hull);
  const inside = new THREE.Mesh(new THREE.CapsuleGeometry(.44, .76, 4, 10), new THREE.MeshStandardMaterial({ color: 0x668ee2, roughness: .72, flatShading: true }));
  inside.scale.set(1, .08, .38); inside.rotation.y = Math.PI / 2; inside.position.y = .36; boat.add(inside);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(.14, .05, .55), new THREE.MeshStandardMaterial({ color: 0xff765c, roughness: .7, flatShading: true }));
  seat.position.set(-.1, .44, 0); boat.add(seat);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(.035, .05, .62, 6), new THREE.MeshStandardMaterial({ color: 0xf0eee8, flatShading: true }));
  mast.position.y = .68; boat.add(mast);
  boat.position.set(-.65, .18, .15); world.add(boat);

  const ropeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(.0, .46, .15), new THREE.Vector3(.75, .34, .2),
    new THREE.Vector3(1.35, .28, -.05), new THREE.Vector3(2.25, .25, -.6),
  ]);
  const rope = new THREE.Mesh(new THREE.TubeGeometry(ropeCurve, 24, .018, 5, false), new THREE.MeshBasicMaterial({ color: 0xf0eee8, transparent: true, opacity: .8 }));
  world.add(rope);

  scene.add(new THREE.AmbientLight(0x91baff, 2.2));
  const key = new THREE.DirectionalLight(0xf0eee8, 2.6); key.position.set(-3, 6, 2); scene.add(key);
  let visible = true, frame = 0, last = 0;
  const resize = () => {
    const rect = boatCanvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    const aspect = rect.width / Math.max(1, rect.height);
    camera.left = -3 * aspect; camera.right = 3 * aspect; camera.top = 2; camera.bottom = -2; camera.updateProjectionMatrix();
  };
  const render = (now) => {
    frame = 0; if (!visible) return;
    const t = now / 1000, dt = Math.min(.04, (now - last) / 1000 || .016); last = now;
    if (!reducedMotion) {
      boat.position.y = .18 + Math.sin(t * 1.15) * .035;
      boat.rotation.y = Math.sin(t * .7) * .035;
      rope.rotation.y = Math.sin(t * .7) * .01;
      ripples.forEach((ring, i) => { const pulse = (Math.sin(t * .8 + ring.userData.phase) + 1) / 2; ring.scale.setScalar(ring.userData.base + pulse * .55); ring.material.opacity = .12 + pulse * .18; });
      world.rotation.z = Math.sin(t * .12) * .008;
    }
    renderer.render(scene, camera);
    if (!reducedMotion) frame = requestAnimationFrame(render);
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(render); }, { threshold: 0 });
  observer.observe(boatCanvas);
  window.addEventListener('resize', resize, { passive: true });
  resize();
  if (reducedMotion) render(0); else frame = requestAnimationFrame(render);
}
