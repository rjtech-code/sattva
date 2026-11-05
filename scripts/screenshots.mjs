// Full-page screenshots + basic audits (overflow, broken images, console errors).
// Usage: node scripts/screenshots.mjs <outDir> [baseUrl=http://localhost:4173]
// Needs a running server (npm run build && npm run preview) and Google Chrome.
// Writes <outDir>/{dark,light}/{desktop,mobile}/<route>.png
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const out = process.argv[2] || 'screenshots/run'
const base = process.argv[3] || 'http://localhost:4173'
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome'

const ROUTES = [
  '/', '/about', '/manufacturing', '/innovation', '/products',
  '/products/stonir', '/products/stonit', '/products/art-i-canvas-veneer',
  '/products/stonir/natural-series', '/products/stonir/natural-series/ssv-3000-1',
  '/products/stonir/translucent-series/ssv-1000-1',
  '/products/stonit/haveli-arch', '/products/stonit/haveli-arch/haveli-arch-multi-color',
  '/products/art-i-canvas-veneer/canvas-series/acv-04',
  '/applications', '/partners', '/resources', '/contact', '/nope/missing',
]
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
]
const THEMES = ['dark', 'light']
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
let problems = 0
for (const theme of THEMES) {
  for (const vp of VIEWPORTS) {
    const dir = path.join(out, theme, vp.name)
    fs.mkdirSync(dir, { recursive: true })
    for (const route of ROUTES) {
      const page = await browser.newPage()
      await page.setViewport(vp)
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`))
      try {
        await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 60000 })
        if (theme === 'light') {
          await page.evaluate(() => document.querySelector('button[aria-label="Switch to light theme"]')?.click())
          await wait(300)
        }
        // Reveal animated sections and trigger lazy images before capturing.
        await page.evaluate(async () => {
          document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'))
          for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)) }
          window.scrollTo(0, 0)
        })
        await wait(2500)
        const info = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
        }))
        const file = (route === '/' ? 'home' : route.slice(1).replace(/\//g, '__')) + '.png'
        await page.screenshot({ path: path.join(dir, file), fullPage: true })
        const flags = [info.overflow > 0 && `overflow ${info.overflow}px`, info.broken.length && `broken ${info.broken.join(' ')}`, errors.length && `errors ${errors.join(' | ').slice(0, 240)}`].filter(Boolean)
        if (flags.length) problems++
        console.log(`${theme.padEnd(5)} ${vp.name.padEnd(7)} ${route.padEnd(58)} ${flags.join(' · ') || 'ok'}`)
      } catch (e) {
        problems++
        console.log(`${theme} ${vp.name} ${route} ✖ ${e.message}`)
      }
      await page.close()
    }
  }
}
await browser.close()
console.log(problems ? `${problems} page(s) with problems` : 'all pages ok')
