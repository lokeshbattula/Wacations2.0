# Wacations 2.0

**Dream it. Experience it.**

A cinematic landing page for **Wacations**, a Hyderabad-based experiential travel company that plans complete, state-by-state journeys across India: train and flight tickets, hotels and homestays, cabs and local transport, and curated local experiences (food, fashion, festivals, crafts and culture).

The page is designed as a journey: the visitor "boards" at the top and travels through India as they scroll. The recurring motif is the **travel ticket**: perforated edges, dashed borders, tear-off stubs, notches and passport stamps.

---

## Highlights

- **3D hero "Boarding Pass":** a layered paper-and-fabric map of India in Three.js, with a paper airplane looping a dotted flight path across the states.
- **Eight Tastes of India:** eight interactive low-poly 3D objects (kulhad chai, silk, diya, Kathakali mask, houseboat, auto-rickshaw, potter's wheel, masala dabba). Drag to rotate, click for a story card. All eight are drawn by one shared WebGL renderer.
- **How It Works:** a horizontal, scroll-pinned ticket route where each stop gets a passport stamp as it scrolls into view.
- **Destinations Index:** a data-driven travel ledger with filters, a cursor-following preview and a glow in each state's accent colour.
- **Live Like a Local**, **Traveller Stories** (postcard marquee), **Why Wacations** (stamp grid).
- **Plan My Journey:** an enquiry form with client-side validation and an animated "✓ CONFIRMED" ticket stamp.
- **Ticket-stub footer** with contact details, a passport stamp and a WhatsApp button.
- **Two themes:** *Saffron Dusk* (default) and *Peacock Monsoon*, switched with a ticket-punch toggle and remembered per visitor.
- **Signature transitions:** a diya / golden-hour light sweep and a perforated ticket tear between sections.
- **Micro-interactions:** a ticket-punch custom cursor, perforated button hovers, handwritten "write-on" labels, a dotted flight-path scroll progress bar and a floating WhatsApp button.

## Tech stack

| | |
|---|---|
| Build | [Vite](https://vitejs.dev/) (vanilla JS, ES modules) |
| 3D | [Three.js](https://threejs.org/) (lazy-loaded) |
| Animation | [GSAP](https://gsap.com/) + ScrollTrigger |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering/) |
| Fonts | Playfair Display, Kaushan Script, DM Sans, Noto Sans/Serif (Devanagari, Telugu, Malayalam, Tamil, Bengali) |

## Getting started

Requires **Node.js 18+**.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

## Project structure

```
index.html                  Page markup, SEO / Open Graph meta, TravelAgency schema
public/                     Static files: logo, favicon, robots.txt, sitemap.xml, images
src/
  main.js                   Entry: renders data, wires interactions, lazy-loads 3D
  config.js                 Enquiry endpoint, WhatsApp number, social links
  data/
    destinations.js         State packages (ledger + form state chips)
    experiences.js          The "Eight Tastes" objects and stories
    stories.js              Traveller testimonials (placeholder content)
    india.js                Stylised India outline + flight-loop cities
  styles/
    tokens.css              Both colour themes, type scale, spacing (CSS variables)
    base.css                Reset, typography, accessibility, reduced motion
    components.css          Buttons, tickets, stamps, navbar, cursor, dialog, transitions
    sections.css            Per-section layout
  components/               Rendering + behaviour per section
  animations/               Lenis, ScrollTrigger choreography, reveals, transitions
  scenes/                   Three.js hero map, 2D fallback, Eight Tastes renderer + models
```

## Customising

| Task | Where |
|---|---|
| Add or edit a state package | `src/data/destinations.js` (it appears in the ledger, the filters and the form automatically) |
| Connect the enquiry form | Set `CONFIG.enquiryEndpoint` in `src/config.js`. While it contains `PLACEHOLDER`, submissions are simulated and logged to the console. |
| WhatsApp number, social links | `src/config.js` |
| Theme colours | `src/styles/tokens.css` (`:root` = Saffron Dusk, `[data-theme="peacock"]` = Peacock Monsoon) |
| Photos and logo | See [IMAGE_SLOTS.md](IMAGE_SLOTS.md) for every slot, path and size |
| Testimonials | `src/data/stories.js` (replace placeholders with real, consented quotes, then set `placeholder: false`) |

The form sends a JSON `POST`:

```json
{ "name": "", "phone": "", "email": "", "states": [], "from": "YYYY-MM-DD", "to": "YYYY-MM-DD",
  "travellers": "2", "budgetPerPerson": 40000, "experiences": [], "message": "",
  "source": "landing-page", "submittedAt": "ISO-8601" }
```

## Responsive and accessible

| | Desktop (WebGL) | Mobile ≤ 767px | `prefers-reduced-motion` |
|---|---|---|---|
| Hero | 3D map, animated plane | SVG paper map | Static frame |
| Eight Tastes | Drag-to-rotate 3D | Swipeable illustrated cards | Models move only when dragged |
| How It Works | Horizontal pinned route | Vertical route | Vertical route |
| Smooth scroll / transitions | On | On | Native scroll, no transitions |

Other accessibility details:
- Semantic landmarks, a skip link and visible dashed focus rings.
- A native `<dialog>` with focus return.
- Labelled form errors announced with `aria-live`.
- WCAG AA contrast in both themes.

Dev tip: append `?reduced-motion` to the URL (dev server only) to test the reduced-motion code paths.

## Performance

Three.js loads only on capable desktops, after first paint. Fonts load without blocking rendering, and the hero entrance is CSS (transform-only) so the headline paints immediately.

Lighthouse on the local production build:

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile (simulated slow 4G) | 93 | 100 | 100 | 100 |
| Desktop | 93 | 100 | 100 | 100 |

## Deployment

It's a static site, so any static host works.

- **Vercel / Netlify:** import this repo. The framework preset is *Vite*, the build command is `npm run build` and the output directory is `dist`.
- **GitHub Pages:** build, then publish `dist/` (for example with a GitHub Actions workflow).

## Before going live

- [ ] Add the logo at `public/assets/logo.png` (a text fallback is shown until then)
- [ ] Add photos (see [IMAGE_SLOTS.md](IMAGE_SLOTS.md)) and `public/images/og-cover.jpg`
- [ ] Set the real enquiry endpoint and social links in `src/config.js`
- [ ] Replace placeholder testimonials and the `₹___` prices
- [ ] Add Privacy Policy and Terms pages

## Contact

**Wacations** · Dev Battula
📞 +91 99518 39557 · ✉️ travel@wacations.in · 🌐 [www.wacations.in](https://www.wacations.in)
9th floor, AltF Financial District, Kapil Kavuri Hub, Hyderabad, Telangana 500032
