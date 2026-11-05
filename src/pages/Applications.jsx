import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Reveal from '../components/ui/Reveal'
import Picture, { slotAspect } from '../components/ui/Picture'
import { ArrowLink, ButtonLink, Eyebrow } from '../components/ui/Bits'
import PageHero from '../components/sections/PageHero'
import { CtaBand } from '../components/sections/Blocks'
import { RANGES } from '../data/ranges'
import { applicationsFor } from '../data/catalog'
import { tex } from '../data/media'

// Applications, organised by product range. "Where to use" lists come from each range's
// catalogue; images are application photos/visuals from the same catalogues.
export default function Applications() {
  return (
    <>
      <Seo
        title="Applications by Product"
        path="/applications"
        description="Where to use Stonir flexible stone veneer, StonIT FRP rock panels and Art-i Canvas Veneer — interior and exterior applications from each range’s catalogue."
      />
      <PageHero
        eyebrow="Applications"
        title={<>Where surfaces<br />create spaces</>}
        lede="Each range is made for different spaces. Explore applications by product — from feature walls and facades to bar counters, ceilings and pooja rooms."
        image={tex.marbleDark}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Applications' }]}
      />

      {/* Range switcher */}
      <nav aria-label="Applications by product" className="sticky top-[72px] z-30 border-b border-line bg-ink/90 backdrop-blur">
        <ul className="wrap no-scrollbar flex gap-8 overflow-x-auto py-4 text-[11px] uppercase tracking-[0.2em] text-mist">
          {RANGES.map((r) => <li key={r.slug} className="shrink-0"><a href={`#${r.slug}`} className="hover:text-paper">{r.name}</a></li>)}
        </ul>
      </nav>

      {RANGES.map((r, idx) => {
        const gallery = applicationsFor(r.slug)
        const art = r.slug === 'art-i-canvas-veneer'
        return (
          <section key={r.slug} id={r.slug} className={`section scroll-mt-32 border-b border-line ${idx % 2 ? 'bg-coal' : ''}`} aria-labelledby={`${r.slug}-apps`}>
            <div className="wrap">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
                <Reveal>
                  <Eyebrow className="mb-5">{r.tagline}</Eyebrow>
                  <h2 id={`${r.slug}-apps`} className="display-lg">{r.name}</h2>
                  <p className="lede mt-5">{r.summary}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink to={`/products/${r.slug}`}>Explore {r.name}</ButtonLink>
                    <ButtonLink to={`/contact?type=product&range=${r.slug}`} variant="ghost">Discuss your project</ButtonLink>
                  </div>
                </Reveal>
                <Reveal delay={80} className="grid gap-8 sm:grid-cols-2">
                  {Object.entries(r.uses || {}).filter(([g]) => g !== 'Applied on').map(([group, list]) => (
                    <div key={group}>
                      <h3 className="mb-4 border-b border-crimson/60 pb-3 text-[11px] font-semibold uppercase tracking-[0.22em]">{group === 'Spaces' ? 'Suitable spaces' : `${group} uses`}</h3>
                      <ul className="space-y-2 text-[14.5px] text-mist">
                        {list.map((u) => <li key={u} className="flex gap-2"><span className="mt-[11px] h-px w-3 shrink-0 bg-crimson" aria-hidden="true" />{u}</li>)}
                      </ul>
                    </div>
                  ))}
                </Reveal>
              </div>

              {gallery.length > 0 && (
                <ul className={`mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 ${art ? 'lg:grid-cols-6' : 'lg:grid-cols-4'}`}>
                  {gallery.map((a, i) => (
                    <Reveal as="li" key={a.image.src} delay={(i % 4) * 50}>
                      <Link to={a.to} className="group block">
                        <Picture image={a.image} aspect={slotAspect(gallery.map((g) => g.image))} className="border border-line" imgClassName="h-full w-full object-cover" sizes="(min-width:1024px) 25vw, 50vw" alt={a.image.alt} />
                        <p className="mt-2.5 text-[12.5px] uppercase tracking-[0.12em] text-paper group-hover:text-crimson-hi">{a.title}</p>
                        {(a.subtitle || a.area) && <p className="text-[12px] text-ash">{a.subtitle || a.area}</p>}
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-col gap-3 text-[12px] text-ash sm:flex-row sm:items-center sm:justify-between">
                <p>{r.slug === 'stonir' ? 'Project photographs from the Stonir catalogue.' : 'Application visuals from the catalogue — tap one to see the product.'}</p>
                <ArrowLink to={`/products/${r.slug}`} className="shrink-0">All {r.name} products</ArrowLink>
              </div>
            </div>
          </section>
        )
      })}

      <CtaBand eyebrow="Project enquiry" title="Tell us about your space." text="Share your application and we’ll suggest the right range, design and format." primary={{ to: '/contact?type=product', label: 'Discuss your project' }} secondary={{ to: '/resources', label: 'Catalogues' }} />
    </>
  )
}
