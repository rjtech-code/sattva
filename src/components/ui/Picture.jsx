// Responsive image for manifest entries
// ({ src, srcSmall?, smallWidth?, width, height, alt, light?, illustrative?, rotatable? }).
// - srcset uses each file's real width, so the browser never stretches the small file.
// - Entries with a `light` counterpart (generated textures) swap with the theme via CSS;
//   the hidden copy is display:none, so lazy copies are never downloaded.
// - `aspect` (width / height of the slot) turns on smart fitting — images are never zoomed
//   and cropped to fit a slot of a different shape:
//     close match            → fills the slot
//     stone sheet (rotatable) of the opposite orientation → turned 90° (filling it when the
//       proportions match, otherwise shown whole)
//     anything else (room photos, artwork) → shown whole (contain) on a neutral stage
// - showTag labels generated textures where they could be mistaken for product photography.
// Below-the-fold images lazy-load by default; pass priority for the LCP image.
const smallWidth = (im) => im.smallWidth || Math.round(im.width * Math.min(1, 480 / Math.max(im.width, im.height)))
const near = (a, b) => Math.abs(Math.log(a / b)) < 0.2

export function fitFor(image, aspect) {
  if (!aspect || !image?.width || !image?.height || image.illustrative) return 'cover' // textures are decorative
  const ia = image.width / image.height
  if (near(ia, aspect)) return 'cover'
  if (image.rotatable && (ia < 1) !== (aspect < 1)) return near(1 / ia, aspect) ? 'rotate' : 'rotate-contain'
  return 'contain'
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
    ? { position: 'absolute', left: '50%', top: '50%', width: `${100 / aspect}%`, height: `${aspect * 100}%`, maxWidth: 'none', transform: 'translate(-50%, -50%) rotate(90deg)', objectFit: fit === 'rotate' ? 'cover' : 'contain' }
    : undefined
  const fitClass = fit === 'contain' ? 'h-full w-full !object-contain' : ''
  const frameStyle = aspect ? { aspectRatio: aspect } : undefined
  return (
    <div className={`media-frame ${fit.includes('contain') ? 'bg-coal-2' : ''} ${className}`} style={frameStyle}>
      {image.light ? (
        <>
          <Img image={image} alt={a} sizes={sizes} priority={priority} className={`only-dark ${imgClassName} ${fitClass}`} style={rotated} />
          <Img image={image.light} alt={a} sizes={sizes} className={`only-light ${imgClassName} ${fitClass}`} style={rotated} />
        </>
      ) : (
        <Img image={image} alt={a} sizes={sizes} priority={priority} className={`${imgClassName} ${fitClass}`} style={rotated} />
      )}
      {showTag && image.illustrative && (
        <span className="illustrative-tag absolute bottom-3 right-3">Illustrative texture</span>
      )}
    </div>
  )
}
