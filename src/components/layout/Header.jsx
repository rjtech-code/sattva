import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { NAV, BRAND } from '../../data/site'
import { ButtonLink } from '../ui/Bits'
import ThemeToggle from '../ui/ThemeToggle'

export function Wordmark({ compact = false }) {
  return (
    <Link to="/" className="group flex flex-col leading-none" aria-label={`${BRAND.name} — home`}>
      <span className="font-display text-[19px] sm:text-[21px] tracking-[0.2em] text-paper">
        STON<span className="text-crimson-hi">-</span>I <span className="text-mist">SURFACES</span>
      </span>
      {!compact && (
        <span className="mt-1.5 text-[8.5px] tracking-[0.34em] uppercase text-ash">{BRAND.attribution}</span>
      )}
    </Link>
  )
}

const isActive = (pathname, item) =>
  item.to === '/' ? pathname === '/' : [item, ...(item.children || [])].some((c) => pathname.startsWith(c.to.split('#')[0]))

function Dropdown({ item, pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const active = isActive(pathname, item)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget) && setOpen(false)}
    >
      <div className="flex items-center">
        <Link to={item.to} className={`navlink ${active ? 'is-active' : ''}`}>{item.label}</Link>
        <button
          type="button"
          className="ml-0.5 p-1 text-ash hover:text-paper"
          aria-expanded={open}
          aria-label={`${item.label} menu`}
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 ${open ? 'visible opacity-100' : 'invisible opacity-0'} transition-opacity duration-200`}>
        <ul className="panel w-72 bg-ink/95 backdrop-blur py-3 shadow-2xl shadow-black">
          {item.children.map((c) => (
            <li key={c.to + c.label}>
              <Link to={c.to} onClick={() => setOpen(false)} className="group block px-5 py-2.5 hover:bg-coal-3">
                <span className="block text-[13px] text-paper group-hover:text-crimson-hi transition-colors">{c.label}</span>
                <span className="block text-[11.5px] text-ash">{c.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Close the mobile menu whenever the route changes (adjusting state during render).
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMobile(false)
    setOpenGroup(null)
  }

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    if (!mobile) return
    const onKey = (e) => e.key === 'Escape' && setMobile(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobile])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || mobile ? 'bg-ink/92 backdrop-blur-md border-b border-line' : 'bg-gradient-to-b from-ink/85 to-transparent border-b border-transparent'
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 btn btn-primary z-50">Skip to content</a>
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) =>
              item.children ? (
                <Dropdown key={item.label} item={item} pathname={pathname} />
              ) : (
                <li key={item.label}>
                  <NavLink to={item.to} end={item.to === '/'} className={({ isActive: a }) => `navlink ${a ? 'is-active' : ''}`}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ButtonLink to="/partners#enquiry" className="hidden sm:inline-flex !min-h-[40px] !px-4 !text-[10px]">B2B Enquiry</ButtonLink>
          <button
            type="button"
            className="xl:hidden -mr-2 p-2 text-paper"
            aria-label={mobile ? 'Close menu' : 'Open menu'}
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav id="mobile-menu" aria-label="Mobile" className="xl:hidden h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-ink">
          <ul className="wrap py-6">
            {NAV.map((item) => (
              <li key={item.label} className="border-b border-line">
                <div className="flex items-center justify-between">
                  <Link to={item.to} className={`block py-4 font-display text-[26px] uppercase ${isActive(pathname, item) ? 'text-crimson-hi' : 'text-paper'}`}>
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      className="p-3 text-mist"
                      aria-expanded={openGroup === item.label}
                      aria-label={`Show ${item.label} pages`}
                      onClick={() => setOpenGroup((g) => (g === item.label ? null : item.label))}
                    >
                      <ChevronDown size={20} className={`transition-transform ${openGroup === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {item.children && openGroup === item.label && (
                  <ul className="pb-4 pl-1">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <Link to={c.to} className="flex items-baseline justify-between gap-4 py-2.5 text-[14px] text-mist hover:text-paper">
                          {c.label}
                          <span className="text-[11.5px] text-ash text-right">{c.note}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-8">
              <ButtonLink to="/partners#enquiry" className="w-full">B2B Enquiry</ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
