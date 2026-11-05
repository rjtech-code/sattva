import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FileText, X } from 'lucide-react'
import EnquiryForm from './EnquiryForm'

// Catalogues are not downloaded directly: visitors request them through a short form that hands
// off to WhatsApp, so the sales team receives a lead along with the request.
const Ctx = createContext(() => {})
export const useCatalogueRequest = () => useContext(Ctx)

export function CatalogueRequestProvider({ children }) {
  const [doc, setDoc] = useState(null)
  const ref = useRef(null)
  const open = useCallback((d) => setDoc(d), [])

  useEffect(() => {
    const dlg = ref.current
    if (doc && dlg && !dlg.open) dlg.showModal()
  }, [doc])

  return (
    <Ctx.Provider value={open}>
      {children}
      <dialog
        ref={ref}
        onClose={() => setDoc(null)}
        onClick={(e) => e.target === ref.current && ref.current.close()}
        aria-labelledby="catalogue-dialog-title"
        className="m-auto w-[min(100%-24px,620px)] max-h-[calc(100dvh-24px)] overflow-y-auto border border-line-2 bg-ink p-0 text-paper backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {doc && (
          <div className="p-6 sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Request catalogue</p>
                <h2 id="catalogue-dialog-title" className="display-sm flex items-center gap-3"><FileText size={20} className="shrink-0 text-crimson-hi" aria-hidden="true" />{doc.label}</h2>
                <p className="mt-2 text-[13.5px] text-mist">Share a few details and we’ll send the PDF to you on WhatsApp.</p>
              </div>
              <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="-mr-2 -mt-1 p-2 text-mist hover:text-paper"><X size={20} /></button>
            </div>
            <div className="mt-6"><EnquiryForm key={doc.label} document={doc} compact /></div>
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  )
}

/** A catalogue row/button that opens the request dialog instead of downloading the file. */
export function CatalogueButton({ doc, className = '', children }) {
  const open = useCatalogueRequest()
  return (
    <button type="button" onClick={() => open(doc)} className={className}>
      {children}
    </button>
  )
}

/** List of catalogues as request buttons (replaces direct PDF links everywhere). */
export function DocRequestList({ docs, className = '' }) {
  const open = useCatalogueRequest()
  if (!docs?.length) return null
  return (
    <ul className={`divide-y divide-line border-y border-line ${className}`}>
      {docs.map((d) => (
        <li key={d.label}>
          <button type="button" onClick={() => open(d)} className="group flex w-full items-center justify-between gap-4 py-4 text-left text-[14.5px] hover:text-crimson-hi">
            <span className="flex min-w-0 items-center gap-3"><FileText size={16} aria-hidden="true" className="shrink-0 text-crimson-hi" /><span className="min-w-0">{d.label}</span></span>
            <span className="shrink-0 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-crimson-hi">Request</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
