/**
 * "Eight Tastes of India": renders the cards, story dialog, and (on capable desktops)
 * lazy-loads the shared Three.js renderer that draws one model per card.
 */
import { experiences } from '../data/experiences.js';
import { tasteIllus, placeholderArt } from './illustrations.js';
import { isMobile, hasWebGL, prefersReducedMotion, whenNear } from '../utils/env.js';
import { getLenis } from '../animations/smooth.js';

const pad = (n) => String(n).padStart(2, '0');

function renderCards(grid) {
  grid.innerHTML = experiences.map((e, i) => `
    <li class="taste-item ticket-shadow">
      <article class="taste ticket ticket--v" style="--tint:${e.tint}" data-index="${i}">
        <span class="taste__num">${pad(i + 1)}</span>
        <span class="taste__script indic" lang="${e.lang}" aria-hidden="true">${e.label}</span>
        <div class="taste__stage" data-cursor="drag" data-index="${i}" role="img"
             aria-label="Interactive 3D ${e.model === 'dabba' ? 'masala dabba' : e.model}. Drag to rotate.">
          <div class="taste__illus">${tasteIllus[e.model] || ''}</div>
        </div>
        <div class="taste__body">
          <h3>${e.title}</h3>
          <p>${e.copy[0]}</p>
          <button class="taste__open" type="button" data-index="${i}" aria-haspopup="dialog">Open the story <span aria-hidden="true">→</span></button>
        </div>
      </article>
    </li>`).join('');
}

/* ---------------- Story dialog ---------------- */
function initDialog() {
  const dlg = document.getElementById('story-dialog');
  const el = (id) => document.getElementById(id);
  let current = 0;
  let opener = null;

  const fill = (i) => {
    const e = experiences[i];
    current = i;
    el('story-num').textContent = `${pad(i + 1)} / ${pad(experiences.length)}`;
    el('story-title').textContent = e.title;
    el('story-copy').innerHTML = e.copy.join('<br/>');
    el('story-example').textContent = e.example;
    const stamp = el('story-stamp');
    stamp.textContent = e.label;
    stamp.lang = e.lang;
    stamp.className = 'indic';
    const media = el('story-media');
    media.style.backgroundImage = `url("${e.image || placeholderArt({ title: e.title, script: e.label, accent: e.tint, slot: `experiences/${e.id}.jpg` })}")`;
    media.setAttribute('aria-label', e.example);
    el('story-cta').dataset.chip = e.chip || '';
  };

  const open = (i, from) => {
    opener = from || document.activeElement;
    fill(i);
    if (!dlg.open) dlg.showModal();
    getLenis()?.stop();
  };
  const close = () => dlg.open && dlg.close();

  dlg.addEventListener('close', () => {
    getLenis()?.start();
    opener?.focus?.({ preventScroll: true });
  });
  // click on backdrop closes
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  el('story-close').addEventListener('click', close);
  el('story-next').addEventListener('click', () => fill((current + 1) % experiences.length));
  el('story-cta').addEventListener('click', (e) => {
    const chip = e.currentTarget.dataset.chip;
    if (chip) window.dispatchEvent(new CustomEvent('prefill-experience', { detail: { chip } }));
    opener = null; // focus moves to the form instead
    close();
    getLenis()?.start(); // 'close' fires async; restart now so the #plan anchor scroll runs
  });

  return { open };
}

/* ---------------- Init ---------------- */
export function initTastes() {
  const grid = document.getElementById('tastes-grid');
  const wrap = grid.parentElement;
  const canvas = document.getElementById('tastes-canvas');
  renderCards(grid);
  const dialog = initDialog();

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.taste__open');
    if (btn) dialog.open(+btn.dataset.index, btn);
  });

  // Only desktops with WebGL get real 3D. Mobile keeps the illustrated, gently turning cards.
  if (isMobile() || !hasWebGL()) return;

  whenNear(wrap, '400px').then(async () => {
    const { createTastesScene } = await import('../scenes/tastesScene.js');
    const stages = [...grid.querySelectorAll('.taste__stage')];
    const scene = createTastesScene({ canvas, wrap, stages, experiences, reduced: prefersReducedMotion() });
    document.documentElement.classList.add('has-webgl');

    // Drag to rotate, click (without dragging) to open the story.
    stages.forEach((stage, i) => {
      let down = null;
      let moved = 0;
      stage.addEventListener('pointerenter', () => scene.hover(i, true));
      stage.addEventListener('pointerleave', () => { scene.hover(i, false); });
      stage.addEventListener('pointerdown', (e) => {
        down = { x: e.clientX, y: e.clientY };
        moved = 0;
        stage.setPointerCapture(e.pointerId);
        scene.grab(i, true);
      });
      stage.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - down.x;
        const dy = e.clientY - down.y;
        moved += Math.abs(dx) + Math.abs(dy);
        down = { x: e.clientX, y: e.clientY };
        scene.drag(i, dx, dy);
      });
      const end = (e) => {
        if (!down) return;
        down = null;
        scene.grab(i, false);
        if (e.type === 'pointerup' && moved < 6) dialog.open(i, stage.closest('.taste').querySelector('.taste__open'));
      };
      stage.addEventListener('pointerup', end);
      stage.addEventListener('pointercancel', end);
    });

    // Keyboard: focusing the story button highlights its model
    grid.addEventListener('focusin', (e) => {
      const b = e.target.closest('.taste__open');
      if (b) scene.hover(+b.dataset.index, true);
    });
    grid.addEventListener('focusout', (e) => {
      const b = e.target.closest('.taste__open');
      if (b) scene.hover(+b.dataset.index, false);
    });
  });
}
