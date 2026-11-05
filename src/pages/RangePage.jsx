import { Link, useParams } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Picture from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import { ArrowLink, Breadcrumbs, ButtonLink, Eyebrow } from '../components/ui/Bits'
import { CtaBand, SectionHead } from '../components/sections/Blocks'
import ProductViewer from '../components/viewer/ProductViewer'
import { DocRequestList } from '../components/CatalogueRequest'
import NotFound from './NotFound'
import { RANGES, getRange } from '../data/ranges'
import { applicationsFor, collectionCover, collectionsFor, productImage, productsFor, rangeCover } from '../data/catalog'
import { BRAND } from '../data/site'

/* Three hero compositions — one per range identity — sharing the same type system. */

function StrataHero({ range, crumbs }) {
  // Stonir: real veneer swatches layered like stone strata, oversized wordmark, red highlight line.
  const layers = [
    productImage('stonir', 'natural-series', 'ssv-15000-3'),
    productImage('stonir', 'grainy-series', 'ssv-41000-2'),
    productImage('stonir', 'natural-series', 'ssv-3000-1'),
  ]
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-20 stage-glow" />
      <Picture image={range.identity.texture} className="!absolute inset-0 -z-20" imgClassName="h-full w-full object-cover opacity-25" alt="" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      <div className="pointer-events-none absolute right-[16%] top-[15%] -z-10 hidden h-[68%] w-[14%] lg:block" aria-hidden="true">
        {layers.map((im, i) => im && (
          <div key={im.src} className="absolute left-0 top-0 h-full overflow-hidden border border-line-2 shadow-2xl shadow-black" style={{ aspectRatio: im.width / im.height, transform: `translate(${(i - 1) * -38}%, ${(i - 1) * 6}%) rotate(${-6 + i * 4}deg)`, zIndex: i }}>
            <img src={im.src} alt="" className="h-full w-full object-cover" width={im.width} height={im.height} />
          </div>
        ))}
        <span className="absolute -left-[46%] top-[52%] z-10 h-[2px] w-[44%] bg-crimson" />
      </div>
      <div className="wrap flex min-h-[92svh] flex-col justify-end pb-16 pt-32 lg:pb-24">
        <Breadcrumbs items={crumbs} />
        <Reveal className="mt-10">
          <p className="eyebrow mb-6">{range.tagline}</p>
          <h1 className="font-display text-[clamp(4rem,14vw,11rem)] leading-[0.82] tracking-[0.04em]">{range.wordmark}</h1>
          <p className="display-sm mt-8 !normal-case italic text-paper/90">{range.headline}</p>
          <p className="lede mt-5">{range.summary}</p>
          <HeroCtas range={range} label="Explore Collections" />
        </Reveal>
      </div>
    </section>
  )
}

function FlowHero({ range, crumbs }) {
  // StonIT: a real installation behind a deep radial scrim, centred editorial composition.
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-line">
      <Picture image={range.identity.texture} priority className="!absolute inset-0 -z-20" imgClassName="h-full w-full object-cover opacity-70" alt="" />
      <div className="absolute inset-0 -z-10 scrim-radial" />
      <div className="wrap flex min-h-[92svh] flex-col pb-16 pt-28">
        <Breadcrumbs items={crumbs} />
        <Reveal className="my-auto py-16 text-center">
          <p className="eyebrow mb-8 justify-center">A {BRAND.name} range</p>
          <h1 className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.8] tracking-[0.08em]">{range.wordmark}</h1>
          <div className="mx-auto mt-10 h-[2px] w-16 bg-crimson" aria-hidden="true" />
          <p className="mt-8 text-[13px] uppercase tracking-[0.32em] text-paper">{range.tagline}</p>
          <p className="mt-3 font-display text-[1.35rem] italic text-mist">{range.headline}</p>
          <p className="lede mx-auto mt-6 text-center">{range.summary}</p>
          <HeroCtas range={range} label="Explore Designs" center />
        </Reveal>
      </div>
    </section>
  )
}

