// Editorial content. Sources are tagged per block; see docs/CONTENT_AND_ASSET_MAP.md.

// Source: client "About Sattva Sattvik" copy.
export const ABOUT = {
  intro:
    'Sattva Sattvik Private Limited is a Jaipur-based manufacturing and product-development company focused on creating innovative surface solutions for India and the world.',
  idea:
    'At the heart of Sattva Sattvik is a simple idea — to develop better, more versatile surface materials and make them accessible through a strong B2B network across India and worldwide.',
  brand:
    'Our manufacturing capabilities, product development, and market understanding come together under Ston-i Surfaces, our market-facing brand dedicated to innovative architectural surface solutions.',
  stoni:
    'Ston-i Surfaces brings together our expertise in developing surface materials that combine design, versatility, and practicality.',
  // Source: About collage panel.
  purpose:
    'From material development and manufacturing to quality and supply, we work towards building stronger surface-material brands for the future.',
  mission: 'To build one of the strongest B2B surface-material networks — across India and the world.',
}

// Source: brand-architecture brief §22.
export const STRATEGY = [
  { who: 'Sattva Sattvik', does: 'builds the materials.', role: 'Manufacturing, R&D and ownership' },
  { who: 'Ston-i Surfaces', does: 'builds the market.', role: 'Market-facing architectural surface brand' },
  { who: 'Product ranges', does: 'build category leadership.', role: 'Stonir · StonIT · Art-i Canvas Veneer' },
]

// Source: "WHY STON-i? Stone, Reimagined." reference image (five pillars).
// Descriptions restate client copy only — no sourcing, performance or sustainability claims.
export const PILLARS = [
  { n: '01', icon: 'Mountain', title: 'Natural Material', text: 'Stonir retains the distinctive look and texture of natural stone.' },
  { n: '02', icon: 'Lightbulb', title: 'Innovation', text: 'Surface materials developed through Sattva Sattvik’s R&D and product development.' },
  { n: '03', icon: 'PenTool', title: 'Italian Design', text: 'A brand designed in Italy — the “i” in Ston-i — with three distinct ranges, from stone veneer to art-led canvas.' },
  { n: '04', icon: 'Factory', title: 'Made in India', text: 'Manufactured by Sattva Sattvik Private Limited in Jaipur, Rajasthan — supplied worldwide.' },
  { n: '05', icon: 'Shapes', title: 'Versatility', text: 'Developed for versatility in handling, application and design.' },
]

// Source: About collage capability row + brief §2.
export const CAPABILITIES = [
  { icon: 'Factory', title: 'Manufacturing' },
  { icon: 'FlaskConical', title: 'Product Development' },
  { icon: 'Atom', title: 'R&D' },
  { icon: 'ShieldCheck', title: 'Quality' },
  { icon: 'Truck', title: 'Supply & Distribution' },
]

// Source: Manufacturing collage + brief §11. Generic stages only — per-range specifics
// are not verified and are deliberately not stated.
export const PROCESS = [
  { icon: 'Layers', title: 'Raw Materials', text: 'Selection and preparation of input materials.' },
  { icon: 'Cog', title: 'Processing', text: 'Production of surface material in our Jaipur facility.' },
  { icon: 'ScanSearch', title: 'Quality Check', text: 'Inspection at defined stages of production.' },
  { icon: 'Sparkles', title: 'Finishing', text: 'Surface finishing to the range’s specification.' },
  { icon: 'Package', title: 'Packing', text: 'Packing for protection in transit.' },
  { icon: 'Truck', title: 'Dispatch', text: 'Supply to B2B partners across India and worldwide.' },
]

// Source: R&D collage + brief §12.
export const RND = [
  { icon: 'Atom', title: 'New Materials', text: 'Exploring new surface-material possibilities for architecture and interiors.' },
  { icon: 'Sparkles', title: 'New Finishes', text: 'Developing finishes that extend each range.' },
  { icon: 'Ruler', title: 'New Formats', text: 'Working on formats that suit how surfaces are specified and installed.' },
  { icon: 'FlaskConical', title: 'Prototypes & Testing', text: 'Prototyping new products before they reach the portfolio.' },
]

// Source: brief §13 + B2B collage.
export const PARTNER_TYPES = [
  { icon: 'Store', title: 'Dealers', group: 'trade' },
  { icon: 'Network', title: 'Distributors', group: 'trade' },
  { icon: 'Warehouse', title: 'Wholesalers', group: 'trade' },
  { icon: 'ShoppingBag', title: 'Retailers', group: 'trade' },
  { icon: 'Boxes', title: 'Material Suppliers', group: 'trade' },
  { icon: 'ClipboardList', title: 'Project Procurement', group: 'trade' },
  { icon: 'Compass', title: 'Architects', group: 'specifier' },
  { icon: 'Sofa', title: 'Interior Designers', group: 'specifier' },
  { icon: 'Building2', title: 'Builders', group: 'specifier' },
  { icon: 'HardHat', title: 'Contractors', group: 'specifier' },
  { icon: 'Hammer', title: 'Fabricators', group: 'specifier' },
]

// Application galleries, grouped by product range (Applications page, Home teaser).
// Stonir: project-gallery photographs from the Stonir Introduction Catalogue (p.1, 38–40).
// StonIT / Art-i: the application visual of each product in their catalogues (see catalog.js).
const stonirApp = (slug, title, area, w, h) => ({
  title, area, image: { src: `/media/stonir/applications/${slug}.webp`, srcSmall: `/media/stonir/applications/${slug}-sm.webp`, width: w, height: h, alt: `Stonir flexible stone veneer — ${title.toLowerCase()}` },
})
export const STONIR_APPLICATIONS = [
  stonirApp('living-room-feature-wall', 'Living room feature wall', 'Interior', 692, 490),
  stonirApp('meeting-area-accent-wall', 'Meeting area accent wall', 'Interior', 730, 361),
  stonirApp('partition-wall', 'Partition wall', 'Interior', 730, 360),
  stonirApp('fireplace-wall', 'Fireplace wall', 'Interior', 730, 361),
  stonirApp('bar-counter', 'Bar counter', 'Interior', 800, 395),
  stonirApp('kitchen-island', 'Kitchen island', 'Interior', 730, 362),
  stonirApp('bedroom-wall', 'Bedroom wall', 'Interior', 404, 405),
  stonirApp('tv-shelving-wall', 'TV & shelving wall', 'Interior', 371, 371),
  stonirApp('building-facade', 'Building facade', 'Exterior', 750, 370),
  stonirApp('compound-wall', 'Compound wall', 'Exterior', 723, 337),
  stonirApp('exterior-landscape-wall', 'Exterior & landscape wall', 'Exterior', 442, 309),
]


