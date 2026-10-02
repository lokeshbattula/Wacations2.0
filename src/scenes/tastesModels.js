/**
 * Low-poly builders for the "Eight Tastes of India" objects.
 * Each builder returns { object, update?(t, dt, energy) } where `energy` (0 → 1)
 * rises while the card is hovered or dragged.
 */
import * as THREE from 'three';
import { blockPrintTexture, glowTexture } from './textures.js';

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, flatShading: true, ...o });
const lathe = (pts, seg = 18) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const mesh = (geo, m, pos, rot) => {
  const o = new THREE.Mesh(geo, m);
  if (pos) o.position.set(...pos);
  if (rot) o.rotation.set(...rot);
  return o;
};
const glow = glowTexture();
const sprite = (color, size, opacity = 1) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.scale.setScalar(size);
  return s;
};

/* 1. Kulhad chai with rising steam */
function chai() {
  const g = new THREE.Group();
  const clay = mat('#B5562E', { roughness: 0.95 });
  g.add(mesh(lathe([[0, 0], [0.48, 0], [0.54, 0.06], [0.72, 1.1], [0.76, 1.16], [0.7, 1.18], [0.64, 1.08], [0.46, 0.16], [0, 0.16]], 14), clay, [0, -0.6, 0]));
  g.add(mesh(new THREE.CircleGeometry(0.64, 14), mat('#C98B5A', { roughness: 0.4, flatShading: false }), [0, 0.42, 0], [-Math.PI / 2, 0, 0]));
  g.add(mesh(new THREE.CylinderGeometry(1.15, 1.2, 0.1, 20), mat('#6B3B1F'), [0, -0.66, 0]));
  // a couple of rusks on the tray
  const rusk = mat('#D9A15A');
  g.add(mesh(new THREE.BoxGeometry(0.5, 0.12, 0.26), rusk, [0.62, -0.55, 0.55], [0, 0.6, 0.05]));
  g.add(mesh(new THREE.BoxGeometry(0.5, 0.12, 0.26), rusk, [0.75, -0.43, 0.4], [0, 0.2, -0.08]));
  // steam puffs
  const puffs = [];
  for (let i = 0; i < 12; i++) {
    const s = sprite('#ffffff', 0.45, 0.0);
    s.material.blending = THREE.NormalBlending;
    s.userData = { off: i / 12, x: (Math.random() - 0.5) * 0.4 };
    puffs.push(s);
    g.add(s);
  }
  return {
    object: g,
    update(t, dt, e) {
      puffs.forEach((p) => {
        const k = (t * (0.22 + e * 0.25) + p.userData.off) % 1;
        p.position.set(p.userData.x + Math.sin(k * 6 + p.userData.off * 9) * 0.18, 0.5 + k * 1.6, 0);
        p.material.opacity = Math.sin(k * Math.PI) * (0.35 + e * 0.3);
        p.scale.setScalar(0.3 + k * 0.7);
      });
    },
  };
}

/* 2. Folded silk / block-printed textiles with a draped top */
function textile() {
  const g = new THREE.Group();
  const prints = [
    { ground: '#2E8B57', ink: '#F4A024', accent: '#FFF9F0' },
    { ground: '#0B0B3D', ink: '#C8553D', accent: '#FFC864' },
    { ground: '#A3195B', ink: '#F4A024', accent: '#FFF9F0' },
  ];
  prints.forEach((p, i) => {
    const tex = blockPrintTexture(p);
    const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.05 });
    const b = mesh(new THREE.BoxGeometry(1.9, 0.24, 1.3, 1, 1, 1), m, [0, -0.55 + i * 0.26, 0], [0, (i - 1) * 0.08, 0]);
    g.add(b);
  });
  // draped silk falling over the front edge
  const silkTex = blockPrintTexture({ ground: '#C2477A', ink: '#FFC864', accent: '#FFF9F0' });
  silkTex.repeat.set(1.5, 1.5);
  const geo = new THREE.PlaneGeometry(2.0, 1.9, 24, 24);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    // first 1.3 units lie flat on top, the rest folds down the front
    const along = (y + 0.95);
    let py, pz;
    if (along < 1.3) { py = 0; pz = 0.65 - along; }
    else { const k = along - 1.3; py = -k * 0.9; pz = -0.65 - k * 0.25; }
    pos.setXYZ(i, x, py + Math.sin(x * 4) * 0.02, pz);
  }
  geo.computeVertexNormals();
  const silk = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: silkTex, side: THREE.DoubleSide, roughness: 0.35, metalness: 0.2 }));
  silk.position.y = 0.2;
  silk.rotation.y = Math.PI; // fold faces the viewer
  g.add(silk);
  g.scale.setScalar(1.25);
  const base = pos.array.slice();
  return {
    object: g,
    update(t, dt, e) {
      // a breath of wind ripples the hanging edge
      for (let i = 0; i < pos.count; i++) {
        const y0 = base[i * 3 + 1];
        if (y0 < -0.01) pos.setZ(i, base[i * 3 + 2] + Math.sin(t * 2.4 + base[i * 3] * 3) * 0.04 * (0.4 + e) * -y0);
      }
      pos.needsUpdate = true;
    },
  };
}

