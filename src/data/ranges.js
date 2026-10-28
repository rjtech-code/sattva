// Product ranges within the Ston-i Surfaces portfolio.
//
// Hierarchy: Sattva Sattvik → Ston-i Surfaces → Range → Collection → Product/SKU → Variant.
// Collections and products live in ./catalog.js and reference a range by `slug`.
// To launch a new range, append an entry here — navigation, the portfolio page,
// the range page template and the enquiry form pick it up automatically.
//
// All copy and specifications below come from the client's catalogues
// (Stonir Introduction Catalogue, StonIT Intro Shade Card, Art-i Canvas Veneer 2026).
// Optional fields that are absent are hidden by the templates.

import { tex } from './media.js'
import { DOCS } from './documents.js'

export const RANGES = [
  {
    slug: 'stonir',
    name: 'Stonir',
    wordmark: 'STONIR',
    tagline: 'Flexible Stone Veneer',
    headline: 'Bold like stone, light like veneer.',
    summary:
      'Stonir brings the natural character and visual richness of stone into a lightweight, flexible format.',
    description: [
      'Stonir brings the natural character and visual richness of stone into a lightweight, flexible format — developed to offer greater versatility in handling, application and design, while retaining the distinctive look and texture of natural stone.',
      'Flexible stone veneer is made by slicing thin layers of real stone and backing them with a flexible base such as fiberglass or polyester resin. It keeps the texture and look of real stone while making it easier to apply on curved or uneven surfaces, for both interior and exterior applications.',
    ],
    features: [
      { icon: 'Feather', title: 'Lightweight & flexible', text: 'Ultra-thin natural stone — approx. 1.5 kg/m² — that bends to curved and uneven surfaces.' },
      { icon: 'Mountain', title: '100% natural stone surface', text: 'Real stone face on a fiberglass and resin backing, retaining authentic texture.' },
      { icon: 'Droplets', title: 'Sealed surface', text: 'Water absorption below 1% on the sealed surface.' },
      { icon: 'Wrench', title: 'Easy to install', text: 'Cut with a cutter or scissors; fixed with PU-based adhesive on most substrates.' },
    ],
    specs: [
      ['Thickness', '1–2 mm (flexible) · 2–4 mm (board)'],
      ['Size', "8' × 4' (2440 × 1220 mm) · 10' × 4' (3048 × 1220 mm)"],
      ['Composition', 'Natural stone surface + fiberglass & resin backing'],
      ['Weight', 'Approx. 1.5 kg/m²'],
      ['Water absorption', '< 1% (sealed surface)'],
      ['Temperature resistance', '−20 °C to 65 °C'],
      ['Adhesive', 'PU-based adhesive'],
      ['Maintenance', 'Low — dry / wet cloth cleaning'],
      ['Durability', '10–15 years with proper care'],
      ['Installation base', 'Concrete, wood, MDF, metal, glass, tile'],
    ],
    tests: [
      ['Density', 'ASTM D 792', '1.36 gm/cc'],
      ['Water absorption (24 h)', 'ASTM D 570', '0.74 %'],
      ['Tensile strength', 'ASTM D 638', '45 N/mm²'],
      ['Compressive strength', 'ASTM D 695', '85 N/mm²'],
      ['Flexural strength', 'ASTM D 790', '92 N/mm²'],
      ['Hardness', 'ASTM D 2583', '40 N/mm²'],
      ['Chemical resistance (10% HCl, 10% H₂SO₄)', 'ASTM D 543', 'No visible change in colour, no weight loss observed'],
    ],
    uses: {
      Interior: ['Bedroom walls', 'TV walls', 'Bathroom walls', 'Kitchen tables', 'Furniture', 'Wardrobes', 'Doors', 'Staircase walls'],
      Exterior: ['Building facades', 'Entrance gates', 'Outdoor', 'Landscaping'],
      'Applied on': ['Concrete walls', 'Plywood', 'MDF', 'HDF', 'Tiles', 'Stone surfaces', 'Cement board', 'Glass'],
    },
    installation: [
      ['Surface preparation', 'Ensure the surface is dry, clean and dust-free.'],
      ['Planning the layout', 'Cut the veneer sheets to fit using a cutter or scissors (for flexible types).'],
      ['Applying adhesive', 'Spread adhesive evenly with a notched trowel on the back of the sheet or on the wall. Exterior: PU-based adhesive. Interior and acrylic/glass: PVC-based adhesive or clear silicone.'],
      ['Fixing the sheet', 'Apply firm, even pressure by hand or roller; ensure no air bubbles remain.'],
      ['Finishing', 'Clean any extra adhesive with a damp cloth before it dries.'],
    ],
    identity: { layout: 'strata', texture: tex.stonir, cover: { collection: 'natural-series', slug: 'ssv-3000-1', image: 0 } },
    viewer: { kind: 'slab', texture: '/media/stonir/natural-series/ssv-3000-1.webp', flex: true },
    viewerProduct: { collection: 'natural-series', slug: 'ssv-3000-1' },
    documents: [DOCS.stonirIntro],
  },
  {
    slug: 'stonit',
    name: 'StonIT',
    wordmark: 'STONIT',
    tagline: 'Innovative Surface Solutions',
    headline: 'Lighter. Stronger. Smarter stone.',
    summary:
      'StonIT specialises in FRP-based (Fiber Reinforced Polymer) rock stone panels — lightweight, durable, richly textured cladding for interiors and exteriors.',
    description: [
      'StonIT is an architectural surface range specialising in FRP-based (Fiber Reinforced Polymer) rock stone panels, blending the timeless appeal of stone with the performance of composite materials.',
      'The result is lightweight, highly durable and aesthetically rich cladding for both interior and exterior applications — 3D relief designs from Haveli Arch to Modular Cube, in 8+ colours and 25+ designs, with customised colours also available.',
    ],
    stats: [['25+', 'Designs'], ['8+', 'Colours'], ['Custom', 'Colours available']],
    features: [
      { icon: 'Mountain', title: 'Natural stone look', text: 'Realistic 3D rock and stone appearance.' },
      { icon: 'Feather', title: 'Lightweight & easy to handle', text: 'Approx. 20–25 kg per 8 × 4 ft panel.' },
      { icon: 'Droplets', title: 'Water & weather resistant', text: 'Water, moisture and weather resistant, for interior and exterior use.' },
      { icon: 'Flame', title: 'Fire retardant', text: 'Stated as fire retardant in the StonIT technical card.' },
      { icon: 'Wrench', title: 'Quick installation', text: 'Cut with a diamond blade, fixed with PU-based adhesive.' },
      { icon: 'Sparkles', title: 'Low maintenance', text: 'Protective coating over a hand-painted stone texture.' },
    ],
    specs: [
      ['Material composition', 'High-density Fiber Reinforced Polymer (FRP)'],
      ['Panel size', 'Typically 8 × 4 ft'],
      ['Thickness', '50 mm – 100 mm'],
      ['Weight', 'Approx. 20–25 kg per panel'],
      ['Surface finish', 'Hand-painted stone texture with protective coating'],
      ['Appearance', 'Realistic 3D rock / stone look'],
    ],
    uses: {
      Interior: ['TV unit walls', 'Bedroom accent walls', 'Hallways & passages', 'Staircase side walls', 'Bar counters / bar walls', 'Pooja rooms', 'Dining areas', 'Lobby / reception areas'],
      Exterior: ['Main entrance wall cladding', 'Building elevations', 'Compound walls', 'Balcony & terrace wall panels', 'Garden feature walls'],
    },
    installation: [
      ['Surface preparation', 'The surface must be clean, dry and free of dust, grease or loose particles.'],
      ['Planning & layout', 'Determine the layout and pattern; measure the area and calculate the panels needed.'],
      ['Cutting the panels', 'Measure and mark cuts; cut carefully with a diamond blade cutter.'],
      ['Applying adhesive', 'Apply a high-quality PU-based adhesive evenly to the back of each panel.'],
      ['Installing the panels', 'Press panels firmly into place, check alignment with a level and leave a small expansion gap between panels.'],
      ['Checking', 'Confirm installation against the design guidance and matching grooving.'],
    ],
    identity: { layout: 'flow', texture: tex.stonit, cover: { collection: 'haveli-arch', slug: 'haveli-arch-multi-color', image: 1 } },
    viewer: { kind: 'slab', texture: '/media/stonit/flint-rock/flint-rock-black-p33.webp', flex: false, depth: 0.14 },
    viewerProduct: { collection: 'flint-rock', slug: 'flint-rock-black' },
    documents: [DOCS.stonitIntro, DOCS.stonitMaster],
  },
  {
    slug: 'art-i-canvas-veneer',
    name: 'Art-i Canvas Veneer',
    wordmark: 'ART-I',
    wordmarkSub: 'CANVAS VENEER',
    tagline: 'Art Meets Surface',
    headline: 'Stone as a living canvas.',
    summary:
      'High-definition artistry on flexible stone veneer — natural slate and quartzite infused with bespoke patterns, textures and imagery.',
    description: [
      'Art-i Canvas on Flexible Stone Veneer is a curated dialogue between the timeless texture of natural stone and the boundless potential of high-definition artistry.',
      'By treating ultra-thin flexible stone veneers as a “living canvas”, Canvas Print technology infuses natural slate and quartzite with bespoke patterns, intricate textures and vibrant imagery — without losing the tactile soul of the stone. Suited to high-end interior feature walls, with exterior cladding possible on veneers engineered for it.',
    ],
    features: [
      { icon: 'Feather', title: 'Lightweight', text: 'Ultra-thin flexible stone veneer.' },
      { icon: 'Wrench', title: 'Easy to install', text: 'Flexible 4′ × 8′ panels.' },
      { icon: 'Sparkles', title: 'Maintenance free', text: 'As stated in the Canvas Series technical features.' },
      { icon: 'Palette', title: 'High-premium print', text: 'High-definition Canvas Print on natural stone.' },
      { icon: 'Move', title: 'Flexible', text: 'Bends with the veneer it is printed on.' },
    ],
    specs: [
      ['Base', 'Ultra-thin flexible natural stone veneer (slate / quartzite)'],
      ['Print', 'High-definition Canvas Print'],
      ['Panel size', "4' × 8'"],
    ],
    uses: {
      Spaces: ['Residential areas', 'Commercial areas', 'Hospitals', 'Public places', 'Shops & malls', 'Hotels & restaurants'],
    },
    identity: { layout: 'canvas', texture: tex.arti, cover: { collection: 'canvas-series', slug: 'acv-13', image: 1 } },
    viewer: { kind: 'slab', texture: '/media/art-i/canvas-series/acv-01.webp', flex: true },
    viewerProduct: { collection: 'canvas-series', slug: 'acv-01' },
    documents: [DOCS.artiCanvas],
  },
]

export const getRange = (slug) => RANGES.find((r) => r.slug === slug)
