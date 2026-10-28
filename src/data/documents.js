// Client catalogue PDFs, hosted in the client's public Google Drive folder
// (https://drive.google.com/drive/folders/1N6MIPEwxZMelJvrOKzzlY8P4xKWt6t21).
// Linked rather than self-hosted because the set is ~140 MB (Art-i alone is 62 MB).
const drive = (id) => `https://drive.google.com/file/d/${id}/view`

export const DOCS = {
  stonirIntro: { label: 'Stonir — Introduction Catalogue', href: drive('1kQ3o0RB7f2HeOnVzdu5KXe-BQqUeRLQH'), range: 'stonir', size: '3.7 MB', pages: 40 },
  stonirNatural: { label: 'Stonir — Natural Series', href: drive('19r4cQrTRVeXNURamm-izCKFtGq9MX30V'), range: 'stonir', collection: 'natural-series', size: '16 MB', pages: 41 },
  stonirGrainy: { label: 'Stonir — Grainy Series', href: drive('1qatNwFQsL8pstn7Q_dQA1HPYRReoUYyG'), range: 'stonir', collection: 'grainy-series', size: '11 MB', pages: 49 },
  stonirTranslucent: { label: 'Stonir — Translucent Series', href: drive('1ZkJJVYemtldhFC6J9P6B5xjkP80S_LKt'), range: 'stonir', collection: 'translucent-series', size: '22 MB', pages: 49 },
  stonirBookmatch: { label: 'Stonir — Bookmatch Series', href: drive('1Y4qVNYwY8v7H3EQwQe60lNQpp55wRMlu'), range: 'stonir', collection: 'bookmatch-series', size: '2.4 MB', pages: 11 },
  stonir10x4: { label: 'Stonir — 10x4 Veneer Series', href: drive('1dkuzeSE15KvxT49EUSqx2NNr-qrrw0x9'), range: 'stonir', collection: '10x4-massive-veneer', size: '9.2 MB', pages: 21 },
  stonitIntro: { label: 'StonIT — Intro Shade Card', href: drive('13BlcSxdjxWE1a4Q-al4DsMDMJgANIofZ'), range: 'stonit', size: '5.9 MB', pages: 39 },
  stonitMaster: { label: 'StonIT — Master Shade Card', href: drive('1foqMup4O3y0LmcSE9oVuwZjR-dLMN84w'), range: 'stonit', size: '11 MB', pages: 43 },
  artiCanvas: { label: 'Art-i Canvas Veneer — Canvas Series 2026', href: drive('1BtB7DtcIcbuAiI_2qx3uRINmUty1yt__'), range: 'art-i-canvas-veneer', collection: 'canvas-series', size: '62 MB', pages: 39 },
}