/* 3. Diya with flickering flame and marigold petals */
function diya() {
  const g = new THREE.Group();
  const clay = mat('#A8481E', { roughness: 0.9 });
  const bowl = mesh(lathe([[0, 0], [0.3, 0], [0.85, 0.22], [1.0, 0.42], [0.94, 0.46], [0.82, 0.33], [0, 0.24]], 16), clay, [0, -0.35, 0]);
  bowl.scale.set(1, 1, 0.82);
  g.add(bowl);
  const spout = mesh(new THREE.ConeGeometry(0.2, 0.5, 8), clay, [0.92, 0.02, 0], [0, 0, -Math.PI / 2 - 0.35]);
  g.add(spout);
  g.add(mesh(new THREE.CircleGeometry(0.78, 16), mat('#E2B04A', { roughness: 0.2, metalness: 0.3 }), [0, -0.08, 0], [-Math.PI / 2, 0, 0])); // ghee
  const flameMat = new THREE.MeshBasicMaterial({ color: '#FFC864' });
  const flame = mesh(lathe([[0, 0], [0.09, 0.08], [0.11, 0.2], [0.06, 0.38], [0, 0.5]], 10), flameMat, [1.08, 0.12, 0]);
  const core = mesh(lathe([[0, 0], [0.05, 0.06], [0.05, 0.15], [0, 0.25]], 8), new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), [1.08, 0.13, 0]);
  const halo = sprite('#FFB648', 1.8, 0.85);
  halo.position.set(1.08, 0.4, 0);
  const light = new THREE.PointLight('#FFB648', 4, 6, 1.6);
  light.position.set(1.08, 0.5, 0.2);
  g.add(flame, core, halo, light);
  // marigold petals ring
  const petal = mat('#F4A024', { roughness: 0.8 });
  const petal2 = mat('#E8633A', { roughness: 0.8 });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const p = mesh(new THREE.SphereGeometry(0.13, 6, 4), i % 2 ? petal : petal2, [Math.cos(a) * 1.35, -0.42, Math.sin(a) * 1.25]);
    p.scale.set(1, 0.45, 1);
    g.add(p);
  }
  g.position.x = -0.25;
  return {
    object: g,
    update(t, dt, e) {
      const f = 1 + Math.sin(t * 17) * 0.06 + Math.sin(t * 7.3) * 0.08;
      flame.scale.set(1, f * (1 + e * 0.35), 1);
      flame.rotation.z = Math.sin(t * 3) * 0.08;
      light.intensity = (3.2 + e * 3) * f;
      halo.material.opacity = 0.6 + e * 0.35 + Math.sin(t * 11) * 0.05;
      halo.scale.setScalar(1.6 + e * 0.8);
    },
  };
}

