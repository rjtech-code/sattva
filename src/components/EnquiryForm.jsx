import { useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, AlertTriangle, MessageCircle } from 'lucide-react'
import { ENQUIRY_TYPES, ROLES, STATES, normalizeEnquiry, validateEnquiry, whatsappMessage } from '../lib/enquiry'
import { RANGES } from '../data/ranges'
import { CONTACT } from '../data/site'

const waUrl = (text) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`

// Best-effort copy to the server (email/webhook) when configured; never blocks or fails the WhatsApp flow.
const logEnquiry = (raw) => {
  try {
    fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(raw), keepalive: true }).catch(() => {})
  } catch { /* ignore */ }
}

/**
 * Short, India-first enquiry form. Submitting opens WhatsApp with the details pre-filled, addressed
 * to the business number (CONTACT.whatsapp); the visitor taps Send in WhatsApp. If no number is
 * configured it falls back to the /api/enquiry server route and reports that result honestly.
 *
 * Preselects type, range and product from props or the URL (?type=catalogue&range=stonir&product=…).
 * `document` turns it into a catalogue request ({ label, range }).
 */
export default function EnquiryForm({ defaultType = 'general', title, intro, document, onDone, compact = false }) {
  const [params] = useSearchParams()
  const uid = useId()
  const formRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [failure, setFailure] = useState('')
  const [lastUrl, setLastUrl] = useState('')

  const type = document ? 'catalogue' : ENQUIRY_TYPES.some((t) => t.value === params.get('type')) ? params.get('type') : defaultType
  const presetRange = document?.range || (RANGES.some((r) => r.slug === params.get('range')) ? params.get('range') : '')
  const presetProduct = document ? '' : (params.get('product') || '').slice(0, 80)

  async function onSubmit(e) {
    e.preventDefault()
    const raw = Object.fromEntries(new FormData(e.currentTarget))
    const data = normalizeEnquiry(raw)
    const errs = validateEnquiry(data)
    setErrors(errs)
    if (Object.keys(errs).length) {
      formRef.current?.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }
    if (data.website) return // honeypot

    if (CONTACT.whatsapp) {
      const rangeName = RANGES.find((r) => r.slug === data.range)?.name
      const url = waUrl(whatsappMessage(data, { rangeName, documentLabel: document?.label }))
      // Open synchronously (inside the click) so pop-up blockers allow it.
      const win = window.open(url, '_blank')
      if (win) win.opener = null
      else window.location.href = url
      logEnquiry({ ...raw, document: document?.label })
      setLastUrl(url)
      setStatus('sent')
      formRef.current?.reset()
      onDone?.()
      return
    }

    // No WhatsApp number configured: server delivery only.
    setStatus('sending')
    try {
      const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...raw, document: document?.label }) })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body.ok === true) {
        setStatus('sent')
        formRef.current?.reset()
        return
      }
      if (body.errors) setErrors(body.errors)
      setFailure(body.error === 'not_configured'
        ? 'Online enquiries are not connected yet, so your enquiry was not sent. Please try again later.'
        : 'We couldn’t send your enquiry just now. Please try again in a few minutes.')
      setStatus('failed')
    } catch {
      setFailure('We couldn’t reach the server. Please check your connection and try again.')
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div className={compact ? '' : 'panel p-8 sm:p-12'} role="status" aria-live="polite">
        <MessageCircle size={34} strokeWidth={1.25} className="text-crimson-hi" aria-hidden="true" />
        {lastUrl ? (
          <>
            <h3 className="display-md mt-6">Almost done.</h3>
            <p className="lede mt-4">WhatsApp has opened with your {document ? 'request' : 'enquiry'} filled in — tap <span className="text-paper">Send</span> there and our team will reply on WhatsApp.</p>
            <a href={lastUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">Open WhatsApp again<ArrowRight size={15} aria-hidden="true" /></a>
          </>
        ) : (
          <>
            <h3 className="display-md mt-6">Thank you.</h3>
            <p className="lede mt-4">Your enquiry has been received. Our team will call or WhatsApp you on the number you provided.</p>
          </>
        )}
        {!compact && <button type="button" className="btn btn-ghost mt-4 sm:ml-3 sm:mt-8" onClick={() => setStatus('idle')}>New enquiry</button>}
      </div>
    )
  }

  const f = (name) => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-err` : undefined,
  })
  const err = (name) => (errors[name] ? <p id={`${uid}-${name}-err`} className="err">{errors[name]}</p> : null)

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={compact ? '' : 'panel p-6 sm:p-10'}>
      {title && <h3 className="display-md">{title}</h3>}
      {intro && <p className="mt-3 text-[14px] text-mist">{intro}</p>}
      <input type="hidden" name="type" value={type} />
      {presetProduct && <input type="hidden" name="product" value={presetProduct} />}

      <div className={`grid gap-4 sm:grid-cols-2 ${title || intro ? 'mt-7' : ''}`}>
        <div className="field">
          <label htmlFor={`${uid}-name`}>Name *</label>
          <input {...f('name')} autoComplete="name" required />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-phone`}>Mobile (WhatsApp) *</label>
          <div className="flex">
            <span className="flex items-center border border-r-0 border-line-2 px-3 text-[15px] text-mist" aria-hidden="true">+91</span>
            <input {...f('phone')} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={18} placeholder="98xxxxxxxx" required />
          </div>
          {err('phone')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-city`}>City *</label>
          <input {...f('city')} autoComplete="address-level2" required />
          {err('city')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-state`}>State *</label>
          <select {...f('state')} defaultValue="" required>
            <option value="" disabled>Select state</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {err('state')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-role`}>I am a</label>
          <select {...f('role')} defaultValue="">
            <option value="">Select…</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${uid}-range`}>Interested in</label>
          <select {...f('range')} defaultValue={presetRange}>
            <option value="">All products</option>
            {RANGES.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
          </select>
        </div>
        {!document && (
          <div className="field sm:col-span-2">
            <label htmlFor={`${uid}-message`}>Requirement (optional)</label>
            <textarea {...f('message')} rows={3} className="!min-h-[96px]" placeholder="Quantity, site, design you liked…" defaultValue={presetProduct ? `Enquiry about ${presetProduct}. ` : ''} />
            {err('message')}
          </div>
        )}

        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {status === 'failed' && (
        <div className="mt-6 flex gap-3 border border-crimson/60 bg-crimson-lo/20 p-4 text-[14px] text-paper" role="alert">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-crimson-hi" aria-hidden="true" />
          <p>{failure}</p>
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-7 w-full sm:w-auto" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : CONTACT.whatsapp ? <><MessageCircle size={16} aria-hidden="true" />{document ? 'Get it on WhatsApp' : 'Send on WhatsApp'}</> : 'Send Enquiry'}
      </button>
      <p className="mt-3 text-[12px] text-ash">We’ll contact you on this number about your {document ? 'request' : 'enquiry'} only.</p>
    </form>
  )
}
