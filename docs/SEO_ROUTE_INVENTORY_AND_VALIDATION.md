# SEO route inventory and implementation notes

**Production hostname:** https://www.sattvasattvik.com  
**Build model:** Vite static build with client-side React Router; `scripts/postbuild.js` writes route-specific HTML files after Vite completes.  
**Source of route data:** `src/App.jsx`, `src/data/ranges.js`, `src/data/catalog.generated.json`.

## Public indexable route inventory

The production build generated **245 route-specific HTML documents**:

| Route family | Count | Indexing |
|---|---:|---|
| Home, About, Innovation, Products overview, Applications, B2B Partners, Resources, Contact | 8 | Index |
| Product range pages: Stonir, StonIT, Art-i Canvas Veneer | 3 | Index |
| Collection pages | 22 | Index |
| Individual catalogue product pages | 212 | Index |
| **Total** | **245** | |

### Product route breakdown

| Range | Collections | Product detail routes |
|---|---:|---:|
| Stonir | 5 | 152 |
| StonIT | 16 | 42 |
| Art-i Canvas Veneer | 1 | 18 |
| **Total** | **22** | **212** |

Product URLs follow the existing React Router pattern:
`/products/:range/:collection/:product`.
Collection URLs follow `/products/:range/:collection`.

## Redirect and non-indexable behaviour

- `/manufacturing` permanently redirects to `/about`; it is not included in the sitemap.
- `/projects` permanently redirects to `/applications`; it is not included in the sitemap.
- The generated `404.html` carries `noindex, nofollow`.
- The current application has no admin or login route in `src/App.jsx`; no made-up private routes were added to robots rules.
- Clean route URLs are canonical. Product/contact query parameters are not included in canonical paths.
- The sitemap is generated from the explicit public route manifest and excludes redirects and query-string variants.

## Initial HTML and metadata

For every generated public route, the post-build step writes:
- One page-specific title and meta description.
- One canonical URL on the preferred `www.sattvasattvik.com` host.
- One robots directive.
- Open Graph title, description, URL and image.
- Twitter large-image card metadata.
- A JSON-LD graph containing Organization, Brand and WebSite entities, page type, breadcrumbs where available, and Product/ItemList data where appropriate.
- The same page's featured image in the image sitemap.

The React SEO component removes build-time head tags only after JavaScript starts and then renders metadata for client-side navigation. This preserves the static initial HTML for crawlers while avoiding duplicate tags after hydration.

## Validation performed

GitHub Actions run for commit `57b59e92fd9c1bae879e01cfc0cc179931070eed`:
- `npm ci`: passed
- `npm run build`: passed
- `scripts/seo-check.js`: passed; 245 generated route documents, unique titles/descriptions, canonical and robots tags, OG/Twitter tags, JSON-LD, sitemap URL coverage and image sitemap checks.
- `npm run lint`: passed
- Vercel GitHub commit status: success.

The SEO checker also checks that every catalogue image file referenced by the generated catalogue exists in the production output and that catalogue images have intrinsic width/height metadata.

## Not verified / owner actions

- Live raw HTTP responses, live redirect/status behaviour, and live `robots.txt` / `sitemap.xml` could not be fetched from the execution environment. The production deployment status is successful, but live URL inspection remains pending.
- No Lighthouse/PageSpeed or field Core Web Vitals measurements were run. The build log shows a large 3D viewer chunk; do not claim CWV improvement without a browser performance run.
- Google Search Console ownership, sitemap submission, indexing requests, search query performance and Google rich-result eligibility remain owner-side tasks.
- No analytics ID was found in the repository search; no new tracking code or invented measurement ID was added.
- The keyword map is an intent-led opportunity map, not a paid keyword-tool report. Search volume and difficulty have not been fabricated.
- The repository contains only the state-level company location (Rajasthan, India); no street address was invented.
