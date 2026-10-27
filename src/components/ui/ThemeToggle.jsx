import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

// Dark is the brand default and is restored on every fresh visit — the choice is
// deliberately kept in memory only, not persisted to storage.
export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f5f2' : '#050505')
  }, [theme])

  const light = theme === 'light'
  return (
    <button
      type="button"
      onClick={() => setTheme(light ? 'dark' : 'light')}
      aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={light}
      title={light ? 'Dark theme' : 'Light theme'}
      className={`flex h-10 w-10 items-center justify-center border border-line-2 text-mist transition-colors hover:border-paper hover:text-paper ${className}`}
    >
      {light ? <Moon size={17} strokeWidth={1.5} aria-hidden="true" /> : <Sun size={17} strokeWidth={1.5} aria-hidden="true" />}
    </button>
  )
}
