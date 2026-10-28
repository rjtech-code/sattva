// Image manifest.
//
// The `tex.*` entries are abstract, generated atmosphere textures (see
// scripts/gen_textures.py) — they are NOT product photographs and are marked
// `illustrative: true` so components can label them. Real client photography
// goes in public/media/<range>/<collection>/… and is referenced from catalog.js.

const t = (name, alt) => ({
  src: `/textures/${name}.webp`,
  srcSmall: `/textures/${name}-960.webp`,
  width: 1920,
  height: 1200,
  alt,
  illustrative: true,
})

export const tex = {
  marbleDark: t('marble-dark', 'Dark stone texture with fine white veining'),
  marbleCrimson: t('marble-crimson', 'Black stone texture with crimson veining'),
  stonir: t('stonir-strata', 'Layered natural stone strata texture'),
  stonit: t('stonit-flow', 'Dark flowing sculptural surface texture'),
  arti: t('arti-canvas', 'Abstract canvas texture with crimson strokes'),
  charcoal: t('charcoal', 'Charcoal grain texture'),
  ridge: t('ridge', 'Dark mountain ridge silhouette'),
}
