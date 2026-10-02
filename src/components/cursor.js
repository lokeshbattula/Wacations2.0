/**
 * Custom cursor: a dot that becomes a dashed "ticket-punch" ring over clickables.
 * Fine pointers only; the native cursor returns for text inputs.
 */
import { finePointer, prefersReducedMotion } from '../utils/env.js';

const CLICKABLE = 'a, button, [role="button"], label, summary, .chip, [data-cursor="link"]';

export function initCursor() {
  if (!finePointer()) return;
  const root = document.querySelector('.cursor');
  const dot = root.querySelector('.cursor__dot');
  const ring = root.querySelector('.cursor__ring');
  document.documentElement.classList.add('has-cursor');

  let x = -100, y = -100, rx = x, ry = y;
  const lerp = prefersReducedMotion() ? 1 : 0.2;

  window.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const t = e.target;
    root.classList.toggle('is-drag', !!t.closest?.('[data-cursor="drag"]'));
    root.classList.toggle('is-link', !!t.closest?.(CLICKABLE) && !t.closest('[data-cursor="drag"]'));
    root.classList.toggle('is-hidden', !!t.closest?.('input:not([type=range]):not([type=checkbox]), textarea, select'));
  }, { passive: true });
  window.addEventListener('pointerdown', () => root.classList.add('is-down'));
  window.addEventListener('pointerup', () => root.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => root.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => root.classList.remove('is-hidden'));

  const loop = () => {
    rx += (x - rx) * lerp;
    ry += (y - ry) * lerp;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
}
