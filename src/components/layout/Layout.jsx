import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// Scrolls to the top on navigation, or to the #hash target when one is present.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Lazy routes may still be mounting; retry briefly until the target exists.
      let tries = 0
      const id = setInterval(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (el || ++tries > 20) {
          clearInterval(id)
          el?.scrollIntoView({ block: 'start' })
        }
      }, 50)
      return () => clearInterval(id)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function PageLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-px w-24 overflow-hidden bg-line">
        <span className="block h-full w-1/2 animate-pulse bg-crimson" />
      </span>
      <span className="sr-only">Loading page</span>
    </div>
  )
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
