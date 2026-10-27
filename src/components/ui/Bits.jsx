import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'

export function Eyebrow({ children, className = '' }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

export function ButtonLink({ to, children, variant = 'primary', className = '', arrow = true }) {
  return (
    <Link to={to} className={`btn btn-${variant} ${className}`}>
      {children}
      {arrow && <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />}
    </Link>
  )
}

export function ArrowLink({ to, children, className = '' }) {
  return (
    <Link to={to} className={`link-arrow ${className}`}>
      {children}
      <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
    </Link>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] tracking-[0.18em] uppercase text-ash">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {it.to && i < items.length - 1 ? (
              <Link to={it.to} className="hover:text-paper transition-colors">{it.label}</Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined} className="text-mist">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Honest placeholder for content that has not been supplied/approved yet.
export function Pending({ title, children, action }) {
  return (
    <div className="panel relative overflow-hidden p-7 sm:p-10">
      <div className="absolute left-0 top-0 h-full w-[2px] bg-crimson" aria-hidden="true" />
      <p className="eyebrow mb-4">Being prepared</p>
      <h3 className="display-sm mb-3">{title}</h3>
      <div className="text-mist max-w-2xl text-[15px] leading-relaxed">{children}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
