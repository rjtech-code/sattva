// Responsive image for manifest entries ({ src, srcSmall?, alt, width, height, illustrative? }).
// showTag labels generated textures where they could be mistaken for product photography.
// Below-the-fold images lazy-load by default; pass priority for the LCP image.
export default function Picture({ image, className = '', imgClassName = '', priority = false, sizes = '100vw', alt, showTag = false }) {
  if (!image) return null
  const srcSet = image.srcSmall ? `${image.srcSmall} 960w, ${image.src} ${image.width || 1920}w` : undefined
  return (
    <div className={`media-frame ${className}`}>
      <img
        src={image.src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt ?? image.alt ?? ''}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={imgClassName}
      />
      {showTag && image.illustrative && (
        <span className="illustrative-tag absolute bottom-3 right-3">Illustrative texture</span>
      )}
    </div>
  )
}
