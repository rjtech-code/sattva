import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Picture from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import { ArrowLink, ButtonLink, Eyebrow } from '../components/ui/Bits'
import { CtaBand, PartnerGrid, ProcessSteps, RangeCards, SectionHead, WhyStoni } from '../components/sections/Blocks'
import { tex } from '../data/media'
import { RANGES } from '../data/ranges'
import { productImage, rangeCover } from '../data/catalog'
import { APPLICATIONS, STRATEGY } from '../data/content'
import { BRAND, COMPANY } from '../data/site'

function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden border-b border-line lg:items-center">
      <Picture image={tex.marbleCrimson} priority className="!absolute inset-0 -z-20" imgClassName="h-full w-full object-cover opacity-80" alt="" />
      <div className="absolute inset-0 -z-10 scrim-l" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" aria-hidden="true" />

      {/* Layered material panels — one per range — echoing the collage's architectural composition */}
      <div className="pointer-events-none absolute right-[-6%] top-1/2 -z-10 hidden h-[78%] w-[46%] -translate-y-1/2 lg:block" aria-hidden="true">
        {RANGES.map((r, i) => (rangeCover(r) || null) && (
          <div
            key={r.slug}
            className="absolute top-0 h-full w-[34%] overflow-hidden border border-line-2 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.9)]"
            style={{ left: `${i * 27}%`, transform: `translateY(${(i - 1) * 6}%) skewY(-4deg)`, zIndex: 3 - i }}
          >
            <img src={rangeCover(r).srcSmall} alt="" className="h-full w-full object-cover" width={rangeCover(r).width} height={rangeCover(r).height} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <span className="absolute bottom-5 left-5 font-display text-[15px] tracking-[0.2em] text-paper/90">{r.wordmark}</span>
          </div>
        ))}
      </div>

      <div className="wrap pb-16 pt-32 lg:py-40">
        <Reveal className="max-w-[44rem]">
          <Eyebrow className="mb-7">{BRAND.name}</Eyebrow>
          <h1 className="display-xl">Surfaces that expand the possibilities of design.</h1>
          <p className="lede mt-7 max-w-[30rem]">
            Innovative architectural surface materials manufactured by {COMPANY.shortName} and developed for the evolving needs of the B2B market.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/products">Explore Products</ButtonLink>
            <ButtonLink to="/partners#enquiry" variant="ghost">B2B Enquiry</ButtonLink>
          </div>
          <p className="mt-14 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-ash">
            <span className="h-px w-8 bg-crimson" aria-hidden="true" />
            {BRAND.attribution}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="section">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <Picture image={tex.marbleDark} className="aspect-[5/4]" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 50vw, 100vw" alt="" />
          <div className="absolute -bottom-6 -right-2 hidden border border-line bg-ink px-6 py-5 sm:block lg:-right-8">
            <p className="text-[10px] uppercase tracking-[0.26em] text-ash">Manufactured in</p>
            <p className="mt-1 font-display text-[22px]">{COMPANY.city}, {COMPANY.state}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Eyebrow className="mb-6">The company behind the brand</Eyebrow>
          <h2 className="display-lg">Built by manufacturing. Defined by material innovation.</h2>
          <p className="lede mt-7">
            {BRAND.name} is an architectural surface-material brand by <span className="text-paper">{COMPANY.legalName}</span>, a manufacturing and product-development company based in {COMPANY.city}, {COMPANY.state}.
          </p>
          <p className="lede mt-4">Through {BRAND.name}, {COMPANY.shortName} develops and supplies innovative surface materials for the B2B market across India.</p>
          <ArrowLink to="/about" className="mt-9">Discover Sattva Sattvik</ArrowLink>
        </Reveal>
      </div>
    </section>
  )
}

