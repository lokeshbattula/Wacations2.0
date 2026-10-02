/**
 * Inline SVG icons + illustrated placeholder art.
 * Icons use currentColor so they follow the active theme.
 */

const s = (body, vb = '0 0 64 64') =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

/* ---- "Eight Tastes" fallback illustrations (mobile / no WebGL) ---- */
export const tasteIllus = {
  chai: s(`<path d="M16 26h28l-3 26a4 4 0 0 1-4 3H23a4 4 0 0 1-4-3z" fill="#B5562E" stroke="none"/><path d="M16 26h28" /><path d="M24 20c-2-3 2-5 0-8M32 20c-2-3 2-5 0-8M40 20c-2-3 2-5 0-8" opacity=".6"/><ellipse cx="30" cy="27" rx="13" ry="2.5" fill="#C98B5A" stroke="none"/>`),
  textile: s(`<path d="M10 22h44v10H10z" fill="#A3195B" stroke="none"/><path d="M8 32h48v10H8z" fill="#F4A024" stroke="none"/><path d="M12 42h40v10H12z" fill="#2E8B57" stroke="none"/><path d="M14 27h36M12 37h40M16 47h32" stroke="#FFF9F0" stroke-dasharray="2 4"/>`),
  diya: s(`<path d="M12 36c4 10 36 10 40 0z" fill="#B5562E" stroke="none"/><path d="M12 36h40"/><path d="M32 33c-5-5-3-12 0-18 3 6 5 13 0 18z" fill="#FFC864" stroke="#F4A024"/><circle cx="32" cy="26" r="12" fill="#FFC864" opacity=".25" stroke="none"/>`),
  mask: s(`<path d="M18 22c0-10 28-10 28 0v14c0 10-6 16-14 16s-14-6-14-16z" fill="#2E8B57" stroke="none"/><path d="M12 22a20 10 0 0 1 40 0" stroke="#F4A024" stroke-width="5"/><path d="M14 40c4 14 32 14 36 0" stroke="#FFF9F0" stroke-width="4"/><path d="M24 30l5 2M40 30l-5 2" stroke="#0B0B3D" stroke-width="3"/><path d="M28 43h8" stroke="#C8553D" stroke-width="4"/>`),
  shikara: s(`<path d="M6 38c10 8 42 8 52 0l-4-4H10z" fill="#7A3E1D" stroke="none"/><path d="M16 34V24c8-6 24-6 32 0v10" fill="#E8C68E" stroke="none"/><path d="M16 24c8-6 24-6 32 0"/><path d="M4 48c6-3 10 3 16 0s10 3 16 0 10 3 16 0 6 3 8 1" stroke="#14525C"/>`),
  auto: s(`<path d="M14 42V26c0-6 6-10 14-10h8c8 0 14 6 14 14v12z" fill="#2E8B57" stroke="none"/><path d="M14 30h36v12H14z" fill="#F4C21B" stroke="none"/><circle cx="20" cy="45" r="5" fill="#0B0B3D" stroke="none"/><circle cx="46" cy="45" r="5" fill="#0B0B3D" stroke="none"/><path d="M24 20h12v8H24z" fill="#B8D4D1" stroke="none"/>`),
  pottery: s(`<path d="M24 16h16c-1 4 8 10 8 20 0 10-8 14-16 14s-16-4-16-14c0-10 9-16 8-20z" fill="#A0522D" stroke="none"/><path d="M22 30h20M20 38h24" stroke="#F4A024" stroke-dasharray="3 3"/><ellipse cx="32" cy="54" rx="20" ry="4" fill="#4A4A6A" stroke="none" opacity=".5"/>`),
  dabba: s(`<circle cx="32" cy="34" r="22" fill="#C9CED6" stroke="none"/><circle cx="32" cy="34" r="6" fill="#E5B300" stroke="none"/><circle cx="32" cy="21" r="5.5" fill="#C8553D" stroke="none"/><circle cx="43" cy="28" r="5.5" fill="#7A3E1D" stroke="none"/><circle cx="43" cy="41" r="5.5" fill="#2E8B57" stroke="none"/><circle cx="32" cy="47" r="5.5" fill="#F4A024" stroke="none"/><circle cx="21" cy="41" r="5.5" fill="#3A1450" stroke="none"/><circle cx="21" cy="28" r="5.5" fill="#E8833A" stroke="none"/>`),
};

/* ---- How-it-works stamp icons ---- */
export const howIcons = {
  map: s(`<path d="M8 16l14-6 20 6 14-6v38l-14 6-20-6-14 6z"/><path d="M22 10v38M42 16v38"/><circle cx="32" cy="30" r="4" fill="currentColor"/>`),
  ticket: s(`<path d="M8 20h48v8a4 4 0 0 0 0 8v8H8v-8a4 4 0 0 0 0-8z"/><path d="M40 20v24" stroke-dasharray="3 3"/><path d="M16 30l6 4 10-8" />`),
  bed: s(`<path d="M8 46V18M8 36h48v10M56 36v-6a6 6 0 0 0-6-6H28v12"/><circle cx="18" cy="29" r="5"/>`),
  cab: s(`<path d="M10 40v-8l6-12h32l6 12v8z"/><path d="M10 32h44"/><circle cx="20" cy="42" r="5"/><circle cx="44" cy="42" r="5"/><path d="M28 14h8"/>`),
  spark: s(`<path d="M32 8l5 15 15 5-15 5-5 15-5-15-15-5 15-5z"/><path d="M50 44l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>`),
  heart: s(`<path d="M32 52S10 40 10 24a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 16-22 28-22 28z"/><path d="M22 28h6l3-6 4 12 3-6h6"/>`),
};