/* 4. Kathakali mask */
function mask() {
  const g = new THREE.Group();
  const gold = mat('#E2B04A', { roughness: 0.35, metalness: 0.6 });
  const red = mat('#C8302B', { roughness: 0.6 });
  // crown disc (kireedam) behind the face
  g.add(mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.1, 24), gold, [0, 0.45, -0.45], [Math.PI / 2, 0, 0]));
  g.add(mesh(new THREE.TorusGeometry(1.08, 0.08, 6, 24), red, [0, 0.45, -0.38]));
  g.add(mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.6, 12), gold, [0, 1.1, -0.15]));
  g.add(mesh(new THREE.ConeGeometry(0.28, 0.4, 8), red, [0, 1.6, -0.15]));
  // green face
  const face = mesh(new THREE.SphereGeometry(0.72, 14, 10), mat('#2E8B57', { roughness: 0.5 }), [0, 0.15, 0]);
  face.scale.set(1, 1.15, 0.72);
  g.add(face);
  // white chutti framing the jaw
  const chutti = mesh(new THREE.TorusGeometry(0.78, 0.14, 6, 20, Math.PI), mat('#FFF9F0', { roughness: 0.9 }), [0, 0.12, 0.08], [0, 0, Math.PI]);
  chutti.scale.set(1, 1.1, 1);
  g.add(chutti);
  // eyes, brows, lips, tilak
  const white = mat('#FFFFFF', { roughness: 0.3 });
  const black = mat('#111111');
  [-0.27, 0.27].forEach((x) => {
    const eye = mesh(new THREE.SphereGeometry(0.11, 8, 6), white, [x, 0.3, 0.48]);
    eye.scale.set(1.5, 0.8, 0.6);
    const pupil = mesh(new THREE.SphereGeometry(0.045, 6, 4), black, [x, 0.3, 0.55]);
    const brow = mesh(new THREE.BoxGeometry(0.34, 0.05, 0.05), black, [x, 0.47, 0.48], [0, 0, x > 0 ? 0.25 : -0.25]);
    g.add(eye, pupil, brow);
    g.userData[x > 0 ? 'pr' : 'pl'] = pupil;
  });
  const lips = mesh(new THREE.SphereGeometry(0.16, 8, 4), red, [0, -0.2, 0.47]);
  lips.scale.set(1.4, 0.45, 0.5);
  g.add(lips, mesh(new THREE.SphereGeometry(0.05, 6, 4), red, [0, 0.62, 0.42]));
  g.position.y = -0.3;
  g.scale.setScalar(0.92);
  return {
    object: g,
    update(t) {
      // the famous rolling eyes
      const dx = Math.sin(t * 1.6) * 0.035;
      g.userData.pl.position.x = -0.27 + dx;
      g.userData.pr.position.x = 0.27 + dx;
    },
  };
}

/* 5. Kettuvallam houseboat on rippling water */
function shikara() {
  const g = new THREE.Group();
  const boat = new THREE.Group();
  const wood = mat('#6B3B1F', { roughness: 0.8, side: THREE.DoubleSide });
  // hull: the lower half of a stretched sphere, with upturned prow and stern
  const hull = mesh(new THREE.SphereGeometry(1, 18, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), wood, [0, 0.12, 0]);
  hull.scale.set(1.75, 0.45, 0.55);
  boat.add(hull);
  const deck = mesh(new THREE.CircleGeometry(1, 18), mat('#8A5530'), [0, 0.12, 0], [-Math.PI / 2, 0, 0]);
  deck.scale.set(1.72, 0.53, 1);
  boat.add(deck);
  [-1, 1].forEach((side) => boat.add(mesh(new THREE.ConeGeometry(0.1, 0.55, 6), wood, [side * 1.72, 0.3, 0], [0, 0, -side * 0.85])));
  // woven palm-thatch canopy: half-cylinder whose axis runs along the hull, arch facing up
  const canopy = mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.9, 12, 1, true, 0, Math.PI), mat('#E8C68E', { side: THREE.DoubleSide, roughness: 1 }), [0, 0.13, 0], [0, 0, Math.PI / 2]);
  boat.add(canopy);
  [-0.95, 0.95].forEach((x) => boat.add(mesh(new THREE.TorusGeometry(0.48, 0.03, 4, 12, Math.PI), mat('#8A5530'), [x, 0.13, 0], [0, Math.PI / 2, 0])));
  // lantern at the prow
  const lamp = sprite('#FFC864', 0.7, 0.9);
  lamp.position.set(1.25, 0.55, 0);
  boat.add(lamp, mesh(new THREE.SphereGeometry(0.06, 6, 4), new THREE.MeshBasicMaterial({ color: '#FFE2A0' }), [1.25, 0.55, 0]));
  g.add(boat);
  // water + ripples
  const water = mesh(new THREE.CircleGeometry(1.8, 32), new THREE.MeshStandardMaterial({ color: '#14525C', roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.75 }), [0, -0.12, 0], [-Math.PI / 2, 0, 0]);
  g.add(water);
  const rings = [0, 1, 2].map((i) => {
    const r = mesh(new THREE.RingGeometry(0.98, 1, 40), new THREE.MeshBasicMaterial({ color: '#B8D4D1', transparent: true, side: THREE.DoubleSide }), [0, -0.1, 0], [-Math.PI / 2, 0, 0]);
    r.userData.off = i / 3;
    g.add(r);
    return r;
  });
  // a couple of lotus leaves
  const leaf = mat('#2E8B57');
  g.add(mesh(new THREE.CircleGeometry(0.22, 8), leaf, [1.3, -0.1, 0.9], [-Math.PI / 2, 0, 0]));
  g.add(mesh(new THREE.CircleGeometry(0.16, 8), leaf, [-1.4, -0.1, -0.7], [-Math.PI / 2, 0, 0]));
  g.position.y = -0.1;
  return {
    object: g,
    update(t, dt, e) {
      boat.position.y = Math.sin(t * 1.4) * 0.04;
      boat.rotation.z = Math.sin(t * 1.1) * 0.03;
      rings.forEach((r) => {
        const k = (t * (0.18 + e * 0.2) + r.userData.off) % 1;
        r.scale.setScalar(0.8 + k * 1.2);
        r.material.opacity = (1 - k) * 0.6;
      });
    },
  };
}

