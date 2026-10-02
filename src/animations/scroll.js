/**
 * GSAP + ScrollTrigger choreography:
 *  - flight-path scroll progress
 *  - hero boarding entrance + parallax
 *  - How It Works horizontal pinned route with stamps
 *  - Live Like a Local parallax
 *  - Finale diya warm-up and ticket slide-in
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/env.js';
import { stamp } from './reveal.js';

gsap.registerPlugin(ScrollTrigger);

/** Listeners that want hero scroll progress (0 → 1), e.g. the 3D camera. */
const heroListeners = new Set();
export const onHeroProgress = (fn) => heroListeners.add(fn);

export function initScrollAnimations() {
  const reduced = prefersReducedMotion();

  /* ---- Flight-path progress ---- */
  const fp = document.querySelector('.flightpath');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => fp.style.setProperty('--p', self.progress.toFixed(4)),
  });

  /* ---- Hero ---- */
  const heroStamp = document.querySelector('.hero__stamp');
  if (!reduced) {
    // The boarding entrance itself is CSS (sections.css, "hero entrance") so the headline
    // paints on the first frame for LCP; the stamp lands once the ticket settles.
    setTimeout(() => stamp(heroStamp), 1000);

    gsap.to('.hero__inner', {
      yPercent: -14, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  } else {
    stamp(heroStamp);
  }
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top',
    onUpdate: (self) => heroListeners.forEach((fn) => fn(self.progress)),
  });

  /* ---- How It Works: horizontal pinned route ---- */
  const how = document.querySelector('.how');
  const track = document.getElementById('how-track');
  const stamps = () => [...track.querySelectorAll('.stop__stamp')];
  const mm = gsap.matchMedia();

  mm.add({ wide: '(min-width: 900px)', motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
    const { wide, motion } = ctx.conditions;
    if (!(wide && motion) || reduced) {
      // stacked vertical route; stamps thunk as each stop enters
      how.classList.add('how--stacked');
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { stamp(e.target); io.unobserve(e.target); }
      }), { threshold: 0.6 });
      stamps().forEach((s) => io.observe(s));
      return () => io.disconnect();
    }
    how.classList.remove('how--stacked');
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: how,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    stamps().forEach((s) => {
      ScrollTrigger.create({
        trigger: s,
        containerAnimation: tween,
        start: 'left 78%',
        onEnter: () => stamp(s),
      });
    });
    return () => tween.scrollTrigger?.kill();
  });

  /* ---- Live Like a Local parallax ---- */
  if (!reduced) {
    document.querySelectorAll('.local [data-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { yPercent: -speed * 100 }, {
        yPercent: speed * 100, ease: 'none',
        scrollTrigger: { trigger: '.local', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---- Finale: the screen warms like a diya, the ticket slides in ---- */
  const finale = document.querySelector('.finale');
  if (!reduced) {
    gsap.fromTo(finale, { '--warm': 0 }, {
      '--warm': 1, ease: 'none',
      scrollTrigger: { trigger: finale, start: 'top 85%', end: 'top 15%', scrub: true },
    });
    gsap.from('.finale__ticket-wrap', {
      y: 140, rotate: 3, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: finale, start: 'top 60%', once: true },
    });
  } else {
    finale.style.setProperty('--warm', 1);
  }

  // Fonts and lazy content change layout; keep trigger positions accurate.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
