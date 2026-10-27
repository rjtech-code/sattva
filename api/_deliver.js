import { normalizeEnquiry, validateEnquiry } from '../src/lib/enquiry.js'

/**
 * Validates and delivers an enquiry using whichever server-side channel is configured.
 * Returns { status, body } so both the Vercel function and the dev middleware can use it.
 * Never reports success unless a delivery channel accepted the enquiry.
 */
export async function handleEnquiry(raw, env = process.env, { devStore } = {}) {
  const data = normalizeEnquiry(raw)
  if (data.website) return { status: 200, body: { ok: true } } // silently drop bots
  const errors = validateEnquiry(data)
  if (Object.keys(errors).length) return { status: 422, body: { ok: false, errors } }

  const { website: _hp, ...enquiry } = data
  const record = { ...enquiry, submittedAt: new Date().toISOString() }
  const delivered = []

  if (env.ENQUIRY_WEBHOOK_URL) {
    const r = await fetch(env.ENQUIRY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
    if (!r.ok) return { status: 502, body: { ok: false, error: 'delivery_failed' } }
    delivered.push('webhook')
  }

  if (env.RESEND_API_KEY && env.ENQUIRY_TO_EMAIL && env.ENQUIRY_FROM_EMAIL) {
    const lines = Object.entries(record).map(([k, v]) => `${k}: ${v}`).join('\n')
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.ENQUIRY_FROM_EMAIL,
        to: env.ENQUIRY_TO_EMAIL.split(',').map((s) => s.trim()),
        reply_to: record.email,
        subject: `Website enquiry (${record.type}) — ${record.name}${record.company ? `, ${record.company}` : ''}`,
        text: lines,
      }),
    })
    if (!r.ok) return { status: 502, body: { ok: false, error: 'delivery_failed' } }
    delivered.push('email')
  }

  if (!delivered.length && devStore) {
    devStore(record)
    delivered.push('dev-file')
  }

  if (!delivered.length) return { status: 503, body: { ok: false, error: 'not_configured' } }
  return { status: 200, body: { ok: true } }
}
