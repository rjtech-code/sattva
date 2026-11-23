import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Facebook, Instagram, Menu, X } from 'lucide-react'
import { NAV, BRAND, COMPANY } from '../../data/site'
import { ButtonLink } from '../ui/Bits'
import ThemeToggle from '../ui/ThemeToggle'

// Brand-first lockup matching the supplied brochure: symbol + Ston-i name,
// with Sattva Sattvik and the Italian design line beneath.
export function Wordmark({ compact = false }) {
  return (
    <Link
      to="/"
      className="group inline-flex min-w-0 items-center gap-2.5 border border-black/10 bg-[#f8f7f3] px-3 py-2 shadow-[0_3px_18px_rgb(0_0_0/0.16)] sm:gap-3 sm:px-4 sm:py-2.5"
      aria-label={`${COMPANY.legalName} — ${BRAND.name}, home`}
    >
      <img
        src="/media/ston-i-mark-dark.svg"
        alt=""
        aria-hidden="true"
        className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
        width="48"
        height="48"
      />
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className="whitespace-nowrap font-display text-[17px] font-semibold tracking-[0.025em] text-[#172b2c] sm:text-[21px] xl:text-[23px]">
          STON<span className="text-[#c8102e]">-I</span> SURFACES
        </span>
        {!compact && (
          <span className="mt-1.5 whitespace-nowrap text-[6.5px] font-semibold uppercase tracking-[0.12em] text-[#263637] sm:text-[8px] sm:tracking-[0.16em]">
            INNOVATIVE STONE <span className="mx-1 text-[#c8102e]">|</span>
            <span className="text-[#a51c30]">DESIGNED IN ITALY</span>
          </span>
        )}
      </span>
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
              {c.children?.length > 0 && (
                <ul className="ml-5 mb-2 border-l border-line pl-3">
                  {c.children.map((child) => (
                    <li key={child.to + child.label}>
                      <Link to={child.to} onClick={() => setOpen(false)} className="group flex items-start gap-2 px-2 py-2 hover:bg-coal-3">
                        <span aria-hidden="true" className="mt-[2px] text-crimson-hi">•</span>
                        <span>
                          <span className="block text-[12px] text-mist group-hover:text-paper transition-colors">{child.label}</span>
                          <span className="block text-[10.5px] text-ash">{child.note}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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
          <ul className="flex items-center gap-4 2xl:gap-6">
            {NAV.map((item) =>
              item.children?.length ? (
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1.5 lg:flex" aria-label="Social media">
            <a href="https://www.facebook.com/sattva.decor/" target="_blank" rel="noopener noreferrer" aria-label="Facebook — opens in a new tab" className="flex h-8 w-8 items-center justify-center border border-line text-mist transition-colors hover:border-crimson hover:text-crimson-hi"><Facebook size={15} /></a>
            <a href="https://www.instagram.com/sattva.sattvik/" target="_blank" rel="noopener noreferrer" aria-label="Instagram — opens in a new tab" className="flex h-8 w-8 items-center justify-center border border-line text-mist transition-colors hover:border-crimson hover:text-crimson-hi"><Instagram size={15} /></a>
          </div>
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
                  {item.children?.length > 0 && (
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
                {item.children?.length > 0 && openGroup === item.label && (
                  <ul className="pb-4 pl-1">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <Link to={c.to} className="flex items-baseline justify-between gap-4 py-2.5 text-[14px] text-mist hover:text-paper">
                          {c.label}
                          <span className="text-[11.5px] text-ash text-right">{c.note}</span>
                        </Link>
                        {c.children?.length > 0 && (
                          <ul className="mb-2 ml-4 border-l border-line pl-3">
                            {c.children.map((child) => (
                              <li key={child.label}>
                                <Link to={child.to} className="flex items-baseline gap-2 py-2 text-[13px] text-ash hover:text-paper">
                                  <span aria-hidden="true" className="text-crimson-hi">•</span>
                                  <span>{child.label}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="flex items-center gap-3 border-b border-line py-5">
              <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-ash">Follow us</span>
              <a href="https://www.facebook.com/sattva.decor/" target="_blank" rel="noopener noreferrer" aria-label="Facebook — opens in a new tab" className="flex h-10 w-10 items-center justify-center border border-line text-mist hover:border-crimson hover:text-crimson-hi"><Facebook size={18} /></a>
              <a href="https://www.instagram.com/sattva.sattvik/" target="_blank" rel="noopener noreferrer" aria-label="Instagram — opens in a new tab" className="flex h-10 w-10 items-center justify-center border border-line text-mist hover:border-crimson hover:text-crimson-hi"><Instagram size={18} /></a>
            </li>
            <li className="pt-6">
              <ButtonLink to="/partners#enquiry" className="w-full">B2B Enquiry</ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
