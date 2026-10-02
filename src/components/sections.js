/**
 * Small data-driven sections: How It Works stops, Live Like a Local media,
 * Traveller Stories postcards, Why Wacations stamps, footer extras.
 */
import { stories } from '../data/stories.js';
import { howIcons, whyIcons, socialIcons, passportStamp, placeholderArt } from './illustrations.js';
import { CONFIG, whatsappLink } from '../config.js';

/* ---------- 4. How It Works ---------- */
const HOW_STOPS = [
  { icon: 'map', title: 'Choose your state', copy: 'Pick a state, or tell us a feeling. Desert gold? Monsoon green? We’ll match it.', tag: 'You' },
  { icon: 'ticket', title: 'We book your tickets', copy: 'Trains with a view, flights that fit. Seats chosen, PNRs in your inbox.', tag: 'Train · Flight' },
  { icon: 'bed', title: 'We book your rooms', copy: 'Heritage havelis, boutique hotels and homestays run by families who cook.', tag: 'Hotels · Homestays' },
  { icon: 'cab', title: 'We arrange your rides', copy: 'Airport pickups, local cabs, autos and the odd shikara, all waiting on time.', tag: 'Cabs · Local transport' },
  { icon: 'spark', title: 'We curate experiences', copy: 'Cook, weave, dance, pray, paddle. Moments with the people who live there.', tag: 'Food · Craft · Culture' },
  { icon: 'heart', title: 'You live it', copy: 'We handle everything else, with a real human on call every hour of your trip.', tag: '24/7 on-trip support' },
];

export function renderHow() {
  const track = document.getElementById('how-track');
  track.innerHTML = HOW_STOPS.map((s, i) => `
    <li class="stop-item ticket-shadow">
      <article class="stop ticket ticket--v">
        <div class="stop__top">
          <span class="stop__n" aria-hidden="true">${i + 1}</span>
          <span class="stamp stop__stamp will-stamp" aria-hidden="true">${howIcons[s.icon]}</span>
        </div>
        <div class="stop__body">
          <h3><span class="sr-only">Stop ${i + 1}: </span>${s.title}</h3>
          <p>${s.copy}</p>
          <span class="stamp stamp--rect stop__tag meta">${s.tag}</span>
        </div>
      </article>
    </li>`).join('');
}

/* ---------- 6. Live Like a Local: placeholder art for each image slot ---------- */
export function renderLocalMedia() {
  document.querySelectorAll('.local__media').forEach((m) => {
    const title = m.closest('.local__card').querySelector('.local__verb').textContent;
    const st = getComputedStyle(m);
    const src = m.dataset.src || placeholderArt({
      title, accent: st.getPropertyValue('--a').trim(), deep: st.getPropertyValue('--b').trim(), slot: `local/${m.dataset.slot}`,
    });
    m.style.backgroundImage = `url("${src}")`;
    m.setAttribute('role', 'img');
    m.setAttribute('aria-label', m.closest('.local__card').querySelector('h3').textContent);
  });
}

/* ---------- 7. Stories ---------- */
const postcard = (s, clone = false) => `
  <li class="postcard"${clone ? ' data-clone aria-hidden="true"' : ''}>
    ${s.placeholder ? '<span class="placeholder-tag postcard__ph">Placeholder</span>' : ''}
    <blockquote class="postcard__quote">“${s.quote}”</blockquote>
    <div class="postcard__side">
      <span class="postcard__stamp-box" aria-hidden="true">✈</span>
      <div class="postcard__lines">
        <span class="postcard__name">${s.name}</span>
        <span class="postcard__from">${s.from}</span>
        <span class="postcard__trip">${s.trip}</span>
      </div>
    </div>
    <span class="stamp postcard__pstamp" aria-hidden="true">${s.stamp}</span>
  </li>`;

export function renderStories() {
  const track = document.getElementById('stories-track');
  // second copy makes the marquee loop seamlessly; hidden from assistive tech
  track.innerHTML = stories.map((s) => postcard(s)).join('') + stories.map((s) => postcard(s, true)).join('');
}

/* ---------- 8. Why Wacations ---------- */
const WHY = [
  { icon: 'route', title: 'End‑to‑End Planning', copy: 'One team for tickets, rooms, rides and experiences. One WhatsApp thread for everything.' },
  { icon: 'hands', title: 'Authentic Local Partners', copy: 'Families, artisans and guides we know by name, and pay fairly.' },
  { icon: 'clock', title: '24/7 On‑Trip Support', copy: 'A missed train at midnight? A real person answers, and fixes it.' },
  { icon: 'pen', title: 'Personalised Itineraries', copy: 'Your pace, your food, your festivals. No two Wacations are the same.' },
];

export function renderWhy() {
  document.getElementById('why-grid').innerHTML = WHY.map((w) => `
    <li class="ticket-shadow reveal">
      <article class="why__item ticket ticket--v">
        <div class="why__top"><span class="stamp why__stamp will-stamp" aria-hidden="true">${whyIcons[w.icon]}</span></div>
        <div class="why__body"><h3>${w.title}</h3><p>${w.copy}</p></div>
      </article>
    </li>`).join('');
}

/* ---------- 10. Footer ---------- */
export function renderFooter() {
  document.getElementById('footer-stamp').innerHTML = passportStamp;
  document.getElementById('footer-social').innerHTML = Object.entries(CONFIG.socials).map(([k, url]) => `
    <li><a href="${url}" target="_blank" rel="noopener" aria-label="Wacations on ${k[0].toUpperCase() + k.slice(1)}">${socialIcons[k]}</a></li>`).join('');
  const wa = whatsappLink();
  document.getElementById('footer-wa').href = wa;
  document.getElementById('wa-float').href = wa;
  document.getElementById('year').textContent = new Date().getFullYear();
}