function Portfolio() {
  return (
    <section className="section border-t border-line bg-coal" aria-labelledby="portfolio">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] lg:gap-14">
        <Reveal className="lg:pt-4">
          <Eyebrow className="mb-6">The ecosystem</Eyebrow>
          <h2 id="portfolio" className="display-md">One vision. Three product ranges.</h2>
          <p className="mt-6 text-[14.5px] leading-relaxed text-mist">
            {BRAND.name} brings together a portfolio of innovative surface materials, manufactured by {COMPANY.shortName}, for diverse architectural applications.
          </p>
          <ArrowLink to="/products" className="mt-8">Explore the portfolio</ArrowLink>
        </Reveal>
        <RangeCards />
      </div>
      <div className="wrap mt-5">
        <Reveal>
          <Link to="/products#future-brands" className="group relative flex flex-col gap-4 overflow-hidden border border-line p-7 sm:flex-row sm:items-center sm:justify-between">
            <img src={tex.marbleCrimson.srcSmall} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" loading="lazy" width="960" height="600" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-coal via-coal/80 to-transparent" />
            <div>
              <p className="display-sm">Future brands</p>
              <p className="mt-1 text-[14px] text-mist">Built to grow — new surface-material categories will join the portfolio.</p>
            </div>
            <span className="link-arrow">Discover<Icon name="ArrowRight" size={14} strokeWidth={1.75} /></span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function Architecture() {
  return (
    <section className="section" aria-labelledby="architecture">
      <div className="wrap">
        <SectionHead
          eyebrow="Brand architecture"
          title={<span id="architecture">One company. One brand. A growing portfolio.</span>}
          lede="Each layer has a clear role — so customers discover the product first, and the manufacturer behind it as they go deeper."
        />
        <ol className="mt-14 grid border-t border-line lg:grid-cols-3">
          {STRATEGY.map((s, i) => (
            <Reveal as="li" key={s.who} delay={i * 100} className="border-b border-line py-9 lg:border-b-0 lg:border-l lg:px-9 lg:first:border-l-0 lg:first:pl-0">
              <span className="font-display text-crimson-hi">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-5 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] uppercase leading-tight">
                {s.who} <span className="text-mist normal-case italic">{s.does}</span>
              </p>
              <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-ash">{s.role}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ApplicationsTeaser() {
  const items = APPLICATIONS.filter((a) => a.image && !a.imageNote).slice(0, 6)
  return (
    <section className="section border-t border-line" aria-labelledby="applications-teaser">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead eyebrow="Applications" title={<span id="applications-teaser">Where surfaces create spaces.</span>} />
          <ArrowLink to="/applications">All applications</ArrowLink>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
          {items.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 60}>
              <Link to={`/applications#${a.slug}`} className="group relative block aspect-[4/3] overflow-hidden border border-line">
                {(() => {
                  const im = productImage(a.image[0], a.image[1], a.image[2], 1)
                  return im && <img src={im.srcSmall} alt="" loading="lazy" width={im.width} height={im.height} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                })()}
                <div className="absolute inset-0 scrim-b" />
                <p className="absolute bottom-4 left-4 right-4 text-[12px] uppercase tracking-[0.16em] sm:bottom-5 sm:left-5 sm:text-[13px]">{a.title}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ManufacturingTeaser() {
  return (
    <section className="section border-t border-line bg-coal" aria-labelledby="mfg-teaser">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <SectionHead eyebrow="Manufacturing" title={<span id="mfg-teaser">Built in Jaipur. Growing across India.</span>} />
          <Reveal>
            <p className="lede">We don’t merely trade these products — {COMPANY.shortName} manufactures and develops them, from material preparation to dispatch.</p>
            <ArrowLink to="/manufacturing" className="mt-6">Our manufacturing</ArrowLink>
          </Reveal>
        </div>
        <div className="mt-16"><ProcessSteps /></div>
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section className="section border-t border-line" aria-labelledby="b2b-teaser">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <Reveal>
          <Eyebrow className="mb-6">Built for the B2B market</Eyebrow>
          <h2 id="b2b-teaser" className="display-lg">Who we work with.</h2>
          <p className="lede mt-6">{BRAND.name} is focused on long-term relationships with dealers, distributors, wholesalers, retailers and material suppliers — and works alongside the architects, designers and builders who specify and use the products.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/partners">Become a B2B Partner</ButtonLink>
            <ButtonLink to="/contact?type=general" variant="ghost">Talk to Sales</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={100}><PartnerGrid compact /></Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Seo
        path="/"
        description="Ston-i Surfaces — architectural surface materials by Sattva Sattvik Private Limited, Jaipur. Explore Stonir flexible stone veneer, StonIT and Art-i Canvas Veneer, and partner with us."
      />
      <Hero />
      <Intro />
      <WhyStoni />
      <Portfolio />
      <Architecture />
      <ApplicationsTeaser />
      <ManufacturingTeaser />
      <Partners />
      <CtaBand
        eyebrow="Catalogue & product information"
        title="Let’s talk about your next project."
        text="Request the current range information, catalogues and shade cards, or speak to our team about supply."
        primary={{ to: '/contact?type=catalogue', label: 'Request Catalogue' }}
        secondary={{ to: '/partners#enquiry', label: 'B2B Enquiry' }}
      />
    </>
  )
}