/* 6. Hand-painted auto-rickshaw */
function auto() {
  const g = new THREE.Group();
  const green = mat('#2E8B57');
  const yellow = mat('#F4C21B');
  const black = mat('#1A1A1A', { roughness: 0.6 });
  g.add(mesh(new THREE.BoxGeometry(1.5, 0.55, 1.1), yellow, [-0.25, -0.15, 0]));                 // rear body
  g.add(mesh(new THREE.BoxGeometry(0.55, 0.75, 0.75), green, [0.75, -0.08, 0]));                  // front cowl
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: '#B8D4D1', transparent: true, opacity: 0.55, roughness: 0.1 }), [0.98, 0.6, 0], [0, 0, -0.12])); // windscreen
  const roof = mesh(new THREE.BoxGeometry(1.95, 0.1, 1.2), black, [0, 0.98, 0]);
  g.add(roof);
  g.add(mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 10, 1, true, 0, Math.PI / 2), mat('#1A1A1A', { side: THREE.DoubleSide }), [-0.4, 0.38, 0], [Math.PI / 2, 0, Math.PI]));
  [[0.95, 0.42], [0.95, -0.42], [-0.95, 0.56], [-0.95, -0.56]].forEach(([x, z]) => g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 5), black, [x, 0.5, z])));
  // painted side panels (flowers)
  const pink = mat('#C2477A'), white = mat('#FFF9F0');
  [0.56, -0.56].forEach((z) => {
    for (let i = 0; i < 3; i++) {
      const f = mesh(new THREE.CircleGeometry(0.08, 6), i % 2 ? white : pink, [-0.7 + i * 0.4, -0.15, z * 1.0 + Math.sign(z) * 0.002], [0, z > 0 ? 0 : Math.PI, 0]);
      g.add(f);
    }
  });
  // headlight + handlebar
  g.add(mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: '#FFE2A0' }), [1.04, 0.05, 0]));
  const lightGlow = sprite('#FFE2A0', 0.6, 0.7);
  lightGlow.position.set(1.12, 0.05, 0);
  g.add(lightGlow);
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.06, 0.7), black, [0.85, 0.45, 0]));
  // wheels
  const wheels = [];
  [[0.75, 0], [-0.75, 0.55], [-0.75, -0.55]].forEach(([x, z]) => {
    const w = mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 12), black, [x, -0.5, z], [Math.PI / 2, 0, 0]);
    const hub = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 8), mat('#C9CED6', { metalness: 0.7, roughness: 0.3 }), [0, 0, 0]);
    w.add(hub);
    wheels.push(w);
    g.add(w);
  });
  g.scale.setScalar(0.95);
  g.position.y = 0.05;
  return {
    object: g,
    update(t, dt, e) {
      wheels.forEach((w) => (w.rotation.y -= dt * (0.6 + e * 9)));
      g.position.y = 0.05 + Math.abs(Math.sin(t * (4 + e * 10))) * 0.015 * (0.3 + e);
    },
  };
}

