import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import Seo from '../components/ui/Seo'
import { Breadcrumbs, Eyebrow } from '../components/ui/Bits'
import EnquiryForm from '../components/EnquiryForm'
import { COMPANY, CONTACT } from '../data/site'
import { tex } from '../data/media'

export default function Contact() {
  const channels = [
    { icon: MapPin, label: 'Manufacturing base', value: CONTACT.location },
    CONTACT.phone && { icon: Phone, label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
    CONTACT.email && { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    CONTACT.whatsapp && { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsapp, href: `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}` },
  ].filter(Boolean)

  return (
    <>
      <Seo title="Contact" path="/contact" description="Contact Ston-i Surfaces and Sattva Sattvik Private Limited, Jaipur — B2B partnership, product information and catalogue requests." />
      <section className="relative isolate overflow-hidden pt-32">
        <img src={tex.marbleCrimson.src} alt="" className="absolute right-0 top-0 -z-10 h-[70vh] w-full object-cover opacity-50 lg:w-2/3" width="1920" height="1200" />
        <div className="absolute inset-0 -z-10 scrim-l" />
        <div className="absolute inset-x-0 top-[40vh] -z-10 h-[30vh] bg-gradient-to-b from-transparent to-ink" />
        <div className="wrap pb-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <div>
              <Eyebrow className="mb-6">Contact</Eyebrow>
              <h1 className="display-xl">Let’s talk about your next project.</h1>
              <p className="lede mt-6">We’re here to help with product information, partnerships and enquiries.</p>
              <ul className="mt-12 space-y-6">
                {channels.map((c) => (
                  <li key={c.label} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-crimson/60 text-crimson-hi"><c.icon size={17} aria-hidden="true" /></span>
                    <div>
                      <p className="text-[10.5px] uppercase tracking-[0.22em] text-ash">{c.label}</p>
                      {c.href ? <a href={c.href} className="text-[15px] hover:text-crimson-hi">{c.value}</a> : <p className="text-[15px]">{c.value}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-12 border-t border-line pt-6 text-[12px] uppercase tracking-[0.2em] text-ash">{COMPANY.legalName}<br /><span className="normal-case tracking-normal">Manufacturing · R&amp;D · Product Development</span></p>
            </div>
            <EnquiryForm defaultType="general" />
          </div>
        </div>
      </section>
    </>
  )
}
