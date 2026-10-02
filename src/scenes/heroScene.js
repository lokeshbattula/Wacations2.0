/**
 * HERO 3D SCENE: a softly lit, layered paper-and-fabric map of India with a
 * paper airplane looping a dotted flight path across the states.
 * Loaded lazily (dynamic import) on capable desktops only.
 */
import * as THREE from 'three';
import { indiaOutline, flightStops, project } from '../data/india.js';
import { paperTexture, blockPrintTexture, glowTexture } from './textures.js';
import { currentTheme } from '../components/theme.js';

const SCALE = 0.36;

const PALETTES = {
  saffron: {
    layers: ['#C9741A', '#F4A024', '#FFF6E8'],
    fabric: { ground: '#F4A024', ink: '#D9851A', accent: '#FFF9F0' },
    pin: '#0B0B3D', path: '#0B0B3D', plane: '#FFFFFF', dust: '#FFC864',
    hemi: ['#FFE9C8', '#7A4A1E', 1.15], sun: ['#FFD8A0', 2.4], shadow: 0.16,
  },
  peacock: {
    layers: ['#082C32', '#C8553D', '#F5EBDD'],
    fabric: { ground: '#C8553D', ink: '#F4A024', accent: '#FFF9F0' },
    pin: '#F4A024', path: '#FFD27A', plane: '#FFF9F0', dust: '#FFD27A',
    hemi: ['#BFE3E0', '#0E3B43', 0.9], sun: ['#FFD27A', 2.0], shadow: 0.35,
  },
};