/* 7. Potter's wheel with a terracotta pot */
function pottery() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.35, 0.5, 0.5, 12), mat('#4A3426'), [0, -0.85, 0]));
  const wheel = new THREE.Group();
  wheel.add(mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.14, 24), mat('#5C4033', { roughness: 0.9 })));
  wheel.add(mesh(new THREE.TorusGeometry(1.05, 0.04, 4, 24), mat('#3B2A20'), [0, 0.07, 0], [Math.PI / 2, 0, 0]));
  const pot = mesh(lathe([[0, 0], [0.38, 0], [0.62, 0.3], [0.7, 0.6], [0.58, 0.95], [0.36, 1.12], [0.32, 1.25], [0.42, 1.32], [0.36, 1.36], [0.26, 1.28], [0, 1.2]], 18), mat('#A0522D', { roughness: 0.95 }), [0, 0.07, 0]);
  wheel.add(pot);
  // painted bands
  const band = mat('#FFF9F0', { roughness: 0.9 });
  wheel.add(mesh(new THREE.TorusGeometry(0.69, 0.025, 4, 28), band, [0, 0.64, 0], [Math.PI / 2, 0, 0]));
  wheel.add(mesh(new THREE.TorusGeometry(0.62, 0.02, 4, 28), mat('#0B0B3D'), [0, 0.4, 0], [Math.PI / 2, 0, 0]));
  // a little clay lump + a tool on the wheel
  wheel.add(mesh(new THREE.DodecahedronGeometry(0.16, 0), mat('#B5653A'), [0.8, 0.15, 0.2]));
  wheel.position.y = -0.55;
  g.add(wheel);
  return {
    object: g,
    update(t, dt, e) { wheel.rotation.y += dt * (0.5 + e * 5); },
  };
}

/* 8. Masala dabba */
function dabba() {
  const g = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: '#C9CED6', metalness: 0.9, roughness: 0.28 });
  g.add(mesh(new THREE.CylinderGeometry(1.15, 1.1, 0.42, 32), steel, [0, -0.4, 0]));
  g.add(mesh(new THREE.TorusGeometry(1.13, 0.035, 6, 32), steel, [0, -0.19, 0], [Math.PI / 2, 0, 0]));
  const spices = ['#E5B300', '#C8302B', '#7A3E1D', '#2E8B57', '#F4A024', '#3A1450', '#E8833A'];
  const bowls = [];
  spices.forEach((c, i) => {
    const r = i === 0 ? 0 : 0.68;
    const a = ((i - 1) / 6) * Math.PI * 2;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const bowl = mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.3, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#D8DCE2', metalness: 0.9, roughness: 0.25, side: THREE.DoubleSide }), [x, -0.12, z]);
    const heap = mesh(new THREE.SphereGeometry(0.27, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(c, { roughness: 1 }), [x, -0.06, z]);
    heap.scale.y = 0.45;
    g.add(bowl, heap);
    bowls.push(heap);
  });
  // spoon
  const spoon = new THREE.Group();
  spoon.add(mesh(new THREE.BoxGeometry(0.9, 0.03, 0.07), steel, [0.45, 0, 0]));
  const bowlS = mesh(new THREE.SphereGeometry(0.1, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), steel, [0, 0, 0], [Math.PI, 0, 0]);
  bowlS.scale.y = 0.4;
  spoon.add(bowlS);
  spoon.position.set(-0.05, 0.08, 0.68);
  spoon.rotation.set(0.2, 0.4, 0.15);
  g.add(spoon);
  g.position.y = 0.1;
  g.scale.setScalar(1.1);
  return {
    object: g,
    update(t, dt, e) {
      bowls.forEach((b, i) => { b.scale.y = 0.45 + Math.max(0, Math.sin(t * 3 + i)) * 0.12 * e; });
    },
  };
}

export const builders = { chai, textile, diya, mask, shikara, auto, pottery, dabba };
