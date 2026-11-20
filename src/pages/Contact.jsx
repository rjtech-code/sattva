import { Mail, MapPin, Phone, MessageCircle, ExternalLink } from 'lucide-react'
import Seo from '../components/ui/Seo'
import { Breadcrumbs, Eyebrow } from '../components/ui/Bits'
import EnquiryForm from '../components/EnquiryForm'
import { COMPANY, CONTACT } from '../data/site'
import { tex } from '../data/media'
import Picture from '../components/ui/Picture'

const MAP_EMBED = 'https://www.google.com/maps?q=Jaipur,Rajasthan,India&output=embed'
const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=Jaipur%2C+Rajasthan%2C+India'

export default function Contact() {
  const channels = [
    { icon: MapPin, label: 'Location', value: 'Jaipur, Rajasthan, India' },
    CONTACT.phone && { icon: Phone, label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\\s/g, '')}` },
    CONTACT.email && { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    CONTACT.whatsapp && { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsappDisplay, href: `https://wa.me/${CONTACT.whatsapp}` },
  ].filter(Boolean)

  return (
    <>
      <Seo title="Contact" path="/contact" description="Contact Ston-i Surfaces in Jaipur, Rajasthan for product information, partnerships and enquiries." />
      <section className="relative isolate overflow-hidden pt-32">
        <Picture image={tex.marbleCrimson} priority className="!absolute right-0 top-0 -z-10 h-[70vh] w-full lg:w-2/3" imgClassName="h-full w-full object-cover opacity-50" alt="" />
        <div className="absolute inset-0 -z-10 scrim-l" />
        <div className="absolute inset-x-0 top-[40vh] -z-10 h-[30vh] bg-gradient-to-b from-transparent to-ink" />
        <div className="wrap pb-20">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <div>
              <Eyebrow className="mb-6">Contact</Eyebrow>
              <h1 className="display-xl">Let’s talk about your next project.</h1>
              <p className="lede mt-6">Product questions, partnerships or project enquiries — our team is here to help.</p>
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
              <p className="mt-12 border-t border-line pt-6 text-[12px] uppercase tracking-[0.2em] text-ash">{COMPANY.legalName}</p>
            </div>
            <EnquiryForm defaultType="general" />
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-coal">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><Eyebrow className="mb-3">Find us</Eyebrow><h2 className="display-lg">Jaipur, Rajasthan.</h2><p className="mt-3 text-[14px] text-mist">Explore our location on Google Maps.</p></div>
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="link-arrow">Open Google Maps <ExternalLink size={14} /></a>
          </div>
          <div className="relative isolate min-h-[360px] overflow-hidden border border-line sm:min-h-[460px]">
            <iframe title="Google Map — Jaipur, Rajasthan" src={MAP_EMBED} className="absolute inset-0 h-full min-h-[360px] w-full border-0 grayscale-[0.75] contrast-125 opacity-75 sm:min-h-[460px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink/35 via-transparent to-crimson/10" />
            <div className="pointer-events-none absolute left-4 top-4 border border-white/15 bg-ink/55 px-4 py-3 shadow-xl backdrop-blur-md sm:left-7 sm:top-7">
              <div className="flex items-center gap-2 text-crimson-hi"><MapPin size={15} /><span className="text-[10px] uppercase tracking-[0.22em]">Ston-i Surfaces</span></div>
              <p className="mt-1 font-display text-xl text-white">Jaipur, India</p>
              <p className="mt-1 text-[11px] text-white/65">Rajasthan · Manufacturing base region</p>
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 border border-white/10 bg-ink/45 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-md sm:bottom-7 sm:right-7">Ston-i Surfaces · Rajasthan</div>
          </div>
        </div>
      </section>
    </>
  )
}
