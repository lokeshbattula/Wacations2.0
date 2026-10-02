/**
 * Procedural canvas textures (no image downloads): handmade paper fibre,
 * block-print fabric and soft glow sprites.
 */
import * as THREE from 'three';

function canvas(size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')];
}

function toTexture(c, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  return t;
}

/** Handmade-paper fibre: white base with speckles and short fibres; tint via material colour. */
export function paperTexture(size = 256) {
  const [c, g] = canvas(size);
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const v = 215 + Math.random() * 40;
    g.fillStyle = `rgba(${v},${v - 8},${v - 20},${Math.random() * 0.35})`;
    g.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
  }
  g.lineWidth = 0.6;
  for (let i = 0; i < 160; i++) {
    const x = Math.random() * size, y = Math.random() * size, a = Math.random() * Math.PI;
    g.strokeStyle = `rgba(150,120,80,${Math.random() * 0.18})`;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6, x + Math.cos(a) * 12, y + Math.sin(a) * 3);
    g.stroke();
  }
  return toTexture(c);
}

/** Block-print motif on a coloured ground with a zari-like border stripe. */
export function blockPrintTexture({ ground = '#A3195B', ink = '#F4A024', accent = '#FFF9F0', size = 256, border = true } = {}) {
  const [c, g] = canvas(size);
  g.fillStyle = ground;
  g.fillRect(0, 0, size, size);
  const cell = size / 4;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const cx = x * cell + cell / 2 + (y % 2 ? cell / 2 : 0);
      const cy = y * cell + cell / 2;
      g.save();
      g.translate(cx % size, cy);
      g.fillStyle = ink;
      for (let p = 0; p < 6; p++) {
        g.rotate(Math.PI / 3);
        g.beginPath();
        g.ellipse(0, cell * 0.2, cell * 0.08, cell * 0.17, 0, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = accent;
      g.beginPath();
      g.arc(0, 0, cell * 0.07, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
  if (border) {
    g.fillStyle = '#E2B04A';
    g.fillRect(0, size - 22, size, 14);
    g.fillStyle = ground;
    for (let x = 0; x < size; x += 12) g.fillRect(x + 3, size - 18, 6, 6);
  }
  return toTexture(c);
}

/** Soft radial sprite used for glows, dust motes and dotted paths. */
export function glowTexture(size = 64, hard = false) {
  const [c, g] = canvas(size);
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  if (hard) {
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.55, 'rgba(255,255,255,1)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0)');
  } else {
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
