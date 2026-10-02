/**
 * IntersectionObserver-driven reveals: handwritten label write-on,
 * generic fade-ups and passport-stamp "thunks".
 */
import { prefersReducedMotion } from '../utils/env.js';

export function initReveals() {
  const reduced = prefersReducedMotion();
  const targets = document.querySelectorAll('.label, .reveal, .will-stamp');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => {
      el.classList.add('is-written', 'is-in');
      if (el.classList.contains('will-stamp')) { el.classList.remove('will-stamp'); }
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains('label')) el.classList.add('is-written');
      if (el.classList.contains('reveal')) el.classList.add('is-in');
      // The How-It-Works stamps are driven by the horizontal scroll instead (scroll.js)
      if (el.classList.contains('will-stamp') && !el.closest('.how:not(.how--stacked)')) stamp(el);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });

  targets.forEach((el) => io.observe(el));
}

/** Play the stamp animation on an element (once). */
export function stamp(el, delay = 0) {
  if (el.classList.contains('is-stamped')) return;
  el.style.animationDelay = `${delay}ms`;
  el.classList.add('is-stamped');
}