/** Paper airplane: two wings + a keel, echoing the logo's looping plane. */
function paperPlane(color) {
  const v = new Float32Array([
    // left wing
    0, 0, 0.6, -0.42, 0.02, -0.42, 0, 0, -0.32,
    // right wing
    0, 0, 0.6, 0, 0, -0.32, 0.42, 0.02, -0.42,
    // keel
    0, 0, 0.6, 0, -0.16, -0.38, 0, 0, -0.32,
  ]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(v, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, roughness: 0.65, flatShading: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function createHeroScene(container, { reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, -1.5, 27);

  /* ---- Lights ---- */
  const hemi = new THREE.HemisphereLight();
  const sun = new THREE.DirectionalLight();
  sun.position.set(-7, 8, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -9;
  sun.shadow.camera.right = sun.shadow.camera.top = 9;
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0008;
  scene.add(hemi, sun);

  /* ---- The map group (tilted like a map on a table) ---- */
  const map = new THREE.Group();
  map.rotation.x = -0.82;
  scene.add(map);

  const pts = indiaOutline.map((p) => new THREE.Vector2(...project(p, SCALE)));
  const shape = new THREE.Shape(pts);
  const extrude = { depth: 0.16, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.04, bevelSegments: 2 };
  const geo = new THREE.ExtrudeGeometry(shape, extrude);

  const paper = paperTexture();
  paper.repeat.set(0.18, 0.18);
  let fabric = blockPrintTexture({ ...PALETTES.saffron.fabric, border: false });
  fabric.repeat.set(0.22, 0.22);

  // Three stacked cut-outs: shadow card, block-printed fabric, handmade paper.
  const layerMats = [
    new THREE.MeshStandardMaterial({ roughness: 0.95, map: paper }),
    new THREE.MeshStandardMaterial({ roughness: 0.9, map: fabric }),
    new THREE.MeshStandardMaterial({ roughness: 0.92, map: paper }),
  ];
  const layerCfg = [
    { z: 0, s: 1.0, dx: 0.12, dy: -0.12 },
    { z: 0.24, s: 0.988, dx: 0.04, dy: -0.04 },
    { z: 0.48, s: 0.975, dx: -0.04, dy: 0.04 },
  ];
  layerCfg.forEach((c, i) => {
    const m = new THREE.Mesh(geo, layerMats[i]);
    m.position.set(c.dx, c.dy, c.z);
    m.scale.set(c.s, c.s, 1);
    m.castShadow = m.receiveShadow = true;
    map.add(m);
  });
  const TOP = 0.48 + 0.16 + 0.035;

  // Ground that only shows the soft shadow (the CSS background stays visible).
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.position.z = -0.05;
  ground.receiveShadow = true;
  map.add(ground);

  /* ---- City pins ---- */
  const pinMat = new THREE.MeshStandardMaterial({ roughness: 0.5 });
  const glowTex = glowTexture();
  const pinGlows = [];
  const stops = flightStops.map(([lon, lat]) => new THREE.Vector3(...project([lon, lat], SCALE), TOP));
  stops.forEach((p, i) => {
    const pin = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), pinMat);
    head.position.z = 0.42;
    const stem = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.38, 8), pinMat);
    stem.rotation.x = -Math.PI / 2;
    stem.position.z = 0.2;
    head.castShadow = stem.castShadow = true;
    pin.add(head, stem);
    pin.position.copy(p);
    map.add(pin);
    // flat golden halo printed onto the paper under each pin
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0.85 }),
    );
    glow.position.copy(p).setZ(TOP + 0.01);
    glow.userData.phase = i * 0.8;
    pinGlows.push(glow);
    map.add(glow);
  });

  /* ---- Looping flight path: arcs between stops ---- */
  const curvePts = [];
  stops.forEach((p, i) => {
    const n = stops[(i + 1) % stops.length];
    curvePts.push(p.clone().setZ(TOP + 0.75));
    const mid = p.clone().lerp(n, 0.5);
    mid.z = TOP + 0.75 + p.distanceTo(n) * 0.22;
    curvePts.push(mid);
  });
  const curve = new THREE.CatmullRomCurve3(curvePts, true, 'centripetal');
  const DOTS = 520;
  const dotGeo = new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(DOTS));
  const dotMat = new THREE.PointsMaterial({ size: 0.09, map: glowTexture(32, true), transparent: true, alphaTest: 0.3, depthWrite: false });
  const dots = new THREE.Points(dotGeo, dotMat);
  dotGeo.setDrawRange(0, reduced ? DOTS : 0);
  map.add(dots);

  const plane = paperPlane('#fff');
  plane.scale.setScalar(0.8);
  scene.add(plane);

  /* ---- Floating golden dust ---- */
  const DUST = 140;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 22;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    dustPos[i * 3 + 2] = Math.random() * 6 - 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.12, map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ---- Theme colours ---- */
  function applyTheme(theme) {
    const P = PALETTES[theme] || PALETTES.saffron;
    P.layers.forEach((c, i) => layerMats[i].color.set(c));
    fabric.dispose();
    fabric = blockPrintTexture({ ...P.fabric, border: false });
    fabric.repeat.set(0.22, 0.22);
    layerMats[1].map = fabric;
    layerMats[1].color.set('#ffffff');
    layerMats[1].needsUpdate = true;
    pinMat.color.set(P.pin);
    dotMat.color.set(P.path);
    plane.material.color.set(P.plane);
    dustMat.color.set(P.dust);
    pinGlows.forEach((g) => g.material.color.set(P.dust));
    hemi.color.set(P.hemi[0]); hemi.groundColor.set(P.hemi[1]); hemi.intensity = P.hemi[2];
    sun.color.set(P.sun[0]); sun.intensity = P.sun[1];
    ground.material.opacity = P.shadow;
    requestRender();
  }

  /* ---- Layout: map sits to the right of the ticket on wide screens ---- */
  let mapBaseX = 0;
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 27 * camera.aspect;
    mapBaseX = camera.aspect > 1.05 ? halfW * 0.56 : 0;
    map.position.x = mapBaseX;
    requestRender();
  }

  /* ---- Interaction: mouse parallax + scroll dolly ---- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reduced) window.addEventListener('pointermove', onMove, { passive: true });
  let scrollP = 0;
  const setScroll = (p) => { scrollP = p; requestRender(); };

  /* ---- Loop ---- */
  const clock = new THREE.Clock();
  let running = false, visible = true, raf = 0, introT = 0;
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), up = new THREE.Vector3();

  function placePlane(t) {
    const u = t % 1;
    map.updateMatrixWorld();
    tmp.copy(curve.getPointAt(u));
    tmp2.copy(curve.getPointAt((u + 0.004) % 1));
    map.localToWorld(tmp);
    map.localToWorld(tmp2);
    up.set(0, 0, 1).applyQuaternion(map.quaternion);
    plane.position.copy(tmp);
    plane.up.copy(up);
    plane.lookAt(tmp2);
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    // intro: the dotted path draws itself
    if (introT < 1) {
      introT = Math.min(1, introT + dt / 2.6);
      dotGeo.setDrawRange(0, Math.floor(DOTS * (1 - Math.pow(1 - introT, 3))));
    }
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    map.rotation.x = -0.82 + pointer.y * 0.06 - scrollP * 0.35;
    map.rotation.z = pointer.x * 0.08 + Math.sin(t * 0.2) * 0.02;
    map.position.y = -scrollP * 2.5;
    camera.position.z = 27 - scrollP * 4;

    placePlane(0.02 + t * 0.028);
    plane.rotateZ(Math.sin(t * 2.2) * 0.25);   // gentle wing wobble

    const pos = dustGeo.attributes.position;
    for (let i = 0; i < DUST; i++) {
      let z = pos.getZ(i) + dt * 0.18;
      if (z > 6) z = -1;
      pos.setZ(i, z);
      pos.setX(i, pos.getX(i) + Math.sin(t + i) * 0.002);
    }
    pos.needsUpdate = true;
    pinGlows.forEach((g) => g.scale.setScalar(0.75 + Math.sin(t * 2 + g.userData.phase) * 0.2));

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }

  // Reduced motion: one static frame, re-rendered on resize/theme/scroll only.
  function staticRender() {
    map.rotation.x = -0.82 - scrollP * 0.2;
    placePlane(0.12);
    renderer.render(scene, camera);
  }
  let pending = false;
  function requestRender() {
    if (!reduced || pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; staticRender(); });
  }

  function start() {
    if (reduced || running || !visible || document.hidden) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
  io.observe(container);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  window.addEventListener('themechange', (e) => applyTheme(e.detail.theme));

  applyTheme(currentTheme());
  resize();
  if (reduced) {
    staticRender();
  } else {
    start();
    renderer.domElement.style.opacity = '0';
    renderer.domElement.style.transition = 'opacity 1.2s ease';
    requestAnimationFrame(() => (renderer.domElement.style.opacity = '1'));
  }

  return { setScroll };
}
