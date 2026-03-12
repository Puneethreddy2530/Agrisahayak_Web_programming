import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

const LETTERS = 'AgriSahayak'.split('')

export default function LoadingScreen() {
  // Only show once per browser session
  const [visible] = useState(() => !sessionStorage.getItem('agri_loaded'))
  const [exiting, setExiting] = useState(false)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!visible) return

    const canvas = canvasRef.current
    const W = window.innerWidth
    const H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000)
    camera.position.z = 5

    // World-space viewport dimensions at camera z=5
    const vFov = (camera.fov * Math.PI) / 180
    const viewH = 2 * Math.tan(vFov / 2) * camera.position.z
    const viewW = viewH * (W / H)

    // ── 2000-point particle field ─────────────────────────────
    const COUNT = 2000
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * viewW
      // Bias ~45% of particles toward the bottom third = wheat field silhouette
      const r = Math.random()
      positions[i3 + 1] = r < 0.45
        ? -viewH * 0.05 - Math.random() * viewH * 0.42
        : (Math.random() - 0.5) * viewH
      positions[i3 + 2] = (Math.random() - 0.5) * 2
      speeds[i] = 0.003 + Math.random() * 0.007   // upward drift velocity
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Soft circular sprite via CanvasTexture
    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = 16
    spriteCanvas.height = 16
    const ctx = spriteCanvas.getContext('2d')
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    grad.addColorStop(0, 'rgba(34,197,94,0.9)')
    grad.addColorStop(0.4, 'rgba(34,197,94,0.5)')
    grad.addColorStop(1, 'rgba(34,197,94,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 16, 16)
    const sprite = new THREE.CanvasTexture(spriteCanvas)

    const material = new THREE.PointsMaterial({
      size: 0.09,
      map: sprite,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const posAttr = geometry.attributes.position
    const halfH = viewH / 2

    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3
        posAttr.array[i3 + 1] += speeds[i]
        // Wrap particle back to bottom when it drifts above the top edge
        if (posAttr.array[i3 + 1] > halfH + 0.5) {
          posAttr.array[i3 + 1] = -halfH - 0.5
          posAttr.array[i3]     = (Math.random() - 0.5) * viewW
        }
      }
      posAttr.needsUpdate = true
      renderer.render(scene, camera)
    }
    animate()

    // ── Dismiss timing ────────────────────────────────────────
    const exitTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        sessionStorage.setItem('agri_loaded', '1')
        // Force re-render to unmount by reloading location — simpler: just hide via CSS,
        // the component stays mounted but invisible, which is fine.
      }, 620)
    }, 2800)

    return () => {
      clearTimeout(exitTimer)
      cancelAnimationFrame(rafRef.current)
      geometry.dispose()
      material.dispose()
      sprite.dispose()
      renderer.dispose()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#09100E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Dissolve upward exit transition
        transition: 'transform 0.55s cubic-bezier(0.76,0,0.24,1), opacity 0.55s ease',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? 'none' : 'all',
      }}
    >
      {/* Three.js particle field */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* ── Centered logo overlay ──────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', userSelect: 'none' }}>

        {/* Self-drawing SVG leaf */}
        <svg
          width="68" height="68" viewBox="0 0 68 68" fill="none"
          aria-hidden="true"
          style={{ margin: '0 auto 20px', display: 'block', overflow: 'visible' }}
        >
          {/* Glow circle */}
          <circle cx="34" cy="34" r="30"
            fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.08)" strokeWidth="1"
          />
          {/* Stem */}
          <path
            d="M34 58 L34 26"
            stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"
            style={{
              strokeDasharray: 32,
              strokeDashoffset: 32,
              animation: 'agriLeafDraw 0.35s 0.15s ease forwards',
            }}
          />
          {/* Left leaf blade */}
          <path
            d="M34 40 Q18 32 16 14 Q30 10 34 30"
            fill="rgba(34,197,94,0.14)" stroke="#22C55E" strokeWidth="2"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 85,
              strokeDashoffset: 85,
              animation: 'agriLeafDraw 0.55s 0.45s ease forwards',
            }}
          />
          {/* Right leaf blade */}
          <path
            d="M34 47 Q50 39 52 21 Q38 17 34 37"
            fill="rgba(34,197,94,0.09)" stroke="#22C55E" strokeWidth="2"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 85,
              strokeDashoffset: 85,
              animation: 'agriLeafDraw 0.55s 0.70s ease forwards',
            }}
          />
        </svg>

        {/* Letter-by-letter reveal */}
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '2.1rem',
            fontWeight: 700,
            color: '#F0FDF4',
            letterSpacing: '0.03em',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.85 + i * 0.065,
                duration: 0.28,
                ease: 'easeOut',
              }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.45 }}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.72rem',
            color: 'rgba(240,253,244,0.38)',
            marginTop: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Smart Farming Intelligence
        </motion.p>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(34,197,94,0.1)',
        }}
      >
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #16A34A, #22C55E, #4ADE80)',
          width: '0%',
          animation: 'agriLoadProgress 2.5s cubic-bezier(0.4,0,0.2,1) forwards',
          boxShadow: '0 0 10px rgba(34,197,94,0.6)',
        }} />
      </div>
    </div>
  )
}
