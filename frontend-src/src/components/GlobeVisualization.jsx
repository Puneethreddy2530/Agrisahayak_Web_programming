import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useApp } from '../contexts/AppContext'

export default function GlobeVisualization() {
  const { state } = useApp()
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    // ── Scene / Camera ────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 6)

    // ── Lights ────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0x00ff88, 0.8)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    // ── Globe (solid sphere) ──────────────────────────────────────────
    const globeGeo = new THREE.SphereGeometry(2, 64, 64)
    const globeMat = new THREE.MeshPhongMaterial({
      color:    0x1a3a2a,
      emissive: 0x0a2a15,
      emissiveIntensity: 0.35,
      shininess: 25,
    })
    const globe = new THREE.Mesh(globeGeo, globeMat)
    scene.add(globe)

    // ── Wireframe overlay ────────────────────────────────────────────
    const wireMat = new THREE.MeshBasicMaterial({
      color:     0x22c55e,
      wireframe: true,
      opacity:   0.07,
      transparent: true,
    })
    const wireframe = new THREE.Mesh(new THREE.SphereGeometry(2.008, 32, 32), wireMat)
    scene.add(wireframe)

    // ── Atmosphere glow ring ─────────────────────────────────────────
    const atmGeo = new THREE.SphereGeometry(2.18, 32, 32)
    const atmMat = new THREE.MeshBasicMaterial({
      color:       0x22c55e,
      transparent: true,
      opacity:     0.04,
      side:        THREE.BackSide,
    })
    scene.add(new THREE.Mesh(atmGeo, atmMat))

    // ── Farmer marker ─────────────────────────────────────────────────
    const lat = (state.farmer?.latitude  ?? 20.5937) * (Math.PI / 180)
    const lon = (state.farmer?.longitude ?? 78.9629) * (Math.PI / 180)
    const R   = 2.06
    const mx  = R * Math.cos(lat) * Math.cos(lon)
    const my  = R * Math.sin(lat)
    const mz  = R * Math.cos(lat) * Math.sin(lon)

    const markerMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    const marker    = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), markerMat)
    marker.position.set(mx, my, mz)
    globe.add(marker)

    // Inner pulse ring around marker
    const ringGeo  = new THREE.RingGeometry(0.07, 0.10, 24)
    const ringMat  = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
    const ring     = new THREE.Mesh(ringGeo, ringMat)
    ring.position.set(mx, my, mz)
    ring.lookAt(new THREE.Vector3(mx, my, mz).multiplyScalar(2))
    globe.add(ring)

    // ── Manual orbit state ────────────────────────────────────────────
    let isDragging = false
    let prevMouse  = { x: 0, y: 0 }
    const pivot    = new THREE.Group()
    scene.add(pivot)
    pivot.add(globe)
    pivot.add(wireframe)

    function onMouseDown(e) {
      isDragging = true
      prevMouse  = { x: e.clientX, y: e.clientY }
    }
    function onMouseMove(e) {
      if (!isDragging) return
      const dx = (e.clientX - prevMouse.x) * 0.005
      const dy = (e.clientY - prevMouse.y) * 0.005
      pivot.rotation.y += dx
      pivot.rotation.x  = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pivot.rotation.x + dy))
      prevMouse = { x: e.clientX, y: e.clientY }
    }
    function onMouseUp()   { isDragging = false }
    function onTouchStart(e) {
      if (e.touches.length !== 1) return
      isDragging = true
      prevMouse  = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    function onTouchMove(e) {
      if (!isDragging || e.touches.length !== 1) return
      const dx = (e.touches[0].clientX - prevMouse.x) * 0.005
      const dy = (e.touches[0].clientY - prevMouse.y) * 0.005
      pivot.rotation.y += dx
      pivot.rotation.x  = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pivot.rotation.x + dy))
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    el.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { passive: true })
    el.addEventListener('touchend',   onMouseUp)

    // ── Resize handler ────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      if (!el) return
      renderer.setSize(el.clientWidth, el.clientHeight)
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
    })
    ro.observe(el)

    // ── Animation loop ────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Auto-rotate when not dragging
      if (!isDragging) pivot.rotation.y += 0.002

      // Pulsing marker scale
      const pulse = 1.0 + 0.5 * (0.5 + 0.5 * Math.sin(t * 3))
      marker.scale.setScalar(pulse)

      // Pulsing ring opacity
      ringMat.opacity = 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2))

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onMouseUp)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [state.farmer?.latitude, state.farmer?.longitude])

  return (
    <div
      ref={mountRef}
      className="w-full cursor-grab active:cursor-grabbing select-none"
      style={{ height: 350 }}
      aria-hidden="true"
    />
  )
}
