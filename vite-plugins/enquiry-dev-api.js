import fs from 'node:fs'
import path from 'node:path'
import { loadEnv } from 'vite'
import { handleEnquiry } from '../api/_deliver.js'

const DATA_FILE = path.resolve(process.cwd(), 'data/enquiries.json')

function devStore(record) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  let list = []
  try { list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) } catch { /* first write */ }
  list.push(record)
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2))
}

/**
 * Dev-only: serves POST /api/enquiry from `npm run dev` using the same handler as the
 * Vercel function. With no delivery env configured it writes to data/enquiries.json so
 * the form can be tested end-to-end locally. Production has no such fallback.
 */
export default function enquiryDevApi() {
  return {
    name: 'enquiry-dev-api',
    configureServer(server) {
      const env = { ...process.env, ...loadEnv(server.config.mode, process.cwd(), '') }
      server.middlewares.use('/api/enquiry', (req, res) => {
        const send = (status, body) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return send(405, { ok: false, error: 'method_not_allowed' })
        let raw = ''
        req.on('data', (c) => { raw += c })
        req.on('end', async () => {
          try {
            const { status, body } = await handleEnquiry(JSON.parse(raw || '{}'), env, { devStore })
            send(status, body)
          } catch {
            send(500, { ok: false, error: 'server_error' })
          }
        })
      })
    },
  }
}
