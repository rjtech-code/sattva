import { SITE_URL, BRAND, COMPANY, CONTACT } from '../../data/site'

const absolute = (value) => value?.startsWith('http') ? value : value ? `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}` : undefined

export default function Seo({ title, description, path, image = '/textures/marble-crimson.webp', noindex = false, schema = [] }) {
  const fullTitle = title ? `${title} | ${BRAND.name}` : `${BRAND.name} — Italian-Designed Architectural Surfaces`
  const url = path != null && !noindex ? absolute(path) : null
  const img = absolute(image)
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: COMPANY.legalName,
      legalName: COMPANY.legalName,
      url: SITE_URL,
      logo: absolute('/favicon.svg'),
      address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' },
      contactPoint: CONTACT.phone ? [{ '@type': 'ContactPoint', telephone: CONTACT.phone, contactType: 'sales', areaServed: 'IN' }] : undefined,
      sameAs: CONTACT.social.map((item) => item.href),
      brand: { '@id': `${SITE_URL}/#brand` },
    },
    {
      '@type': 'Brand',
      '@id': `${SITE_URL}/#brand`,
      name: BRAND.name,
      url: SITE_URL,
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND.name,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-IN',
    },
    ...(url ? [{
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: fullTitle,
      description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#brand` },
      inLanguage: 'en-IN',
    }] : []),
    ...schema,
  ].filter(Boolean)
  const normalizeSchema = (value, key = '') => {
    if (Array.isArray(value)) return value.map((item) => normalizeSchema(item, key))
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeSchema(v, k)]))
    if (typeof value === 'string' && ['url', 'image', 'item'].includes(key) && value.startsWith('/')) return absolute(value)
    return value
  }
  const cleanGraph = normalizeSchema(JSON.parse(JSON.stringify(graph)))
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      {img && <meta property="og:image" content={img} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {img && <meta name="twitter:image" content={img} />}
      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': cleanGraph }).replace(/</g, '\\u003c')}</script>
    </>
  )
}
