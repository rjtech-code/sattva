// Generate route-specific initial HTML metadata, JSON-LD, robots.txt and sitemap.xml.
// The React app remains client-rendered; every public route gets its own crawlable head
// before JavaScript executes. Product data is sourced only from the approved catalogue JSON.
import fs from 'node:fs'
import path from 'node:path'
import { RANGES } from '../src/data/ranges.js'

const dist = path.resolve('dist')
const products = JSON.parse(fs.readFileSync(path.resolve('src/data/catalog.generated.json'), 'utf8'))
const site = (process.env.VITE_SITE_URL || 'https://www.sattvasattvik.com').replace(/\/$/, '')
const brand = 'Ston-i Surfaces'
const company = 'Sattva Sattvik Private Limited'
const social = ['https://www.instagram.com/sattva.sattvik', 'https://www.facebook.com/sattva.decor']
const phone = '+919512481000'
const baseHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const abs = (p) => p?.startsWith('http') ? p : p ? `${site}${p.startsWith('/') ? '' : '/'}${p}` : undefined
const truncate = (s, max = 158) => {
  const text = String(s || '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`
}
const productPath = (p) => `/products/${p.range}/${p.collection}/${p.slug}`
const collectionPath = (c) => `/products/${c.range}/${c.slug}`
const collectionMap = [...new Map(products.map((p) => [`${p.range}/${p.collection}`, { range: p.range, slug: p.collection }])).values()]
const collections = collectionMap.map((c) => {
  const range = RANGES.find((r) => r.slug === c.range)
  const items = products.filter((p) => p.range === c.range && p.collection === c.slug)
  return { ...c, rangeName: range?.name || c.range, name: c.slug.split('-').map((x) => x[0]?.toUpperCase() + x.slice(1)).join(' '), items, image: items[c.range === 'art-i-canvas-veneer' ? 1 : 0]?.images?.[0]?.src }
})
const getRangeImage = (r) => {
  if (r.identity?.coverImage?.src) return r.identity.coverImage.src
  const c = r.identity?.cover
  const p = c && products.find((x) => x.range === r.slug && x.collection === c.collection && x.slug === c.slug)
  return p?.images?.[c?.image || 0]?.src || products.find((x) => x.range === r.slug)?.images?.[0]?.src
}
const commonGraph = () => [
  {
    '@type': 'Organization', '@id': `${site}/#organization`, name: company, legalName: company, url: site,
    sameAs: social,
    address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' },
    contactPoint: [{ '@type': 'ContactPoint', telephone: phone, contactType: 'sales', areaServed: 'IN' }],
    brand: { '@id': `${site}/#brand` },
  },
  { '@type': 'Brand', '@id': `${site}/#brand`, name: brand, url: site },
  { '@type': 'WebSite', '@id': `${site}/#website`, url: site, name: brand, publisher: { '@id': `${site}/#organization` }, inLanguage: 'en-IN' },
]
const pages = []
const add = (pathName, title, description, image, type = 'WebPage', extra = [], crumbs = []) => {
  const url = abs(pathName)
  const fullTitle = `${title} | ${brand}`
  const desc = truncate(description)
  const graph = [
    ...commonGraph(),
    { '@type': type, '@id': `${url}#webpage`, url, name: fullTitle, description: desc, isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#brand` }, inLanguage: 'en-IN' },
    ...(crumbs.length ? [{ '@type': 'BreadcrumbList', itemListElement: crumbs.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: abs(item.path) })) }] : []),
    ...extra,
  ]
  pages.push({ path: pathName, url, title: fullTitle, description: desc, image: abs(image || '/textures/marble-crimson.webp'), graph })
}
const homeCrumbs = [{ name: 'Home', path: '/' }]
add('/', 'Architectural Surface Materials by Sattva Sattvik', 'Explore Stonir flexible stone veneer, StonIT architectural surface panels and Art-i Canvas Veneer by Ston-i Surfaces, the market-facing brand of Sattva Sattvik Private Limited.', '/textures/marble-crimson.webp', 'WebPage', [], homeCrumbs)
add('/about', 'About Sattva Sattvik — Parent Company', 'Learn about Sattva Sattvik Private Limited, the parent company behind Ston-i Surfaces and its architectural surface-material product portfolio.', '/textures/marble-dark.webp', 'AboutPage', [], [...homeCrumbs, { name: 'About', path: '/about' }])
add('/innovation', 'Product Development & Innovation', 'Explore product development and research initiatives behind the Ston-i Surfaces architectural surface-material portfolio.', '/textures/stonir-strata.webp', 'AboutPage', [], [...homeCrumbs, { name: 'Innovation', path: '/innovation' }])
add('/products', 'Architectural Surface Materials — Product Portfolio', 'Explore Ston-i Surfaces product ranges: Stonir flexible stone veneer, StonIT surface panels and Art-i Canvas Veneer, by Sattva Sattvik Private Limited.', '/textures/marble-crimson.webp', 'CollectionPage', [{ '@type': 'ItemList', name: 'Ston-i Surfaces product ranges', itemListElement: RANGES.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r.name, url: abs(`/products/${r.slug}`) })) }], [...homeCrumbs, { name: 'Products', path: '/products' }])
for (const range of RANGES) {
  const rangeProducts = products.filter((p) => p.range === range.slug)
  const title = range.slug === 'stonir' ? 'Stonir Flexible Stone Veneer' : range.slug === 'stonit' ? 'StonIT Architectural Surface Panels' : 'Art-i Canvas Veneer'
  const description = `${range.summary} Explore ${rangeProducts.length} catalogue products and designs from ${brand}, by ${company}.`
  const groups = collections.filter((c) => c.range === range.slug)
  add(`/products/${range.slug}`, title, description, getRangeImage(range), 'CollectionPage', [
    { '@type': 'ItemList', name: `${range.name} collections and products`, numberOfItems: rangeProducts.length, itemListElement: rangeProducts.slice(0, 100).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.code || p.name || p.slug, url: abs(productPath(p)) })) },
  ], [...homeCrumbs, { name: 'Products', path: '/products' }, { name: range.name, path: `/products/${range.slug}` }])
  for (const collection of groups) {
    const cPath = collectionPath(collection)
    const desc = collection.description || `${collection.name}, a ${range.name} collection from ${brand}.`
    add(cPath, `${collection.name} — ${range.name} Collection`, desc, collection.image, 'CollectionPage', [
      { '@type': 'ItemList', name: `${collection.name} products`, numberOfItems: collection.items.length, itemListElement: collection.items.slice(0, 100).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.code || p.name || p.slug, url: abs(productPath(p)) })) },
    ], [...homeCrumbs, { name: 'Products', path: '/products' }, { name: range.name, path: `/products/${range.slug}` }, { name: collection.name, path: cPath }])
    for (const p of collection.items) {
      const name = p.code || p.name || p.slug
      const specs = Object.entries(p.specs || {}).filter(([, v]) => v != null && String(v).trim()).map(([k, v]) => `${k}: ${v}`)
      const description = truncate(`${name} from the ${collection.name} collection — ${range.name}, ${range.tagline}, by ${brand}.${specs.length ? ' ' + specs.join('. ') + '.' : ''}`, 500)
      const image = p.images?.[0]?.src || collection.image
      const schema = {
        '@type': 'Product', '@id': `${abs(productPath(p))}#product`, name: `${range.name} ${name}`,
        description, image: p.images?.map((im) => abs(im.src)).filter(Boolean),
        brand: { '@id': `${site}/#brand` }, manufacturer: { '@id': `${site}/#organization` },
        category: collection.name, url: abs(productPath(p)),
      }
      add(productPath(p), `${name} — ${collection.name} | ${range.name}`, description, image, 'WebPage', [schema], [...homeCrumbs, { name: 'Products', path: '/products' }, { name: range.name, path: `/products/${range.slug}` }, { name: collection.name, path: cPath }, { name, path: productPath(p) }])
    }
  }
}
add('/applications', 'Architectural Surface Applications', 'Explore documented interior and exterior applications for Stonir, StonIT and Art-i Canvas Veneer across residential and commercial spaces.', '/textures/marble-dark.webp', 'CollectionPage', [], [...homeCrumbs, { name: 'Applications', path: '/applications' }])
add('/partners', 'B2B Dealers, Distributors & Trade Partners', 'Enquire about becoming a Ston-i Surfaces dealer, distributor, wholesaler, retailer or project partner for the Stonir, StonIT and Art-i ranges.', '/textures/stonit-flow.webp', 'WebPage', [], [...homeCrumbs, { name: 'B2B Partners', path: '/partners' }])
add('/resources', 'Product Catalogues & Technical Resources', 'Request Ston-i Surfaces product catalogues, shade cards, technical information and installation guidance for Stonir, StonIT and Art-i Canvas Veneer.', '/textures/arti-canvas.webp', 'CollectionPage', [], [...homeCrumbs, { name: 'Resources', path: '/resources' }])
add('/contact', 'Contact Ston-i Surfaces', 'Contact Ston-i Surfaces in Jaipur, Rajasthan, India for product information, trade partnerships and architectural surface-material enquiries.', '/textures/marble-crimson.webp', 'ContactPage', [], [...homeCrumbs, { name: 'Contact', path: '/contact' }])

