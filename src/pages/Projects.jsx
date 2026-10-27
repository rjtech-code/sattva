import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Picture from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import { ButtonLink, Pending } from '../components/ui/Bits'
import PageHero from '../components/sections/PageHero'
import { CtaBand, SectionHead } from '../components/sections/Blocks'
import { PROJECTS } from '../data/content'
import { RANGES } from '../data/ranges'
import { tex } from '../data/media'

const JOURNEY = [
  { k: 'Product', v: 'Choose a range and design from the Ston-i portfolio.' },
  { k: 'Material detail', v: 'Inspect the surface, finish and format.' },
  { k: 'Application', v: 'Match it to walls, furniture or architectural elements.' },
  { k: 'Finished space', v: 'See how the material translates into a real project.' },
]

export default function Projects() {
  return (
    <>
      <Seo
        title="Projects & Inspiration"
        path="/projects"
        description="Ston-i Surfaces in architectural context — from product and material detail to application and finished space."
      />
      <PageHero
        eyebrow="Projects & Inspiration"
        title={<>Ideas. Materials.<br />Real spaces.</>}
        lede="Explore how our surface materials are used in architectural and interior projects across India."
        image={tex.marbleDark}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Projects' }]}
      />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="From sample to space" title="Product → Application → Finished space." />
          <ol className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((j, i) => (
              <Reveal as="li" key={j.k} delay={i * 80} className="bg-ink p-8">
                <span className="font-display text-crimson-hi">{String(i + 1).padStart(2, '0')}</span>
                <p className="display-sm mt-5">{j.k}</p>
                <p className="mt-3 text-[14px] text-mist">{j.v}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-line bg-coal">
        <div className="wrap">
          {PROJECTS.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((p) => (
                <li key={p.slug} className="panel">
                  <Picture image={p.images[0]} className="aspect-[4/3]" imgClassName="h-full w-full object-cover" />
                  <div className="p-6">
                    <p className="text-[10.5px] uppercase tracking-[0.22em] text-ash">{p.category}{p.location ? ` · ${p.location}` : ''}</p>
                    <p className="display-sm mt-2">{p.title}</p>
                    {p.caption && <p className="mt-2 text-[14px] text-mist">{p.caption}</p>}
                    <p className="mt-4 flex flex-wrap gap-3 text-[12px]">
                      {RANGES.filter((r) => p.ranges.includes(r.slug)).map((r) => <Link key={r.slug} to={`/products/${r.slug}`} className="link-arrow">{r.name}</Link>)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Pending
              title="Project gallery"
              action={<ButtonLink to="/contact?type=product">Share your project</ButtonLink>}
            >
              Completed projects featuring Stonir, StonIT and Art-i Canvas Veneer will be published here with approved photography and details. Working on a project? Tell us about it — our team can help you choose the right surface.
            </Pending>
          )}
        </div>
      </section>

      <CtaBand eyebrow="Interested in a project?" title="Let’s talk about your next space." text="Get in touch for product specifications, samples and support." primary={{ to: '/contact?type=product', label: 'Contact us' }} secondary={{ to: '/applications', label: 'Applications' }} />
    </>
  )
}
