// Shared by the browser form and the server handler so both enforce the same rules.
// Short, India-first form: name, mobile (WhatsApp), city, state; the rest optional.

export const ENQUIRY_TYPES = [
  { value: 'b2b-partnership', label: 'Dealership / distribution' },
  { value: 'product', label: 'Product information / pricing' },
  { value: 'catalogue', label: 'Catalogue / shade card' },
  { value: 'general', label: 'General enquiry' },
]

export const ROLES = [
  'Dealer / Distributor',
  'Retailer / Wholesaler',
  'Architect / Interior Designer',
  'Builder / Contractor',
  'Fabricator / Installer',
  'Homeowner',
  'Other',
]

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu', 'Delhi',
  'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const LIMITS = { name: 80, company: 120, city: 60, message: 1000 }
const MOBILE_RE = /^[6-9]\d{9}$/

// Accepts "+91 98290 12345", "098290-12345", "9829012345" → "9829012345".
export const normalizeMobile = (v = '') => {
  const d = String(v).replace(/\D/g, '')
  return d.length === 12 && d.startsWith('91') ? d.slice(2) : d.length === 11 && d.startsWith('0') ? d.slice(1) : d
}

export function normalizeEnquiry(raw = {}) {
  const s = (v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '')
  return {
    type: s(raw.type) || 'general',
    name: s(raw.name),
    company: s(raw.company),
    phone: normalizeMobile(raw.phone),
    city: s(raw.city),
    state: s(raw.state),
    role: s(raw.role),
    range: s(raw.range),
    product: s(raw.product),
    message: typeof raw.message === 'string' ? raw.message.trim() : '',
    website: s(raw.website), // honeypot
  }
}

export function validateEnquiry(data) {
  const errors = {}
  if (!data.name) errors.name = 'Please enter your name.'
  if (!data.phone) errors.phone = 'Please enter your mobile number.'
  else if (!MOBILE_RE.test(data.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.'
  if (!data.city) errors.city = 'Please enter your city.'
  if (!data.state) errors.state = 'Please select your state.'
  else if (!STATES.includes(data.state)) errors.state = 'Please select a state from the list.'
  if (!ENQUIRY_TYPES.some((t) => t.value === data.type)) errors.type = 'Please choose an enquiry type.'
  for (const [k, max] of Object.entries(LIMITS)) {
    if (data[k] && data[k].length > max) errors[k] = `Please keep this under ${max} characters.`
  }
  return errors
}

// The WhatsApp message the visitor sends to the business.
export function whatsappMessage(data, { rangeName, documentLabel } = {}) {
  const type = ENQUIRY_TYPES.find((t) => t.value === data.type)?.label
  const details = [
    `Name: ${data.name}`,
    data.company && `Company: ${data.company}`,
    data.role && `I am a: ${data.role}`,
    `City: ${data.city}, ${data.state}`,
    `Mobile: +91 ${data.phone}`,
    rangeName && `Interested in: ${rangeName}`,
    data.product && `Product: ${data.product}`,
  ].filter(Boolean)
  const greeting = documentLabel
    ? `Hello Ston-i Surfaces, please share the *${documentLabel}*.`
    : `Hello Ston-i Surfaces, I have an enquiry${type ? ` (${type})` : ''}.`
  return [greeting, '', ...details, ...(data.message ? ['', data.message] : [])].join('\n')
}