/* ---- Why-Wacations stamp icons ---- */
export const whyIcons = {
  route: s(`<circle cx="14" cy="48" r="5"/><circle cx="50" cy="16" r="5"/><path d="M18 45c10-6 0-16 14-18s8-10 14-8" stroke-dasharray="4 4"/>`),
  hands: s(`<path d="M8 34l10-10 8 4 6-4 6 4 8-4 10 10-14 14c-2 2-5 2-7 0l-3-3-3 3c-2 2-5 2-7 0z"/><path d="M26 28l8 8M32 26l8 8"/>`),
  clock: s(`<circle cx="32" cy="34" r="20"/><path d="M32 22v12l8 6"/><path d="M14 12l-6 6M50 12l6 6"/>`),
  pen: s(`<path d="M44 10l10 10-28 28H16V38z"/><path d="M38 16l10 10M12 56h40" />`),
};

/* ---- Social icons (filled) ---- */
export const socialIcons = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8c-.1-1.6-.4-3-1.6-4.2C19.1 2.5 17.6 2.2 16 2.1 14.4 2 9.6 2 8 2.1c-1.6.1-3 .4-4.2 1.6S2.2 6.4 2.1 8C2 9.6 2 14.4 2.1 16c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6 1.2-1.2 1.5-2.6 1.6-4.2.1-1.6.1-6.4 0-8Zm-2.1 9.7a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7A3.3 3.3 0 0 1 6.3 4.5c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7Z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21.9v-7.4H16l.4-2.9h-2.9V9.8c0-.8.2-1.4 1.4-1.4h1.6V5.8a21 21 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.1H8v2.9h2.5v7.4a10 10 0 1 1 3 0Z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></svg>`,
};

/* ---- Footer passport stamp with circular text + compass ---- */
export const passportStamp = `
<svg viewBox="0 0 200 200" role="img" aria-label="Passport stamp: Wander, Dérive, Travel">
  <defs><path id="stamp-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs>
  <g fill="none" stroke="currentColor">
    <circle cx="100" cy="100" r="94" stroke-width="4"/>
    <circle cx="100" cy="100" r="86" stroke-width="1.5" stroke-dasharray="3 4"/>
    <circle cx="100" cy="100" r="52" stroke-width="2"/>
  </g>
  <text fill="currentColor" font-family="DM Sans, sans-serif" font-weight="800" font-size="16" textLength="446" lengthAdjust="spacing">
    <textPath href="#stamp-circle" startOffset="0" textLength="446" lengthAdjust="spacing">WANDER · DÉRIVE · TRAVEL ·</textPath>
  </text>
  <g fill="currentColor" transform="translate(100 100)">
    <path d="M0-40 7-7 0 0-7-7Z"/><path d="M0 40-7 7 0 0 7 7Z" opacity=".55"/>
    <path d="M40 0 7 7 0 0 7-7Z" opacity=".55"/><path d="M-40 0-7-7 0 0-7 7Z" opacity=".55"/>
    <circle r="4" fill="none" stroke="currentColor" stroke-width="2"/>
    <text y="-44" text-anchor="middle" font-size="10" font-weight="800" font-family="DM Sans, sans-serif">N</text>
  </g>
</svg>`;

/**
 * Generated "image slot" art used until a real photo is supplied.
 * Returns a data: URI SVG: layered hills + sun in the accent colour, with the slot filename.
 */
export function placeholderArt({ title = '', script = '', accent = '#F4A024', deep = '#0B0B3D', slot = '' }) {
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
    <pattern id="p" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1.4" fill="#fff" opacity=".18"/></pattern>
  </defs>
  <rect width="400" height="500" fill="url(#g)"/>
  <rect width="400" height="500" fill="url(#p)"/>
  <circle cx="290" cy="170" r="70" fill="#FFC864" opacity=".9"/>
  <path d="M0 330 Q100 250 200 310 T400 280 V500 H0Z" fill="${deep}" opacity=".45"/>
  <path d="M0 390 Q120 320 240 380 T400 360 V500 H0Z" fill="${deep}" opacity=".7"/>
  <text x="28" y="456" font-family="Georgia, serif" font-size="34" fill="#FFF9F0">${esc(title)}</text>
  <text x="28" y="416" font-family="sans-serif" font-size="22" fill="#FFF9F0" opacity=".75">${esc(script)}</text>
  <text x="28" y="40" font-family="sans-serif" font-size="12" letter-spacing="2" fill="#FFF9F0" opacity=".8">IMAGE SLOT · ${esc(slot)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
