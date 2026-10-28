// Brand hierarchy and site-wide constants.
// Source of every statement here is recorded in docs/CONTENT_AND_ASSET_MAP.md.

export const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')

export const COMPANY = {
  legalName: 'Sattva Sattvik Private Limited',
  shortName: 'Sattva Sattvik',
  role: 'Manufacturing & Product Development Company',
  location: 'Jaipur, Rajasthan, India',
  city: 'Jaipur',
  state: 'Rajasthan',
  // Approximate city coordinates (public geographic fact), shown as a typographic marker only.
  coordinates: '26.91° N, 75.79° E',
}

export const BRAND = {
  name: 'Ston-i Surfaces',
  wordmark: 'STON-I SURFACES',
  descriptor: 'Architectural Surface Materials',
  attribution: 'A Sattva Sattvik Company',
}

// Verified contact channels. Only the location is confirmed in the supplied brief;
// add phone / email / social URLs here once the client confirms them — every
// component reads from this object and hides channels that are absent.
export const CONTACT = {
  location: COMPANY.location,
  phone: null,
  email: null,
  whatsapp: null,
  social: [], // e.g. { label: 'LinkedIn', href: 'https://…' }
}

export const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'Sattva Sattvik', to: '/about', note: 'The company behind Ston-i' },
      { label: 'Manufacturing', to: '/manufacturing', note: 'Built in Jaipur' },
      { label: 'R&D / Innovation', to: '/innovation', note: 'Materials. Research. Possibility.' },
    ],
  },
  {
    label: 'Products',
    to: '/products',
    children: [
      { label: 'Ston-i Surfaces', to: '/products', note: 'The full portfolio' },
      { label: 'Stonir', to: '/products/stonir', note: 'Flexible Stone Veneer' },
      { label: 'StonIT', to: '/products/stonit', note: 'Innovative Surface Solutions' },
      { label: 'Art-i Canvas Veneer', to: '/products/art-i-canvas-veneer', note: 'Art Meets Surface' },
      { label: 'Future Brands', to: '/products#future-brands', note: 'Expanding the portfolio' },
    ],
  },
  { label: 'Applications', to: '/applications' },
  { label: 'Projects', to: '/projects' },
  { label: 'B2B Partners', to: '/partners' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
]
