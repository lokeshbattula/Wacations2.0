/**
 * Signature section transitions (each < 1.2s):
 *  .sx--glow : diya / golden-hour light bloom sweeping across with rising sparks
 *  .sx--tear : the previous section's edge tears along a perforated line
 * They alternate down the page and replay each time they scroll into view from above.
 */
import { prefersReducedMotion } from '../utils/env.js';

/** Build a jagged torn-paper clip-path for the flap's bottom edge. */
function tearPath(seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const pts = ['0% 0%', '100% 0%'];
  for (let x = 100; x >= 0; x -= 2.5) pts.push(`${x}% ${55 + rnd() * 40}%`);
  return `polygon(${pts.join(',')})`;
}

export function initTransitions() {
  const all = document.querySelectorAll('.sx');
  if (prefersReducedMotion()) return;

  all.forEach((sx, i) => {
    if (sx.classList.contains('sx--glow')) {
      const bloom = sx.querySelector('.sx__bloom');
      // warm sparks, like oil-lamp embers
      for (let k = 0; k < 18; k++) {
        const sp = document.createElement('span');
        sp.className = 'sx__spark';
        sp.style.left = `${5 + Math.random() * 90}%`;
        sp.style.setProperty('--d', `${(k / 18) * 0.45}s`);
        sp.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
        sp.style.setProperty('--dy', `${-50 - Math.random() * 90}px`);
        sp.style.width = sp.style.height = `${3 + Math.random() * 5}px`;
        bloom.appendChild(sp);
      }
    } else {
      // flap colour comes from --flap-bg on the element (set in index.html)
      sx.style.setProperty('--tear-path', tearPath(i + 3));
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const sx = en.target;
      // only play when scrolling down into it
      if (en.isIntersecting && en.boundingClientRect.top > window.innerHeight * 0.35) {
        sx.classList.remove('is-playing');
        void sx.offsetWidth;
        sx.classList.add('is-playing');
      }
    });
  }, { rootMargin: '0px 0px -25% 0px' });
  all.forEach((sx) => io.observe(sx));
}
