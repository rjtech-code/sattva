# SEO keyword and route map

**Market:** India-first B2B discovery, with international brand enquiries supported by the existing website copy.  
**Evidence note:** The phrases below are search-intent opportunities inferred from the catalogue, current page content and public search-result language. No search-volume, CPC or difficulty figures are claimed. Validate demand and actual queries in Google Search Console / Keyword Planner after the site is verified.

## Brand architecture

Sattva Sattvik Private Limited (parent company and manufacturer) → Ston-i Surfaces (market-facing architectural surface brand) → Stonir / StonIT / Art-i Canvas Veneer → collections → catalogue products → applications.

Keep the parent-company query cluster distinct from customer-facing range queries. Do not create separate company entities for each range.

## Keyword-to-page map

| Existing route | Primary opportunity | Supporting opportunities | Intent |
|---|---|---|---|
| / | Ston-i Surfaces | Ston-i architectural surfaces; Sattva Sattvik | Navigational / commercial |
| /about | Sattva Sattvik Private Limited | Sattva Sattvik company; architectural surface material manufacturer India | Navigational / informational |
| /products | Architectural surface materials | decorative architectural surfaces; surface material collections | Commercial investigation |
| /products/stonir | Flexible stone veneer | natural stone veneer sheets; thin stone veneer; flexible stone sheets | Commercial investigation |
| /products/stonit | StonIT architectural surface panels | FRP rock panels; 3D decorative wall panels; textured wall panels | Commercial investigation |
| /products/art-i-canvas-veneer | Art-i Canvas Veneer | printed stone veneer; canvas veneer; decorative stone surface | Commercial investigation |
| /products/stonir/natural-series | Natural stone veneer | natural slate veneer; flexible slate veneer | Commercial investigation |
| /products/stonir/grainy-series | Grainy stone veneer | sedimentary stone veneer; grainy veneer designs | Commercial investigation |
| /products/stonir/translucent-series | Translucent stone veneer | backlit stone veneer; translucent natural stone sheets | Commercial investigation |
| /products/stonir/bookmatch-series | Bookmatch stone veneer | bookmatched stone veneer; mirrored stone sheets | Commercial investigation |
| /products/stonir/10x4-massive-veneer | 10x4 stone veneer | large-format stone veneer sheets | Commercial investigation |
| /products/stonit/* | StonIT + exact design name | design name + colour / panel where catalogue data confirms it | Commercial investigation |
| /products/art-i-canvas-veneer/canvas-series | Art-i Canvas Series | canvas stone veneer designs | Commercial investigation |
| /applications | Architectural surface applications | stone veneer wall applications; decorative wall panel applications | Informational / commercial |
| /partners | Architectural surface material dealer / distributor | Ston-i dealer enquiry; surface material B2B partnership | Transactional |
| /resources | Ston-i product catalogues | Stonir catalogue; StonIT shade card; Art-i catalogue | Informational |
| /contact | Contact Ston-i Surfaces | Ston-i product enquiry; Sattva Sattvik contact | Navigational / transactional |
| /innovation | Surface material product development | architectural surface R&D | Informational |

The 22 existing collection routes and 212 catalogue product routes inherit long-tail intent from their exact collection/product identifiers and verified product specifications. They are generated from `catalog.generated.json`; no artificial landing pages are created.

## Guardrails

- Use “flexible stone veneer” primarily for Stonir because that terminology is supported by its range copy and specifications.
- Use “FRP-based architectural panels” / “3D rock panels” for StonIT where the catalogue supports it; do not call every StonIT design natural stone.
- Use “printed natural stone veneer” / “Canvas Veneer” for Art-i where the range description supports it.
- Do not target unsupported claims such as waterproof, fireproof, eco-friendly, certified, sustainable, or guaranteed lifespan unless the exact approved catalogue text supports the claim on that page.
- Do not add price keywords or Product offers markup: this is an enquiry-led catalogue, not a checkout store.
- Do not create separate URLs for colour filters, tracking parameters, or query-string variants. Canonicals point to the clean route.

## Research observations (not search-volume data)

Public India search results show established category language around “flexible stone veneer”, “flexible stone veneer sheets”, “stone veneer manufacturer” and “3D wall panels”. These are useful phrase candidates, not evidence of Sattva Sattvik ranking or demand volume. Competitor result pages are not used as sources for product claims.

## Measurement plan

After Google Search Console ownership is verified:
1. Export queries and landing pages for the last 28 and 90 days.
2. Compare branded queries with non-branded category queries.
3. Check whether Stonir, StonIT and Art-i queries land on their own category routes.
4. Identify queries with impressions but weak CTR; refine titles/descriptions only against actual page intent.
5. Check cannibalization between range, collection and product URLs before creating any new content.
