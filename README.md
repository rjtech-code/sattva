# Ston-i Surfaces — website

Website for **Ston-i Surfaces**, the architectural surface-material brand of **Sattva Sattvik Private Limited** (Jaipur), covering its three ranges: Stonir, StonIT and Art-i Canvas Veneer.

Vite + React 19 + React Router 7 + Tailwind CSS 4, with react-three-fiber for the 3D product viewer.

## Run

```bash
npm install
npm run dev       # http://localhost:5173 — enquiries are saved to data/enquiries.json
npm run build     # production build in dist/ (+ robots.txt, sitemap.xml when VITE_SITE_URL is set)
npm run preview   # serve dist/
npm run lint
```

## Deploy (Vercel)

1. Import the repo. Framework preset: Vite. Build: `npm run build`. Output: `dist`.
2. `vercel.json` rewrites every non-asset path to `index.html`, so direct links like `/products/stonir/natural-series/ssv-1000-1` work.
3. `api/enquiry.js` deploys as a serverless function at `POST /api/enquiry`.
4. Set environment variables (see `.env.example`):
   - `VITE_SITE_URL`: the production origin. Enables canonical URLs, Open Graph URLs and `sitemap.xml`.
   - Enquiry delivery, at least one of:
     - `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL` + `ENQUIRY_FROM_EMAIL` (email via Resend)
     - `ENQUIRY_WEBHOOK_URL` (POSTs the enquiry JSON to a CRM / Zapier / Apps Script)

   Without delivery configured, the form tells the visitor the enquiry was **not** sent. It never fakes success.

## Theme

Dark is the brand default and loads on every visit. The sun/moon button in the header switches to a light theme for the current visit only. Both themes use the same tokens in `src/index.css`: `:root` holds the dark values and `[data-theme='light']` holds the light ones.

## Content

| What | Where |
|------|-------|
| Brand, contact details, navigation | `src/data/site.js` |
| Ranges (copy, specs, tests, uses, installation) | `src/data/ranges.js` |
| Collections | `src/data/catalog.js` |
| Products (generated from the catalogue PDFs) | `src/data/catalog.generated.json` |
| Catalogue downloads | `src/data/documents.js` |
| About, pillars, process, partners, applications | `src/data/content.js` |
| Resources & FAQs | `src/data/resources.js` |
| Sources, conflicts, missing items | `docs/CONTENT_AND_ASSET_MAP.md` |

### Regenerating products from the catalogues

```bash
# PDFs downloaded from the client's Drive folder into ./pdfs
python3 scripts/extract_catalogue.py ./pdfs ./.work   # crops swatches → public/media
python3 scripts/finalize_catalog.py ./.work           # → src/data/catalog.generated.json
```

Requires `poppler-utils` (`pdftoppm`, `pdftotext`) and Python Pillow. Crop boxes are calibrated per catalogue layout. If a catalogue's layout changes, re-check the boxes.

### Adding a range

Append an entry to `RANGES` and its collections to `COLLECTIONS`. Navigation is still a fixed list in `src/data/site.js › NAV`, so also add a link there. The portfolio page, range template, enquiry form and sitemap pick the new range up automatically.

### 3D viewer

`src/components/viewer/ProductViewer.jsx` supports:
- `slab`: a real-time 3D panel textured with the product photo (used today)
- `model`: a supplied `.glb`/`.gltf`
- `sequence`: a 360° image sequence, labelled as such

three.js is only downloaded when a viewer scrolls into view.