function CanvasHero({ range, crumbs }) {
  // Art-i: a real design presented as a framed canvas with a gallery-style label.
  const art = productImage('art-i-canvas-veneer', 'canvas-series', 'acv-13')
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-10 stage-glow" />
      <div className="wrap grid min-h-[92svh] items-center gap-12 pb-20 pt-28 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Breadcrumbs items={crumbs} />
          <Reveal className="mt-12">
            <p className="eyebrow mb-6">{range.tagline}</p>
            <h1 className="font-display leading-[0.85]">
              <span className="block text-[clamp(4rem,12vw,9rem)] tracking-[0.06em]">{range.wordmark}</span>
              <span className="mt-3 block text-[clamp(1.4rem,3vw,2.4rem)] uppercase tracking-[0.3em] text-mist">{range.wordmarkSub}</span>
            </h1>
            <p className="display-sm mt-8 !normal-case italic">{range.headline}</p>
            <p className="lede mt-5">{range.summary}</p>
            <HeroCtas range={range} label="Explore Designs" />
          </Reveal>
        </div>
        <Reveal delay={150} className="relative mx-auto w-full max-w-[440px]">
          <div className="border border-line-2 bg-coal-2 p-4 shadow-[0_50px_100px_-30px_rgb(0_0_0)] sm:p-6">
            <Picture image={art} priority aspect={0.5} imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 34vw, 100vw" alt="Art-i Canvas Veneer design ACV-13" />
          </div>
          <div className="absolute -bottom-6 left-4 border-l-2 border-crimson bg-ink px-5 py-3 sm:left-8">
            <p className="font-display text-[17px] uppercase tracking-[0.12em]">ACV-13</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ash">Canvas Series · 4′ × 8′</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function HeroCtas({ range, label, center }) {
  return (
    <div className={`mt-9 flex flex-wrap gap-3 ${center ? 'justify-center' : ''}`}>
      <ButtonLink to="#collections">{label}</ButtonLink>
      <ButtonLink to={`/partners?range=${range.slug}#enquiry`} variant="ghost">B2B Enquiry</ButtonLink>
    </div>
  )
}

const HEROES = { strata: StrataHero, flow: FlowHero, canvas: CanvasHero }

// Card shapes matched to each range's imagery, so nothing is zoomed to fit:
// Stonir sheets turn into wide strips; StonIT panels and Art-i designs stay portrait.
const SLOT = { stonir: 2.2, stonit: 0.55, 'art-i-canvas-veneer': 0.5 }
export const APP_SLOT = { stonir: 2, stonit: 4 / 3, 'art-i-canvas-veneer': 3 / 4 }

