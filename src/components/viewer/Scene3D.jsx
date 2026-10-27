import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Bounds } from '@react-three/drei'
import { TextureLoader, BoxGeometry, SRGBColorSpace } from 'three'

// Slab proportions follow the photo's own aspect so the surface is never cropped or stretched.
const MAX_SPAN = 2.4
const DEPTH = 0.02
const SEGMENTS = 40
const EDGE = '#1d1d20'

/**
 * A thin surface panel textured with a real product photograph (or, on range pages, an
 * explicitly-labelled illustrative texture). `flex` animates a gentle bend and must only be
 * enabled for ranges verified as flexible.
 */
function Slab({ src, flex, reduced, onReady, onError }) {
  const [texture, setTexture] = useState(null)
  const [size, setSize] = useState({ w: MAX_SPAN, h: MAX_SPAN * 0.62 })
  const geometry = useMemo(() => new BoxGeometry(size.w, size.h, DEPTH, SEGMENTS, 1, 1), [size])
  const base = useMemo(() => geometry.attributes.position.array.slice(), [geometry])

  useEffect(() => {
    let cancelled = false
    new TextureLoader().load(
      src,
      (t) => {
        if (cancelled) return
        t.colorSpace = SRGBColorSpace // photos are sRGB; without this they render washed out
        t.anisotropy = 8
        const a = t.image.width / t.image.height
        setSize(a >= 1 ? { w: MAX_SPAN, h: MAX_SPAN / a } : { w: MAX_SPAN * a, h: MAX_SPAN })
        setTexture(t)
        onReady()
      },
      undefined,
      () => !cancelled && onError(),
    )
    return () => { cancelled = true }
  }, [src, onReady, onError])

  /* eslint-disable react-hooks/immutability -- per-frame in-place vertex animation (r3f pattern) */
  useFrame(({ clock }) => {
    if (!flex || reduced) return
    const pos = geometry.attributes.position
    const t = clock.getElapsedTime() * 0.8
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, base[i * 3 + 2] + Math.sin(base[i * 3] * 1.5 + t) * 0.065)
    }
    pos.needsUpdate = true
    geometry.computeVertexNormals()
  })
  /* eslint-enable react-hooks/immutability */

  if (!texture) return null
  return (
    <mesh geometry={geometry}>
      {[0, 1, 2, 3].map((i) => <meshStandardMaterial key={i} attach={`material-${i}`} color={EDGE} roughness={0.8} />)}
      {/* Unlit so the photograph renders exactly as shot, not re-lit or tone-mapped. */}
      <meshBasicMaterial attach="material-4" map={texture} toneMapped={false} />
      <meshStandardMaterial attach="material-5" color={EDGE} roughness={0.8} />
    </mesh>
  )
}

function Model({ src, onReady }) {
  const { scene } = useGLTF(src)
  useEffect(() => { onReady() }, [scene, onReady])
  return (
    <Bounds fit clip observe margin={1.15}>
      <Center><primitive object={scene} /></Center>
    </Bounds>
  )
}

// Rotates the subject toward a target angle so keyboard/button input animates smoothly.
function Turntable({ apiRef, auto, children }) {
  const group = useRef(null)
  const target = useRef(0.5)
  const { camera } = useThree()
  const controls = useThree((s) => s.controls)

  useEffect(() => {
    apiRef.current = {
      rotate: (d) => { target.current += d },
      zoom: (f) => {
        camera.position.multiplyScalar(f)
        controls?.update()
      },
      reset: () => {
        target.current = 0.5
        controls?.reset()
      },
    }
  }, [apiRef, camera, controls])

  useFrame((_, dt) => {
    if (!group.current) return
    if (auto) target.current += dt * 0.25
    group.current.rotation.y += (target.current - group.current.rotation.y) * Math.min(1, dt * 6)
  })
  return <group ref={group}>{children}</group>
}

export default function Scene3D({ config, apiRef, onReady, onError, reduced }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.6], fov: 40 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
      onCreated={({ gl }) => gl.setClearColor('#070708')}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-4, -1, -3]} intensity={0.5} color="#c8102e" />
      <Turntable apiRef={apiRef} auto={!reduced}>
        <Suspense fallback={null}>
          {config.kind === 'model' ? (
            <Model src={config.src} onReady={onReady} />
          ) : (
            <Slab src={config.texture} flex={config.flex} reduced={reduced} onReady={onReady} onError={onError} />
          )}
        </Suspense>
      </Turntable>
      <OrbitControls makeDefault enablePan={false} minDistance={1.8} maxDistance={6} enableDamping />
    </Canvas>
  )
}
