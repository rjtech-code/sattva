// Editorial content. Sources are tagged per block; see docs/CONTENT_AND_ASSET_MAP.md.

// Source: client "About Sattva Sattvik" copy.
export const ABOUT = {
  intro:
    'Sattva Sattvik Private Limited is a Jaipur-based manufacturing and product-development company focused on creating innovative surface solutions for the Indian market.',
  idea:
    'At the heart of Sattva Sattvik is a simple idea — to develop better, more versatile surface materials and make them accessible through a strong B2B network across India.',
  brand:
    'Our manufacturing capabilities, product development, and market understanding come together under Ston-i Surfaces, our market-facing brand dedicated to innovative architectural surface solutions.',
  stoni:
    'Ston-i Surfaces brings together our expertise in developing surface materials that combine design, versatility, and practicality.',
  // Source: About collage panel.
  purpose:
    'From material development and manufacturing to quality and supply, we work towards building stronger surface-material brands for the future.',
  mission: 'To build one of India’s strongest B2B surface-material networks.',
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
  { n: '03', icon: 'PenTool', title: 'Design', text: 'Three distinct ranges for architectural surfaces — from stone veneer to art-led canvas.' },
  { n: '04', icon: 'Factory', title: 'Manufacturing', text: 'Manufactured by Sattva Sattvik Private Limited in Jaipur, Rajasthan.' },
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
  { icon: 'Truck', title: 'Dispatch', text: 'Supply to B2B partners across India.' },
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

// Source: "Where to use" / "Application area" sections of each range catalogue.
// `ranges` lists only ranges whose catalogue names that application.
// `image` points to an application visual from the client catalogues (product slug + image index).
export const APPLICATIONS = [
  { slug: 'feature-walls', title: 'Feature & Accent Walls', group: 'Interior', ranges: ['stonir', 'stonit', 'art-i-canvas-veneer'], image: ['art-i-canvas-veneer', 'canvas-series', 'acv-04'] },
  { slug: 'living-tv-walls', title: 'Living Rooms & TV Walls', group: 'Interior', ranges: ['stonir', 'stonit'], image: ['stonit', 'flora-relief', 'flora-relief-brown'] },
  { slug: 'bedrooms', title: 'Bedroom Walls', group: 'Interior', ranges: ['stonir', 'stonit', 'art-i-canvas-veneer'], image: ['art-i-canvas-veneer', 'canvas-series', 'acv-01'] },
  { slug: 'staircases', title: 'Staircase Walls', group: 'Interior', ranges: ['stonir', 'stonit'], image: ['stonit', 'modular-cube', 'modular-cube-white-black'] },
  { slug: 'dining-bars', title: 'Dining Areas & Bar Walls', group: 'Interior', ranges: ['stonit'], image: ['stonit', 'flora-relief', 'flora-relief-black'] },
  { slug: 'pooja-rooms', title: 'Pooja Rooms', group: 'Interior', ranges: ['stonit'], image: ['art-i-canvas-veneer', 'canvas-series', 'acv-11'], imageNote: 'Shown: Art-i Canvas Veneer ACV-11' },
  { slug: 'furniture-doors', title: 'Furniture, Wardrobes & Doors', group: 'Interior', ranges: ['stonir'], image: null },
  { slug: 'ceilings', title: 'Ceilings', group: 'Interior', ranges: ['stonir'], image: ['art-i-canvas-veneer', 'canvas-series', 'acv-08'], imageNote: 'Shown: Art-i Canvas Veneer ACV-08' },
  { slug: 'backlit', title: 'Backlit Walls & Features', group: 'Interior', ranges: ['stonir'], image: null, note: 'Stonir Translucent Series' },
  { slug: 'lobbies-reception', title: 'Lobbies & Reception Areas', group: 'Commercial', ranges: ['stonir', 'stonit'], image: ['stonit', 'maple-arch', 'maple-arch-black-copper'] },
  { slug: 'hospitality', title: 'Hotels & Restaurants', group: 'Commercial', ranges: ['stonir', 'art-i-canvas-veneer'], image: ['art-i-canvas-veneer', 'canvas-series', 'acv-09'] },
  { slug: 'retail-public', title: 'Shops, Malls & Public Places', group: 'Commercial', ranges: ['art-i-canvas-veneer'], image: ['art-i-canvas-veneer', 'canvas-series', 'acv-14'] },
  { slug: 'commercial-interiors', title: 'Commercial Interiors & Offices', group: 'Commercial', ranges: ['stonir', 'art-i-canvas-veneer'], image: ['stonit', 'vertical-vista', 'vertical-vista-grey'], imageNote: 'Shown: StonIT Vertical Vista' },
  { slug: 'facades', title: 'Facades & Building Elevations', group: 'Exterior', ranges: ['stonir', 'stonit'], image: ['stonit', 'flint-rock', 'flint-rock-black-gold'] },
  { slug: 'entrances-compound', title: 'Entrances & Compound Walls', group: 'Exterior', ranges: ['stonir', 'stonit'], image: null },
  { slug: 'outdoor-landscape', title: 'Balconies, Gardens & Landscaping', group: 'Exterior', ranges: ['stonir', 'stonit'], image: null },
]

// Verified project records. Empty until the client supplies approved projects:
// { slug, title, category, location?, ranges: ['stonir'], images: [{src, alt}], caption }
export const PROJECTS = []
