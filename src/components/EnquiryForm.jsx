import { useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ENQUIRY_TYPES, ROLES, normalizeEnquiry, validateEnquiry } from '../lib/enquiry'
import { RANGES } from '../data/ranges'
import { CONTACT } from '../data/site'

const ERROR_COPY = {
  not_configured:
    'Online enquiries are not connected yet, so your message was not sent. Please try again later or reach us through another channel.',
  delivery_failed: 'We couldn’t deliver your enquiry just now. Please try again in a few minutes.',
  default: 'Something went wrong and your enquiry was not sent. Please try again.',
}

/**
 * B2B / general enquiry form. Preselects type, range and product from props or the URL
 * (?type=catalogue&range=stonir&product=SR-101) so CTAs across the site can deep-link here.
 */
export default function EnquiryForm({ defaultType = 'general', title, intro }) {
  const [params] = useSearchParams()
  const uid = useId()
  const formRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [failure, setFailure] = useState('')

  const initialType = ENQUIRY_TYPES.some((t) => t.value === params.get('type')) ? params.get('type') : defaultType
  const initialRange = RANGES.some((r) => r.slug === params.get('range')) ? params.get('range') : ''
  const initialProduct = (params.get('product') || '').slice(0, 80)

  async function onSubmit(e) {
    e.preventDefault()
    const raw = Object.fromEntries(new FormData(e.currentTarget))
    const data = normalizeEnquiry(raw)
    const errs = validateEnquiry(data)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = formRef.current?.querySelector(`[name="${Object.keys(errs)[0]}"]`)
      first?.focus()
      return
    }
    setStatus('sending')
    setFailure('')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(raw),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body.ok === true) {
        setStatus('sent')
        formRef.current?.reset()
        return
      }
      if (body.errors) setErrors(body.errors)
      setFailure(ERROR_COPY[body.error] || ERROR_COPY.default)
      setStatus('failed')
    } catch {
      setFailure('We couldn’t reach the server. Please check your connection and try again.')
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div className="panel p-8 sm:p-12" role="status" aria-live="polite">
        <CheckCircle2 size={34} strokeWidth={1.25} className="text-crimson-hi" aria-hidden="true" />
        <h3 className="display-md mt-6">Thank you.</h3>
        <p className="lede mt-4">Your enquiry has been received. Our team will get back to you on the email address you provided.</p>
        <button type="button" className="btn btn-ghost mt-8" onClick={() => setStatus('idle')}>Send another enquiry</button>
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
    <form ref={formRef} onSubmit={onSubmit} noValidate className="panel p-6 sm:p-10" aria-describedby={`${uid}-req`}>
      {title && <h3 className="display-md">{title}</h3>}
      {intro && <p className="mt-3 text-[14px] text-mist">{intro}</p>}
      <p id={`${uid}-req`} className="mt-3 text-[12px] text-ash">Fields marked * are required.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="field sm:col-span-2">
          <label htmlFor={`${uid}-type`}>Enquiry type *</label>
          <select {...f('type')} defaultValue={initialType}>
            {ENQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {err('type')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-name`}>Name *</label>
          <input {...f('name')} autoComplete="name" required />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input {...f('company')} autoComplete="organization" />
          {err('company')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-email`}>Business email *</label>
          <input {...f('email')} type="email" autoComplete="email" inputMode="email" required />
          {err('email')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-phone`}>Phone</label>
          <input {...f('phone')} type="tel" autoComplete="tel" inputMode="tel" />
          {err('phone')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-city`}>City *</label>
          <input {...f('city')} autoComplete="address-level2" required />
          {err('city')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-state`}>State</label>
          <input {...f('state')} autoComplete="address-level1" />
          {err('state')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-role`}>Your business / role</label>
          <select {...f('role')} defaultValue="">
            <option value="">Select…</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${uid}-range`}>Product range of interest</label>
          <select {...f('range')} defaultValue={initialRange}>
            <option value="">All / not sure yet</option>
            {RANGES.map((r) => <option key={r.slug} value={r.slug}>{r.name} — {r.tagline}</option>)}
          </select>
        </div>
        {initialProduct && <input type="hidden" name="product" value={initialProduct} />}
        <div className="field sm:col-span-2">
          <label htmlFor={`${uid}-message`}>Message / project requirements *</label>
          <textarea {...f('message')} required defaultValue={initialProduct ? `Enquiry about ${initialProduct}: ` : ''} />
          {err('message')}
        </div>

        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field sm:col-span-2">
          <label className="!mb-0 flex items-start gap-3 !text-[13px] !normal-case !tracking-normal !text-mist" htmlFor={`${uid}-consent`}>
            <input {...f('consent')} type="checkbox" className="mt-1 !w-4 h-4 shrink-0 accent-[#c8102e]" />
            <span>I agree that Sattva Sattvik Private Limited may store these details and contact me about this enquiry. *</span>
          </label>
          {err('consent')}
        </div>
      </div>

      {status === 'failed' && (
        <div className="mt-6 flex gap-3 border border-crimson/60 bg-crimson-lo/20 p-4 text-[14px] text-paper" role="alert">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-crimson-hi" aria-hidden="true" />
          <div>
            <p>{failure}</p>
            {(CONTACT.email || CONTACT.phone) && (
              <p className="mt-1 text-mist">
                {CONTACT.email && <>Email <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. </>}
                {CONTACT.phone && <>Call <a className="underline" href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>.</>}
              </p>
            )}
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
        {status !== 'sending' && <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />}
      </button>
      <p className="sr-only" aria-live="polite">{status === 'sending' ? 'Sending your enquiry' : ''}</p>
    </form>
  )
}
