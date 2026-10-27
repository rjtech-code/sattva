import { useEffect, useRef, useState } from 'react'

// 360° image-sequence viewer: drag, swipe or use the slider/arrow keys to step through frames.
// This is not real-time 3D; the parent labels it "360° image sequence".
export default function SequenceViewer({ frames = [], title }) {
  const [i, setI] = useState(0)
  const drag = useRef(null)
  const n = frames.length

  // Preload frames once so scrubbing is smooth.
  useEffect(() => {
    frames.forEach((src) => { const img = new Image(); img.src = src })
  }, [frames])

  if (!n) return null
  const step = (d) => setI((v) => (v + d + n) % n)

  return (
    <div
      className="relative h-full w-full cursor-grab select-none active:cursor-grabbing"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={(e) => { drag.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => {
        if (drag.current == null) return
        const dx = e.clientX - drag.current
        if (Math.abs(dx) > 12) { step(dx > 0 ? -1 : 1); drag.current = e.clientX }
      }}
      onPointerUp={() => { drag.current = null }}
    >
      <img src={frames[i]} alt={`${title} — view ${i + 1} of ${n}`} className="h-full w-full object-contain" draggable={false} />
      <label className="absolute inset-x-6 bottom-4">
        <span className="sr-only">Rotate {title}</span>
        <input type="range" min={0} max={n - 1} value={i} onChange={(e) => setI(+e.target.value)} className="w-full accent-[#c8102e]" />
      </label>
    </div>
  )
}
