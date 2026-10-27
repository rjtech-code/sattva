// Writes robots.txt and (when VITE_SITE_URL is set) sitemap.xml into dist/ from the route data.
import fs from 'node:fs'
import path from 'node:path'
import { RANGES } from '../src/data/ranges.js'

const dist = path.resolve('dist')
const PRODUCTS = JSON.parse(fs.readFileSync(path.resolve('src/data/catalog.generated.json'), 'utf-8'))
const COLLECTIONS = [...new Map(PRODUCTS.map((p) => [`${p.range}/${p.collection}`, { range: p.range, slug: p.collection }])).values()]
const site = (process.env.VITE_SITE_URL || '').replace(/\/$/, '')

const routes = [
  '/', '/about', '/manufacturing', '/innovation', '/products',
  ...RANGES.map((r) => `/products/${r.slug}`),
  ...COLLECTIONS.map((c) => `/products/${c.range}/${c.slug}`),
  ...PRODUCTS.map((p) => `/products/${p.range}/${p.collection}/${p.slug}`),
  '/applications', '/projects', '/partners', '/resources', '/contact',
]

let robots = 'User-agent: *\nAllow: /\nDisallow: /api/\n'
if (site) {
  const today = new Date().toISOString().slice(0, 10)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((r) => `  <url><loc>${site}${r}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml)
  robots += `Sitemap: ${site}/sitemap.xml\n`
  console.log(`sitemap.xml: ${routes.length} URLs`)
} else {
  console.warn('VITE_SITE_URL not set — sitemap.xml and canonical URLs skipped until the domain is confirmed.')
}
fs.writeFileSync(path.join(dist, 'robots.txt'), robots)
