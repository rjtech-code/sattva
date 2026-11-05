// Responsive image for manifest entries
// ({ src, srcSmall?, smallWidth?, width, height, alt, light?, illustrative?, rotatable? }).
// - srcset uses each file's real width, so the browser never stretches the small file.
// - Entries with a `light` counterpart (generated textures) swap with the theme via CSS;
//   the hidden copy is display:none, so lazy copies are never downloaded.
// - `aspect` (width / height of the slot) turns on smart fitting. Slots should be sized with
//   slotAspect() — the average shape of the images shown in them — so images fill them with
//   little or no cropping; any small remaining difference is filled (cover), never left as bars.
//   Stone sheets (rotatable) in a slot of the opposite orientation are turned 90° to fill it.
// - showTag labels generated textures where they could be mistaken for product photography.
// Below-the-fold images lazy-load by default; pass priority for the LCP image.
const smallWidth = (im) => im.smallWidth || Math.round(im.width * Math.min(1, 480 / Math.max(im.width, im.height)))

export function fitFor(image, aspect) {
  if (!aspect || !image?.width || !image?.height || image.illustrative) return 'cover' // textures are decorative
  const ia = image.width / image.height
  if (image.rotatable && (ia < 1) !== (aspect < 1)) return 'rotate'
  return 'cover'
}

/** Average shape (geometric mean of width/height) of a set of images, for sizing their slots.
 *  `landscape` treats stone sheets as turned 90° (as fitFor does in landscape slots). */
export function slotAspect(images, { landscape = false, fallback = 4 / 3 } = {}) {
  const list = images.filter((im) => im?.width && im?.height)
  if (!list.length) return fallback
  const logs = list.map((im) => {
    const a = im.width / im.height
    return Math.log(landscape && im.rotatable && a < 1 ? 1 / a : a)
  })
  return Math.exp(logs.reduce((s, x) => s + x, 0) / logs.length)
}

function Img({ image, alt, sizes, priority, className, style }) {
  const srcSet = image.srcSmall && image.width ? `${image.srcSmall} ${smallWidth(image)}w, ${image.src} ${image.width}w` : undefined
  return (
    <img
      src={image.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  )
}

export default function Picture({ image, className = '', imgClassName = '', priority = false, sizes = '100vw', alt, showTag = false, aspect }) {
  if (!image) return null
  const a = alt ?? image.alt ?? ''
  const fit = fitFor(image, aspect)
  // Rotated: the image's own box is the slot turned 90°, then rotated back into place.
  const rotated = fit.startsWith('rotate')
    ? { position: 'absolute', left: '50%', top: '50%', width: `${100 / aspect}%`, height: `${aspect * 100}%`, maxWidth: 'none', transform: 'translate(-50%, -50%) rotate(90deg)', objectFit: 'cover' }
    : undefined
  const frameStyle = aspect ? { aspectRatio: aspect } : undefined
  return (
    <div className={`media-frame ${className}`} style={frameStyle}>
      {image.light ? (
        <>
          <Img image={image} alt={a} sizes={sizes} priority={priority} className={`only-dark ${imgClassName}`} style={rotated} />
          <Img image={image.light} alt={a} sizes={sizes} className={`only-light ${imgClassName}`} style={rotated} />
        </>
      ) : (
        <Img image={image} alt={a} sizes={sizes} priority={priority} className={imgClassName} style={rotated} />
      )}
      {showTag && image.illustrative && (
        <span className="illustrative-tag absolute bottom-3 right-3">Illustrative texture</span>
      )}
    </div>
  )
}
