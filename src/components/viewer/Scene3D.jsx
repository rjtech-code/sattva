import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Bounds, ContactShadows } from '@react-three/drei'
import { TextureLoader, BoxGeometry, SRGBColorSpace, CanvasTexture, AdditiveBlending } from 'three'

// Slab proportions follow the photo's own aspect so the surface is never cropped or stretched.
const MAX_SPAN = 2.4
const DEPTH = 0.03 // panel thickness in scene units — the same thin panel for every range
const SEGMENTS = 40
const EDGE = '#9a958e' // stone-grey edges so the panel's thickness reads against the light stage
// The panel's back surface: Tailwind gray-900 on the dark stage, gray-50 on the light (cream) stage.
const BACK = { dark: '#101828', light: '#f9fafb' }

// Follows the header theme toggle (it sets data-theme on <html>).
function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    const root = document.documentElement
    const mo = new MutationObserver(() => setTheme(root.dataset.theme || 'dark'))
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return theme
}

const loadTexture = (src, onLoad, onError) => {
  new TextureLoader().load(
    src,
    (t) => {
      t.colorSpace = SRGBColorSpace // photos are sRGB; without this they render washed out
      t.anisotropy = 8
      onLoad(t)
    },
    undefined,
    onError,
  )
}

// Soft radial glow used behind translucent sheets when the backlight is on.
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128)
    grad.addColorStop(0, 'rgba(255,214,150,0.95)')
    grad.addColorStop(0.45, 'rgba(255,180,90,0.35)')
    grad.addColorStop(1, 'rgba(255,160,60,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 256)
    return new CanvasTexture(c)
  }, [])
}

// Moves the camera so the whole sheet fits the frame (with margin), and makes that the reset view.
function FitCamera({ w, h }) {
  const { camera, size } = useThree()
  const controls = useThree((s) => s.controls)
  useEffect(() => {
    const half = (camera.fov * Math.PI) / 360
    const aspect = size.width / size.height
    const dist = Math.max(h / 2 / Math.tan(half), w / 2 / (Math.tan(half) * aspect)) * 1.22
    camera.position.set(0, 0, dist)
    camera.updateProjectionMatrix()
    if (controls) {
      /* eslint-disable react-hooks/immutability -- three.js controls are mutable scene objects (r3f pattern) */
      controls.target.set(0, 0, 0)
      controls.maxDistance = dist * 2
      controls.minDistance = dist * 0.35
      /* eslint-enable react-hooks/immutability */
      controls.update()
      controls.saveState()
    }
  }, [camera, controls, size.width, size.height, w, h])
  return null
}

/**
 * A surface panel textured with a real product photograph. `flex` animates a gentle bend and
 * must only be enabled for ranges verified as flexible. Translucent sheets pass `glowSrc` (the
 * catalogue's backlit photograph); with `lit` the face shows it, glowing, with light behind.
 */
function Slab({ src, glowSrc, lit, flex, depth = DEPTH, reduced, onReady, onError }) {
  const [texture, setTexture] = useState(null)
  const [glowTexture, setGlowTexture] = useState(null)
  const [size, setSize] = useState({ w: MAX_SPAN, h: MAX_SPAN * 0.62 })
  const geometry = useMemo(() => new BoxGeometry(size.w, size.h, depth, SEGMENTS, 1, 1), [size, depth])
  const base = useMemo(() => geometry.attributes.position.array.slice(), [geometry])
  const halo = useGlowTexture()
  const theme = useTheme()

  useEffect(() => {
    let cancelled = false
    loadTexture(
      src,
      (t) => {
        if (cancelled) return
        const a = t.image.width / t.image.height
        setSize(a >= 1 ? { w: MAX_SPAN, h: MAX_SPAN / a } : { w: MAX_SPAN * a, h: MAX_SPAN })
        setTexture(t)
        onReady()
      },
      () => !cancelled && onError(),
    )
    return () => { cancelled = true }
  }, [src, onReady, onError])

  useEffect(() => {
    if (!glowSrc) return
    let cancelled = false
    loadTexture(glowSrc, (t) => !cancelled && setGlowTexture(t), () => {})
    return () => { cancelled = true }
  }, [glowSrc])

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
  const glowing = lit && glowTexture
  const face = glowing ? glowTexture : texture
  return (
    <>
      <FitCamera w={size.w} h={size.h} />
      {glowing && (
        <>
          {/* Light source behind the sheet: a warm halo plus a point light spilling round the edges. */}
          <mesh position={[0, 0, -0.25]}>
            <planeGeometry args={[size.w * 2.2, size.h * 1.7]} />
            <meshBasicMaterial map={halo} transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0, -0.6]} intensity={6} distance={4} color="#ffc98a" />
        </>
      )}
      <mesh geometry={geometry}>
        {[0, 1, 2, 3].map((i) => <meshStandardMaterial key={i} attach={`material-${i}`} color={glowing ? '#d9b98c' : EDGE} roughness={0.7} />)}
        {/* The photo face is unlit and not tone-mapped, so it shows exactly the catalogue photograph's
            colours (no brightening or wash-out); scene lights only shape the edges and back. */}
        <meshBasicMaterial key={glowing ? 'lit' : 'unlit'} attach="material-4" map={face} toneMapped={false} />
        <meshStandardMaterial attach="material-5" color={BACK[theme] || BACK.dark} roughness={0.85} />
      </mesh>
    </>
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

export default function Scene3D({ config, apiRef, onReady, onError, reduced, lit }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.6], fov: 40 }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {/* Bright studio lighting (the stage colour is CSS behind a transparent canvas); dimmed when backlit. */}
      <ambientLight intensity={lit && config.glow ? 0.5 : 1.1} />
      <hemisphereLight args={['#ffffff', '#b8b4ae', 0.9]} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <directionalLight position={[-4, 2, 3]} intensity={0.9} />
      <directionalLight position={[0, -2, -4]} intensity={0.6} />
      <ContactShadows position={[0, -1.32, 0]} opacity={0.45} scale={6} blur={2.6} far={3} />
      <Turntable apiRef={apiRef} auto={!reduced}>
        <Suspense fallback={null}>
          {config.kind === 'model' ? (
            <Model src={config.src} onReady={onReady} />
          ) : (
            <Slab src={config.texture} glowSrc={config.glow} lit={lit} flex={config.flex} depth={config.depth} reduced={reduced} onReady={onReady} onError={onError} />
          )}
        </Suspense>
      </Turntable>
      {/* Zoom limits are set by FitCamera from the framed distance. */}
      <OrbitControls makeDefault enablePan={false} enableDamping />
    </Canvas>
  )
}
