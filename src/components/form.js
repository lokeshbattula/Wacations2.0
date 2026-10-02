/**
 * "Plan My Journey" enquiry form: client-side validation, placeholder endpoint,
 * animated "ticket stamped ✓ CONFIRMED" success state.
 * Set CONFIG.enquiryEndpoint (src/config.js) to your real API to go live.
 */
import { destinations } from '../data/destinations.js';
import { CONFIG } from '../config.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../animations/smooth.js';

const EXPERIENCES = ['Food', 'Fashion', 'Festivals', 'Crafts', 'Nature', 'Spiritual'];
const tick = '<svg class="chip__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const chip = (name, value, label) =>
  `<li><label class="chip"><input type="checkbox" name="${name}" value="${value}" />${tick}${label}</label></li>`;
const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}${Number(n) >= 200000 ? '+' : ''}`;
const isoDate = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export function initForm() {
  const form = document.getElementById('enquiry');
  const $ = (id) => document.getElementById(id);
  const statesEl = $('f-states');
  const expEl = $('f-exp');

  statesEl.innerHTML = destinations.map((d) => chip('states', d.name, d.name)).join('') + chip('states', 'Not sure yet', 'Not sure yet');
  expEl.innerHTML = EXPERIENCES.map((e) => chip('experiences', e, e)).join('');

  // Dates can't be in the past; "to" follows "from"
  const today = isoDate(new Date());
  $('f-from').min = today;
  $('f-to').min = today;
  $('f-from').addEventListener('change', (e) => { $('f-to').min = e.target.value || today; });

  // Budget slider label + track fill
  const budget = $('f-budget');
  const syncBudget = () => {
    $('f-budget-out').textContent = inr(budget.value);
    const pct = ((budget.value - budget.min) / (budget.max - budget.min)) * 100;
    budget.style.setProperty('--fill', `${pct}%`);
    budget.setAttribute('aria-valuetext', `${inr(budget.value)} per person`);
  };
  budget.addEventListener('input', syncBudget);
  syncBudget();

  // Pre-fill from other sections ("Add to my journey", "View Package")
  window.addEventListener('prefill-experience', (e) => {
    const box = expEl.querySelector(`input[value="${e.detail.chip}"]`);
    if (box) box.checked = true;
  });
  window.addEventListener('prefill-state', (e) => {
    const d = destinations.find((x) => x.id === e.detail.id);
    const box = d && statesEl.querySelector(`input[value="${d.name}"]`);
    if (box) { box.checked = true; setError('states', ''); }
  });

  /* ---------- Validation ---------- */
  const errors = { name: 'e-name', phone: 'e-phone', email: 'e-email', states: 'e-states', from: 'e-from', to: 'e-to', travellers: 'e-pax' };
  const fieldFor = { name: 'f-name', phone: 'f-phone', email: 'f-email', from: 'f-from', to: 'f-to', travellers: 'f-pax' };

  function setError(key, msg) {
    $(errors[key]).textContent = msg;
    const input = fieldFor[key] && $(fieldFor[key]);
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate(data) {
    const out = {};
    if (!data.name || data.name.trim().length < 2) out.name = 'Please tell us your name.';
    const digits = (data.phone || '').replace(/[^\d]/g, '');
    if (!/^\+?[\d\s()-]+$/.test(data.phone || '') || digits.length < 10 || digits.length > 13) out.phone = 'Enter a valid phone number (10 digits, or with country code).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email || '')) out.email = 'Enter a valid email address.';
    if (!data.states.length) out.states = 'Pick at least one state (or “Not sure yet”).';
    if (!data.from) out.from = 'Choose a start date.';
    else if (data.from < today) out.from = 'Start date can’t be in the past.';
    if (!data.to) out.to = 'Choose an end date.';
    else if (data.from && data.to < data.from) out.to = 'End date must be on or after the start date.';
    const pax = Number(data.travellers);
    if (!Number.isInteger(pax) || pax < 1 || pax > 60) out.travellers = 'Between 1 and 60 travellers.';
    return out;
  }

  const collect = () => {
    const fd = new FormData(form);
    return {
      name: fd.get('name')?.trim(),
      phone: fd.get('phone')?.trim(),
      email: fd.get('email')?.trim(),
      states: fd.getAll('states'),
      from: fd.get('from'),
      to: fd.get('to'),
      travellers: fd.get('travellers'),
      budgetPerPerson: Number(fd.get('budget')),
      experiences: fd.getAll('experiences'),
      message: fd.get('message')?.trim(),
      source: 'landing-page',
      submittedAt: new Date().toISOString(),
    };
  };

  // Re-validate a field once the user has interacted with it
  form.addEventListener('change', (e) => {
    if (!form.dataset.tried) return;
    const errs = validate(collect());
    Object.keys(errors).forEach((k) => setError(k, errs[k] || ''));
    void e;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.dataset.tried = '1';
    const data = collect();
    const errs = validate(data);
    Object.keys(errors).forEach((k) => setError(k, errs[k] || ''));
    const first = Object.keys(errs)[0];
    if (first) {
      $('f-status').textContent = `Please check ${Object.keys(errs).length} field${Object.keys(errs).length > 1 ? 's' : ''} above.`;
      const target = fieldFor[first] ? $(fieldFor[first]) : statesEl.querySelector('input');
      target.focus();
      return;
    }
    $('f-status').textContent = '';
    form.classList.add('is-sending');
    form.setAttribute('aria-busy', 'true');
    try {
      await send(data);
      showConfirmed(data);
    } catch (err) {
      $('f-status').textContent = 'We couldn’t send that just now. Please try again, or message us on WhatsApp.';
    } finally {
      form.classList.remove('is-sending');
      form.removeAttribute('aria-busy');
    }
  });

  async function send(data) {
    if (CONFIG.enquiryEndpoint.includes('PLACEHOLDER')) {
      // Simulated submit until the real endpoint is configured.
      console.info('[Wacations] Enquiry (simulated):', data);
      await new Promise((r) => setTimeout(r, 900));
      return { ok: true };
    }
    const res = await fetch(CONFIG.enquiryEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json().catch(() => ({}));
  }

  function showConfirmed(data) {
    const box = $('confirmed');
    $('c-name').textContent = data.name.split(' ')[0];
    $('c-ref').textContent = `WC-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    form.hidden = true;
    box.hidden = false;
    box.classList.remove('is-shown');
    void box.offsetWidth;
    box.classList.add('is-shown');
    box.focus({ preventScroll: true });
    // the ticket just got much shorter: re-measure before scrolling to it
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const lenis = getLenis();
      if (lenis) { lenis.resize(); lenis.scrollTo(box, { offset: -window.innerHeight / 3 }); }
      else box.scrollIntoView({ block: 'center' });
    });
  }

  $('c-reset').addEventListener('click', () => {
    form.reset();
    delete form.dataset.tried;
    syncBudget();
    Object.keys(errors).forEach((k) => setError(k, ''));
    $('confirmed').hidden = true;
    form.hidden = false;
    ScrollTrigger.refresh();
    $('f-name').focus();
  });
}
