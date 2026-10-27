import Seo from '../components/ui/Seo'
import { ArrowLink, ButtonLink } from '../components/ui/Bits'
import { tex } from '../data/media'

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[90svh] items-center overflow-hidden">
      <Seo title="Page not found" description="The page you were looking for could not be found." noindex />
      <img src={tex.marbleDark.src} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" width="1920" height="1200" />
      <div className="absolute inset-0 -z-10 scrim-l" />
      <div className="wrap py-32">
        <p className="font-display text-[clamp(5rem,16vw,11rem)] leading-none text-crimson-hi">404</p>
        <h1 className="display-lg mt-4">This surface doesn’t exist.</h1>
        <p className="lede mt-6">The page may have moved, or the link may be incorrect.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/">Back to home</ButtonLink>
          <ButtonLink to="/products" variant="ghost">Explore products</ButtonLink>
        </div>
        <ArrowLink to="/contact" className="mt-10">Contact us</ArrowLink>
      </div>
    </section>
  )
}
