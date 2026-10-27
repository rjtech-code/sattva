import { SITE_URL, BRAND } from '../../data/site'

// React 19 hoists <title>, <meta> and <link> into <head>, so each route sets its own.
export default function Seo({ title, description, path, image = '/textures/marble-crimson.webp', noindex }) {
  const fullTitle = title ? `${title} | ${BRAND.name}` : `${BRAND.name} — Architectural Surface Materials by Sattva Sattvik`
  const url = SITE_URL && path != null ? `${SITE_URL}${path}` : null
  const img = SITE_URL ? `${SITE_URL}${image}` : image
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
