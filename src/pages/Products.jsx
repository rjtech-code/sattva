import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Picture from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import { ButtonLink, Eyebrow } from '../components/ui/Bits'
import PageHero from '../components/sections/PageHero'
import { CtaBand } from '../components/sections/Blocks'
import { RANGES } from '../data/ranges'
import { collectionsFor, productsFor, rangeCover } from '../data/catalog'
import { ABOUT } from '../data/content'
import { BRAND, COMPANY } from '../data/site'
import { tex } from '../data/media'

export default function Products() {
  return (
    <>
      <Seo
        title="Products — The Ston-i Surfaces Portfolio"
        path="/products"
        description="Explore the Ston-i Surfaces portfolio by Sattva Sattvik: Stonir flexible stone veneer, StonIT innovative surface solutions and Art-i Canvas Veneer."
      />
      <PageHero
        eyebrow="Our products"
        title={<>Explore the Ston-i<br />Surfaces portfolio</>}
        lede={`Three distinct product ranges. Endless possibilities. ${ABOUT.stoni}`}
        image={tex.marbleCrimson}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }]}
      />

      {/* Category navigation */}
      <nav aria-label="Product ranges" className="sticky top-[72px] z-30 border-b border-line bg-ink/90 backdrop-blur">
        <ul className="wrap no-scrollbar flex gap-8 overflow-x-auto py-4 text-[11px] uppercase tracking-[0.2em] text-mist">
          {RANGES.map((r) => <li key={r.slug} className="shrink-0"><a href={`#${r.slug}`} className="hover:text-paper">{r.name}</a></li>)}
          <li className="shrink-0"><a href="#future-brands" className="hover:text-paper">Future Brands</a></li>
        </ul>
      </nav>

      {RANGES.map((r, i) => {
        const cols = collectionsFor(r.slug)
        return (
          <section key={r.slug} id={r.slug} className={`scroll-mt-32 border-b border-line ${i % 2 ? 'bg-coal' : ''}`} aria-labelledby={`${r.slug}-h`}>
            <div className={`wrap section grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <Reveal>
                <Link to={`/products/${r.slug}`} aria-label={`${r.name} — ${r.tagline}`} tabIndex={-1}>
                  <Picture image={rangeCover(r) || r.identity.texture} className="aspect-[4/3]" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 50vw, 100vw" alt="" />
                </Link>
              </Reveal>
              <Reveal delay={100}>
                <p className="font-display text-crimson-hi">{String(i + 1).padStart(2, '0')}</p>
                <h2 id={`${r.slug}-h`} className="display-xl mt-3">{r.wordmark}</h2>
                {r.wordmarkSub && <p className="font-display text-[clamp(1.2rem,2.2vw,1.8rem)] uppercase tracking-[0.2em] text-mist">{r.wordmarkSub}</p>}
                <p className="mt-4 text-[13px] uppercase tracking-[0.2em] text-paper">{r.tagline}</p>
                <p className="lede mt-6">{r.summary}</p>
                <p className="mt-4 text-[12px] uppercase tracking-[0.2em] text-ash">{productsFor(r.slug).length} products · {cols.length} {r.slug === 'stonit' ? 'designs' : cols.length === 1 ? 'collection' : 'collections'}</p>
                {cols.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {cols.map((c) => (
                      <li key={c.slug}><Link to={`/products/${r.slug}/${c.slug}`} className="border border-line px-3 py-1.5 text-[12px] text-mist hover:border-crimson hover:text-paper">{c.name}</Link></li>
                    ))}
                  </ul>
                )}
                <div className="mt-9 flex flex-wrap gap-3">
                  <ButtonLink to={`/products/${r.slug}`}>Explore {r.name}</ButtonLink>
                  <ButtonLink to={`/partners?range=${r.slug}#enquiry`} variant="ghost">Enquire</ButtonLink>
                </div>
              </Reveal>
            </div>
          </section>
        )
      })}

      <section id="future-brands" className="relative isolate scroll-mt-32 overflow-hidden">
        <Picture image={tex.marbleCrimson} className="!absolute inset-0 -z-10 lg:left-1/2" imgClassName="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 -z-10 scrim-l" aria-hidden="true" />
        <div className="wrap section">
          <Reveal className="max-w-2xl">
            <Eyebrow className="mb-6">Future brands</Eyebrow>
            <h2 className="display-lg">Expanding the possibilities of surface materials.</h2>
            <p className="lede mt-6">{BRAND.name} is built as a brand ecosystem. As {COMPANY.shortName} develops new surface-material categories, they will join the portfolio here — each with its own range page, collections, documents and applications.</p>
            <Link to="/innovation" className="link-arrow mt-8">Our R&amp;D<Icon name="ArrowRight" size={14} strokeWidth={1.75} /></Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
