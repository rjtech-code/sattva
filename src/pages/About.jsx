import Seo from '../components/ui/Seo'
import Picture from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import { ArrowLink, Eyebrow } from '../components/ui/Bits'
import PageHero from '../components/sections/PageHero'
import { CapabilityStrip, CtaBand, MissionPanel, RangeCards, SectionHead } from '../components/sections/Blocks'
import { ABOUT, STRATEGY } from '../data/content'
import { BRAND, COMPANY } from '../data/site'
import { tex } from '../data/media'

export default function About() {
  return (
    <>
      <Seo
        title="About Sattva Sattvik"
        path="/about"
        description="Sattva Sattvik Private Limited is a Jaipur-based manufacturing and product-development company creating innovative surface solutions for the Indian market through Ston-i Surfaces."
      />
      <PageHero
        eyebrow="Our company"
        title={<>About<br />Sattva Sattvik</>}
        lede={ABOUT.intro}
        image={tex.marbleDark}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      >
        <ArrowLink to="#vision">Our vision</ArrowLink>
      </PageHero>

      <section className="section">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal><Picture image={tex.stonir} className="aspect-[16/10]" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 45vw, 100vw" alt="" /></Reveal>
          <Reveal delay={100}>
            <h2 className="display-md">Built on innovation.<br />Driven by purpose.</h2>
            <p className="lede mt-6">{ABOUT.purpose}</p>
            <p className="lede mt-4">{ABOUT.idea}</p>
          </Reveal>
        </div>
        <div className="wrap mt-16"><CapabilityStrip /></div>
      </section>

      <section id="vision" className="section scroll-mt-20 border-t border-line bg-coal">
        <div className="wrap">
          <SectionHead eyebrow="Vision" title="A manufacturing company building the next generation of surface materials." />
          <div className="mt-14"><MissionPanel /></div>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="brand-rel">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow className="mb-6">Our market-facing brand</Eyebrow>
            <h2 id="brand-rel" className="display-lg">{BRAND.name}</h2>
            <p className="lede mt-6">{ABOUT.brand}</p>
            <p className="lede mt-4">{ABOUT.stoni}</p>
          </Reveal>
          {/* Corporate → brand → ranges, as two connected identities */}
          <Reveal delay={100} className="flex flex-col">
            {[
              { k: COMPANY.legalName, v: 'Manufacturing · R&D · Product Development' },
              { k: BRAND.name, v: 'Market-facing architectural surface brand' },
              { k: 'Stonir · StonIT · Art-i Canvas Veneer', v: 'Product ranges' },
            ].map((row, i) => (
              <div key={row.k} className="relative">
                <div className={`border border-line p-6 ${i === 1 ? 'bg-coal-2 border-crimson/50' : 'bg-coal'}`}>
                  <p className="font-display text-[clamp(1.25rem,2vw,1.6rem)] uppercase">{row.k}</p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-ash">{row.v}</p>
                </div>
                {i < 2 && <div className="mx-auto h-8 w-px bg-crimson" aria-hidden="true" />}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-line bg-coal">
        <div className="wrap">
          <SectionHead eyebrow="Our portfolio" title="Three distinct product ranges." lede="Built around one brand, each range has its own identity — and room for future brands to join." />
          <div className="mt-12"><RangeCards /></div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead eyebrow="The strategic idea" title="Every layer has a clear job." />
          <ul className="mt-12 grid gap-px bg-line lg:grid-cols-3">
            {STRATEGY.map((s) => (
              <li key={s.who} className="bg-ink p-8">
                <p className="font-display text-[1.6rem] uppercase">{s.who}</p>
                <p className="mt-1 font-display text-[1.35rem] italic text-mist">{s.does}</p>
                <p className="mt-5 text-[12px] uppercase tracking-[0.18em] text-ash">{s.role}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-8">
            <ArrowLink to="/manufacturing">Manufacturing</ArrowLink>
            <ArrowLink to="/innovation">R&amp;D / Innovation</ArrowLink>
            <ArrowLink to="/partners">B2B partnerships</ArrowLink>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
