import Picture from '../ui/Picture'
import Reveal from '../ui/Reveal'
import { Breadcrumbs, Eyebrow } from '../ui/Bits'

// Interior-page hero following the collage: copy on the left, imagery bleeding in from the right.
export default function PageHero({ eyebrow, title, lede, image, breadcrumbs, children, tall = false }) {
  return (
    <section className={`relative isolate overflow-hidden border-b border-line ${tall ? 'min-h-[88svh]' : 'min-h-[62svh]'} flex items-end`}>
      {image && (
        <Picture
          image={image}
          priority
          className="!absolute inset-0 -z-10 lg:left-[38%] opacity-90"
          imgClassName="h-full w-full object-cover"
          alt=""
        />
      )}
      <div className="absolute inset-0 -z-10 scrim-l" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 scrim-b" aria-hidden="true" />
      <div className="wrap pb-14 pt-32 lg:pb-20 lg:pt-40">
        {breadcrumbs && <div className="mb-8"><Breadcrumbs items={breadcrumbs} /></div>}
        <Reveal>
          {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
          <h1 className="display-xl max-w-4xl">{title}</h1>
          {lede && <p className="lede mt-7">{lede}</p>}
          {children && <div className="mt-9">{children}</div>}
        </Reveal>
      </div>
    </section>
  )
}
