import { handleEnquiry } from './_deliver.js'

// Vercel serverless function: POST /api/enquiry
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { status, body: out } = await handleEnquiry(body)
    return res.status(status).json(out)
  } catch {
    return res.status(500).json({ ok: false, error: 'server_error' })
  }
}
