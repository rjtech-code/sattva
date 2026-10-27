import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Download } from 'lucide-react'
import Seo from '../components/ui/Seo'
import { Breadcrumbs, ButtonLink, Eyebrow } from '../components/ui/Bits'
import ProductViewer from '../components/viewer/ProductViewer'
import NotFound from './NotFound'
import { getRange } from '../data/ranges'
import { getCollection, getProduct, productsFor } from '../data/catalog'

const VIEW_LABEL = { 'natural light': 'Natural light', backlit: 'Backlit', application: 'Application', panel: 'Panel', design: 'Design' }

export default function ProductPage() {
  const { range: r, collection: c, product: p } = useParams()
  const range = getRange(r)
  const collection = range && getCollection(range.slug, c)
  const product = collection && getProduct(range.slug, collection.slug, p)
  const [shot, setShot] = useState(0)
  if (!product) return <NotFound />

  const base = `/products/${range.slug}/${collection.slug}`
  const siblings = productsFor(range.slug, collection.slug)
  const idx = siblings.findIndex((s) => s.slug === product.slug)
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length]
  const next = siblings[(idx + 1) % siblings.length]
  const images = product.images || []
  const title = product.code || product.name
  const fullName = `${range.name} ${product.code ? `${collection.name} ${product.code}` : product.name}`
  const specs = Object.entries(product.specs || {}).filter(([, v]) => v != null && String(v).trim() !== '')
  const current = images[shot]
  // Real-time 3D only for the product's own swatch photo; application photos stay as photos.
  const viewer = current && current.alt !== 'application' ? { kind: 'slab', texture: current.src, flex: range.viewer?.flex, depth: range.viewer?.depth } : null
  const related = siblings.filter((s) => s.slug !== product.slug).slice(0, 8)

  return (
    <>
      <Seo
        title={`${fullName} — ${range.tagline}`}
        path={`${base}/${product.slug}`}
        description={`${title} from the ${collection.name} collection — ${range.name}, ${range.tagline}, by Ston-i Surfaces.${specs.length ? ' ' + specs.map(([k, v]) => `${k}: ${v}`).join('. ') + '.' : ''}`}
        image={images[0]?.src}
      />
      <div className="pt-28">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'Products', to: '/products' }, { label: range.name, to: `/products/${range.slug}` }, { label: collection.name, to: base }, { label: title }]} />
        </div>
      </div>

      <section className="section !pt-10">
        <div className="wrap grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <ProductViewer key={shot} config={viewer} photo={current && { ...current, alt: `${fullName} — ${VIEW_LABEL[current.alt] || 'photo'}` }} title={fullName} />
            {images.length > 1 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Product views">
                {images.map((im, i) => (
                  <li key={im.src}>
                    <button type="button" onClick={() => setShot(i)} aria-pressed={shot === i} className={`flex items-center gap-3 border p-1.5 pr-4 text-[11px] uppercase tracking-[0.16em] ${shot === i ? 'border-crimson text-paper' : 'border-line text-mist hover:text-paper'}`}>
                      <img src={im.srcSmall} alt="" className="h-12 w-12 object-cover" loading="lazy" width="48" height="48" />
                      {VIEW_LABEL[im.alt] || `View ${i + 1}`}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {siblings.length > 1 && (
              <div className="mt-6 flex items-center justify-between text-[12px] text-mist">
                <Link to={`${base}/${prev.slug}`} className="flex items-center gap-1.5 hover:text-paper"><ArrowLeft size={14} aria-hidden="true" />{prev.code || prev.name}</Link>
                <span className="text-ash">{idx + 1} / {siblings.length}</span>
                <Link to={`${base}/${next.slug}`} className="flex items-center gap-1.5 hover:text-paper">{next.code || next.name}<ArrowRight size={14} aria-hidden="true" /></Link>
              </div>
            )}
          </div>

          <div>
            <Eyebrow className="mb-5">{range.name} · {collection.name}</Eyebrow>
            <h1 className="display-lg">{title}</h1>
            <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-ash">{range.tagline}</p>
            {collection.description && <p className="lede mt-6">{collection.description}</p>}
            {product.backlit && <p className="mt-4 border-l-2 border-crimson pl-4 text-[14px] text-mist">Shown in natural light and backlit — switch views below the image.</p>}

            {specs.length > 0 && (
              <dl className="mt-8 border-t border-line">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[minmax(0,8rem)_1fr] gap-4 border-b border-line py-3 text-[14px]">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-ash">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to={`/contact?type=product&range=${range.slug}&product=${encodeURIComponent(`${range.name} ${title}`)}`}>Enquire about {title}</ButtonLink>
              <ButtonLink to={`/products/${range.slug}#specifications`} variant="ghost" arrow={false}>Range specifications</ButtonLink>
            </div>

            {collection.documents?.length > 0 && (
              <ul className="mt-10 divide-y divide-line border-y border-line">
                {collection.documents.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 py-3 text-[14px] hover:text-crimson-hi">
                      <span className="flex items-center gap-3"><Download size={15} aria-hidden="true" className="text-crimson-hi" />{d.label}</span>
                      <span className="shrink-0 text-[12px] text-ash">PDF · {d.size}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section border-t border-line bg-coal !py-16">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-sm">More from {collection.name}</h2>
              <Link to={base} className="link-arrow shrink-0">View all<ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
            <ul className="no-scrollbar -mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
              {related.map((s) => (
                <li key={s.slug} className="w-[38%] shrink-0 snap-start sm:w-auto">
                  <Link to={`${base}/${s.slug}`} className="group block">
                    <div className="media-frame aspect-[3/4] border border-line"><img src={s.images[0].srcSmall} alt={`${range.name} ${s.code || s.name}`} loading="lazy" width={s.images[0].width} height={s.images[0].height} /></div>
                    <p className="mt-2 text-[12px] tracking-[0.06em] text-mist group-hover:text-paper">{s.code || s.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
