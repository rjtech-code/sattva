import { Link, useParams } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Picture, { slotAspect } from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import { ArrowLink, Breadcrumbs, ButtonLink, Eyebrow } from '../components/ui/Bits'
import { CtaBand, ItalyBadge, SectionHead } from '../components/sections/Blocks'
import ProductViewer from '../components/viewer/ProductViewer'
import { DocRequestList } from '../components/CatalogueRequest'
import NotFound from './NotFound'
import { RANGES, getRange } from '../data/ranges'
import { applicationsFor, collectionCover, collectionsFor, productsFor, rangeCover } from '../data/catalog'
import { BRAND } from '../data/site'

/* One consistent, split editorial hero for every product range. */
function StrataHero({ range, crumbs }) {
  const products = productsFor(range.slug)
  const featured = products.filter((product) => product.images?.length).slice(0, 3)

  const layers = featured.filter(Boolean).map((product) => {
    const image = product.images[0]
    return {
      image,
      to: `/products/${range.slug}/${product.collection}/${product.slug}`,
      label: product.code || product.name,
    }
  })

  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-20 stage-glow" />
      <Picture image={range.identity.texture} className="!absolute inset-0 -z-20" imgClassName="h-full w-full object-cover opacity-25" alt="" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <div className="wrap grid min-h-[92svh] items-center gap-10 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20">
        <div className="relative z-10">
          <Breadcrumbs items={crumbs} />
          <Reveal className="mt-10">
            <ItalyBadge className="mb-6" />
            <p className="eyebrow mb-6">{range.tagline}</p>
            <h1 className="font-display text-[clamp(4rem,13vw,10rem)] leading-[0.82] tracking-[0.035em]">{range.wordmark}</h1>
            {range.wordmarkSub && <p className="mt-3 font-display text-[clamp(1.4rem,3vw,2.4rem)] uppercase tracking-[0.22em] text-mist">{range.wordmarkSub}</p>}
            <p className="display-sm mt-8 !normal-case italic text-paper/90">{range.headline}</p>
            <p className="lede mt-5">{range.summary}</p>
            <HeroCtas range={range} label={range.slug === 'stonir' ? 'Explore Collections' : 'Explore Designs'} />
          </Reveal>
        </div>
        <Reveal delay={150} className="relative mx-auto h-[390px] w-full max-w-[570px] sm:h-[480px] lg:h-[560px]">
          {layers.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              aria-label={`View ${range.name} ${item.label}`}
              className="material-stack-card group absolute top-[5%] h-[88%] w-[43%] overflow-hidden border border-line-2 bg-coal-2 shadow-2xl shadow-black transition-transform duration-500 hover:z-20 hover:scale-[1.025] focus-visible:z-20"
              style={{ left: `${8 + i * 17}%`, transform: `translateY(${i * 5}%) rotate(${-6 + i * 5}deg)`, zIndex: i + 1, animationDelay: `${i * 180}ms` }}
            >
              <Picture image={item.image} className="absolute inset-0 h-full w-full" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 24vw, 43vw" alt={`${range.name} ${item.label}`} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-4 pt-12 text-[10px] uppercase tracking-[0.18em] text-white sm:px-4 sm:text-[11px]">{item.label}</span>
            </Link>
          ))}
          <span className="pointer-events-none absolute left-0 top-[52%] z-10 h-[2px] w-[25%] bg-crimson" />
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

const HEROES = { strata: StrataHero, flow: StrataHero, canvas: StrataHero }

// Card shapes are the average shape of the images they show (slotAspect), so they fill with
// little or no cropping. Stonir sheets are laid landscape (rotated) as wide strips.
const LANDSCAPE_COVERS = { stonir: true }

export default function RangePage() {
  const { range: slug } = useParams()
  return <RangePageContent key={slug} slug={slug} />
}

