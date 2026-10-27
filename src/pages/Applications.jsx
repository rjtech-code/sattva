import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Reveal from '../components/ui/Reveal'
import PageHero from '../components/sections/PageHero'
import { CtaBand } from '../components/sections/Blocks'
import { APPLICATIONS } from '../data/content'
import { RANGES } from '../data/ranges'
import { tex } from '../data/media'
import { productImage } from '../data/catalog'

const appImage = (a) => (a.image ? productImage(a.image[0], a.image[1], a.image[2], 1) : null)

const GROUPS = ['All', ...new Set(APPLICATIONS.map((a) => a.group))]
const TEXTURES = [tex.stonir, tex.marbleDark, tex.stonit, tex.arti, tex.marbleCrimson, tex.charcoal]

export default function Applications() {
  const [group, setGroup] = useState('All')
  const list = APPLICATIONS.filter((a) => group === 'All' || a.group === group)

  return (
    <>
      <Seo
        title="Applications"
        path="/applications"
        description="Application areas for Ston-i Surfaces materials — interior and feature walls, furniture, ceilings, partitions, hospitality, retail and more. Suitability is confirmed per product."
      />
      <PageHero
        eyebrow="Applications"
        title={<>Where surfaces<br />create spaces</>}
        lede="From walls to furniture, surface materials bring natural beauty and lasting character to a wide range of architectural applications."
        image={tex.stonir}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Applications' }]}
      />

      <section className="section">
        <div className="wrap">
          <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div role="group" aria-label="Filter applications" className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 md:mx-0 md:px-0">
              {GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={group === g}
                  onClick={() => setGroup(g)}
                  className={`relative shrink-0 pb-2 text-[11px] uppercase tracking-[0.2em] ${group === g ? 'text-paper after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-crimson' : 'text-ash hover:text-mist'}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="max-w-md text-[13px] text-ash">Application areas are those named in each range’s catalogue. Images are application visuals from the client catalogues. Confirm product suitability with our team for your project.</p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
            {list.map((a) => {
              const i = APPLICATIONS.indexOf(a)
              const photo = appImage(a)
              const ranges = RANGES.filter((r) => a.ranges.includes(r.slug))
              return (
                <Reveal as="li" key={a.slug} id={a.slug} className="scroll-mt-28">
                  <div className="group relative aspect-[4/3] overflow-hidden border border-line">
                    {photo ? (
                      <img src={photo.srcSmall} alt={`${a.title} — application visual`} loading="lazy" width={photo.width} height={photo.height} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                    ) : (
                      <img src={TEXTURES[i % TEXTURES.length].srcSmall} alt="" loading="lazy" width="960" height="600" className="theme-dim h-full w-full object-cover opacity-50" />
                    )}
                    <div className="absolute inset-0 scrim-b" />
                    {a.imageNote && <span className="illustrative-tag absolute right-2 top-2 !text-[8.5px]">{a.imageNote}</span>}
                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-ash">{a.group}</p>
                      <p className="mt-1 text-[13px] uppercase tracking-[0.14em] sm:text-[14px]">{a.title}</p>
                      {a.note && <p className="text-[11px] text-mist">{a.note}</p>}
                      {ranges.length > 0 && (
                        <p className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-mist">
                          {ranges.map((r) => <Link key={r.slug} to={`/products/${r.slug}`} className="underline-offset-4 hover:underline">{r.name}</Link>)}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section border-t border-line bg-coal">
        <div className="wrap grid gap-5 md:grid-cols-3">
          {RANGES.map((r) => (
            <Link key={r.slug} to={`/products/${r.slug}`} className="panel !bg-ink group p-7 hover:border-line-2">
              <p className="text-[10.5px] uppercase tracking-[0.24em] text-ash">Explore the range</p>
              <p className="display-sm mt-3">{r.name}</p>
              <p className="mt-1 text-[13px] text-mist">{r.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand eyebrow="Project enquiry" title="Real spaces. Lasting impressions." text="Tell us about your application and we’ll recommend the right range." primary={{ to: '/contact?type=product', label: 'Discuss your project' }} secondary={{ to: '/projects', label: 'Projects & Inspiration' }} />
    </>
  )
}
