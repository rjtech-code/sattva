import { useEffect, useRef } from 'react'

// Fades content in once it scrolls into view. Without JS / with reduced motion it is simply visible.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  )
}
