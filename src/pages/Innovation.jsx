import Seo from '../components/ui/Seo'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'
import { ArrowLink } from '../components/ui/Bits'
import PageHero from '../components/sections/PageHero'
import { CtaBand, SectionHead } from '../components/sections/Blocks'
import { RND } from '../data/content'
import { COMPANY } from '../data/site'
import { tex } from '../data/media'

export default function Innovation() {
  return (
    <>
      <Seo
        title="R&D / Innovation"
        path="/innovation"
        description="Sattva Sattvik continuously develops and explores new surface-material possibilities for architecture and interiors — new materials, finishes, formats and prototypes."
      />
      <PageHero
        eyebrow="R&D / Innovation"
        title={<>Materials. Research.<br />Possibility.</>}
        lede={`${COMPANY.shortName} continuously develops and explores new surface-material possibilities for architecture and interiors.`}
        image={tex.marbleCrimson}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'R&D / Innovation' }]}
      />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Product development" title="Where new surfaces begin." lede="As the parent and manufacturing company, R&D is central to how Sattva Sattvik grows the Ston-i portfolio." />
          <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {RND.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 80} className="bg-ink p-8">
                <Icon name={r.icon} size={28} className="text-crimson-hi" />
                <h3 className="display-sm mt-8">{r.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-mist">{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-line bg-coal">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="display-lg">Innovation today.<br />Better surfaces tomorrow.</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">The Ston-i Surfaces portfolio is designed to grow. New categories developed by our team can join Stonir, StonIT and Art-i Canvas Veneer as future brands.</p>
            <div className="mt-8 flex flex-wrap gap-8">
              <ArrowLink to="/products#future-brands">Future brands</ArrowLink>
              <ArrowLink to="/manufacturing">Manufacturing</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand eyebrow="Collaborate" title="Have a surface requirement?" text="Architects, designers and project teams — tell us what you need. Our product-development team is listening." primary={{ to: '/contact?type=product', label: 'Request Product Information' }} />
    </>
  )
}
