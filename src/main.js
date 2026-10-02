/**
 * WACATIONS: landing page entry.
 * Order matters: render data-driven markup first, then animations measure it.
 */
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import { initTheme } from './components/theme.js';
import { initNav } from './components/nav.js';
import { initCursor } from './components/cursor.js';
import { initTastes } from './components/tastes.js';
import { initDestinations } from './components/destinations.js';
import { initForm } from './components/form.js';
import { renderHow, renderLocalMedia, renderStories, renderWhy, renderFooter } from './components/sections.js';
import { initSmoothScroll } from './animations/smooth.js';
import { initScrollAnimations, onHeroProgress } from './animations/scroll.js';
import { initReveals } from './animations/reveal.js';
import { initTransitions } from './animations/transitions.js';
import { renderHeroFallback } from './scenes/heroFallback.js';
import { isMobile, hasWebGL, prefersReducedMotion, whenIdle } from './utils/env.js';

// 1) Content
renderHow();
renderLocalMedia();
renderStories();
renderWhy();
renderFooter();
initDestinations();
initTastes();
initForm();

// 2) Chrome & interaction
initTheme();
initNav();
initCursor();

// 3) Motion
initSmoothScroll();
initScrollAnimations();
initReveals();
initTransitions();

// 4) Hero scene: real 3D on capable desktops, SVG paper map elsewhere.
const heroEl = document.getElementById('hero-scene');
const reduced = prefersReducedMotion();
if (isMobile() || !hasWebGL()) {
  renderHeroFallback(heroEl, { reduced });
} else {
  // Defer Three.js until the main thread is free so first paint stays fast.
  whenIdle(async () => {
    try {
      const { createHeroScene } = await import('./scenes/heroScene.js');
      const hero = createHeroScene(heroEl, { reduced });
      onHeroProgress(hero.setScroll);
    } catch (err) {
      console.warn('[Wacations] 3D hero unavailable, using 2D map.', err);
      renderHeroFallback(heroEl, { reduced });
    }
  });
}
