import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Picture from '../components/ui/Picture'
import { Breadcrumbs, ButtonLink, Eyebrow } from '../components/ui/Bits'
import { CtaBand } from '../components/sections/Blocks'
import NotFound from './NotFound'
import { getRange } from '../data/ranges'
import { getCollection, productsFor } from '../data/catalog'

export default function CollectionPage() {
  const { range: rangeSlug, collection: slug } = useParams()
  const range = getRange(rangeSlug)
  const collection = range && getCollection(range.slug, slug)
  if (!collection) return <NotFound />

  const products = productsFor(range.slug, collection.slug)
  const path = `/products/${range.slug}/${collection.slug}`

  return (
    <>
      <Seo
        title={`${collection.name} — ${range.name}`}
        path={path}
        description={collection.description || `${collection.name}, a ${range.name} (${range.tagline}) collection by Ston-i Surfaces.`}
        image={collection.image?.src}
      />
      <section className="border-b border-line pt-32">
        <div className="wrap pb-14">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: range.name, to: `/products/${range.slug}` }, { label: collection.name }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <Eyebrow className="mb-5">{range.name} · {range.tagline}</Eyebrow>
              <h1 className="display-xl">{collection.name}</h1>
              {collection.description && <p className="lede mt-6">{collection.description}</p>}
              <p className="mt-4 text-[12px] uppercase tracking-[0.2em] text-ash">{products.length} {range.slug === 'stonit' ? 'colours' : 'designs'}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink to={`/partners?range=${range.slug}#enquiry`}>Enquire</ButtonLink>
              <ButtonLink to={`/products/${range.slug}`} variant="ghost" arrow={false}>All {range.name}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {products.length ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link to={`${path}/${p.slug}`} className="group block border border-line bg-coal hover:border-line-2">
                    {p.images?.[0] ? (
                      <Picture image={p.images[0]} className="aspect-[3/4]" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 20vw, 50vw" alt={`${range.name} ${p.code || p.name}`} />
                    ) : (
                      <div className="flex aspect-[3/4] items-center justify-center text-[12px] text-ash">Image pending</div>
                    )}
                    <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                      <p className="font-display text-[16px] tracking-[0.04em] sm:text-[18px]">{p.code || p.specs?.Colour || p.name}</p>
                      {p.backlit && <span className="text-[9.5px] uppercase tracking-[0.16em] text-crimson-hi">Backlit</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-mist">Products in this collection are being added.</p>
          )}
          {collection.documents?.length > 0 && (
            <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
              {collection.documents.map((d) => (
                <li key={d.href}><a href={d.href} target="_blank" rel="noopener noreferrer" className="link-arrow">Download {d.label} · PDF {d.size}<ArrowRight size={14} aria-hidden="true" /></a></li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  )
}
