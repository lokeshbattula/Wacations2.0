# Image slots to fill

Every slot below shows a generated, clearly labelled placeholder ("IMAGE SLOT · …") until you supply a real file.
Drop files into `public/` at the paths shown; anything in `public/` is served from the site root.

| # | Slot | Path | Size / ratio | Where it appears | How to switch it on |
|---|------|------|--------------|------------------|---------------------|
| 1 | **Logo** | `public/assets/logo.png` | ~480×168 transparent PNG (or SVG, then update the `src`) | Navbar | Picked up automatically. Until then a text fallback is shown. |
| 2 | Favicon | `public/assets/favicon.svg` | square SVG | Browser tab | Replace the simple "W" placeholder with your mark. |
| 3 | Open Graph / social cover | `public/images/og-cover.jpg` | 1200×630 JPG | Link previews (WhatsApp, LinkedIn, X) | Referenced in `index.html` meta tags. |
| 4–11 | Destination previews (8) | `public/images/destinations/{id}.jpg`: `rajasthan`, `kerala`, `telangana`, `himachal-pradesh`, `goa`, `tamil-nadu`, `uttarakhand`, `west-bengal` | 800×1000 (4:5) | Hover preview in the Destinations Index | Set `image: '/images/destinations/rajasthan.jpg'` etc. in `src/data/destinations.js` |
| 12–19 | Experience story photos (8) | `public/images/experiences/{id}.jpg`: `chai`, `textile`, `diya`, `mask`, `shikara`, `auto`, `pottery`, `dabba` | 1120×440 (wide) | Top of each story card (dialog) in "Eight Tastes" | Set `image: '/images/experiences/chai.jpg'` etc. in `src/data/experiences.js` |
| 20 | Live Like a Local: Taste | `public/images/local/local-taste.jpg` | 800×600 | "Taste" card | Add `data-src="/images/local/local-taste.jpg"` to its `.local__media` div in `index.html` |
| 21 | Live Like a Local: Wear | `public/images/local/local-wear.jpg` | 800×600 | "Wear" card | Same, on the second card |
| 22 | Live Like a Local: Celebrate | `public/images/local/local-celebrate.jpg` | 800×600 | "Celebrate" card | Same, on the third card |

**Tips**
- Export JPGs at ~75–80% quality (or WebP) to keep the Lighthouse score high.
- Photos should feature real local hosts, artisans and places you work with. Get consent for any recognisable faces.
- Traveller Stories (`src/data/stories.js`) are **placeholder testimonials**. Replace them with real, consented quotes and set `placeholder: false` on each.
