/**
 * Smooth scrolling (Lenis) wired into GSAP's ticker so ScrollTrigger stays in sync.
 * Skipped entirely for prefers-reduced-motion.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/env.js';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
export const getLenis = () => lenis;

export function initSmoothScroll() {
  if (!prefersReducedMotion()) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 3.2) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    if (import.meta.env.DEV) window.__lenis = lenis; // handy for debugging in the console
  }

  // In-page anchors: smooth scroll with nav offset, then move focus for keyboard users.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) { e.preventDefault(); return; }
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const focusTarget = () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', id);
    };
    if (lenis) {
      lenis.scrollTo(target, { offset: id === '#top' ? 0 : -70, duration: 1.4, onComplete: focusTarget });
    } else {
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      focusTarget();
    }
  });
  return lenis;
}
