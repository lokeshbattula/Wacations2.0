/**
 * Destinations Index: a data-driven travel ledger with filters and a
 * cursor-following preview image. Rows come from src/data/destinations.js.
 */
import { destinations, filters } from '../data/destinations.js';
import { placeholderArt } from './illustrations.js';
import { finePointer, prefersReducedMotion } from '../utils/env.js';

const pad = (n) => String(n).padStart(2, '0');
const imgFor = (d) => d.image || placeholderArt({ title: d.name, script: d.script, accent: d.accent, slot: `destinations/${d.id}.jpg` });
const priceLabel = (p) => (p ? `₹${p.toLocaleString('en-IN')}` : '₹___');

function row(d, i) {
  return `
    <li class="ledger__item" data-tags="${d.tags.join(' ')}" data-id="${d.id}">
      <div class="ledger__row" style="--accent:${d.accent}">
        <span class="ledger__no">${pad(i + 1)}</span>
        <div class="ledger__state">
          <span class="ledger__name">${d.name}</span>
          <span class="ledger__script indic" lang="${d.lang}">${d.script}</span>
          <span class="ledger__tags">${d.tags.map((t) => `<span>${filters.find((f) => f.id === t)?.label || t}</span>`).join('')}</span>
        </div>
        <p class="ledger__places">${d.places.map((p) => `<span>${p}</span>`).join('')}</p>
        <span class="ledger__days">${d.days}</span>
        <span class="ledger__price"><small>Starting from</small>${priceLabel(d.price)}</span>
        <a class="link-arrow ledger__link" href="${d.url}" data-state="${d.id}">View Package<span class="sr-only">: ${d.name}</span> <span aria-hidden="true">→</span></a>
      </div>
    </li>`;
}

export function initDestinations() {
  const list = document.getElementById('ledger-list');
  const filterEl = document.getElementById('ledger-filters');
  const preview = document.getElementById('ledger-preview');
  const img = preview.querySelector('img');

  list.innerHTML = destinations.map(row).join('') + '<li class="ledger__empty" hidden>No packages under this filter yet. Ask us; we’ll build one.</li>';
  filterEl.innerHTML = filters.map((f, i) => `<li><button class="chip" type="button" data-filter="${f.id}" aria-pressed="${i === 0}">${f.label}</button></li>`).join('');

  // Filters
  filterEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filterEl.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.filter;
    let shown = 0;
    list.querySelectorAll('.ledger__item').forEach((li) => {
      const on = f === 'all' || li.dataset.tags.split(' ').includes(f);
      li.hidden = !on;
      if (on) shown++;
    });
    list.querySelector('.ledger__empty').hidden = shown > 0;
  });

  // "View Package" pre-selects that state in the enquiry form
  list.addEventListener('click', (e) => {
    const a = e.target.closest('[data-state]');
    if (a) window.dispatchEvent(new CustomEvent('prefill-state', { detail: { id: a.dataset.state } }));
  });

  // Cursor-following preview (fine pointers only)
  if (!finePointer()) return;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = false;
  const ease = prefersReducedMotion() ? 1 : 0.16;
  const tick = () => {
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    preview.style.translate = `${x + 28}px ${y - 160}px`;
    if (active || Math.abs(tx - x) > 0.5) raf = requestAnimationFrame(tick);
    else raf = 0;
  };
  list.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  list.addEventListener('pointerover', (e) => {
    const li = e.target.closest('.ledger__item');
    if (!li) return;
    const d = destinations.find((x) => x.id === li.dataset.id);
    if (img.dataset.id !== d.id) { img.src = imgFor(d); img.dataset.id = d.id; }
    if (!active) { x = e.clientX; y = e.clientY; }
    active = true;
    preview.classList.add('is-on');
  });
  list.addEventListener('pointerleave', () => { active = false; preview.classList.remove('is-on'); });
}
