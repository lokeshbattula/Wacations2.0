/**
 * Theme toggle ("ticket punch"). Theme A (saffron) is default; Theme B = "peacock".
 * Dispatches `themechange` on window so 3D scenes can recolour.
 */
const KEY = 'wacations-theme';

export const currentTheme = () => (document.documentElement.dataset.theme === 'peacock' ? 'peacock' : 'saffron');

function apply(theme, btn) {
  const root = document.documentElement;
  if (theme === 'peacock') root.dataset.theme = 'peacock';
  else delete root.dataset.theme;
  const dark = theme === 'peacock';
  btn.setAttribute('aria-pressed', String(dark));
  btn.setAttribute('aria-label', dark ? 'Switch to Saffron Dusk theme' : 'Switch to Peacock Monsoon theme');
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', dark ? '#0E3B43' : '#FFF9F0'));
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  apply(currentTheme(), btn);
  btn.addEventListener('click', () => {
    const next = currentTheme() === 'peacock' ? 'saffron' : 'peacock';
    btn.classList.remove('is-punching');
    void btn.offsetWidth; // restart the punch animation
    btn.classList.add('is-punching');
    apply(next, btn);
    try { localStorage.setItem(KEY, next); } catch (e) { /* storage unavailable */ }
  });
}