const unique = [...new Map(pages.map((p) => [p.path, p])).values()]
const writePage = (page) => {
  const dir = page.path === '/' ? dist : path.join(dist, page.path.replace(/^\//, ''))
  fs.mkdirSync(dir, { recursive: true })
  const file = page.path === '/' ? path.join(dist, 'index.html') : path.join(dir, 'index.html')
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': page.graph }).replace(/</g, '\\u003c')
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${esc(page.url)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(brand)}" />`,
    '<meta property="og:locale" content="en_IN" />',
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${esc(page.url)}" />`,
    `<meta property="og:image" content="${esc(page.image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${esc(page.image)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ')
  let html = baseHtml.replace(/<html lang="[^"]*">/, '<html lang="en-IN">')
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta name="description"[^>]*>/i, '')
    .replace('</head>', `    ${tags}\n  </head>`)
  fs.writeFileSync(file, html)
}
unique.forEach(writePage)

const notFound = baseHtml
  .replace(/<html lang="[^"]*">/, '<html lang="en-IN">')
  .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
  .replace(/\s*<meta name="description"[^>]*>/i, '')
  .replace('</head>', `    <title>Page not found | ${brand}</title>\n    <meta name="robots" content="noindex, nofollow" />\n  </head>`)
fs.writeFileSync(path.join(dist, '404.html'), notFound)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${unique.map((p) => `  <url><loc>${p.url}</loc><image:image><image:loc>${p.image}</image:loc><image:title>${esc(p.title)}</image:title></image:image></url>`).join('\n')}\n</urlset>\n`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`)
fs.writeFileSync(path.join(dist, 'seo-manifest.json'), JSON.stringify(unique.map(({ path: route, url, title, description }) => ({ path: route, url, title, description })), null, 2))
const llms = [
  '# Ston-i Surfaces',
  '',
  '> Ston-i Surfaces is the market-facing architectural surface materials brand of Sattva Sattvik Private Limited.',
  '',
  '## Brand and company',
  '- Parent company: Sattva Sattvik Private Limited',
  '- Market-facing brand: Ston-i Surfaces',
  '- Product ranges: Stonir, StonIT, Art-i Canvas Veneer',
  '- Company location: Rajasthan, India',
  '- Business enquiries: +91 95124 81000',
  '',
  '## Public pages',
  '- [Home](' + site + '/)',
  '- [About Sattva Sattvik](' + site + '/about)',
  '- [Product portfolio](' + site + '/products)',
  '- [Stonir](' + site + '/products/stonir)',
  '- [StonIT](' + site + '/products/stonit)',
  '- [Art-i Canvas Veneer](' + site + '/products/art-i-canvas-veneer)',
  '- [Applications](' + site + '/applications)',
  '- [B2B partners](' + site + '/partners)',
  '- [Resources](' + site + '/resources)',
  '- [Contact](' + site + '/contact)',
  '',
  '## Product information',
  'Product names, collections and published specifications are maintained in public catalogue pages. Do not infer unlisted prices, availability, certifications or technical claims. Product enquiries are handled directly by the business.',
  '',
  '## Sitemap',
  '- [XML sitemap](' + site + '/sitemap.xml)',
  '',
].join('\n')
fs.writeFileSync(path.join(dist, 'llms.txt'), llms)
console.log(`SEO output: ${unique.length} route-specific HTML documents, sitemap.xml and robots.txt for ${site}`)
