/**
 * Environment checks shared by every module.
 */
const mq = (q) => window.matchMedia(q);

export const reducedMotionQuery = mq('(prefers-reduced-motion: reduce)');
// Dev aid: append ?reduced-motion to the URL to exercise the JS reduced-motion paths.
const forcedReduced = import.meta.env.DEV && new URLSearchParams(location.search).has('reduced-motion');
export const prefersReducedMotion = () => forcedReduced || reducedMotionQuery.matches;

/** "Mobile" = narrow viewport or touch-first device. Heavy 3D is skipped here. */
export const isMobile = () => mq('(max-width: 767px)').matches || mq('(pointer: coarse) and (max-width: 1024px)').matches;
export const finePointer = () => mq('(pointer: fine)').matches;

let webgl;
export function hasWebGL() {
  if (webgl !== undefined) return webgl;
  try {
    const c = document.createElement('canvas');
    webgl = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    webgl = false;
  }
  return webgl;
}

/** Run when the browser is idle (or after a timeout), for deferring heavy work. */
export const whenIdle = (fn, timeout = 1200) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 200);

/** Resolve once `el` is near the viewport. */
export function whenNear(el, rootMargin = '300px') {
  return new Promise((resolve) => {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); resolve(); }
    }, { rootMargin });
    io.observe(el);
  });
}

export const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const $ = (s, root = document) => root.querySelector(s);
export const $$ = (s, root = document) => [...root.querySelectorAll(s)];
