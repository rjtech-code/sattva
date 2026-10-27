import { Link } from 'react-router-dom'
import { Download, Plus } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import PageHero from '../components/sections/PageHero'
import { CtaBand, SectionHead } from '../components/sections/Blocks'
import { FAQS, RESOURCE_CATEGORIES } from '../data/resources'
import { RANGES } from '../data/ranges'
import { tex } from '../data/media'

export default function Resources() {
  return (
    <>
      <Seo
        title="Resources — Catalogues, Technical Information & FAQs"
        path="/resources"
        description="Ston-i Surfaces resource centre — product catalogues, shade cards, technical information, specifications, installation guides and FAQs."
      />
      <PageHero
        eyebrow="Resources"
        title={<>Everything you need.<br />In one place.</>}
        lede="Catalogues, technical information and tools to help you specify, design and build with confidence."
        image={tex.stonit}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources' }]}
      />

      <section className="section">
        <div className="wrap">
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCE_CATEGORIES.map((c, i) => (
              <Reveal as="li" key={c.slug} id={c.slug} delay={i * 60} className="flex flex-col bg-ink p-8 scroll-mt-28">
                <Icon name={c.icon} size={28} className="text-crimson-hi" />
                <h2 className="display-sm mt-6">{c.title}</h2>
                <p className="mt-2 text-[14px] text-mist">{c.text}</p>
                {c.documents.length ? (
                  <ul className="mt-6 divide-y divide-line border-t border-line">
                    {c.documents.map((d) => (
                      <li key={d.href}>
                        <a href={d.href} download className="flex items-center justify-between gap-3 py-3 text-[14px] hover:text-crimson-hi">
                          <span className="flex items-center gap-2"><Download size={14} aria-hidden="true" />{d.label}</span>
                          <span className="text-[11.5px] text-ash">{[RANGES.find((r) => r.slug === d.range)?.name, d.size].filter(Boolean).join(' · ')}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-auto pt-6">
                    <p className="mb-3 text-[12px] text-ash">Available on request</p>
                    <Link to={`/contact?type=catalogue`} className="link-arrow">Request<Icon name="ArrowRight" size={14} strokeWidth={1.75} /></Link>
                  </div>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="faqs" className="section scroll-mt-16 border-t border-line bg-coal">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead eyebrow="FAQs" title="Frequently asked questions." />
          <div className="border-t border-line">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[16px] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus size={18} className="shrink-0 text-crimson-hi transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="pb-6 pr-10 text-[14.5px] leading-relaxed text-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Need something specific?" title="Request product information." text="Tell us the range and document you need, and our team will send the current version." primary={{ to: '/contact?type=catalogue', label: 'Request Resources' }} secondary={{ to: '/partners', label: 'B2B Partners' }} />
    </>
  )
}
