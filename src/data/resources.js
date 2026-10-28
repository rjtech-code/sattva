// Resource centre. Every `documents` entry points to a real, publicly accessible file —
// currently the client's catalogue PDFs in their public Google Drive folder (./documents.js).
// Categories without a document show a "request" action instead of a download.

import { DOCS } from './documents'

export const RESOURCE_CATEGORIES = [
  { slug: 'catalogues', icon: 'BookOpen', title: 'Product Catalogues', text: 'Range catalogues for Stonir, StonIT and Art-i Canvas Veneer.', documents: [DOCS.stonirIntro, DOCS.stonitIntro, DOCS.artiCanvas] },
  { slug: 'shade-cards', icon: 'Palette', title: 'Shade Cards', text: 'Current designs, colours and finishes per range and series.', documents: [DOCS.stonirNatural, DOCS.stonirGrainy, DOCS.stonirTranslucent, DOCS.stonirBookmatch, DOCS.stonir10x4, DOCS.stonitMaster] },
  { slug: 'technical', icon: 'FileText', title: 'Technical Information', text: 'Specifications and test results are published on each range page and in the introduction catalogues.', documents: [], links: [{ label: 'Stonir technical specifications', to: '/products/stonir#specifications' }, { label: 'StonIT technical specifications', to: '/products/stonit#specifications' }] },
  { slug: 'specifications', icon: 'Ruler', title: 'Specifications', text: 'Formats, sizes and specification text for projects.', documents: [] },
  { slug: 'installation', icon: 'Wrench', title: 'Installation Guides', text: 'Wet and dry cladding guidance for Stonir; installation steps for StonIT.', documents: [], links: [{ label: 'Stonir installation guide', to: '/products/stonir#installation' }, { label: 'StonIT installation guide', to: '/products/stonit#installation' }] },
  { slug: 'brochures', icon: 'Newspaper', title: 'Brochures', text: 'Company and brand brochures.', documents: [] },
]

// Answers are drawn from verified brand facts only.
export const FAQS = [
  {
    q: 'Who manufactures Ston-i Surfaces products?',
    a: 'Ston-i Surfaces is the market-facing brand of Sattva Sattvik Private Limited, a manufacturing and product-development company based in Jaipur, Rajasthan.',
  },
  {
    q: 'What product ranges are available?',
    a: 'The Ston-i Surfaces portfolio currently includes three ranges: Stonir (Flexible Stone Veneer), StonIT (Innovative Surface Solutions) and Art-i Canvas Veneer (Art Meets Surface).',
  },
  {
    q: 'Do you sell directly to consumers?',
    a: 'Ston-i Surfaces is focused on the B2B market — dealers, distributors, wholesalers, retailers and material suppliers — and works with architects, designers, builders, contractors and fabricators who specify or use the products.',
  },
  {
    q: 'How do I become a dealer or distributor?',
    a: 'Send a B2B partnership enquiry with your company, city and the ranges you are interested in. Our team will get in touch.',
  },
  {
    q: 'How do I get a catalogue or shade card?',
    a: 'Use the request option in the Resources section or the enquiry form, and mention the range you need. We will share the current material with you.',
  },
]
