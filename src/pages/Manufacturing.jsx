import Seo from '../components/ui/Seo'
import Picture from '../components/ui/Picture'
import Reveal from '../components/ui/Reveal'
import { Pending, ButtonLink } from '../components/ui/Bits'
import PageHero from '../components/sections/PageHero'
import { CtaBand, MissionPanel, ProcessSteps, SectionHead } from '../components/sections/Blocks'
import { COMPANY } from '../data/site'
import { tex } from '../data/media'

// Real facility photography goes here: { src, alt, width, height, caption }.
const FACILITY_PHOTOS = []

export default function Manufacturing() {
  return (
    <>
      <Seo
        title="Manufacturing"
        path="/manufacturing"
        description="Ston-i Surfaces products are manufactured by Sattva Sattvik Private Limited in Jaipur, Rajasthan — from material preparation and processing to quality checks, finishing, packing and dispatch."
      />
      <PageHero
        eyebrow="Manufacturing"
        title={<>Built in Jaipur.<br />Growing across India.</>}
        lede={`Our manufacturing facility in ${COMPANY.city} is the foundation of our business. We don’t merely trade these products — we manufacture and develop them.`}
        image={tex.stonit}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Manufacturing' }]}
      />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Our process" title="From material to dispatch." lede="The stages every order moves through. Range-specific processes differ and are documented per product." />
          <div className="mt-16"><ProcessSteps /></div>
        </div>
      </section>

      <section className="section border-t border-line bg-coal">
        <div className="wrap grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {FACILITY_PHOTOS.length ? (
            <ul className="grid grid-cols-2 gap-3">
              {FACILITY_PHOTOS.map((p) => (
                <li key={p.src}><Picture image={p} className="aspect-[4/3]" imgClassName="h-full w-full object-cover" /></li>
              ))}
            </ul>
          ) : (
            <Pending title="Inside the facility" action={<ButtonLink to="/contact?type=general" variant="ghost">Arrange a visit enquiry</ButtonLink>}>
              Photography of our Jaipur facility, machinery and team will be published here. Partners are welcome to enquire about the facility directly.
            </Pending>
          )}
          <Reveal className="panel flex flex-col justify-between p-8">
            <div>
              <h2 className="display-sm">Quality at every step</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-mist">Inspection is built into production — from incoming materials to finishing and packing — so partners receive consistent product.</p>
            </div>
            <div className="mt-8 h-[2px] w-12 bg-crimson" aria-hidden="true" />
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead eyebrow="Manufactured by" title={COMPANY.legalName} />
          <div className="mt-12"><MissionPanel /></div>
        </div>
      </section>

      <CtaBand title="Supply for your market." text="Talk to us about becoming a dealer or distributor for Ston-i Surfaces." />
    </>
  )
}