export default function RangePage() {
  const { range: slug } = useParams()
  const range = getRange(slug)
  if (!range) return <NotFound />

  const Hero = HEROES[range.identity.layout] || StrataHero
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: range.name }]
  const collections = collectionsFor(range.slug)
  const products = productsFor(range.slug)
  const apps = applicationsFor(range.slug).slice(0, 4)
  const docs = [...range.documents, ...collections.flatMap((c) => c.documents || [])].filter((d, i, a) => a.findIndex((x) => x.href === d.href) === i)
  const others = RANGES.filter((r) => r.slug !== range.slug)
  const vp = range.viewerProduct
  const cover = rangeCover(range)

  return (
    <>
      <Seo title={`${range.name} — ${range.tagline}`} path={`/products/${range.slug}`} description={`${range.summary} A ${BRAND.name} range by Sattva Sattvik Private Limited.`} image={cover?.src} />
      <Hero range={range} crumbs={crumbs} />

      {/* Introduction + key features */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <Reveal>
            <Eyebrow className="mb-6">Introduction</Eyebrow>
            <h2 className="display-lg">{range.name}</h2>
            <p className="mt-4 text-[11px] uppercase tracking-[0.26em] text-ash">A {BRAND.name} brand · A Sattva Sattvik company</p>
            {range.stats && (
              <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-line pt-6">
                {range.stats.map(([v, k]) => (
                  <div key={k}><dt className="sr-only">{k}</dt><dd className="font-display text-[2rem] leading-none text-crimson-hi">{v}</dd><p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-ash">{k}</p></div>
                ))}
              </dl>
            )}
          </Reveal>
          <Reveal delay={100}>
            {range.description.map((p) => <p key={p} className="lede mb-4 max-w-none">{p}</p>)}
          </Reveal>
        </div>

        {range.features.length > 0 && (
          <div className="wrap mt-16">
            <h3 className="eyebrow mb-8">Key features</h3>
            <ul className={`grid gap-px border border-line bg-line sm:grid-cols-2 ${range.features.length % 3 === 0 ? 'lg:grid-cols-3' : range.features.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}>
              {range.features.map((f, i) => (
                <Reveal as="li" key={f.title} delay={(i % 3) * 80} className="bg-ink p-7 lg:p-8">
                  <Icon name={f.icon} size={26} className="text-crimson-hi" />
                  <p className="display-sm mt-5">{f.title}</p>
                  <p className="mt-2 text-[14px] text-mist">{f.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Collections */}
      <section id="collections" className="section scroll-mt-20 border-t border-line bg-coal">
        <div className="wrap">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHead eyebrow={range.slug === 'stonit' ? 'Designs' : 'Collections'} title={range.slug === 'stonit' ? 'StonIT designs' : `${range.name} collections`} />
            <p className="text-[13px] text-ash">{products.length} products · {collections.length} {collections.length === 1 ? 'collection' : 'collections'}</p>
          </div>
          <ul className={`mt-12 grid gap-3 sm:gap-4 ${collections.length > 6 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {collections.map((c, i) => {
              const n = productsFor(range.slug, c.slug).length
              return (
                <Reveal as="li" key={c.slug} delay={(i % 4) * 60}>
                  <Link to={`/products/${range.slug}/${c.slug}`} className="group panel !bg-ink flex h-full flex-col hover:border-line-2">
                    <Picture image={collectionCover(c)} aspect={SLOT[range.slug]} imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 25vw, 50vw" alt={`${c.name} — ${range.name}`} />
                    <div className="flex flex-1 flex-col p-4 sm:p-6">
                      <p className={collections.length > 6 ? 'font-display text-[1.15rem] uppercase sm:text-[1.3rem]' : 'display-sm'}>{c.name}</p>
                      <p className="mt-1 text-[12px] text-ash">{n} {range.slug === 'stonit' ? (n === 1 ? 'colour' : 'colours') : (n === 1 ? 'design' : 'designs')}</p>
                      {c.description && collections.length <= 6 && <p className="mt-3 flex-1 text-[14px] text-mist">{c.description}</p>}
                      <span className="link-arrow mt-4">View<Icon name="ArrowRight" size={14} strokeWidth={1.75} /></span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Real-time 3D preview, built from a real product photograph */}
      <section className="section border-t border-line" aria-labelledby="viewer-h">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ProductViewer config={range.viewer} title={`${range.name} — 3D preview`} />
          <Reveal>
            <Eyebrow className="mb-6">Interactive 3D</Eyebrow>
            <h2 id="viewer-h" className="display-md">See the surface in 3D.</h2>
            <p className="mt-5 text-[14.5px] leading-relaxed text-mist">
              Every {range.name} product page includes a real-time 3D panel built from that product’s own catalogue photograph — drag to rotate, pinch or scroll to zoom.
            </p>
            {range.viewer.flex && <p className="mt-4 text-[14.5px] leading-relaxed text-mist">The gentle bend reflects the flexible veneer format.</p>}
            {vp && <ArrowLink to={`/products/${range.slug}/${vp.collection}/${vp.slug}`} className="mt-7">View this product</ArrowLink>}
          </Reveal>
        </div>
      </section>

      {/* Technical specifications */}
      {range.specs?.length > 0 && (
        <section id="specifications" className="section scroll-mt-20 border-t border-line bg-coal">
          <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <SectionHead eyebrow="Technical information" title="Specifications." lede={`As published in the ${range.name} catalogue.`} />
            <div>
              <dl className="border-t border-line">
                {range.specs.map(([k, v]) => (
                  <div key={k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-ash">{k}</dt>
                    <dd className="text-[15px]">{v}</dd>
                  </div>
                ))}
              </dl>
              {range.tests && (
                <div className="mt-12">
                  <h3 className="eyebrow mb-5">Test report</h3>
                  <div className="overflow-x-auto border border-line">
                    <table className="w-full min-w-[520px] text-left text-[14px]">
                      <thead className="bg-ink text-[10.5px] uppercase tracking-[0.18em] text-ash">
                        <tr><th scope="col" className="p-4 font-medium">Test</th><th scope="col" className="p-4 font-medium">Method</th><th scope="col" className="p-4 font-medium">Result</th></tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {range.tests.map(([t, m, r]) => (
                          <tr key={t}><th scope="row" className="p-4 font-normal">{t}</th><td className="p-4 text-mist">{m}</td><td className="p-4">{r}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Where to use */}
      {range.uses && (
        <section className="section border-t border-line" aria-labelledby="uses-h">
          <div className="wrap">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHead eyebrow="Applications" title={<span id="uses-h">Where to use {range.name}.</span>} />
              <ArrowLink to={`/applications#${range.slug}`}>All {range.name} applications</ArrowLink>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(range.uses).map(([group, list]) => (
                <div key={group}>
                  <h3 className="mb-4 border-b border-crimson/60 pb-3 text-[11px] font-semibold uppercase tracking-[0.22em]">{group}</h3>
                  <ul className="space-y-2 text-[14.5px] text-mist">{list.map((u) => <li key={u}>{u}</li>)}</ul>
                </div>
              ))}
            </div>
            {apps.length > 0 && (
              <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {apps.map((a) => (
                  <li key={a.image.src}>
                    <Link to={a.to} className="group block">
                      <Picture image={a.image} aspect={APP_SLOT[range.slug]} className="border border-line" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 25vw, 50vw" alt={a.image.alt} />
                      <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-mist group-hover:text-paper">{a.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Installation + downloads */}
      <section className="section border-t border-line bg-coal">
        <div className={`wrap grid gap-12 ${range.installation ? 'lg:grid-cols-[1.4fr_1fr]' : ''} lg:gap-16`}>
          {range.installation && (
            <div id="installation" className="scroll-mt-24">
              <SectionHead eyebrow="Installation" title="Installation guide." />
              <ol className="mt-10 space-y-px border border-line bg-line">
                {range.installation.map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[3rem_1fr] gap-2 bg-ink p-5 sm:p-6">
                    <span className="font-display text-[1.3rem] text-crimson-hi">{String(i + 1).padStart(2, '0')}</span>
                    <div><p className="text-[12px] font-semibold uppercase tracking-[0.16em]">{t}</p><p className="mt-1.5 text-[14px] text-mist">{d}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div id="catalogues" className="scroll-mt-24">
            <SectionHead eyebrow="Catalogues & shade cards" title="Get the catalogue." />
            <div className="mt-10"><DocRequestList docs={docs} /></div>
            <p className="mt-4 text-[12px] text-ash">We’ll send the PDF to you on WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* Other ranges */}
      <section className="border-t border-line">
        <div className="wrap grid sm:grid-cols-2">
          {others.map((r, i) => {
            const im = rangeCover(r)
            return (
              <Link key={r.slug} to={`/products/${r.slug}`} className={`group relative isolate overflow-hidden py-14 sm:px-10 ${i ? 'border-line sm:border-l' : ''}`}>
                {im && <img src={im.srcSmall} alt="" loading="lazy" width={im.width} height={im.height} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-30" />}
                <p className="text-[10.5px] uppercase tracking-[0.26em] text-ash">{i === 0 ? 'Also in the portfolio' : 'Explore next'}</p>
                <p className="display-md mt-3">{r.wordmark}{r.wordmarkSub ? ` ${r.wordmarkSub}` : ''}</p>
                <p className="mt-1 text-[13px] text-mist">{r.tagline}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <CtaBand
        eyebrow={`${range.name} for your business`}
        title="Become a B2B partner."
        text={`Dealers, distributors and project teams — enquire about supplying ${range.name}.`}
        primary={{ to: `/partners?range=${range.slug}#enquiry`, label: 'Send B2B Enquiry' }}
        secondary={{ to: `/contact?type=catalogue&range=${range.slug}`, label: 'Request Samples & Pricing' }}
      />
    </>
  )
}
