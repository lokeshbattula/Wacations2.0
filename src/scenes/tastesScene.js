/**
 * EIGHT TASTES 3D: one WebGL renderer draws all eight models, each into its own
 * card via scissor/viewport (far cheaper than eight WebGL contexts).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { builders } from './tastesModels.js';
import { currentTheme } from '../components/theme.js';

export function createTastesScene({ canvas, wrap, stages, experiences, reduced = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setScissorTest(true);
  renderer.setClearColor(0x000000, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const items = experiences.map((exp, i) => {
    const scene = new THREE.Scene();
    scene.environment = envTex;
    const hemi = new THREE.HemisphereLight('#FFF1DC', '#5a3a20', 1.1);
    const key = new THREE.DirectionalLight('#FFE2B8', 1.8);
    key.position.set(3, 5, 4);
    const rim = new THREE.DirectionalLight('#FFC864', 1.2);
    rim.position.set(-4, 2, -3);
    scene.add(hemi, key, rim);

    const built = builders[exp.model]();
    const pivot = new THREE.Group();
    pivot.add(built.object);
    scene.add(pivot);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 1.5, 7.2);
    camera.lookAt(0, 0, 0);

    return {
      scene, camera, pivot, hemi, update: built.update, stage: stages[i],
      rotY: 0.5 - i * 0.2, rotX: 0.12, vel: 0, tiltT: 0.12,
      energy: 0, hovered: false, grabbed: false, scale: 1,
    };
  });

  /* ---- theme: cooler fill light on the peacock theme ---- */
  const applyTheme = (t) => items.forEach((it) => {
    it.hemi.color.set(t === 'peacock' ? '#CDEBE7' : '#FFF1DC');
    it.hemi.groundColor.set(t === 'peacock' ? '#0E3B43' : '#5a3a20');
  });
  applyTheme(currentTheme());
  window.addEventListener('themechange', (e) => { applyTheme(e.detail.theme); dirty = true; });

  /* ---- sizing ---- */
  let W = 0, H = 0, dirty = true;
  const resize = () => {
    W = wrap.clientWidth; H = wrap.clientHeight;
    renderer.setSize(W, H, false);
    dirty = true;
  };
  new ResizeObserver(resize).observe(wrap);
  resize();

  /* ---- loop (only while the section is on screen) ---- */
  const clock = new THREE.Clock();
  let running = false, raf = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const wrapRect = wrap.getBoundingClientRect();
    let active = dirty;

    items.forEach((it) => {
      const target = it.hovered || it.grabbed ? 1 : 0;
      it.energy += (target - it.energy) * Math.min(1, dt * 6);
      if (!it.grabbed) {
        if (!reduced) it.vel += (0.35 + it.energy * 0.9 - it.vel) * Math.min(1, dt * 1.5); // idle spin
        else it.vel *= 0.9;
        it.rotY += it.vel * dt;
        it.tiltT += (0.12 - it.tiltT) * dt * 2;
      }
      it.rotX += (it.tiltT - it.rotX) * Math.min(1, dt * 8);
      it.scale += ((1 + it.energy * 0.1) - it.scale) * Math.min(1, dt * 8);
      it.pivot.rotation.set(it.rotX, it.rotY, 0);
      it.pivot.scale.setScalar(it.scale);
      if (!reduced || it.energy > 0.01) it.update?.(t, dt, it.energy);
      if (reduced && (Math.abs(it.vel) > 0.001 || it.grabbed || Math.abs(target - it.energy) > 0.005)) active = true;
    });
    if (!reduced) active = true;

    if (active) {
      renderer.setScissor(0, 0, W, H);
      renderer.clear();
      items.forEach((it) => {
        const r = it.stage.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) return;
        const x = r.left - wrapRect.left;
        const y = H - (r.bottom - wrapRect.top);
        renderer.setViewport(x, y, r.width, r.height);
        renderer.setScissor(x, y, r.width, r.height);
        it.camera.aspect = r.width / r.height;
        it.camera.updateProjectionMatrix();
        renderer.render(it.scene, it.camera);
      });
      dirty = false;
    }
    if (running) raf = requestAnimationFrame(frame);
  }

  const start = () => { if (running) return; running = true; clock.getDelta(); raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '100px' }).observe(wrap);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  return {
    hover(i, on) { items[i].hovered = on; items[i].stage.closest('.taste').classList.toggle('is-active', on); },
    grab(i, on) {
      const it = items[i];
      it.grabbed = on;
      if (on) it.vel = 0;
    },
    drag(i, dx, dy) {
      const it = items[i];
      it.rotY += dx * 0.012;
      it.vel = dx * 0.6; // carries into a flick on release
      it.tiltT = THREE.MathUtils.clamp(it.tiltT + dy * 0.008, -0.5, 0.9);
    },
  };
}
