// Shared by the browser form and the server handler so both enforce the same rules.

export const ENQUIRY_TYPES = [
  { value: 'b2b-partnership', label: 'B2B partnership' },
  { value: 'product', label: 'Product information' },
  { value: 'catalogue', label: 'Catalogue / resources request' },
  { value: 'general', label: 'General enquiry' },
]

export const ROLES = [
  'Dealer',
  'Distributor',
  'Wholesaler',
  'Retailer',
  'Architectural-material supplier',
  'Architect',
  'Interior designer',
  'Builder / developer',
  'Contractor',
  'Fabricator',
  'Project procurement',
  'Other',
]

const LIMITS = { name: 120, company: 160, email: 200, phone: 30, city: 80, state: 80, message: 4000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\-\s\d]{7,20}$/

export function normalizeEnquiry(raw = {}) {
  const s = (v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '')
  return {
    type: s(raw.type) || 'general',
    name: s(raw.name),
    company: s(raw.company),
    email: s(raw.email).toLowerCase(),
    phone: s(raw.phone),
    city: s(raw.city),
    state: s(raw.state),
    role: s(raw.role),
    range: s(raw.range),
    product: s(raw.product),
    message: typeof raw.message === 'string' ? raw.message.trim() : '',
    consent: raw.consent === true || raw.consent === 'true' || raw.consent === 'on',
    // Honeypot — real visitors never see or fill this field.
    website: s(raw.website),
  }
}

export function validateEnquiry(data) {
  const errors = {}
  if (!data.name) errors.name = 'Please enter your name.'
  if (!data.email) errors.email = 'Please enter your business email.'
  else if (!EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = 'Please enter a valid phone number.'
  if (!data.city) errors.city = 'Please enter your city.'
  if (!data.message || data.message.length < 10) errors.message = 'Please tell us a little about your requirement (10+ characters).'
  if (!data.consent) errors.consent = 'Please confirm we may contact you about this enquiry.'
  if (!ENQUIRY_TYPES.some((t) => t.value === data.type)) errors.type = 'Please choose an enquiry type.'
  for (const [k, max] of Object.entries(LIMITS)) {
    if (data[k] && data[k].length > max) errors[k] = `Please keep this under ${max} characters.`
  }
  return errors
}
