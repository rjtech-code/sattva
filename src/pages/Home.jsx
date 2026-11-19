import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Picture, { slotAspect } from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import { ArrowLink, ButtonLink, Eyebrow } from '../components/ui/Bits'
import { BrandOrigin, CtaBand, ItalyBadge, OriginStrip, PartnerGrid, ProcessSteps, RangeCards, SectionHead, WhyStoni } from '../components/sections/Blocks'
import { tex } from '../data/media'
import { RANGES } from '../data/ranges'
import { applicationsFor, productImage } from '../data/catalog'
import { STRATEGY } from '../data/content'
import { BRAND, COMPANY } from '../data/site'

// One real sheet per range, shown at its own proportions (no cropping).
const HERO_SHEETS = [
  { range: RANGES[0], image: productImage('stonir', 'natural-series', 'ssv-3000-1') },
  { range: RANGES[1], image: productImage('stonit', 'haveli-arch', 'haveli-arch-multi-color') },
  { range: RANGES[2], image: productImage('art-i-canvas-veneer', 'canvas-series', 'acv-13') },
]

function Hero() {
  const [activeSheet, setActiveSheet] = useState(0)

  // Keep the material roller moving gently; the manual controls use the same transition.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSheet((current) => (current + 1) % HERO_SHEETS.length)
    }, 5600)
    return () => window.clearInterval(timer)
  }, [])

  const showPrevious = () => setActiveSheet((current) => (current - 1 + HERO_SHEETS.length) % HERO_SHEETS.length)
  const showNext = () => setActiveSheet((current) => (current + 1) % HERO_SHEETS.length)

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden border-b border-line">
      <Picture image={tex.marbleCrimson} priority className="!absolute inset-0 -z-20" imgClassName="h-full w-full object-cover opacity-80" alt="" />
      <div className="absolute inset-0 -z-10 scrim-l" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" aria-hidden="true" />

      <div className="wrap grid min-h-[100svh] items-center gap-8 pb-12 pt-28 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8 lg:pb-10 lg:pt-28 xl:gap-14">
        <Reveal className="relative z-10 max-w-[44rem]">
          <div className="mb-7 flex flex-wrap items-center gap-x-6 gap-y-3"><ItalyBadge /><Eyebrow>{BRAND.name}</Eyebrow></div>
          <h1 className="display-xl">Born in Italy.</h1>
          <p className="lede mt-7 max-w-[30rem]">
            Italian-born architectural surface materials — designed in Italy, manufactured in India by {COMPANY.shortName}, and developed for B2B markets worldwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/products">Explore Products</ButtonLink>
            <ButtonLink to="/partners#enquiry" variant="ghost">B2B Enquiry</ButtonLink>
          </div>
          <OriginStrip className="mt-8" compact />
          <p className="mt-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-ash">
            <span className="h-px w-8 bg-crimson" aria-hidden="true" />
            {BRAND.attribution}
          </p>
        </Reveal>

        <div className="relative flex min-h-[340px] flex-col [perspective:1600px] sm:min-h-[420px] lg:min-h-0 lg:h-full lg:py-8" aria-label="Featured material ranges" aria-roledescription="carousel">
          <div className="relative min-h-[300px] flex-1 sm:min-h-[370px] lg:min-h-0">
            {HERO_SHEETS.map(({ range: r, image: im }, i) => {
              if (!im) return null
              const depth = (i - activeSheet + HERO_SHEETS.length) % HERO_SHEETS.length
              const x = depth === 0 ? -22 : depth === 1 ? 11 : 40
              const scale = depth === 0 ? 1 : depth === 1 ? 0.91 : 0.82
              const rotateY = depth === 0 ? -2 : depth === 1 ? -12 : -19
              const translateZ = depth === 0 ? 55 : depth === 1 ? -35 : -115
              return (
                <Link
                  key={r.slug}
                  to={'/products/' + r.slug}
                  aria-label={'Explore ' + r.name}
                  className="material-stack-card absolute left-1/2 top-0 block h-full w-[43%] cursor-pointer overflow-hidden border border-line-2 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.9)] motion-reduce:transition-none"
                  style={{
                    transform: `translateX(calc(-50% + ${x}%)) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${depth === 0 ? 0 : -2}deg) scale(${scale})`,
                    transformOrigin: 'center center',
                    zIndex: 5 - depth,
                    opacity: 1,
                    transition: 'transform 1350ms cubic-bezier(0.22, 1, 0.36, 1)',
                    willChange: 'transform',
                    animationDelay: `${depth * 180}ms`,
                  }}
                >
                  <img src={im.src} alt={r.name} className="h-full w-full object-cover" width={im.width} height={im.height} fetchPriority={i === 0 ? 'high' : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 font-display text-[11px] tracking-[0.16em] text-white sm:left-5 sm:top-5 sm:text-[15px]">{r.wordmark}</span>
                </Link>
              )
            })}
          </div>
          <div className="relative z-20 mt-3 flex items-center justify-center gap-2 sm:gap-3 lg:mt-5">
            <button type="button" onClick={showPrevious} className="inline-flex items-center gap-2 border border-white/25 bg-ink/80 px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:border-crimson hover:bg-crimson sm:px-4 sm:py-3 sm:text-[10px]" aria-label="Previous featured material">
              <Icon name="ArrowLeft" size={14} /> Previous
            </button>
            <span className="min-w-[3.5rem] text-center font-mono text-[10px] tracking-[0.2em] text-white/65" aria-live="polite">0{activeSheet + 1} / 0{HERO_SHEETS.length}</span>
            <button type="button" onClick={showNext} className="inline-flex items-center gap-2 border border-crimson bg-crimson px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-crimson-hi sm:px-4 sm:py-3 sm:text-[10px]" aria-label="Next featured material">
              Next <Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="section">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <Picture image={tex.marbleDark} aspect={5 / 4} imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 50vw, 100vw" alt="" />
          <div className="absolute -bottom-6 -right-2 hidden border border-line bg-ink px-6 py-5 sm:block lg:-right-8">
            <p className="text-[10px] uppercase tracking-[0.26em] text-ash">Manufactured in</p>
            <p className="mt-1 font-display text-[22px]">{COMPANY.region}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Eyebrow className="mb-6">The company behind the brand</Eyebrow>
          <h2 className="display-lg">Built by manufacturing. Defined by material innovation.</h2>
          <p className="lede mt-7">
            {BRAND.name} is an architectural surface-material brand by <span className="text-paper">{COMPANY.legalName}</span>, a manufacturing and product-development company based in {COMPANY.region}.
          </p>
          <p className="lede mt-4">Through {BRAND.name}, {COMPANY.shortName} develops and supplies innovative surface materials for B2B markets in India and worldwide.</p>
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
            <Picture image={tex.marbleCrimson} className="!absolute inset-0 -z-10" imgClassName="h-full w-full object-cover opacity-40" sizes="100vw" alt="" />
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
  // Two applications from each range, linking to that range's applications.
  // Only photos already close to the 4:3 tile, so none are cropped.
  // Landscape application photos only (Art-i's are full-page portraits), sized to their average shape.
  const items = RANGES.flatMap((r) => applicationsFor(r.slug).filter((a) => a.image.width > a.image.height).slice(0, 3).map((a) => ({ ...a, range: r })))
  const aspect = slotAspect(items.map((a) => a.image))
  return (
    <section className="section border-t border-line" aria-labelledby="applications-teaser">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead eyebrow="Applications" title={<span id="applications-teaser">Where surfaces create spaces.</span>} />
          <ArrowLink to="/applications">All applications</ArrowLink>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
          {items.map((a, i) => (
            <Reveal as="li" key={a.image.src} delay={i * 60}>
              <Link to={`/applications#${a.range.slug}`} className="group relative block overflow-hidden border border-line">
                <Picture image={a.image} aspect={aspect} imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 33vw, 50vw" alt={a.image.alt} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">{a.range.name}</p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-white sm:text-[13px]">{a.title}</p>
                </div>
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
          <SectionHead eyebrow="Manufacturing" title={<span id="mfg-teaser">Built in India. Growing across the world.</span>} />
          <Reveal>
            <p className="lede">We don’t merely trade these products — {COMPANY.shortName} manufactures and develops them, from material preparation to dispatch.</p>
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
        description="Ston-i Surfaces — an Italian-born architectural surface brand: designed in Italy, made in India by Sattva Sattvik Private Limited. Explore Stonir flexible stone veneer, StonIT and Art-i Canvas Veneer, and partner with us."
      />
      <Hero />
      <BrandOrigin />
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
