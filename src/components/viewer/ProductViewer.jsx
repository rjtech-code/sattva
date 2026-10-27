import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Box, Image as ImageIcon, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, RefreshCcw } from 'lucide-react'
import SequenceViewer from './SequenceViewer'

// three.js is only downloaded when a 3D viewer actually scrolls into view.
const Scene3D = lazy(() => import('./Scene3D'))

class ViewerBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError?.() }
  render() { return this.state.failed ? null : this.props.children }
}

const webglAvailable = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const LABEL = {
  slab: 'Real-time 3D',
  model: 'Real-time 3D model',
  sequence: '360° image sequence',
}

/**
 * Reusable product viewer.
 *  config.kind 'slab'     — real-time 3D panel textured with a photo (Gajbala-style)
 *  config.kind 'model'    — real-time 3D from a supplied .glb/.gltf
 *  config.kind 'sequence' — 360° image sequence (not real-time 3D; labelled as such)
 *  no config              — static photo only
 * `photo` is the fallback / "Photo" tab. `illustrative` configs carry a visible disclaimer.
 */
export default function ProductViewer({ config, photo, title, className = 'h-[360px] sm:h-[460px] lg:h-[540px]' }) {
  const host = useRef(null)
  const apiRef = useRef(null)
  const has3D = config && (config.kind === 'slab' || config.kind === 'model')
  const [mode, setMode] = useState(config ? 'interactive' : 'photo')
  const [near, setNear] = useState(false)
  const [state, setState] = useState('loading') // loading | ready | error
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [canGL] = useState(webglAvailable)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: '300px' })
    if (host.current) io.observe(host.current)
    return () => io.disconnect()
  }, [])

  const onReady = useCallback(() => setState('ready'), [])
  const onError = useCallback(() => setState('error'), [])

  const showFallback = !config || mode === 'photo' || (has3D && (!canGL || state === 'error'))
  const kindLabel = config ? LABEL[config.kind] : null

  // Shared by the keyboard handler and the control buttons.
  const run = (action) => {
    const api = apiRef.current
    if (!api) return
    if (action === 'left') api.rotate(-0.4)
    else if (action === 'right') api.rotate(0.4)
    else if (action === 'in') api.zoom(0.85)
    else if (action === 'out') api.zoom(1.18)
    else if (action === 'reset') api.reset()
  }
  const KEYS = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'in', '=': 'in', '-': 'out', 0: 'reset' }
  const onKey = (e) => {
    if (mode !== 'interactive' || !has3D || !KEYS[e.key]) return
    e.preventDefault()
    run(KEYS[e.key])
  }

  return (
    <div className="min-w-0">
      <div
        ref={host}
        className={`viewer-stage relative overflow-hidden border border-line ${className}`}
        role="region"
        aria-label={`${title} — ${showFallback ? 'photo' : kindLabel || 'viewer'}`}
        tabIndex={has3D && mode === 'interactive' ? 0 : undefined}
        onKeyDown={onKey}
      >
        {showFallback ? (
          photo ? (
            <img src={photo.src} alt={photo.alt || title} className="h-full w-full object-cover" width={photo.width} height={photo.height} />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-[14px] text-gray-300">
              {has3D && !canGL ? 'Your browser does not support 3D viewing.' : 'Preview unavailable.'}
            </div>
          )
        ) : config.kind === 'sequence' ? (
          <SequenceViewer frames={config.frames} title={title} />
        ) : (
          near && (
            <ViewerBoundary key={attempt} onError={onError}>
              <Suspense fallback={null}>
                <Scene3D config={config} apiRef={apiRef} onReady={onReady} onError={onError} reduced={reduced} />
              </Suspense>
            </ViewerBoundary>
          )
        )}

        {has3D && mode === 'interactive' && state === 'loading' && canGL && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4" role="status">
            <span className="h-8 w-8 animate-spin rounded-full border border-white/20 border-t-crimson" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-gray-300">Loading 3D view</span>
          </div>
        )}

        {/* Top bar: what the visitor is looking at, and mode switch */}
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {kindLabel && !showFallback && <span className="illustrative-tag !text-paper">{kindLabel}</span>}
            {config?.illustrative && <span className="illustrative-tag">Illustrative texture — not a product sample</span>}
          </div>
          {config && photo && (
            <div className="flex border border-line bg-ink/80 backdrop-blur" role="group" aria-label="Viewer mode">
              <button type="button" onClick={() => setMode('interactive')} aria-pressed={mode === 'interactive'} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] ${mode === 'interactive' ? 'bg-crimson text-white' : 'text-mist hover:text-paper'}`}>
                <Box size={13} aria-hidden="true" /> {config.kind === 'sequence' ? '360°' : '3D'}
              </button>
              <button type="button" onClick={() => setMode('photo')} aria-pressed={mode === 'photo'} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] ${mode === 'photo' ? 'bg-crimson text-white' : 'text-mist hover:text-paper'}`}>
                <ImageIcon size={13} aria-hidden="true" /> Photo
              </button>
            </div>
          )}
        </div>

        {has3D && mode === 'interactive' && state === 'error' && (
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 border border-line bg-ink/85 px-4 py-2.5 text-[12.5px] text-mist" role="alert">
            The 3D view could not be loaded{photo ? ' — showing the photograph instead' : ''}.
            <button type="button" className="flex items-center gap-1 text-paper" onClick={() => { setState('loading'); setAttempt((a) => a + 1) }}><RefreshCcw size={13} aria-hidden="true" /> Retry</button>
          </div>
        )}
      </div>

      {/* Accessible controls (also: arrow keys, + / − and 0 when the viewer is focused) */}
      {has3D && mode === 'interactive' && !showFallback && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex border border-line" role="group" aria-label="3D controls">
            {[
              { icon: RotateCcw, label: 'Rotate left', action: 'left' },
              { icon: RotateCw, label: 'Rotate right', action: 'right' },
              { icon: ZoomIn, label: 'Zoom in', action: 'in' },
              { icon: ZoomOut, label: 'Zoom out', action: 'out' },
              { icon: Maximize2, label: 'Reset view', action: 'reset' },
            ].map(({ icon: I, label, action }) => (
              <button key={label} type="button" onClick={() => run(action)} aria-label={label} title={label} className="border-r border-line p-2.5 text-mist last:border-r-0 hover:bg-coal-3 hover:text-paper">
                <I size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="text-[11px] tracking-[0.12em] text-ash">Drag to rotate · Pinch or scroll to zoom</p>
        </div>
      )}
    </div>
  )
}