function RangePageContent({ slug }) {
  const range = getRange(slug)
  if (!range) return <NotFound />

  const Hero = HEROES[range.identity.layout] || StrataHero
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: range.name }]
  const collections = collectionsFor(range.slug)
  const products = productsFor(range.slug)
  const featuredCanvasDesigns = range.slug === 'art-i-canvas-veneer' ? products.slice(1, 4) : []
  const apps = applicationsFor(range.slug).slice(0, 4)
  const appAspect = slotAspect(apps.map((a) => a.image))
  const coverAspect = slotAspect(collections.map((c) => collectionCover(c)), { landscape: !!LANDSCAPE_COVERS[range.slug] })
  const docs = [...range.documents, ...collections.flatMap((c) => c.documents || [])].filter((d, i, a) => a.findIndex((x) => x.href === d.href) === i)
  const others = RANGES.filter((r) => r.slug !== range.slug)
  const vp = range.viewerProduct
  const cover = rangeCover(range)

  return (
    <>
      <Seo
        title={`${range.name} — ${range.tagline}`}
        path={`/products/${range.slug}`}
        description={`${range.summary} A ${BRAND.name} range by Sattva Sattvik Private Limited.`}
        image={cover?.src}
        schema={[{
          '@type': 'ItemList',
          name: `${range.name} products`,
          numberOfItems: products.length,
          itemListElement: products.slice(0, 100).map((p, i) => ({
            '@type': 'ListItem', position: i + 1, name: p.code || p.name || p.slug,
            item: `/products/${p.range}/${p.collection}/${p.slug}`,
          })),
        }]}
      />
      <Hero range={range} crumbs={crumbs} />

      {/* Real-time 3D preview, built from a real product photograph */}
      <section className="section border-t border-line" aria-labelledby="viewer-h">
        <div className="wrap grid items-stretch gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ProductViewer config={range.viewer} title={`${range.name} — 3D preview`} className="h-[380px] sm:h-[460px] lg:h-[520px]" />
          <Reveal className="flex flex-col justify-center py-4">
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


      {/* Introduction + key features */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <Reveal>
            <Eyebrow className="mb-6">Introduction</Eyebrow>
            <h2 className="display-lg">{range.name}</h2>
            <p className="mt-4 text-[11px] uppercase tracking-[0.26em] text-ash">A {BRAND.name} brand · Designed in Italy · Made in India</p>
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
            <SectionHead eyebrow={range.slug === 'stonit' || featuredCanvasDesigns.length ? 'Designs' : 'Collections'} title={range.slug === 'stonit' ? 'StonIT designs' : featuredCanvasDesigns.length ? 'Canvas collection' : `${range.name} collections`} />
            <p className="text-[13px] text-ash">{featuredCanvasDesigns.length ? `${products.length} designs · 1 collection` : `${products.length} products · ${collections.length} ${collections.length === 1 ? 'collection' : 'collections'}`}</p>
          </div>
          {featuredCanvasDesigns.length > 0 ? (
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCanvasDesigns.map((product, i) => {
                const image = product.images?.find((im) => im.alt === 'design') || product.images?.[0]
                return (
                  <Reveal as="li" key={product.slug} delay={i * 70}>
                    <Link to={`/products/${range.slug}/${product.collection}/${product.slug}`} className="group panel !bg-ink flex h-full flex-col hover:border-line-2">
                      <Picture image={image} aspect={coverAspect} imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 33vw, 100vw" alt={`${product.code || product.name} — Canvas Series`} />
                      <div className="flex flex-1 items-center justify-between gap-4 p-5 sm:p-6">
                        <div><p className="display-sm">{product.code || product.name}</p><p className="mt-1 text-[12px] text-ash">Canvas Series · 4′ × 8′</p></div>
                        <span className="link-arrow shrink-0">View<Icon name="ArrowRight" size={14} strokeWidth={1.75} /></span>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </ul>
          ) : (
          <ul className={`mt-12 grid gap-3 sm:gap-4 ${collections.length > 6 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {collections.map((c, i) => {
              const n = productsFor(range.slug, c.slug).length
              return (
                <Reveal as="li" key={c.slug} delay={(i % 4) * 60}>
                  <Link to={`/products/${range.slug}/${c.slug}`} className="group panel !bg-ink flex h-full flex-col hover:border-line-2">
                    <Picture image={collectionCover(c)} aspect={coverAspect} imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 25vw, 50vw" alt={`${c.name} — ${range.name}`} />
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
          )}
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
                      <Picture image={a.image} aspect={appAspect} className="border border-line" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 25vw, 50vw" alt={a.image.alt} />
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
