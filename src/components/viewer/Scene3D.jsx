import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Bounds, ContactShadows } from '@react-three/drei'
import { TextureLoader, BoxGeometry, SRGBColorSpace } from 'three'

// Slab proportions follow the photo's own aspect so the surface is never cropped or stretched.
const MAX_SPAN = 2.4
const DEPTH = 0.06 // default panel thickness in scene units; config.depth overrides (e.g. thick StonIT panels)
const SEGMENTS = 40
const EDGE = '#9a958e' // stone-grey edges so the panel's thickness reads against the light stage
const BACK = '#364153' // Tailwind gray-700

/**
 * A thin surface panel textured with a real product photograph (or, on range pages, an
 * explicitly-labelled illustrative texture). `flex` animates a gentle bend and must only be
 * enabled for ranges verified as flexible.
 */
function Slab({ src, flex, depth = DEPTH, reduced, onReady, onError }) {
  const [texture, setTexture] = useState(null)
  const [size, setSize] = useState({ w: MAX_SPAN, h: MAX_SPAN * 0.62 })
  const geometry = useMemo(() => new BoxGeometry(size.w, size.h, depth, SEGMENTS, 1, 1), [size, depth])
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
      {[0, 1, 2, 3].map((i) => <meshStandardMaterial key={i} attach={`material-${i}`} color={EDGE} roughness={0.7} />)}
      {/* Lit so the surface catches light as it turns; the emissive copy of the photo keeps
          its colours bright and true instead of falling into shadow. */}
      <meshStandardMaterial attach="material-4" map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.55} metalness={0} />
      <meshStandardMaterial attach="material-5" color={BACK} roughness={0.85} />
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
// Idle motion is a gentle sway (not a full spin) so the product face stays in view.
const REST = 0.35
function Turntable({ apiRef, auto, children }) {
  const group = useRef(null)
  const target = useRef(REST)
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
        target.current = REST
        controls?.reset()
      },
    }
  }, [apiRef, camera, controls])

  useFrame(({ clock }, dt) => {
    if (!group.current) return
    const sway = auto ? Math.sin(clock.getElapsedTime() * 0.45) * 0.45 - REST : 0
    group.current.rotation.y += (target.current + sway - group.current.rotation.y) * Math.min(1, dt * 4)
  })
  return <group ref={group}>{children}</group>
}

export default function Scene3D({ config, apiRef, onReady, onError, reduced }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.6], fov: 40 }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {/* Bright studio lighting on a light-grey stage (the stage gradient is CSS behind the canvas). */}
      <ambientLight intensity={1.1} />
      <hemisphereLight args={['#ffffff', '#b8b4ae', 0.9]} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <directionalLight position={[-4, 2, 3]} intensity={0.9} />
      <directionalLight position={[0, -2, -4]} intensity={0.6} />
      <ContactShadows position={[0, -1.35, 0]} opacity={0.35} scale={6} blur={2.6} far={3} />
      <Turntable apiRef={apiRef} auto={!reduced}>
        <Suspense fallback={null}>
          {config.kind === 'model' ? (
            <Model src={config.src} onReady={onReady} />
          ) : (
            <Slab src={config.texture} flex={config.flex} depth={config.depth} reduced={reduced} onReady={onReady} onError={onError} />
          )}
        </Suspense>
      </Turntable>
      <OrbitControls makeDefault enablePan={false} minDistance={1.8} maxDistance={6} enableDamping />
    </Canvas>
  )
}
