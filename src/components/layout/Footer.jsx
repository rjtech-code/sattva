import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone } from 'lucide-react'
import { COMPANY, CONTACT, NAV } from '../../data/site'
import { RANGES } from '../../data/ranges'
import { Wordmark } from './Header'

const about = NAV.find((n) => n.label === 'About').children

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson/70 to-transparent" aria-hidden="true" />
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <Wordmark />
          <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-mist">
            Architectural surface materials, manufactured by {COMPANY.legalName}.
          </p>
          <ul className="mt-6 space-y-2.5 text-[13.5px] text-mist">
            <li className="flex items-center gap-3"><MapPin size={15} className="text-crimson-hi" aria-hidden="true" />{CONTACT.location}</li>
            {CONTACT.phone && <li className="flex items-center gap-3"><Phone size={15} className="text-crimson-hi" aria-hidden="true" /><a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="hover:text-paper">{CONTACT.phone}</a></li>}
            {CONTACT.email && <li className="flex items-center gap-3"><Mail size={15} className="text-crimson-hi" aria-hidden="true" /><a href={`mailto:${CONTACT.email}`} className="hover:text-paper">{CONTACT.email}</a></li>}
          </ul>
        </div>

        <FooterCol title="Products" links={[{ label: 'Ston-i Surfaces', to: '/products' }, ...RANGES.map((r) => ({ label: r.name, to: `/products/${r.slug}` }))]} />
        <FooterCol title="Company" links={[...about, { label: 'Applications', to: '/applications' }, { label: 'Projects', to: '/projects' }]} />
        <FooterCol title="Work with us" links={[{ label: 'B2B Partners', to: '/partners' }, { label: 'Resources', to: '/resources' }, { label: 'FAQs', to: '/resources#faqs' }, { label: 'Contact', to: '/contact' }]} />
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-3 py-6 text-[11.5px] tracking-[0.08em] text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {COMPANY.legalName}. Ston-i Surfaces is a brand of {COMPANY.shortName}.</p>
          <p className="uppercase tracking-[0.24em] text-[10px]">Manufacturing · R&amp;D · Product Development</p>
          {CONTACT.social.length > 0 && (
            <ul className="flex gap-4">
              {CONTACT.social.map((s) => (
                <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">{s.label}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h2 className="mb-5 font-sans text-[10.5px] font-semibold uppercase tracking-[0.26em] text-paper">{title}</h2>
      <ul className="space-y-3 text-[14px] text-mist">
        {links.map((l) => (
          <li key={l.label}><Link to={l.to} className="hover:text-crimson-hi transition-colors">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  )
}
