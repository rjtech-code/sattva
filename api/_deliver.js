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
        subject: `Website enquiry (${record.type}) — ${record.name}, ${record.city} · +91 ${record.phone}`,
        text: lines,
      }),
    })
    if (!r.ok) return { status: 502, body: { ok: false, error: 'delivery_failed' } }
    delivered.push('email')
  }

  // Optional persistent text-file archive in a PRIVATE GitHub repository.
  // Configure ENQUIRY_GITHUB_TOKEN, ENQUIRY_GITHUB_OWNER and ENQUIRY_GITHUB_REPO
  // as server-side Vercel environment variables (never expose the token to VITE_*).
  if (env.ENQUIRY_GITHUB_TOKEN && env.ENQUIRY_GITHUB_OWNER && env.ENQUIRY_GITHUB_REPO) {
    const owner = encodeURIComponent(env.ENQUIRY_GITHUB_OWNER)
    const repo = encodeURIComponent(env.ENQUIRY_GITHUB_REPO)
    const branch = encodeURIComponent(env.ENQUIRY_GITHUB_BRANCH || 'main')
    const path = 'website-enquiries.txt'
    const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    const headers = {
      Authorization: `Bearer ${env.ENQUIRY_GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    }
    const existing = await fetch(`${api}?ref=${branch}`, { headers })
    let sha
    let previous = ''
    if (existing.ok) {
      const file = await existing.json()
      sha = file.sha
      previous = Buffer.from(file.content || '', 'base64').toString('utf8')
    } else if (existing.status !== 404) {
      return { status: 502, body: { ok: false, error: 'archive_read_failed' } }
    }
    const line = JSON.stringify(record)
    const content = Buffer.from(`${previous}${previous && !previous.endsWith('\\n') ? '\\n' : ''}${line}\\n`).toString('base64')
    const saved = await fetch(api, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Save website enquiry — ${record.submittedAt}`,
        content,
        branch: env.ENQUIRY_GITHUB_BRANCH || 'main',
        ...(sha ? { sha } : {}),
      }),
    })
    if (!saved.ok) return { status: 502, body: { ok: false, error: 'archive_write_failed' } }
    delivered.push('private-github-text-file')
  }

  if (!delivered.length && devStore) {
    devStore(record)
    delivered.push('dev-file')
  }

  if (!delivered.length) return { status: 503, body: { ok: false, error: 'not_configured' } }
  return { status: 200, body: { ok: true } }
}
