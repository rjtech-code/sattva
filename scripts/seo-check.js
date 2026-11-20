import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const manifestPath = path.join(dist, 'seo-manifest.json')
if (!fs.existsSync(manifestPath)) throw new Error('SEO manifest missing. Run the production build first.')
const pages = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const errors = []
const titles = new Map()
const descriptions = new Map()
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const expectedUrls = new Set(pages.map((p) => p.url))
const host = new URL(pages[0].url).origin

for (const page of pages) {
  const file = page.path === '/' ? path.join(dist, 'index.html') : path.join(dist, page.path.slice(1), 'index.html')
  if (!fs.existsSync(file)) { errors.push(`Missing route document: ${page.path}`); continue }
  const html = fs.readFileSync(file, 'utf8')
  const count = (re) => [...html.matchAll(re)].length
  if (count(/<title>/gi) !== 1) errors.push(`${page.path}: expected exactly one title`)
  if (count(/<meta name="description"/gi) !== 1) errors.push(`${page.path}: expected exactly one description`)
  if (count(/<link rel="canonical"/gi) !== 1) errors.push(`${page.path}: expected exactly one canonical`)
  if (count(/<meta name="robots"/gi) !== 1) errors.push(`${page.path}: expected exactly one robots directive`)
  if (count(/<meta property="og:title"/gi) !== 1 || count(/<meta property="og:image"/gi) !== 1) errors.push(`${page.path}: missing/duplicate Open Graph metadata`)
  if (count(/<meta name="twitter:title"/gi) !== 1 || count(/<meta name="twitter:image"/gi) !== 1) errors.push(`${page.path}: missing/duplicate Twitter metadata`)
  if (!html.includes(`<link rel="canonical" href="${page.url}"`)) errors.push(`${page.path}: canonical does not match route`)
  if (!page.url.startsWith(host + '/')) errors.push(`${page.path}: URL is outside preferred host ${host}`)
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || ''
  const desc = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || ''
  if (titles.has(title)) errors.push(`Duplicate title: ${title} (${titles.get(title)} and ${page.path})`)
  if (descriptions.has(desc)) errors.push(`Duplicate description on ${descriptions.get(desc)} and ${page.path}`)
  titles.set(title, page.path); descriptions.set(desc, page.path)
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  if (jsonLd.length !== 1) errors.push(`${page.path}: expected exactly one JSON-LD graph`)
  else {
    try {
      const parsed = JSON.parse(jsonLd[0][1])
      const types = (parsed['@graph'] || []).map((item) => item['@type'])
      if (!types.includes('Organization') || !types.includes('Brand') || !types.includes('WebSite')) errors.push(`${page.path}: missing company/brand/site entities`)
    } catch { errors.push(`${page.path}: invalid JSON-LD`) }
  }
}
if (!sitemap.trim().startsWith('<?xml') || !sitemap.includes('<urlset')) errors.push('Sitemap is not a valid urlset document')
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push('Sitemap contains duplicate URLs')
for (const url of sitemapUrls) if (!expectedUrls.has(url)) errors.push(`Sitemap URL is not in route manifest: ${url}`)
for (const url of expectedUrls) if (!sitemapUrls.includes(url)) errors.push(`Indexable route missing from sitemap: ${url}`)
if (sitemap.includes('/manufacturing')) errors.push('Redirected /manufacturing route must not be in sitemap')
if (!fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').includes(`Sitemap: ${host}/sitemap.xml`)) errors.push('robots.txt sitemap directive missing or incorrect')
const notFound = fs.readFileSync(path.join(dist, '404.html'), 'utf8')
if (!/name="robots" content="noindex, nofollow"/.test(notFound)) errors.push('404 document must be noindex')

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} issue(s):`)
  errors.forEach((error) => console.error(` - ${error}`))
  process.exit(1)
}
console.log(`SEO validation passed: ${pages.length} route documents, unique titles/descriptions, canonicals, OG/Twitter metadata, JSON-LD, sitemap and robots.txt.`)
