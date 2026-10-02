/**
 * Lightweight 2D hero for mobile, reduced motion, or no WebGL:
 * an SVG paper-cut map of India with a dotted flight loop and a paper plane.
 */
import { indiaOutline, flightStops, project } from '../data/india.js';

export function renderHeroFallback(container, { reduced = false } = {}) {
  const S = 14;
  const P = (p) => { const [x, y] = project(p, S); return [x + 210, 220 - y]; };
  const outline = indiaOutline.map(P);
  const d = `M${outline.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join('L')}Z`;
  const stops = flightStops.map(P);

  // Arc between consecutive stops (closed loop)
  let route = `M${stops[0].join(' ')}`;
  stops.forEach((p, i) => {
    const n = stops[(i + 1) % stops.length];
    const mx = (p[0] + n[0]) / 2, my = (p[1] + n[1]) / 2;
    const dx = n[0] - p[0], dy = n[1] - p[1];
    route += ` Q${(mx - dy * 0.25).toFixed(1)} ${(my + dx * 0.25).toFixed(1)} ${n[0].toFixed(1)} ${n[1].toFixed(1)}`;
  });

  container.innerHTML = `
  <svg class="hero-fallback" viewBox="0 0 420 460" role="presentation" focusable="false">
    <defs>
      <filter id="hf-shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="6" dy="10" stdDeviation="8" flood-color="#5a3200" flood-opacity=".25"/></filter>
      <pattern id="hf-print" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="9" cy="9" r="2.4" fill="var(--primary-deep)" opacity=".55"/><circle cx="0" cy="0" r="1.4" fill="var(--bg)"/><circle cx="18" cy="18" r="1.4" fill="var(--bg)"/>
      </pattern>
    </defs>
    <g filter="url(#hf-shadow)">
      <path d="${d}" fill="var(--primary-deep)" transform="translate(7 7)"/>
      <path d="${d}" fill="var(--primary)" transform="translate(3.5 3.5)"/>
      <path d="${d}" fill="url(#hf-print)" transform="translate(3.5 3.5)"/>
      <path d="${d}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1"/>
    </g>
    <path id="hf-route" d="${route}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round" opacity=".75"/>
    ${stops.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="var(--glow)" opacity=".7"/><circle cx="${x}" cy="${y}" r="2.6" fill="var(--ink)"/>`).join('')}
    <g fill="var(--bg)" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round">
      <path d="M-11 -7 L13 0 L-11 7 L-6 0 Z">
        ${reduced ? '' : '<animateMotion dur="22s" repeatCount="indefinite" rotate="auto"><mpath href="#hf-route"/></animateMotion>'}
      </path>
    </g>
  </svg>`;
  if (reduced) {
    // park the plane on the route near Hyderabad
    const plane = container.querySelector('svg > g:last-of-type');
    const [x, y] = stops[0];
    plane.setAttribute('transform', `translate(${x + 18} ${y - 14}) rotate(-20)`);
  }
}
