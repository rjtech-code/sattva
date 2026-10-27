import Seo from '../components/ui/Seo'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import { Eyebrow } from '../components/ui/Bits'
import PageHero from '../components/sections/PageHero'
import { PartnerGrid, SectionHead } from '../components/sections/Blocks'
import EnquiryForm from '../components/EnquiryForm'
import { BRAND, COMPANY } from '../data/site'
import { ABOUT } from '../data/content'
import { tex } from '../data/media'

const OFFER = [
  { icon: 'Factory', title: 'Direct from the manufacturer', text: `Work with ${COMPANY.shortName}, the company that manufactures and develops the ${BRAND.name} portfolio.` },
  { icon: 'Layers', title: 'A growing portfolio', text: 'Three distinct ranges today — Stonir, StonIT and Art-i Canvas Veneer — with future brands to follow.' },
  { icon: 'BookOpen', title: 'Product information & support', text: 'Catalogues, product information and support for your customers and projects.' },
]

export default function Partners() {
  return (
    <>
      <Seo
        title="B2B Partners — Become a Dealer or Distributor"
        path="/partners"
        description="Partner with Ston-i Surfaces. Dealers, distributors, wholesalers, retailers and project teams — enquire about supplying Stonir, StonIT and Art-i Canvas Veneer."
      />
      <PageHero
        eyebrow="B2B Partners"
        title={<>Let’s build<br />together</>}
        lede="We work with dealers, distributors, wholesalers, architects, interior designers and project partners to bring innovative surface solutions to market."
        image={tex.marbleCrimson}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'B2B Partners' }]}
      />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Who we work with" title="Built for the B2B market." lede={`${BRAND.name} is focused on long-term relationships with trade partners, and works alongside the professionals who specify and use our products.`} />
          <div className="mt-12"><PartnerGrid /></div>
        </div>
      </section>

      <section className="section border-t border-line bg-coal">
        <div className="wrap">
          <SectionHead eyebrow="Why partner with us" title="Our proposition." />
          <ul className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
            {OFFER.map((o, i) => (
              <Reveal as="li" key={o.title} delay={i * 80} className="bg-ink p-8">
                <Icon name={o.icon} size={28} className="text-crimson-hi" />
                <p className="display-sm mt-6">{o.title}</p>
                <p className="mt-3 text-[14px] text-mist">{o.text}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-12 border-l-2 border-crimson pl-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ash">Our mission</p>
            <p className="mt-2 font-display text-[clamp(1.4rem,2.6vw,2.1rem)]">{ABOUT.mission}</p>
          </Reveal>
        </div>
      </section>

      <section id="enquiry" className="section scroll-mt-16 border-t border-line">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <Reveal>
            <Eyebrow className="mb-6">Become a B2B partner</Eyebrow>
            <h2 className="display-lg">Send a partnership enquiry.</h2>
            <p className="lede mt-6">Join our network and get access to our product portfolio and support. Tell us about your business, your city and the ranges you’re interested in.</p>
          </Reveal>
          <EnquiryForm defaultType="b2b-partnership" />
        </div>
      </section>
    </>
  )
}
