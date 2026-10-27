import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Icon from '../ui/Icon'
import Picture from '../ui/Picture'
import Reveal from '../ui/Reveal'
import { ArrowLink, ButtonLink, Eyebrow } from '../ui/Bits'
import { PILLARS, PROCESS, PARTNER_TYPES, CAPABILITIES, ABOUT } from '../../data/content'
import { RANGES } from '../../data/ranges'
import { rangeCover } from '../../data/catalog'
import { COMPANY } from '../../data/site'
import { tex } from '../../data/media'

export function SectionHead({ eyebrow, title, lede, align = 'left', className = '' }) {
  return (
    <Reveal className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow className={`mb-5 ${align === 'center' ? 'justify-center' : ''}`}>{eyebrow}</Eyebrow>}
      <h2 className="display-lg">{title}</h2>
      {lede && <p className={`lede mt-6 ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p>}
    </Reveal>
  )
}

/* ── WHY STON-i? — five pillars over dark marble ───────────────────────── */
export function WhyStoni() {
  return (
    <section className="relative isolate overflow-hidden border-y border-line" aria-labelledby="why-stoni">
      <Picture image={tex.marbleDark} className="!absolute inset-0 -z-10 opacity-60" imgClassName="h-full w-full object-cover" alt="" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/70 to-ink" aria-hidden="true" />
      <div className="wrap section">
        <Reveal className="text-center">
          <p className="eyebrow justify-center mb-6">The Ston-i difference</p>
          <h2 id="why-stoni" className="display-xl">Why Ston-i?</h2>
          <p className="mt-5 font-display text-[clamp(1.25rem,2.2vw,1.75rem)] italic text-mist">Stone, Reimagined.</p>
          <div className="mx-auto mt-8 h-[2px] w-14 bg-crimson" aria-hidden="true" />
        </Reveal>

        {/* Five columns on desktop; a scroll-snap rail on mobile so nothing is cropped. */}
        <ol className="no-scrollbar mt-16 -mx-4 flex snap-x snap-mandatory gap-0 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {PILLARS.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 90}
              className="w-[74%] shrink-0 snap-start border-l border-line px-6 py-4 sm:w-[44%] lg:w-auto lg:px-7 first:border-l-0 lg:first:border-l-0"
            >
              <span className="font-display text-[15px] text-crimson-hi">{p.n}</span>
              <Icon name={p.icon} size={30} className="mt-6 text-paper" />
              <h3 className="display-sm mt-6">{p.title}</h3>
              <div className="my-4 h-px w-8 bg-crimson/80" aria-hidden="true" />
              <p className="text-[14px] leading-relaxed text-mist">{p.text}</p>
            </Reveal>
          ))}
        </ol>
        <p className="mt-6 text-center text-[11px] tracking-[0.2em] uppercase text-ash lg:hidden" aria-hidden="true">Swipe to see all five →</p>
      </div>
    </section>
  )
}

/* ── Range cards — the Ston-i portfolio ────────────────────────────────── */
export function RangeCards({ headingLevel = 'h3' }) {
  const H = headingLevel
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {RANGES.map((r, i) => (
        <Reveal as="li" key={r.slug} delay={i * 110}>
          <Link to={`/products/${r.slug}`} className="group panel flex h-full flex-col transition-colors hover:border-line-2">
            <Picture image={rangeCover(r) || r.identity.texture} className="aspect-[4/3.2]" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" alt={`${r.name} — ${r.tagline}`} />
            <div className="flex flex-1 flex-col p-6 lg:p-7">
              <H className="display-md">{r.wordmark}{r.wordmarkSub ? ` ${r.wordmarkSub}` : ''}</H>
              <p className="mt-2 text-[13px] tracking-[0.06em] text-mist">{r.tagline}</p>
              <p className="mt-4 flex-1 text-[14px] leading-relaxed text-ash">{r.summary}</p>
              <span className="link-arrow mt-6">Explore {r.name}<Icon name="ArrowRight" size={14} strokeWidth={1.75} /></span>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}

/* ── Process — six stages with fine connecting line ────────────────────── */
export function ProcessSteps() {
  return (
    <ol className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
      <span className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-line-2 lg:block" aria-hidden="true" />
      {PROCESS.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 80} className="relative px-2 text-center">
          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-crimson/70 bg-ink text-crimson-hi">
            <Icon name={s.icon} size={20} />
          </span>
          <p className="mt-2 font-display text-[13px] text-ash">{String(i + 1).padStart(2, '0')}</p>
          <h3 className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em]">{s.title}</h3>
          <p className="mx-auto mt-2 max-w-[13rem] text-[13px] leading-relaxed text-ash">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  )
}

/* ── Partner audiences grid ────────────────────────────────────────────── */
export function PartnerGrid({ compact = false }) {
  const items = compact ? PARTNER_TYPES.slice(0, 8) : PARTNER_TYPES
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((p) => (
        <li key={p.title} className="flex flex-col items-center gap-4 border-b border-r border-line px-3 py-8 text-center">
          <Icon name={p.icon} size={26} className="text-paper" />
          <span className="text-[12px] tracking-[0.08em] text-mist">{p.title}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Capability strip (About) ──────────────────────────────────────────── */
export function CapabilityStrip() {
  return (
    <ul className="grid grid-cols-2 border-y border-line sm:grid-cols-3 lg:grid-cols-5">
      {CAPABILITIES.map((c, i) => (
        <li key={c.title} className={`flex flex-col items-center gap-3 px-3 py-8 text-center ${i ? 'lg:border-l' : ''} border-line`}>
          <Icon name={c.icon} size={26} className="text-paper" />
          <span className="text-[12px] tracking-[0.1em] text-mist">{c.title}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Mission + manufacturing base ──────────────────────────────────────── */
export function MissionPanel() {
  return (
    <div className="grid border border-line lg:grid-cols-[1.6fr_1fr]">
      <div className="relative isolate min-h-[280px] overflow-hidden">
        <Picture image={tex.ridge} className="!absolute inset-0 -z-10" imgClassName="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-transparent" aria-hidden="true" />
        <div className="flex h-full flex-col justify-end p-7 sm:p-10">
          <p className="text-[12px] tracking-[0.12em] text-mist">Our Mission</p>
          <p className="display-sm mt-3 max-w-md normal-case !font-display !text-[clamp(1.4rem,2.4vw,2rem)]">{ABOUT.mission}</p>
          <ArrowLink to="/partners" className="mt-6">Partner with us</ArrowLink>
        </div>
      </div>
      <div className="relative flex flex-col justify-between gap-10 border-t border-line bg-coal p-7 sm:p-10 lg:border-l lg:border-t-0">
        <div>
          <p className="text-[12px] tracking-[0.12em] text-mist">Manufacturing Base</p>
          <p className="mt-3 flex items-center gap-2 text-crimson-hi"><MapPin size={16} aria-hidden="true" /> {COMPANY.city}, {COMPANY.state}</p>
        </div>
        <div className="relative mx-auto h-40 w-40" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border border-line" />
          <span className="absolute inset-6 rounded-full border border-line" />
          <span className="absolute inset-12 rounded-full border border-line-2" />
          <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson shadow-[0_0_24px_6px_rgb(200_16_46/0.55)]" />
        </div>
        <p className="font-display text-[15px] tracking-[0.1em] text-ash">{COMPANY.coordinates}</p>
      </div>
    </div>
  )
}

/* ── Closing CTA band ──────────────────────────────────────────────────── */
export function CtaBand({
  eyebrow = 'B2B Partnerships',
  title = 'Let’s build together.',
  text = 'Dealers, distributors, wholesalers, retailers and project teams — talk to us about the Ston-i Surfaces portfolio.',
  primary = { to: '/partners#enquiry', label: 'Become a B2B Partner' },
  secondary = { to: '/resources', label: 'Request Catalogue' },
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-line">
      <Picture image={tex.marbleCrimson} className="!absolute inset-0 -z-10 lg:left-1/3" imgClassName="h-full w-full object-cover" alt="" />
      <div className="absolute inset-0 -z-10 scrim-l" aria-hidden="true" />
      <div className="wrap py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
          <h2 className="display-lg">{title}</h2>
          <p className="lede mt-6">{text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to={primary.to}>{primary.label}</ButtonLink>
            {secondary && <ButtonLink to={secondary.to} variant="ghost">{secondary.label}</ButtonLink>}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
